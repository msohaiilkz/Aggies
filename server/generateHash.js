import { scrypt, randomBytes } from "crypto";
import { promiCIFy } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  const password = "password123"; // tumhara password
  const hashed = await hashPassword(password);
  console.log("Hashed password:", hashed);
}

main();
