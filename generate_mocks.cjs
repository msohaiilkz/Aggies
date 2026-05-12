const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'DELL', 'Downloads', 'code', 'client', 'src', 'pages', 'CustomerDetailsModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The basic template from customer 1
const baseCustomer = {
    transactionId: "HG-0331ZZY-01",
    age: 52,
    customerSince: "20 Aug, 2007",
    profession: "Talent Manager",
    gender: "Male",
    dob: "12 Oct, 1972",
    cnic: "42101-1234567-1",
    passport: "P1234567",
    maritalStatus: "Married",
    education: "Master's Degree",
    address: "House 123, Street 5, DHA Phase 6",
    cnicExpiry: "12 Oct, 2028",
    passportExpiry: "15 Jan, 2030",
    blacklistFlag: "No",
    lastLoginDate: "11 Mar, 2018",
    devices: [
      { id: "DEV-98210", name: "iPhone 15 Pro", userId: "USR-001", os: "iOS 17.2", osType: "Mobile", status: "Active", lastLogin: "10 Apr, 2025 14:30", logout: "10 Apr, 2025 22:15" }
    ],
    accounts: [
      { 
        number: "01031720311714136516", status: "Active", iban: "PK47SUMB0000010317203117", balance: 450000, joint: "No", 
        address: "House 123, Street 4, DHA Phase 5", age: "5 Years", type: "Current", branch: "0103", glCode: "100201", currency: "PKR", openingDate: "12 May, 2019" 
      }
    ],
    beneficiaries: [
      { 
        id: "BEN-5521", custCnic: "42101-1234567-1", addDateTime: "15 Jan, 2024 10:20", custAcctNo: "01031720311714136516", 
        iban: "PK47SUMB0331027140115", acctNo: "0331027140115", name: "Ahmed Ali", bank: "Summit Bank" 
      }
    ],
    phoneNo: "(+92) 310 - 4567890",
    email: "example@customer.com",
    accountAge: "18 years",
    highestAmount: 25000000,
    lowestAmount: 3500.0,
    avgAmount: 11500.0,
    branchName: "Main Branch",
    branchLocation: "I.I. Chundrigar Road",
    alertTransactions: [],
    transactionHistory: [],
    previousAttacks: [],
    ibftTransactions: [],
    posTransactions: [],
    cashWithdrawals: []
};

const customersInfo = [
  { id: "2", name: "Obaid Mehmood", city: "Lahore", globalId: "P436691BNC140", passport: "P436691BNC140", idType: "Passport" },
  { id: "3", name: "Abid Ali", city: "Islamabad", globalId: "42301-26920823-3", cnic: "42301-26920823-3", idType: "CNIC" },
  { id: "4", name: "Mustafa Mahmood", city: "Karachi", globalId: "P436691BNC140", passport: "P436691BNC140", idType: "Passport" },
  { id: "5", name: "Kelvin Harris", city: "Multan", globalId: "P436691BNC140", passport: "P436691BNC140", idType: "Passport" },
  { id: "6", name: "Obaid Mehmood", city: "Hyderabad", globalId: "P436691BNC140", passport: "P436691BNC140", idType: "Passport" },
  { id: "7", name: "Ayesha Khan", city: "Karachi", globalId: "A987654XYZ210", cnic: "A987654XYZ210", idType: "CNIC", gender: "Female" },
  { id: "8", name: "Zainab Ali", city: "Lahore", globalId: "B123456LMN987", passport: "B123456LMN987", idType: "Passport", gender: "Female" },
  { id: "43", name: "Zaheer Ali", city: "Karachi", globalId: "B123456LM0123", cnic: "B123456LM0123", idType: "CNIC" },
  { id: "9", name: "Fahad Mustafa", city: "Islamabad", globalId: "C987654MNO321", cnic: "C987654MNO321", idType: "CNIC" },
];

let generatedMocks = '';

for (const info of customersInfo) {
  const merged = {
    ...baseCustomer,
    ...info,
    address: `${baseCustomer.address}, ${info.city}`,
    branchName: `Main Branch, ${info.city}`,
    branchLocation: `Central Area, ${info.city}`
  };
  generatedMocks += `  "${info.id}": ${JSON.stringify(merged, null, 4).replace(/\n/g, '\n  ')},\n`;
}

// We need to inject this into mockCustomerData.
// Find the end of "1": { ... },
// Or we can just find where "10": { ... } starts and insert before it.

const startMarker = '  "10": {';
if (content.includes(startMarker)) {
  content = content.replace(startMarker, generatedMocks + startMarker);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Mock data injected successfully.");
} else {
  console.error("Could not find marker for injection");
}
