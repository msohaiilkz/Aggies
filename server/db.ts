// db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema"; // your schema file
import dotenv from "dotenv";

dotenv.config(); // load .env

console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

// Neon serverless requires a WebSocket constructor
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// create a Neon serverless pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// create Drizzle client using Neon serverless
export const db = drizzle({
  client: pool,
  schema,
});
