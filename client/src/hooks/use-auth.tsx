import { createContext, ReactNode, useContext, useState } from "react";
import { ANALYST_EMAIL_TO_NAME } from "@/lib/analysts";
import { setOnlyOnline } from "@/hooks/use-analyst-online";

type User = {
  email: string;
  role: "BUSINESS_HEAD" | "ANALYST" | "SUPER_EXECUTIVE";
  username?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  // Returns "" on success, otherwise an error message.
  changePassword: (currentPassword: string, newPassword: string) => string;
};

const AuthContext = createContext<AuthContextType | null>(null);

const dummyUsers = [
  { email: "exec@example.com", password: "password123", role: "BUSINESS_HEAD" },
  { email: "analyst@example.com", password: "password123", role: "ANALYST" },
  { email: "analyst2@example.com", password: "password123", role: "ANALYST" },
  {
    email: "super@example.com",
    password: "password123",
    role: "SUPER_EXECUTIVE",
  },
];

// Password overrides (from "Change Password") persist here.
const PW_KEY = "agies_passwords";
const getPwOverrides = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(PW_KEY) || "{}");
  } catch {
    return {};
  }
};
const savePwOverride = (email: string, pw: string) => {
  const all = getPwOverrides();
  all[email.toLowerCase()] = pw;
  localStorage.setItem(PW_KEY, JSON.stringify(all));
};
// The effective (possibly changed) password for an email.
const currentPasswordFor = (email: string): string | undefined => {
  const ov = getPwOverrides()[email.toLowerCase()];
  if (ov) return ov;
  return dummyUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    ?.password;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("sentient_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email: string, password: string) => {
    const known = dummyUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    // Check the (possibly changed) password.
    const effective = currentPasswordFor(email.trim());
    if (known && effective && effective === password.trim()) {
      const userData: User = {
        email: known.email,
        role: known.role as "BUSINESS_HEAD" | "ANALYST" | "SUPER_EXECUTIVE",
        username: known.email.split("@")[0],
      };
      setUser(userData);
      localStorage.setItem("sentient_user", JSON.stringify(userData));
      // The logged-in analyst is online; all other analysts are offline.
      const analystName = ANALYST_EMAIL_TO_NAME[known.email.toLowerCase()];
      if (analystName) setOnlyOnline(analystName);
      return true;
    }
    return false;
  };

  const logout = () => {
    // Presence persists across logout: the analyst who last logged in stays
    // "online" so the executive can still see who is active. Presence only
    // switches when another analyst logs in (setOnlyOnline).
    setUser(null);
    localStorage.removeItem("sentient_user");
  };

  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!user) return "You must be logged in.";
    const effective = currentPasswordFor(user.email);
    if (effective !== currentPassword.trim()) {
      return "Current password is incorrect.";
    }
    if (newPassword.trim().length < 12) {
      return "New password must be at least 12 characters.";
    }
    savePwOverride(user.email, newPassword.trim());
    return "";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
