// Single source of truth for the demo alert dataset. BOTH the analyst dashboard
// (alert list) and the dashboard category cards derive from this, so the counts
// on the cards always match the alerts that are actually shown.
//
// ids "1"–"9"  → active alerts (start Assigned, become Open when opened)
// ids "10"–"13" → already-actioned demo alerts shown on the Closed/Fraud screen
// alertCount    → number of individual alerts grouped under that row (children)

export interface SeedAlert {
  id: string;
  alertCode: string;
  customerName: string;
  globalId: string;
  idType: string;
  alertCount: number;
  amount: number;
  severity: string;
  status: string;
  city: string;
  createdAt: string;
  alertSource: string;
  channel: string;
  assignedTo: string | null;
}

export const initialAlerts: SeedAlert[] = [
  { id: "1", alertCode: "P436691BNC140", customerName: "Kelvin Harris", globalId: "P436691BNC140", idType: "Passport", alertCount: 2, amount: 156000.0, severity: "HIGH", status: "OPEN", city: "Karachi", createdAt: "2025-01-10T10:30:00Z", alertSource: "Rule #105 (High Velocity)", channel: "FT-Raast", assignedTo: "demo-1" },
  { id: "2", alertCode: "42301-26920823-3", customerName: "Obaid Mehmood", globalId: "42301-26920823-3", idType: "CNIC", alertCount: 3, amount: 15000.0, severity: "MEDIUM", status: "OPEN", city: "Lahore", createdAt: "2025-01-09T14:20:00Z", alertSource: "Rule #302 (Structuring)", channel: "IBFT", assignedTo: "demo-2" },
  { id: "3", alertCode: "P436691BNC141", customerName: "Abid Ali", globalId: "P436691BNC141", idType: "Passport", alertCount: 1, amount: 20000.0, severity: "LOW", status: "OPEN", city: "Islamabad", createdAt: "2025-01-08T09:15:00Z", alertSource: "Rule #404 (Large Transaction)", channel: "POS", assignedTo: "demo-1" },
  { id: "4", alertCode: "A987654XYZ210", customerName: "Ayesha Khan", globalId: "A987654XYZ210", idType: "CNIC", alertCount: 2, amount: 95000.0, severity: "HIGH", status: "OPEN", city: "Karachi", createdAt: "2025-01-07T16:45:00Z", alertSource: "Rule #55 (Multiple ATM Attempts)", channel: "ATM-On-Us", assignedTo: "demo-2" },
  { id: "5", alertCode: "B123456LMN987", customerName: "Zainab Ali", globalId: "B123456LMN987", idType: "Passport", alertCount: 1, amount: 50000.0, severity: "MEDIUM", status: "OPEN", city: "Multan", createdAt: "2025-01-06T11:30:00Z", alertSource: "Rule #12 (Off-us withdrawal pattern)", channel: "ATM-Of-Us", assignedTo: "demo-1" },
  { id: "6", alertCode: "C987654MNO321", customerName: "Fahad Mustafa", globalId: "C987654MNO321", idType: "CNIC", alertCount: 2, amount: 500000.0, severity: "HIGH", status: "OPEN", city: "Islamabad", createdAt: "2025-01-05T15:45:00Z", alertSource: "Rule #88 (Large Cash Tx)", channel: "Withdrawal", assignedTo: "demo-2" },
  { id: "7", alertCode: "P436691BNC142", customerName: "Salman Ahmed", globalId: "P436691BNC142", idType: "Passport", alertCount: 4, amount: 171450.0, severity: "HIGH", status: "OPEN", city: "Hyderabad", createdAt: "2025-01-09T08:15:00Z", alertSource: "AI Model (Unusual Location)", channel: "E-Commerce", assignedTo: "demo-1" },
  { id: "8", alertCode: "P436691BNC143", customerName: "Mustafa Mahmood", globalId: "P436691BNC143", idType: "Passport", alertCount: 5, amount: 75000.0, severity: "HIGH", status: "OPEN", city: "Karachi", createdAt: "2025-01-07T13:20:00Z", alertSource: "AI Model (Behavioral Anomaly)", channel: "IBFT", assignedTo: "demo-2" },
  { id: "9", alertCode: "B123456LM0123", customerName: "Zaheer Ali", globalId: "B123456LM0123", idType: "CNIC", alertCount: 1, amount: 50000.0, severity: "MEDIUM", status: "OPEN", city: "Karachi", createdAt: "2025-01-08T11:20:00Z", alertSource: "AI Model (Device Mismatch)", channel: "FT-Raast", assignedTo: null },
  // Already-actioned demo alerts — they appear in the Closed/Fraud screen for
  // BOTH analyst and executive (they live in code, so they show in every browser
  // even when live cross-browser sync isn't available).
  { id: "10", alertCode: "A987654XYZ211", customerName: "Ayesha Khan", globalId: "A987654XYZ211", idType: "CNIC", alertCount: 1, amount: 95000.0, severity: "HIGH", status: "FRAUD", city: "Karachi", createdAt: "2025-01-04T10:00:00Z", alertSource: "Rule #55 (Multiple ATM Attempts)", channel: "ATM-On-Us", assignedTo: "demo-2" },
  { id: "11", alertCode: "P436691BNC144", customerName: "Salman Ahmed", globalId: "P436691BNC144", idType: "Passport", alertCount: 2, amount: 120000.0, severity: "MEDIUM", status: "RESOLVED", city: "Hyderabad", createdAt: "2025-01-03T11:00:00Z", alertSource: "AI Model (Unusual Location)", channel: "E-Commerce", assignedTo: "demo-1" },
  { id: "12", alertCode: "C987654MNO322", customerName: "Fahad Mustafa", globalId: "C987654MNO322", idType: "CNIC", alertCount: 1, amount: 300000.0, severity: "HIGH", status: "DISCARDED", city: "Islamabad", createdAt: "2025-01-02T12:00:00Z", alertSource: "Rule #88 (Large Cash Tx)", channel: "Withdrawal", assignedTo: "demo-2" },
  { id: "13", alertCode: "B123456LMN988", customerName: "Zaheer Ali", globalId: "B123456LMN988", idType: "CNIC", alertCount: 1, amount: 60000.0, severity: "MEDIUM", status: "NOT_CONTACTED", city: "Karachi", createdAt: "2025-01-01T09:30:00Z", alertSource: "AI Model (Device Mismatch)", channel: "FT-Raast", assignedTo: "demo-1" },
];
