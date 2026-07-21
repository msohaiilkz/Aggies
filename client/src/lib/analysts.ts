// The platform's analysts and their login mapping. Keep this small and in one
// place so the alert view, reassignment, and online status all agree.

export const ANALYST_NAMES = ["Ahmed Raza", "Sana Iqbal"];

// Analyst login email → display name.
export const ANALYST_EMAIL_TO_NAME: Record<string, string> = {
  "analyst@example.com": "Ahmed Raza",
  "analyst2@example.com": "Sana Iqbal",
};
