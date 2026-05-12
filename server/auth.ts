import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, UserPublic } from "@shared/schema";
import dotenv from "dotenv";
dotenv.config();  // ye .env file load karega

console.log("Using DATABASE_URL:", process.env.DATABASE_URL);
declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

// Convert User to UserPublic (remove password)
function toUserPublic(user: SelectUser): UserPublic {
  const { password, ...publicUser } = user;
  return publicUser;
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: "username", passwordField: "password" }, 
      async (usernameOrEmail, password, done) => {
        // Trim input to avoid accidental spaces
        const loginInput = usernameOrEmail.trim();
  
        // Try to find user by username or email
        const user = await storage.getUserByUsername(loginInput) || await storage.getUserByEmail(loginInput);
  
        if (!user) return done(null, false); // not found
        if (!(await comparePasswords(password, user.password))) return done(null, false); // wrong password
  
        return done(null, user);
      }
    )
  );
  

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  // Registration endpoint disabled for security
  // In production, user registration should be handled by admin/invitation only
  app.post("/api/register", (req, res) => {
    res.status(403).json({ error: "Registration is disabled. Please contact your administrator." });
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Regenerate session ID to prevent session fixation attacks
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ error: "Session error" });
      }
      // Save session and return user data
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ error: "Session error" });
        }
        res.status(200).json(toUserPublic(req.user!));
      });
    });
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      // Destroy session to prevent reuse
      req.session.destroy((err) => {
        if (err) return next(err);
        res.sendStatus(200);
      });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(toUserPublic(req.user!));
  });
}
