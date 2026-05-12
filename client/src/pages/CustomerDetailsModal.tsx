import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, AlertTriangle, Wallet, Loader2, RefreshCw } from "lucide-react";
import { DateRange } from "react-day-picker";
import MarkFraudModal from "@/components/MarkFraudModalProps";
import { DatePickerWithRange } from "@/components/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import feather from "../assets/5.png";
// Mock customer data
const mockCustomerData = {
  "1": {
    id: "1",
    name: "Kelvin Harris",
    transactionId: "HG-0331ZZY-01",
    globalId: "P436691BNC140",
    age: 52,
    customerSince: "20 Aug, 2007",
    profession: "Talent Manager",
    gender: "Male",
    city: "Karachi",
    dob: "12 Oct, 1972",
    cnic: "42101-1234567-1",
    passport: "P1234567",
    maritalStatus: "Married",
    education: "Master's Degree",
    address: "House 123, Street 5, DHA Phase 6, Karachi",
    cnicExpiry: "12 Oct, 2028",
    passportExpiry: "15 Jan, 2030",
    blacklistFlag: "No",
    lastLoginDate: "11 Mar, 2018",
    devices: [
      { id: "DEV-98210", name: "iPhone 15 Pro", userId: "USR-001", os: "iOS 17.2", osType: "Mobile", status: "Active", lastLogin: "10 Apr, 2025 14:30", logout: "10 Apr, 2025 22:15" },
      { id: "DEV-77123", name: "MacBook Air", userId: "USR-001", os: "macOS Sonoma", osType: "Desktop", status: "Inactive", lastLogin: "08 Apr, 2025 09:12", logout: "08 Apr, 2025 18:45" }
    ],
    accounts: [
      { 
        number: "01031720311714136516", 
        status: "Active", 
        iban: "PK47SUMB0000010317203117", 
        balance: 450000, 
        joint: "No", 
        address: "House 123, Street 4, DHA Phase 5, Karachi", 
        age: "5 Years", 
        type: "Current", 
        branch: "0103", 
        glCode: "100201", 
        currency: "PKR", 
        openingDate: "12 May, 2019" 
      },
      { 
        number: "01031720311714136517", 
        status: "Active", 
        iban: "PK89HABB0000010317203118", 
        balance: 1250000, 
        joint: "Yes", 
        address: "House 123, Street 4, DHA Phase 5, Karachi", 
        age: "3 Years", 
        type: "Savings", 
        branch: "0103", 
        glCode: "100202", 
        currency: "PKR", 
        openingDate: "20 Nov, 2021" 
      }
    ],
    beneficiaries: [
      { 
        id: "BEN-5521", 
        custCnic: "42101-1234567-1", 
        addDateTime: "15 Jan, 2024 10:20", 
        custAcctNo: "01031720311714136516", 
        iban: "PK47SUMB0331027140115", 
        acctNo: "0331027140115", 
        name: "Ahmed Ali", 
        bank: "Summit Bank" 
      },
      { 
        id: "BEN-8832", 
        custCnic: "42101-1234567-1", 
        addDateTime: "02 Feb, 2024 14:45", 
        custAcctNo: "01031720311714136516", 
        iban: "PK89HABB00123456789012", 
        acctNo: "00123456789012", 
        name: "Zainab Malik", 
        bank: "HBL" 
      }
    ],
    phoneNo: "(+92) 310 - 4567890",
    email: "example@customer.com",
    accountAge: "18 years",
    highestAmount: 25000000,
    lowestAmount: 3500.0,
    avgAmount: 11500.0,
    branchName: "Main Branch, Karachi",
    branchLocation: "I.I. Chundrigar Road, Karachi, Sindh",
    alertTransactions: [
      {
        id: "#103-090132581-2",
        date: "16 Apr, 2025",
        time: "7:59 AM",
        type: "IBFT",
        location: "Meezan Bank",
        amount: 156000.0,
        riskScore: 95,
      },
      {
        id: "#103-090132581-2",
        date: "16 Apr, 2025",
        time: "7:47 AM",
        type: "Bill Payment",
        location: "K-Electric",
        amount: 16000.0,
        riskScore: 93,
      },
      {
        id: "#103-090132581-2",
        date: "16 Apr, 2025",
        time: "7:33 AM",
        type: "Easy Paisa",
        location: "Transfer to Wallet",
        amount: 2000.0,
        riskScore: 87,
      },
    ],
    transactionHistory: [
      { id: "TXN-882103", channelType: "Mobile", date: "12 Apr, 2025 10:15", amount: 50000, fromAcct: "01031720311714136516", toAcct: "01031720311714139988", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" },
      { id: "TXN-882104", channelType: "ATM", date: "11 Apr, 2025 18:30", amount: 25000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-KHI-05", status: "Success" },
      { id: "TXN-882105", channelType: "Web", date: "10 Apr, 2025 14:22", amount: 15000, fromAcct: "01031720311714136516", toAcct: "01031720311714141122", userId: "USR-001", type: "Bill Payment", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882106", channelType: "POS", date: "09 Apr, 2025 20:10", amount: 4500, fromAcct: "01031720311714136516", toAcct: "MER-991", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Imtiaz Super Market", status: "Success" },
      { id: "TXN-882107", channelType: "Mobile", date: "08 Apr, 2025 09:45", amount: 2000, fromAcct: "01031720311714136516", toAcct: "03104567890", userId: "USR-001", type: "Top-up", currency: "PKR", channelName: "Jazz Cash", status: "Success" },
      { id: "TXN-882108", channelType: "Mobile", date: "07 Apr, 2025 11:20", amount: 12000, fromAcct: "01031720311714136516", toAcct: "01031720311714137744", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Failed" },
      { id: "TXN-882109", channelType: "ATM", date: "06 Apr, 2025 16:15", amount: 5000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-LHR-12", status: "Success" },
      { id: "TXN-882110", channelType: "POS", date: "05 Apr, 2025 13:30", amount: 8000, fromAcct: "01031720311714136516", toAcct: "MER-112", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Carrefour", status: "Success" },
      { id: "TXN-882111", channelType: "Web", date: "04 Apr, 2025 12:10", amount: 2000, fromAcct: "01031720311714136516", toAcct: "NETFLIX", userId: "USR-001", type: "Subscription", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882112", channelType: "Mobile", date: "03 Apr, 2025 15:40", amount: 30000, fromAcct: "01031720311714136516", toAcct: "01031720311714138855", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" }
    ],
    previousAttacks: [
      {
        type: "Attack",
        date: "16 Apr, 2025",
        time: "7:59 AM",
        fraudType: "Carding / BIN Attacks",
        amount: 156000.0,
        amountType: "Single Transaction",
        riskScore: 95,
      },
      {
        type: "Suspension",
        date: "12 Jan, 2025",
        time: "3:45 PM",
        fraudType: "Multiple Account Access",
        amount: 450000.0,
        amountType: "Total Fraud Amount",
        riskScore: 88,
      },
    ],
    ibftTransactions: [
      {
        date: "17/02/2026 11:25:58",
        amount: 20000,
        respCode: "00",
        procCode: "480000",
        mcc: "6011",
        merchantName: "SUMMIT BANK",
        location: "MOBILE",
        country: "586",
        posMode: "90",
        secOrg: "SUMIT",
        fromAcc: "01031720311714136516",
        benOrg: "MBL",
        benAcc: "04810113812301",
        msgType: "0220",
      },
      {
        date: "17/02/2026 11:21:44",
        amount: 22000,
        respCode: "00",
        procCode: "480000",
        mcc: "6011",
        merchantName: "SUMMIT BANK",
        location: "MOBILE",
        country: "586",
        posMode: "90",
        secOrg: "SUMIT",
        fromAcc: "01031720311714136516",
        benOrg: "MBL",
        benAcc: "04810113812301",
        msgType: "0220",
      },
      {
        date: "17/02/2026 11:14:17",
        amount: 22000,
        respCode: "00",
        procCode: "480000",
        mcc: "6011",
        merchantName: "SUMMIT BANK",
        location: "MOBILE",
        country: "586",
        posMode: "90",
        secOrg: "SUMIT",
        fromAcc: "01031720311714136516",
        benOrg: "MBL",
        benAcc: "04810113812301",
        msgType: "0220",
      },
      {
        date: "17/02/2026 00:53:37",
        amount: 20000,
        respCode: "00",
        procCode: "480000",
        mcc: "6011",
        merchantName: "SUMMIT BANK",
        location: "MOBILE",
        country: "586",
        posMode: "90",
        secOrg: "SUMIT",
        fromAcc: "01031720311714136516",
        benOrg: "MBL",
        benAcc: "02490103433084",
        msgType: "0220",
      },
    ],
    atmOnUsTransactions: [
      {
        date: "17/02/2026 09:15:22",
        amount: 30000,
        respCode: "00",
        procCode: "010000",
        mcc: "6011",
        merchantName: "ATM ON US",
        location: "Karachi Main",
        country: "586",
        posMode: "05",
        secOrg: "BAF",
        fromAcc: "01025220311714102757",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
    ],
    atmOfUsTransactions: [
      {
        date: "17/02/2026 10:22:10",
        amount: 15000,
        respCode: "00",
        procCode: "010000",
        mcc: "6011",
        merchantName: "1LINK OF US ATM",
        location: "Karachi Saddar",
        country: "586",
        posMode: "05",
        secOrg: "1LINK",
        fromAcc: "01025220311714102757",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
    ],
    posTransactions: [
      {
        date: "17/02/2026 08:04:56",
        amount: 536,
        respCode: "00",
        procCode: "000000",
        mcc: "5411",
        merchantName: "KIFAYAH PHARMACY AND",
        location: "Karachi",
        country: "586",
        posMode: "05",
        secOrg: "1LINK",
        fromAcc: "01025220311714102757",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
      {
        date: "17/02/2026 07:54:15",
        amount: 4124.6,
        respCode: "00",
        procCode: "000000",
        mcc: "5411",
        merchantName: "IMTIAZ STORES TS Tower",
        location: "Karachi",
        country: "586",
        posMode: "05",
        secOrg: "1LINK",
        fromAcc: "01025220311714102757",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
      {
        date: "17/02/2026 07:53:52",
        amount: 4124.6,
        respCode: "00",
        procCode: "000000",
        mcc: "5411",
        merchantName: "IMTIAZ STORES TS Tower",
        location: "Karachi",
        country: "586",
        posMode: "05",
        secOrg: "1LINK",
        fromAcc: "01025220311714102757",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
    ],
    cashWithdrawals: [
      {
        date: "17/02/2026 00:19:50",
        amount: 25000,
        respCode: "01",
        procCode: "010000",
        mcc: "6011",
        merchantName: "SHAH ALAM MARKET S&S",
        location: "LAHORE",
        country: "586",
        posMode: "05",
        secOrg: "BAF",
        fromAcc: "01033120311714115480",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
      {
        date: "17/02/2026 00:00:00",
        amount: 25000,
        respCode: "00",
        procCode: "010000",
        mcc: "6011",
        merchantName: "SHAH ALAM MARKET S&S",
        location: "LAHORE",
        country: "586",
        posMode: "05",
        secOrg: "BAF",
        fromAcc: "PK47SUMB0331027140115",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
      {
        date: "17/02/2026 11:33:43",
        amount: 25000,
        respCode: "00",
        procCode: "010000",
        mcc: "6011",
        merchantName: "SHAH ALAM MARKET S&S",
        location: "LAHORE",
        country: "586",
        posMode: "05",
        secOrg: "BAF",
        fromAcc: "PK47SUMB0331027140115",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
    ],
  },
  "7": {
    id: "7",
    name: "Ayesha Khan",
    transactionId: "HG-0331ZZY-02",
    globalId: "A987654XYZ210",
    age: 34,
    customerSince: "12 May, 2015",
    profession: "Software Engineer",
    gender: "Female",
    city: "Karachi",
    dob: "25 May, 1991",
    cnic: "42201-9876543-2",
    passport: "A9876543",
    maritalStatus: "Single",
    education: "Bachelor's Degree",
    address: "Apartment 4B, Clifton Block 5, Karachi",
    cnicExpiry: "25 May, 2031",
    passportExpiry: "10 Mar, 2033",
    blacklistFlag: "No",
    lastLoginDate: "27 Feb, 2026",
    phoneNo: "(+92) 300 - 1234567",
    email: "ayesha@example.com",
    accountAge: "10 years",
    highestAmount: 500000,
    lowestAmount: 1000.0,
    avgAmount: 25000.0,
    branchName: "DHA Branch, Karachi",
    branchLocation: "DHA Phase 6, Karachi, Sindh",
    alertTransactions: [],
    transactionHistory: [],
    previousAttacks: [],
    ibftTransactions: [],
    posTransactions: [],
    cashWithdrawals: [
      {
        date: "17/02/2026 00:19:50",
        amount: 50000,
        respCode: "01",
        procCode: "010000",
        mcc: "6011",
        merchantName: "ATM ON us",
        location: "KARACHI",
        country: "586",
        posMode: "05",
        secOrg: "BAF",
        fromAcc: "01033120311714115480",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
    ],
  },
  "8": {
    id: "8",
    name: "Zainab Ali",
    transactionId: "HG-0331ZZY-03",
    globalId: "B123456LMN987",
    age: 28,
    customerSince: "05 Jan, 2020",
    profession: "Teacher",
    gender: "Female",
    city: "Lahore",
    dob: "08 Jan, 1997",
    cnic: "35202-1234567-8",
    passport: "B1234567",
    maritalStatus: "Married",
    education: "Master's Degree",
    address: "House 45, Model Town, Lahore",
    cnicExpiry: "08 Jan, 2032",
    passportExpiry: "20 Jun, 2029",
    blacklistFlag: "No",
    lastLoginDate: "25 Feb, 2026",
    phoneNo: "(+92) 321 - 9876543",
    email: "z.ali@example.com",
    accountAge: "6 years",
    highestAmount: 150000,
    lowestAmount: 500.0,
    avgAmount: 12000.0,
    branchName: "Model Town Branch, Lahore",
    branchLocation: "Model Town, Lahore, Punjab",
    alertTransactions: [],
    transactionHistory: [],
    previousAttacks: [],
    ibftTransactions: [],
    posTransactions: [],
    cashWithdrawals: [
      {
        date: "17/02/2026 08:19:50",
        amount: 25000,
        respCode: "01",
        procCode: "010000",
        mcc: "6011",
        merchantName: "ATM Of us",
        location: "LAHORE",
        country: "586",
        posMode: "05",
        secOrg: "BAF",
        fromAcc: "01033120311714115480",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
    ],
  },
  "9": {
    id: "9",
    name: "Fahad Mustafa",
    transactionId: "HG-0331ZZY-04",
    globalId: "C987654MNO321",
    age: 45,
    customerSince: "10 Mar, 2012",
    profession: "Businessman",
    gender: "Male",
    city: "Islamabad",
    dob: "15 Mar, 1980",
    cnic: "37405-5555555-5",
    passport: "C9876543",
    maritalStatus: "Single",
    education: "PhD",
    address: "Villa 12, Blue Area, Islamabad",
    cnicExpiry: "15 Mar, 2035",
    passportExpiry: "12 Dec, 2031",
    blacklistFlag: "No",
    lastLoginDate: "26 Feb, 2026",
    phoneNo: "(+92) 333 - 4445556",
    email: "fahad@example.com",
    accountAge: "14 years",
    highestAmount: 5000000,
    lowestAmount: 10000.0,
    avgAmount: 150000.0,
    branchName: "Blue Area Branch, Islamabad",
    branchLocation: "Blue Area, Islamabad",
    alertTransactions: [],
    transactionHistory: [],
    previousAttacks: [],
    ibftTransactions: [],
    posTransactions: [],
    cashWithdrawals: [
      {
        date: "17/02/2026 14:19:50",
        amount: 150000,
        respCode: "01",
        procCode: "010000",
        mcc: "6011",
        merchantName: "Withdrawal Large",
        location: "ISLAMABAD",
        country: "586",
        posMode: "05",
        secOrg: "BAF",
        fromAcc: "01033120311714115480",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
    ],
  },
  "2": {
      "transactionId": "HG-0331ZZY-01",
      "age": 52,
      "customerSince": "20 Aug, 2007",
      "profession": "Talent Manager",
      "gender": "Male",
      "dob": "12 Oct, 1972",
      "cnic": "42101-1234567-1",
      "passport": "P436691BNC140",
      "maritalStatus": "Married",
      "education": "Master's Degree",
      "address": "House 123, Street 5, DHA Phase 6, Lahore",
      "cnicExpiry": "12 Oct, 2028",
      "passportExpiry": "15 Jan, 2030",
      "blacklistFlag": "No",
      "lastLoginDate": "11 Mar, 2018",
      "devices": [
          {
              "id": "DEV-98210",
              "name": "iPhone 15 Pro",
              "userId": "USR-001",
              "os": "iOS 17.2",
              "osType": "Mobile",
              "status": "Active",
              "lastLogin": "10 Apr, 2025 14:30",
              "logout": "10 Apr, 2025 22:15"
          }
      ],
      "accounts": [
          {
              "number": "01031720311714136516",
              "status": "Active",
              "iban": "PK47SUMB0000010317203117",
              "balance": 450000,
              "joint": "No",
              "address": "House 123, Street 4, DHA Phase 5",
              "age": "5 Years",
              "type": "Current",
              "branch": "0103",
              "glCode": "100201",
              "currency": "PKR",
              "openingDate": "12 May, 2019"
          }
      ],
      "beneficiaries": [
          {
              "id": "BEN-5521",
              "custCnic": "42101-1234567-1",
              "addDateTime": "15 Jan, 2024 10:20",
              "custAcctNo": "01031720311714136516",
              "iban": "PK47SUMB0331027140115",
              "acctNo": "0331027140115",
              "name": "Ahmed Ali",
              "bank": "Summit Bank"
          }
      ],
      "phoneNo": "(+92) 310 - 4567890",
      "email": "example@customer.com",
      "accountAge": "18 years",
      "highestAmount": 25000000,
      "lowestAmount": 3500,
      "avgAmount": 11500,
      "branchName": "Main Branch, Lahore",
      "branchLocation": "Central Area, Lahore",
      "alertTransactions": [],
      "transactionHistory": [
      { id: "TXN-882103", channelType: "Mobile", date: "12 Apr, 2025 10:15", amount: 50000, fromAcct: "01031720311714136516", toAcct: "01031720311714139988", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" },
      { id: "TXN-882104", channelType: "ATM", date: "11 Apr, 2025 18:30", amount: 25000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-KHI-05", status: "Success" },
      { id: "TXN-882105", channelType: "Web", date: "10 Apr, 2025 14:22", amount: 15000, fromAcct: "01031720311714136516", toAcct: "01031720311714141122", userId: "USR-001", type: "Bill Payment", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882106", channelType: "POS", date: "09 Apr, 2025 20:10", amount: 4500, fromAcct: "01031720311714136516", toAcct: "MER-991", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Imtiaz Super Market", status: "Success" },
      { id: "TXN-882107", channelType: "Mobile", date: "08 Apr, 2025 09:45", amount: 2000, fromAcct: "01031720311714136516", toAcct: "03104567890", userId: "USR-001", type: "Top-up", currency: "PKR", channelName: "Jazz Cash", status: "Success" },
      { id: "TXN-882108", channelType: "Mobile", date: "07 Apr, 2025 11:20", amount: 12000, fromAcct: "01031720311714136516", toAcct: "01031720311714137744", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Failed" },
      { id: "TXN-882109", channelType: "ATM", date: "06 Apr, 2025 16:15", amount: 5000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-LHR-12", status: "Success" },
      { id: "TXN-882110", channelType: "POS", date: "05 Apr, 2025 13:30", amount: 8000, fromAcct: "01031720311714136516", toAcct: "MER-112", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Carrefour", status: "Success" },
      { id: "TXN-882111", channelType: "Web", date: "04 Apr, 2025 12:10", amount: 2000, fromAcct: "01031720311714136516", toAcct: "NETFLIX", userId: "USR-001", type: "Subscription", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882112", channelType: "Mobile", date: "03 Apr, 2025 15:40", amount: 30000, fromAcct: "01031720311714136516", toAcct: "01031720311714138855", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" }
    ],
      "previousAttacks": [],
      "ibftTransactions": [],
      "posTransactions": [],
      "cashWithdrawals": [],
      "id": "2",
      "name": "Obaid Mehmood",
      "city": "Lahore",
      "globalId": "P436691BNC140",
      "idType": "Passport"
  },
  "3": {
      "transactionId": "HG-0331ZZY-01",
      "age": 52,
      "customerSince": "20 Aug, 2007",
      "profession": "Talent Manager",
      "gender": "Male",
      "dob": "12 Oct, 1972",
      "cnic": "42301-26920823-3",
      "passport": "P1234567",
      "maritalStatus": "Married",
      "education": "Master's Degree",
      "address": "House 123, Street 5, DHA Phase 6, Islamabad",
      "cnicExpiry": "12 Oct, 2028",
      "passportExpiry": "15 Jan, 2030",
      "blacklistFlag": "No",
      "lastLoginDate": "11 Mar, 2018",
      "devices": [
          {
              "id": "DEV-98210",
              "name": "iPhone 15 Pro",
              "userId": "USR-001",
              "os": "iOS 17.2",
              "osType": "Mobile",
              "status": "Active",
              "lastLogin": "10 Apr, 2025 14:30",
              "logout": "10 Apr, 2025 22:15"
          }
      ],
      "accounts": [
          {
              "number": "01031720311714136516",
              "status": "Active",
              "iban": "PK47SUMB0000010317203117",
              "balance": 450000,
              "joint": "No",
              "address": "House 123, Street 4, DHA Phase 5",
              "age": "5 Years",
              "type": "Current",
              "branch": "0103",
              "glCode": "100201",
              "currency": "PKR",
              "openingDate": "12 May, 2019"
          }
      ],
      "beneficiaries": [
          {
              "id": "BEN-5521",
              "custCnic": "42101-1234567-1",
              "addDateTime": "15 Jan, 2024 10:20",
              "custAcctNo": "01031720311714136516",
              "iban": "PK47SUMB0331027140115",
              "acctNo": "0331027140115",
              "name": "Ahmed Ali",
              "bank": "Summit Bank"
          }
      ],
      "phoneNo": "(+92) 310 - 4567890",
      "email": "example@customer.com",
      "accountAge": "18 years",
      "highestAmount": 25000000,
      "lowestAmount": 3500,
      "avgAmount": 11500,
      "branchName": "Main Branch, Islamabad",
      "branchLocation": "Central Area, Islamabad",
      "alertTransactions": [],
      "transactionHistory": [
      { id: "TXN-882103", channelType: "Mobile", date: "12 Apr, 2025 10:15", amount: 50000, fromAcct: "01031720311714136516", toAcct: "01031720311714139988", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" },
      { id: "TXN-882104", channelType: "ATM", date: "11 Apr, 2025 18:30", amount: 25000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-KHI-05", status: "Success" },
      { id: "TXN-882105", channelType: "Web", date: "10 Apr, 2025 14:22", amount: 15000, fromAcct: "01031720311714136516", toAcct: "01031720311714141122", userId: "USR-001", type: "Bill Payment", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882106", channelType: "POS", date: "09 Apr, 2025 20:10", amount: 4500, fromAcct: "01031720311714136516", toAcct: "MER-991", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Imtiaz Super Market", status: "Success" },
      { id: "TXN-882107", channelType: "Mobile", date: "08 Apr, 2025 09:45", amount: 2000, fromAcct: "01031720311714136516", toAcct: "03104567890", userId: "USR-001", type: "Top-up", currency: "PKR", channelName: "Jazz Cash", status: "Success" },
      { id: "TXN-882108", channelType: "Mobile", date: "07 Apr, 2025 11:20", amount: 12000, fromAcct: "01031720311714136516", toAcct: "01031720311714137744", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Failed" },
      { id: "TXN-882109", channelType: "ATM", date: "06 Apr, 2025 16:15", amount: 5000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-LHR-12", status: "Success" },
      { id: "TXN-882110", channelType: "POS", date: "05 Apr, 2025 13:30", amount: 8000, fromAcct: "01031720311714136516", toAcct: "MER-112", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Carrefour", status: "Success" },
      { id: "TXN-882111", channelType: "Web", date: "04 Apr, 2025 12:10", amount: 2000, fromAcct: "01031720311714136516", toAcct: "NETFLIX", userId: "USR-001", type: "Subscription", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882112", channelType: "Mobile", date: "03 Apr, 2025 15:40", amount: 30000, fromAcct: "01031720311714136516", toAcct: "01031720311714138855", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" }
    ],
      "previousAttacks": [],
      "ibftTransactions": [],
      "posTransactions": [],
      "cashWithdrawals": [],
      "id": "3",
      "name": "Abid Ali",
      "city": "Islamabad",
      "globalId": "42301-26920823-3",
      "idType": "CNIC"
  },
  "4": {
      "transactionId": "HG-0331ZZY-01",
      "age": 52,
      "customerSince": "20 Aug, 2007",
      "profession": "Talent Manager",
      "gender": "Male",
      "dob": "12 Oct, 1972",
      "cnic": "42101-1234567-1",
      "passport": "P436691BNC140",
      "maritalStatus": "Married",
      "education": "Master's Degree",
      "address": "House 123, Street 5, DHA Phase 6, Karachi",
      "cnicExpiry": "12 Oct, 2028",
      "passportExpiry": "15 Jan, 2030",
      "blacklistFlag": "No",
      "lastLoginDate": "11 Mar, 2018",
      "devices": [
          {
              "id": "DEV-98210",
              "name": "iPhone 15 Pro",
              "userId": "USR-001",
              "os": "iOS 17.2",
              "osType": "Mobile",
              "status": "Active",
              "lastLogin": "10 Apr, 2025 14:30",
              "logout": "10 Apr, 2025 22:15"
          }
      ],
      "accounts": [
          {
              "number": "01031720311714136516",
              "status": "Active",
              "iban": "PK47SUMB0000010317203117",
              "balance": 450000,
              "joint": "No",
              "address": "House 123, Street 4, DHA Phase 5",
              "age": "5 Years",
              "type": "Current",
              "branch": "0103",
              "glCode": "100201",
              "currency": "PKR",
              "openingDate": "12 May, 2019"
          }
      ],
      "beneficiaries": [
          {
              "id": "BEN-5521",
              "custCnic": "42101-1234567-1",
              "addDateTime": "15 Jan, 2024 10:20",
              "custAcctNo": "01031720311714136516",
              "iban": "PK47SUMB0331027140115",
              "acctNo": "0331027140115",
              "name": "Ahmed Ali",
              "bank": "Summit Bank"
          }
      ],
      "phoneNo": "(+92) 310 - 4567890",
      "email": "example@customer.com",
      "accountAge": "18 years",
      "highestAmount": 25000000,
      "lowestAmount": 3500,
      "avgAmount": 11500,
      "branchName": "Main Branch, Karachi",
      "branchLocation": "Central Area, Karachi",
      "alertTransactions": [],
      "transactionHistory": [
      { id: "TXN-882103", channelType: "Mobile", date: "12 Apr, 2025 10:15", amount: 50000, fromAcct: "01031720311714136516", toAcct: "01031720311714139988", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" },
      { id: "TXN-882104", channelType: "ATM", date: "11 Apr, 2025 18:30", amount: 25000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-KHI-05", status: "Success" },
      { id: "TXN-882105", channelType: "Web", date: "10 Apr, 2025 14:22", amount: 15000, fromAcct: "01031720311714136516", toAcct: "01031720311714141122", userId: "USR-001", type: "Bill Payment", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882106", channelType: "POS", date: "09 Apr, 2025 20:10", amount: 4500, fromAcct: "01031720311714136516", toAcct: "MER-991", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Imtiaz Super Market", status: "Success" },
      { id: "TXN-882107", channelType: "Mobile", date: "08 Apr, 2025 09:45", amount: 2000, fromAcct: "01031720311714136516", toAcct: "03104567890", userId: "USR-001", type: "Top-up", currency: "PKR", channelName: "Jazz Cash", status: "Success" },
      { id: "TXN-882108", channelType: "Mobile", date: "07 Apr, 2025 11:20", amount: 12000, fromAcct: "01031720311714136516", toAcct: "01031720311714137744", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Failed" },
      { id: "TXN-882109", channelType: "ATM", date: "06 Apr, 2025 16:15", amount: 5000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-LHR-12", status: "Success" },
      { id: "TXN-882110", channelType: "POS", date: "05 Apr, 2025 13:30", amount: 8000, fromAcct: "01031720311714136516", toAcct: "MER-112", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Carrefour", status: "Success" },
      { id: "TXN-882111", channelType: "Web", date: "04 Apr, 2025 12:10", amount: 2000, fromAcct: "01031720311714136516", toAcct: "NETFLIX", userId: "USR-001", type: "Subscription", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882112", channelType: "Mobile", date: "03 Apr, 2025 15:40", amount: 30000, fromAcct: "01031720311714136516", toAcct: "01031720311714138855", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" }
    ],
      "previousAttacks": [],
      "ibftTransactions": [],
      "posTransactions": [],
      "cashWithdrawals": [],
      "id": "4",
      "name": "Mustafa Mahmood",
      "city": "Karachi",
      "globalId": "P436691BNC140",
      "idType": "Passport"
  },
  "5": {
      "transactionId": "HG-0331ZZY-01",
      "age": 52,
      "customerSince": "20 Aug, 2007",
      "profession": "Talent Manager",
      "gender": "Male",
      "dob": "12 Oct, 1972",
      "cnic": "42101-1234567-1",
      "passport": "P436691BNC140",
      "maritalStatus": "Married",
      "education": "Master's Degree",
      "address": "House 123, Street 5, DHA Phase 6, Multan",
      "cnicExpiry": "12 Oct, 2028",
      "passportExpiry": "15 Jan, 2030",
      "blacklistFlag": "No",
      "lastLoginDate": "11 Mar, 2018",
      "devices": [
          {
              "id": "DEV-98210",
              "name": "iPhone 15 Pro",
              "userId": "USR-001",
              "os": "iOS 17.2",
              "osType": "Mobile",
              "status": "Active",
              "lastLogin": "10 Apr, 2025 14:30",
              "logout": "10 Apr, 2025 22:15"
          }
      ],
      "accounts": [
          {
              "number": "01031720311714136516",
              "status": "Active",
              "iban": "PK47SUMB0000010317203117",
              "balance": 450000,
              "joint": "No",
              "address": "House 123, Street 4, DHA Phase 5",
              "age": "5 Years",
              "type": "Current",
              "branch": "0103",
              "glCode": "100201",
              "currency": "PKR",
              "openingDate": "12 May, 2019"
          }
      ],
      "beneficiaries": [
          {
              "id": "BEN-5521",
              "custCnic": "42101-1234567-1",
              "addDateTime": "15 Jan, 2024 10:20",
              "custAcctNo": "01031720311714136516",
              "iban": "PK47SUMB0331027140115",
              "acctNo": "0331027140115",
              "name": "Ahmed Ali",
              "bank": "Summit Bank"
          }
      ],
      "phoneNo": "(+92) 310 - 4567890",
      "email": "example@customer.com",
      "accountAge": "18 years",
      "highestAmount": 25000000,
      "lowestAmount": 3500,
      "avgAmount": 11500,
      "branchName": "Main Branch, Multan",
      "branchLocation": "Central Area, Multan",
      "alertTransactions": [],
      "transactionHistory": [
      { id: "TXN-882103", channelType: "Mobile", date: "12 Apr, 2025 10:15", amount: 50000, fromAcct: "01031720311714136516", toAcct: "01031720311714139988", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" },
      { id: "TXN-882104", channelType: "ATM", date: "11 Apr, 2025 18:30", amount: 25000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-KHI-05", status: "Success" },
      { id: "TXN-882105", channelType: "Web", date: "10 Apr, 2025 14:22", amount: 15000, fromAcct: "01031720311714136516", toAcct: "01031720311714141122", userId: "USR-001", type: "Bill Payment", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882106", channelType: "POS", date: "09 Apr, 2025 20:10", amount: 4500, fromAcct: "01031720311714136516", toAcct: "MER-991", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Imtiaz Super Market", status: "Success" },
      { id: "TXN-882107", channelType: "Mobile", date: "08 Apr, 2025 09:45", amount: 2000, fromAcct: "01031720311714136516", toAcct: "03104567890", userId: "USR-001", type: "Top-up", currency: "PKR", channelName: "Jazz Cash", status: "Success" },
      { id: "TXN-882108", channelType: "Mobile", date: "07 Apr, 2025 11:20", amount: 12000, fromAcct: "01031720311714136516", toAcct: "01031720311714137744", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Failed" },
      { id: "TXN-882109", channelType: "ATM", date: "06 Apr, 2025 16:15", amount: 5000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-LHR-12", status: "Success" },
      { id: "TXN-882110", channelType: "POS", date: "05 Apr, 2025 13:30", amount: 8000, fromAcct: "01031720311714136516", toAcct: "MER-112", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Carrefour", status: "Success" },
      { id: "TXN-882111", channelType: "Web", date: "04 Apr, 2025 12:10", amount: 2000, fromAcct: "01031720311714136516", toAcct: "NETFLIX", userId: "USR-001", type: "Subscription", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882112", channelType: "Mobile", date: "03 Apr, 2025 15:40", amount: 30000, fromAcct: "01031720311714136516", toAcct: "01031720311714138855", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" }
    ],
      "previousAttacks": [],
      "ibftTransactions": [],
      "posTransactions": [],
      "cashWithdrawals": [],
      "id": "5",
      "name": "Kelvin Harris",
      "city": "Multan",
      "globalId": "P436691BNC140",
      "idType": "Passport"
  },
  "6": {
      "transactionId": "HG-0331ZZY-01",
      "age": 52,
      "customerSince": "20 Aug, 2007",
      "profession": "Talent Manager",
      "gender": "Male",
      "dob": "12 Oct, 1972",
      "cnic": "42101-1234567-1",
      "passport": "P436691BNC140",
      "maritalStatus": "Married",
      "education": "Master's Degree",
      "address": "House 123, Street 5, DHA Phase 6, Hyderabad",
      "cnicExpiry": "12 Oct, 2028",
      "passportExpiry": "15 Jan, 2030",
      "blacklistFlag": "No",
      "lastLoginDate": "11 Mar, 2018",
      "devices": [
          {
              "id": "DEV-98210",
              "name": "iPhone 15 Pro",
              "userId": "USR-001",
              "os": "iOS 17.2",
              "osType": "Mobile",
              "status": "Active",
              "lastLogin": "10 Apr, 2025 14:30",
              "logout": "10 Apr, 2025 22:15"
          }
      ],
      "accounts": [
          {
              "number": "01031720311714136516",
              "status": "Active",
              "iban": "PK47SUMB0000010317203117",
              "balance": 450000,
              "joint": "No",
              "address": "House 123, Street 4, DHA Phase 5",
              "age": "5 Years",
              "type": "Current",
              "branch": "0103",
              "glCode": "100201",
              "currency": "PKR",
              "openingDate": "12 May, 2019"
          }
      ],
      "beneficiaries": [
          {
              "id": "BEN-5521",
              "custCnic": "42101-1234567-1",
              "addDateTime": "15 Jan, 2024 10:20",
              "custAcctNo": "01031720311714136516",
              "iban": "PK47SUMB0331027140115",
              "acctNo": "0331027140115",
              "name": "Ahmed Ali",
              "bank": "Summit Bank"
          }
      ],
      "phoneNo": "(+92) 310 - 4567890",
      "email": "example@customer.com",
      "accountAge": "18 years",
      "highestAmount": 25000000,
      "lowestAmount": 3500,
      "avgAmount": 11500,
      "branchName": "Main Branch, Hyderabad",
      "branchLocation": "Central Area, Hyderabad",
      "alertTransactions": [],
      "transactionHistory": [
      { id: "TXN-882103", channelType: "Mobile", date: "12 Apr, 2025 10:15", amount: 50000, fromAcct: "01031720311714136516", toAcct: "01031720311714139988", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" },
      { id: "TXN-882104", channelType: "ATM", date: "11 Apr, 2025 18:30", amount: 25000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-KHI-05", status: "Success" },
      { id: "TXN-882105", channelType: "Web", date: "10 Apr, 2025 14:22", amount: 15000, fromAcct: "01031720311714136516", toAcct: "01031720311714141122", userId: "USR-001", type: "Bill Payment", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882106", channelType: "POS", date: "09 Apr, 2025 20:10", amount: 4500, fromAcct: "01031720311714136516", toAcct: "MER-991", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Imtiaz Super Market", status: "Success" },
      { id: "TXN-882107", channelType: "Mobile", date: "08 Apr, 2025 09:45", amount: 2000, fromAcct: "01031720311714136516", toAcct: "03104567890", userId: "USR-001", type: "Top-up", currency: "PKR", channelName: "Jazz Cash", status: "Success" },
      { id: "TXN-882108", channelType: "Mobile", date: "07 Apr, 2025 11:20", amount: 12000, fromAcct: "01031720311714136516", toAcct: "01031720311714137744", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Failed" },
      { id: "TXN-882109", channelType: "ATM", date: "06 Apr, 2025 16:15", amount: 5000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-LHR-12", status: "Success" },
      { id: "TXN-882110", channelType: "POS", date: "05 Apr, 2025 13:30", amount: 8000, fromAcct: "01031720311714136516", toAcct: "MER-112", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Carrefour", status: "Success" },
      { id: "TXN-882111", channelType: "Web", date: "04 Apr, 2025 12:10", amount: 2000, fromAcct: "01031720311714136516", toAcct: "NETFLIX", userId: "USR-001", type: "Subscription", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882112", channelType: "Mobile", date: "03 Apr, 2025 15:40", amount: 30000, fromAcct: "01031720311714136516", toAcct: "01031720311714138855", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" }
    ],
      "previousAttacks": [],
      "ibftTransactions": [],
      "posTransactions": [],
      "cashWithdrawals": [],
      "id": "6",
      "name": "Obaid Mehmood",
      "city": "Hyderabad",
      "globalId": "P436691BNC140",
      "idType": "Passport"
  },
  "7": {
      "transactionId": "HG-0331ZZY-01",
      "age": 52,
      "customerSince": "20 Aug, 2007",
      "profession": "Talent Manager",
      "gender": "Female",
      "dob": "12 Oct, 1972",
      "cnic": "A987654XYZ210",
      "passport": "P1234567",
      "maritalStatus": "Married",
      "education": "Master's Degree",
      "address": "House 123, Street 5, DHA Phase 6, Karachi",
      "cnicExpiry": "12 Oct, 2028",
      "passportExpiry": "15 Jan, 2030",
      "blacklistFlag": "No",
      "lastLoginDate": "11 Mar, 2018",
      "devices": [
          {
              "id": "DEV-98210",
              "name": "iPhone 15 Pro",
              "userId": "USR-001",
              "os": "iOS 17.2",
              "osType": "Mobile",
              "status": "Active",
              "lastLogin": "10 Apr, 2025 14:30",
              "logout": "10 Apr, 2025 22:15"
          }
      ],
      "accounts": [
          {
              "number": "01031720311714136516",
              "status": "Active",
              "iban": "PK47SUMB0000010317203117",
              "balance": 450000,
              "joint": "No",
              "address": "House 123, Street 4, DHA Phase 5",
              "age": "5 Years",
              "type": "Current",
              "branch": "0103",
              "glCode": "100201",
              "currency": "PKR",
              "openingDate": "12 May, 2019"
          }
      ],
      "beneficiaries": [
          {
              "id": "BEN-5521",
              "custCnic": "42101-1234567-1",
              "addDateTime": "15 Jan, 2024 10:20",
              "custAcctNo": "01031720311714136516",
              "iban": "PK47SUMB0331027140115",
              "acctNo": "0331027140115",
              "name": "Ahmed Ali",
              "bank": "Summit Bank"
          }
      ],
      "phoneNo": "(+92) 310 - 4567890",
      "email": "example@customer.com",
      "accountAge": "18 years",
      "highestAmount": 25000000,
      "lowestAmount": 3500,
      "avgAmount": 11500,
      "branchName": "Main Branch, Karachi",
      "branchLocation": "Central Area, Karachi",
      "alertTransactions": [],
      "transactionHistory": [
      { id: "TXN-882103", channelType: "Mobile", date: "12 Apr, 2025 10:15", amount: 50000, fromAcct: "01031720311714136516", toAcct: "01031720311714139988", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" },
      { id: "TXN-882104", channelType: "ATM", date: "11 Apr, 2025 18:30", amount: 25000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-KHI-05", status: "Success" },
      { id: "TXN-882105", channelType: "Web", date: "10 Apr, 2025 14:22", amount: 15000, fromAcct: "01031720311714136516", toAcct: "01031720311714141122", userId: "USR-001", type: "Bill Payment", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882106", channelType: "POS", date: "09 Apr, 2025 20:10", amount: 4500, fromAcct: "01031720311714136516", toAcct: "MER-991", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Imtiaz Super Market", status: "Success" },
      { id: "TXN-882107", channelType: "Mobile", date: "08 Apr, 2025 09:45", amount: 2000, fromAcct: "01031720311714136516", toAcct: "03104567890", userId: "USR-001", type: "Top-up", currency: "PKR", channelName: "Jazz Cash", status: "Success" },
      { id: "TXN-882108", channelType: "Mobile", date: "07 Apr, 2025 11:20", amount: 12000, fromAcct: "01031720311714136516", toAcct: "01031720311714137744", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Failed" },
      { id: "TXN-882109", channelType: "ATM", date: "06 Apr, 2025 16:15", amount: 5000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-LHR-12", status: "Success" },
      { id: "TXN-882110", channelType: "POS", date: "05 Apr, 2025 13:30", amount: 8000, fromAcct: "01031720311714136516", toAcct: "MER-112", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Carrefour", status: "Success" },
      { id: "TXN-882111", channelType: "Web", date: "04 Apr, 2025 12:10", amount: 2000, fromAcct: "01031720311714136516", toAcct: "NETFLIX", userId: "USR-001", type: "Subscription", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882112", channelType: "Mobile", date: "03 Apr, 2025 15:40", amount: 30000, fromAcct: "01031720311714136516", toAcct: "01031720311714138855", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" }
    ],
      "previousAttacks": [],
      "ibftTransactions": [],
      "posTransactions": [],
      "cashWithdrawals": [],
      "id": "7",
      "name": "Ayesha Khan",
      "city": "Karachi",
      "globalId": "A987654XYZ210",
      "idType": "CNIC"
  },
  "8": {
      "transactionId": "HG-0331ZZY-01",
      "age": 52,
      "customerSince": "20 Aug, 2007",
      "profession": "Talent Manager",
      "gender": "Female",
      "dob": "12 Oct, 1972",
      "cnic": "42101-1234567-1",
      "passport": "B123456LMN987",
      "maritalStatus": "Married",
      "education": "Master's Degree",
      "address": "House 123, Street 5, DHA Phase 6, Lahore",
      "cnicExpiry": "12 Oct, 2028",
      "passportExpiry": "15 Jan, 2030",
      "blacklistFlag": "No",
      "lastLoginDate": "11 Mar, 2018",
      "devices": [
          {
              "id": "DEV-98210",
              "name": "iPhone 15 Pro",
              "userId": "USR-001",
              "os": "iOS 17.2",
              "osType": "Mobile",
              "status": "Active",
              "lastLogin": "10 Apr, 2025 14:30",
              "logout": "10 Apr, 2025 22:15"
          }
      ],
      "accounts": [
          {
              "number": "01031720311714136516",
              "status": "Active",
              "iban": "PK47SUMB0000010317203117",
              "balance": 450000,
              "joint": "No",
              "address": "House 123, Street 4, DHA Phase 5",
              "age": "5 Years",
              "type": "Current",
              "branch": "0103",
              "glCode": "100201",
              "currency": "PKR",
              "openingDate": "12 May, 2019"
          }
      ],
      "beneficiaries": [
          {
              "id": "BEN-5521",
              "custCnic": "42101-1234567-1",
              "addDateTime": "15 Jan, 2024 10:20",
              "custAcctNo": "01031720311714136516",
              "iban": "PK47SUMB0331027140115",
              "acctNo": "0331027140115",
              "name": "Ahmed Ali",
              "bank": "Summit Bank"
          }
      ],
      "phoneNo": "(+92) 310 - 4567890",
      "email": "example@customer.com",
      "accountAge": "18 years",
      "highestAmount": 25000000,
      "lowestAmount": 3500,
      "avgAmount": 11500,
      "branchName": "Main Branch, Lahore",
      "branchLocation": "Central Area, Lahore",
      "alertTransactions": [],
      "transactionHistory": [
      { id: "TXN-882103", channelType: "Mobile", date: "12 Apr, 2025 10:15", amount: 50000, fromAcct: "01031720311714136516", toAcct: "01031720311714139988", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" },
      { id: "TXN-882104", channelType: "ATM", date: "11 Apr, 2025 18:30", amount: 25000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-KHI-05", status: "Success" },
      { id: "TXN-882105", channelType: "Web", date: "10 Apr, 2025 14:22", amount: 15000, fromAcct: "01031720311714136516", toAcct: "01031720311714141122", userId: "USR-001", type: "Bill Payment", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882106", channelType: "POS", date: "09 Apr, 2025 20:10", amount: 4500, fromAcct: "01031720311714136516", toAcct: "MER-991", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Imtiaz Super Market", status: "Success" },
      { id: "TXN-882107", channelType: "Mobile", date: "08 Apr, 2025 09:45", amount: 2000, fromAcct: "01031720311714136516", toAcct: "03104567890", userId: "USR-001", type: "Top-up", currency: "PKR", channelName: "Jazz Cash", status: "Success" },
      { id: "TXN-882108", channelType: "Mobile", date: "07 Apr, 2025 11:20", amount: 12000, fromAcct: "01031720311714136516", toAcct: "01031720311714137744", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Failed" },
      { id: "TXN-882109", channelType: "ATM", date: "06 Apr, 2025 16:15", amount: 5000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-LHR-12", status: "Success" },
      { id: "TXN-882110", channelType: "POS", date: "05 Apr, 2025 13:30", amount: 8000, fromAcct: "01031720311714136516", toAcct: "MER-112", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Carrefour", status: "Success" },
      { id: "TXN-882111", channelType: "Web", date: "04 Apr, 2025 12:10", amount: 2000, fromAcct: "01031720311714136516", toAcct: "NETFLIX", userId: "USR-001", type: "Subscription", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882112", channelType: "Mobile", date: "03 Apr, 2025 15:40", amount: 30000, fromAcct: "01031720311714136516", toAcct: "01031720311714138855", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" }
    ],
      "previousAttacks": [],
      "ibftTransactions": [],
      "posTransactions": [],
      "cashWithdrawals": [],
      "id": "8",
      "name": "Zainab Ali",
      "city": "Lahore",
      "globalId": "B123456LMN987",
      "idType": "Passport"
  },
  "43": {
      "transactionId": "HG-0331ZZY-01",
      "age": 52,
      "customerSince": "20 Aug, 2007",
      "profession": "Talent Manager",
      "gender": "Male",
      "dob": "12 Oct, 1972",
      "cnic": "B123456LM0123",
      "passport": "P1234567",
      "maritalStatus": "Married",
      "education": "Master's Degree",
      "address": "House 123, Street 5, DHA Phase 6, Karachi",
      "cnicExpiry": "12 Oct, 2028",
      "passportExpiry": "15 Jan, 2030",
      "blacklistFlag": "No",
      "lastLoginDate": "11 Mar, 2018",
      "devices": [
          {
              "id": "DEV-98210",
              "name": "iPhone 15 Pro",
              "userId": "USR-001",
              "os": "iOS 17.2",
              "osType": "Mobile",
              "status": "Active",
              "lastLogin": "10 Apr, 2025 14:30",
              "logout": "10 Apr, 2025 22:15"
          }
      ],
      "accounts": [
          {
              "number": "01031720311714136516",
              "status": "Active",
              "iban": "PK47SUMB0000010317203117",
              "balance": 450000,
              "joint": "No",
              "address": "House 123, Street 4, DHA Phase 5",
              "age": "5 Years",
              "type": "Current",
              "branch": "0103",
              "glCode": "100201",
              "currency": "PKR",
              "openingDate": "12 May, 2019"
          }
      ],
      "beneficiaries": [
          {
              "id": "BEN-5521",
              "custCnic": "42101-1234567-1",
              "addDateTime": "15 Jan, 2024 10:20",
              "custAcctNo": "01031720311714136516",
              "iban": "PK47SUMB0331027140115",
              "acctNo": "0331027140115",
              "name": "Ahmed Ali",
              "bank": "Summit Bank"
          }
      ],
      "phoneNo": "(+92) 310 - 4567890",
      "email": "example@customer.com",
      "accountAge": "18 years",
      "highestAmount": 25000000,
      "lowestAmount": 3500,
      "avgAmount": 11500,
      "branchName": "Main Branch, Karachi",
      "branchLocation": "Central Area, Karachi",
      "alertTransactions": [],
      "transactionHistory": [
      { id: "TXN-882103", channelType: "Mobile", date: "12 Apr, 2025 10:15", amount: 50000, fromAcct: "01031720311714136516", toAcct: "01031720311714139988", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" },
      { id: "TXN-882104", channelType: "ATM", date: "11 Apr, 2025 18:30", amount: 25000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-KHI-05", status: "Success" },
      { id: "TXN-882105", channelType: "Web", date: "10 Apr, 2025 14:22", amount: 15000, fromAcct: "01031720311714136516", toAcct: "01031720311714141122", userId: "USR-001", type: "Bill Payment", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882106", channelType: "POS", date: "09 Apr, 2025 20:10", amount: 4500, fromAcct: "01031720311714136516", toAcct: "MER-991", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Imtiaz Super Market", status: "Success" },
      { id: "TXN-882107", channelType: "Mobile", date: "08 Apr, 2025 09:45", amount: 2000, fromAcct: "01031720311714136516", toAcct: "03104567890", userId: "USR-001", type: "Top-up", currency: "PKR", channelName: "Jazz Cash", status: "Success" },
      { id: "TXN-882108", channelType: "Mobile", date: "07 Apr, 2025 11:20", amount: 12000, fromAcct: "01031720311714136516", toAcct: "01031720311714137744", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Failed" },
      { id: "TXN-882109", channelType: "ATM", date: "06 Apr, 2025 16:15", amount: 5000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-LHR-12", status: "Success" },
      { id: "TXN-882110", channelType: "POS", date: "05 Apr, 2025 13:30", amount: 8000, fromAcct: "01031720311714136516", toAcct: "MER-112", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Carrefour", status: "Success" },
      { id: "TXN-882111", channelType: "Web", date: "04 Apr, 2025 12:10", amount: 2000, fromAcct: "01031720311714136516", toAcct: "NETFLIX", userId: "USR-001", type: "Subscription", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882112", channelType: "Mobile", date: "03 Apr, 2025 15:40", amount: 30000, fromAcct: "01031720311714136516", toAcct: "01031720311714138855", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" }
    ],
      "previousAttacks": [],
      "ibftTransactions": [],
      "posTransactions": [],
      "cashWithdrawals": [],
      "id": "43",
      "name": "Zaheer Ali",
      "city": "Karachi",
      "globalId": "B123456LM0123",
      "idType": "CNIC"
  },
  "9": {
      "transactionId": "HG-0331ZZY-01",
      "age": 52,
      "customerSince": "20 Aug, 2007",
      "profession": "Talent Manager",
      "gender": "Male",
      "dob": "12 Oct, 1972",
      "cnic": "C987654MNO321",
      "passport": "P1234567",
      "maritalStatus": "Married",
      "education": "Master's Degree",
      "address": "House 123, Street 5, DHA Phase 6, Islamabad",
      "cnicExpiry": "12 Oct, 2028",
      "passportExpiry": "15 Jan, 2030",
      "blacklistFlag": "No",
      "lastLoginDate": "11 Mar, 2018",
      "devices": [
          {
              "id": "DEV-98210",
              "name": "iPhone 15 Pro",
              "userId": "USR-001",
              "os": "iOS 17.2",
              "osType": "Mobile",
              "status": "Active",
              "lastLogin": "10 Apr, 2025 14:30",
              "logout": "10 Apr, 2025 22:15"
          }
      ],
      "accounts": [
          {
              "number": "01031720311714136516",
              "status": "Active",
              "iban": "PK47SUMB0000010317203117",
              "balance": 450000,
              "joint": "No",
              "address": "House 123, Street 4, DHA Phase 5",
              "age": "5 Years",
              "type": "Current",
              "branch": "0103",
              "glCode": "100201",
              "currency": "PKR",
              "openingDate": "12 May, 2019"
          }
      ],
      "beneficiaries": [
          {
              "id": "BEN-5521",
              "custCnic": "42101-1234567-1",
              "addDateTime": "15 Jan, 2024 10:20",
              "custAcctNo": "01031720311714136516",
              "iban": "PK47SUMB0331027140115",
              "acctNo": "0331027140115",
              "name": "Ahmed Ali",
              "bank": "Summit Bank"
          }
      ],
      "phoneNo": "(+92) 310 - 4567890",
      "email": "example@customer.com",
      "accountAge": "18 years",
      "highestAmount": 25000000,
      "lowestAmount": 3500,
      "avgAmount": 11500,
      "branchName": "Main Branch, Islamabad",
      "branchLocation": "Central Area, Islamabad",
      "alertTransactions": [],
      "transactionHistory": [
      { id: "TXN-882103", channelType: "Mobile", date: "12 Apr, 2025 10:15", amount: 50000, fromAcct: "01031720311714136516", toAcct: "01031720311714139988", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" },
      { id: "TXN-882104", channelType: "ATM", date: "11 Apr, 2025 18:30", amount: 25000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-KHI-05", status: "Success" },
      { id: "TXN-882105", channelType: "Web", date: "10 Apr, 2025 14:22", amount: 15000, fromAcct: "01031720311714136516", toAcct: "01031720311714141122", userId: "USR-001", type: "Bill Payment", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882106", channelType: "POS", date: "09 Apr, 2025 20:10", amount: 4500, fromAcct: "01031720311714136516", toAcct: "MER-991", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Imtiaz Super Market", status: "Success" },
      { id: "TXN-882107", channelType: "Mobile", date: "08 Apr, 2025 09:45", amount: 2000, fromAcct: "01031720311714136516", toAcct: "03104567890", userId: "USR-001", type: "Top-up", currency: "PKR", channelName: "Jazz Cash", status: "Success" },
      { id: "TXN-882108", channelType: "Mobile", date: "07 Apr, 2025 11:20", amount: 12000, fromAcct: "01031720311714136516", toAcct: "01031720311714137744", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Failed" },
      { id: "TXN-882109", channelType: "ATM", date: "06 Apr, 2025 16:15", amount: 5000, fromAcct: "01031720311714136516", toAcct: "-", userId: "USR-001", type: "Cash Withdrawal", currency: "PKR", channelName: "ATM-LHR-12", status: "Success" },
      { id: "TXN-882110", channelType: "POS", date: "05 Apr, 2025 13:30", amount: 8000, fromAcct: "01031720311714136516", toAcct: "MER-112", userId: "USR-001", type: "Purchase", currency: "PKR", channelName: "Carrefour", status: "Success" },
      { id: "TXN-882111", channelType: "Web", date: "04 Apr, 2025 12:10", amount: 2000, fromAcct: "01031720311714136516", toAcct: "NETFLIX", userId: "USR-001", type: "Subscription", currency: "PKR", channelName: "Internet Banking", status: "Success" },
      { id: "TXN-882112", channelType: "Mobile", date: "03 Apr, 2025 15:40", amount: 30000, fromAcct: "01031720311714136516", toAcct: "01031720311714138855", userId: "USR-001", type: "IBFT", currency: "PKR", channelName: "HBL Mobile App", status: "Success" }
    ],
      "previousAttacks": [],
      "ibftTransactions": [],
      "posTransactions": [],
      "cashWithdrawals": [],
      "id": "9",
      "name": "Fahad Mustafa",
      "city": "Islamabad",
      "globalId": "C987654MNO321",
      "idType": "CNIC"
  },
  "10": {
    id: "10",
    name: "Salman Ahmed",
    transactionId: "HG-0331ZZY-05",
    globalId: "D456789PQR654",
    age: 39,
    customerSince: "22 Nov, 2018",
    profession: "Doctor",
    gender: "Male",
    city: "Karachi",
    dob: "22 Nov, 1986",
    cnic: "42101-9999999-3",
    passport: "D4567890",
    maritalStatus: "Married",
    education: "MBBS",
    address: "Clifton Block 2, Karachi",
    cnicExpiry: "22 Nov, 2033",
    passportExpiry: "18 Aug, 2029",
    blacklistFlag: "No",
    lastLoginDate: "27 Feb, 2026",
    phoneNo: "(+92) 345 - 6789012",
    email: "salman.doc@example.com",
    accountAge: "7 years",
    highestAmount: 850000,
    lowestAmount: 2000.0,
    avgAmount: 45000.0,
    branchName: "Clifton Branch, Karachi",
    branchLocation: "Clifton Block 5, Karachi, Sindh",
    alertTransactions: [],
    transactionHistory: [],
    previousAttacks: [],
    ibftTransactions: [],
    posTransactions: [],
    cashWithdrawals: [
      {
        date: "17/02/2026 12:19:50",
        amount: 80000,
        respCode: "01",
        procCode: "010000",
        mcc: "6011",
        merchantName: "ATM Withdrawal",
        location: "KARACHI",
        country: "586",
        posMode: "05",
        secOrg: "BAF",
        fromAcc: "01033120311714115480",
        benOrg: "N/A",
        benAcc: "N/A",
        msgType: "0200",
      },
    ],
  },
};

export default function CustomerDetailsModal({
  customerId,
  isOpen,
  onClose,
  onAction,
  alertStatus,
}: {
  customerId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (alertId: string, action: string, data?: any) => void;
  alertStatus?: string;
}) {
  const { toast } = useToast();
  const [isMarkFraudModalOpen, setIsMarkFraudModalOpen] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState("all");
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  const [isDetailedLoading, setIsDetailedLoading] = useState(false);
  const [isDetailedVisible, setIsDetailedVisible] = useState(false);
  const [isAlertLoading, setIsAlertLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [isAttacksLoading, setIsAttacksLoading] = useState(false);
  const [isAttacksVisible, setIsAttacksVisible] = useState(true);
  const [isDevicesLoading, setIsDevicesLoading] = useState(false);
  const [isDevicesVisible, setIsDevicesVisible] = useState(true);
  const [isAccountsLoading, setIsAccountsLoading] = useState(false);
  const [isAccountsVisible, setIsAccountsVisible] = useState(false);
  const [isBeneficiariesLoading, setIsBeneficiariesLoading] = useState(false);
  const [isBeneficiariesVisible, setIsBeneficiariesVisible] = useState(true);
  const [isLast10Loading, setIsLast10Loading] = useState(false);
  const [isLast10Visible, setIsLast10Visible] = useState(false);
  const [isTxnDetailsExpanded, setIsTxnDetailsExpanded] = useState(false);
  const [txnFilterMode, setTxnFilterMode] = useState<"all" | "count" | "days">(
    "all",
  );
  const [txnCountFilter, setTxnCountFilter] = useState("10");
  const [txnDateRange, setTxnDateRange] = useState<DateRange | undefined>();
  const [isDeviceDetailsExpanded, setIsDeviceDetailsExpanded] = useState(false);
  const [beneficiaryFilterMode, setBeneficiaryFilterMode] = useState<
    "all" | "recent" | "days"
  >("all");
  const [beneficiaryCountFilter, setBeneficiaryCountFilter] = useState("2");
  const [beneficiaryDateRange, setBeneficiaryDateRange] = useState<
    DateRange | undefined
  >();
  const [isBeneficiaryDetailsExpanded, setIsBeneficiaryDetailsExpanded] =
    useState(false);

  const customer = customerId 
    ? ((mockCustomerData as any)[customerId] || { ...(mockCustomerData as any)["1"], id: customerId }) 
    : null;

  const totalAttacks = customer?.previousAttacks?.length || 0;
  const totalFraudAmount =
    customer?.previousAttacks?.reduce(
      (sum: any, attack: any) => sum + attack.amount,
      0,
    ) || 0;

  const parseHistoryDate = (value: string) => {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const transactionHistory = customer?.transactionHistory || [];
  let latestTransactionDate: Date | null = null;

  transactionHistory.forEach((transaction: any) => {
    const parsedDate = parseHistoryDate(transaction.date);
    if (!parsedDate) return;
    if (!latestTransactionDate || parsedDate > latestTransactionDate) {
      latestTransactionDate = parsedDate;
    }
  });

  const filteredTransactionHistory =
    txnFilterMode === "all"
      ? transactionHistory
      : txnFilterMode === "count"
        ? transactionHistory.slice(0, Number(txnCountFilter))
        : transactionHistory.filter((transaction: any) => {
            const parsedDate = parseHistoryDate(transaction.date);
            if (!parsedDate || !txnDateRange?.from) return true;

            const rangeStart = new Date(txnDateRange.from);
            rangeStart.setHours(0, 0, 0, 0);

            const rangeEnd = txnDateRange.to
              ? new Date(txnDateRange.to)
              : new Date(txnDateRange.from);
            rangeEnd.setHours(23, 59, 59, 999);

            return parsedDate >= rangeStart && parsedDate <= rangeEnd;
          });

  const beneficiaries = customer?.beneficiaries || [];
  const sortedBeneficiaries = [...beneficiaries].sort((a: any, b: any) => {
    const dateA = parseHistoryDate(a.addDateTime)?.getTime() || 0;
    const dateB = parseHistoryDate(b.addDateTime)?.getTime() || 0;
    return dateB - dateA;
  });

  const filteredBeneficiaries =
    beneficiaryFilterMode === "all"
      ? sortedBeneficiaries
      : beneficiaryFilterMode === "recent"
        ? sortedBeneficiaries.slice(0, Number(beneficiaryCountFilter))
        : sortedBeneficiaries.filter((ben: any) => {
            const parsedDate = parseHistoryDate(ben.addDateTime);
            if (!parsedDate || !beneficiaryDateRange?.from) return true;

            const rangeStart = new Date(beneficiaryDateRange.from);
            rangeStart.setHours(0, 0, 0, 0);

            const rangeEnd = beneficiaryDateRange.to
              ? new Date(beneficiaryDateRange.to)
              : new Date(beneficiaryDateRange.from);
            rangeEnd.setHours(23, 59, 59, 999);

            return parsedDate >= rangeStart && parsedDate <= rangeEnd;
          });

  useEffect(() => {
    setShowMoreInfo(false);
    setIsTxnDetailsExpanded(false);
    setTxnFilterMode("all");
    setTxnCountFilter("10");
    setTxnDateRange(undefined);
    setIsDeviceDetailsExpanded(false);
    setBeneficiaryFilterMode("all");
    setBeneficiaryCountFilter("2");
    setBeneficiaryDateRange(undefined);
    setIsBeneficiaryDetailsExpanded(false);
  }, [isOpen, customerId]);

  if (!isOpen || !customer) return null;

  const getRiskScoreColor = (score) => {
    if (score >= 90) return "text-red-600";
    if (score >= 80) return "text-orange-600";
    return "text-yellow-600";
  };

  const handleFraudSubmit = (data) => {
    console.log("Fraud data submitted:", data);
    // Handle fraud submission logic here
    if (onAction && customerId) onAction(customerId!, "FRAUD", data);
    setIsMarkFraudModalOpen(false);
  };

  const handleMaskAsFalsePositive = (action) => {
    if (action === "contacted") {
      console.log("Customer Contacted: Alert marked as false positive.");
      // Logic to resolve alert as false positive
      if (onAction && customerId) onAction(customerId, "CONTACTED");
      onClose();
    } else if (action === "not_contacted") {
      console.log(
        "Customer Not Contacted: Moving to 'Pending Customer Contact' tab.",
      );
      // Logic to move to pending tab and requeue
      if (onAction && customerId) onAction(customerId, "NOT_CONTACTED");

      toast({
        title: "Alert Requeued",
        description:
          "Alert moved to 'Pending Customer Contact'. It will be requeued in 30 minutes.",
      });

      onClose();
    }
  };

  const handleLoadHistory = () => {
    if (isHistoryVisible) {
      setIsTxnDetailsExpanded(false);
      setIsHistoryVisible(false);
    } else {
      setIsHistoryLoading(true);
      setTimeout(() => {
        setIsHistoryLoading(false);
        setIsHistoryVisible(true);
      }, 1500);
    }
  };

  const handleLoadDetailed = () => {
    if (isDetailedVisible) {
      setIsDetailedVisible(false);
    } else {
      setIsDetailedLoading(true);
      setTimeout(() => {
        setIsDetailedLoading(false);
        setIsDetailedVisible(true);
      }, 1500);
    }
  };

  const handleLoadAlerts = () => {
    if (isAlertVisible) {
      setIsAlertVisible(false);
    } else {
      setIsAlertLoading(true);
      setTimeout(() => {
        setIsAlertLoading(false);
        setIsAlertVisible(true);
      }, 1500);
    }
  };

  const handleLoadAttacks = () => {
    if (isAttacksVisible) {
      setIsAttacksVisible(false);
    } else {
      setIsAttacksLoading(true);
      setTimeout(() => {
        setIsAttacksLoading(false);
        setIsAttacksVisible(true);
      }, 1500);
    }
  };

  const handleLoadDevices = () => {
    if (isDevicesVisible) {
      setIsDeviceDetailsExpanded(false);
      setIsDevicesVisible(false);
    } else {
      setIsDevicesLoading(true);
      setTimeout(() => {
        setIsDevicesLoading(false);
        setIsDevicesVisible(true);
      }, 1500);
    }
  };

  const handleLoadAccounts = () => {
    if (isAccountsVisible) {
      setIsAccountsVisible(false);
    } else {
      setIsAccountsLoading(true);
      setTimeout(() => {
        setIsAccountsLoading(false);
        setIsAccountsVisible(true);
      }, 1500);
    }
  };

  const handleLoadBeneficiaries = () => {
    if (isBeneficiariesVisible) {
      setIsBeneficiaryDetailsExpanded(false);
      setIsBeneficiariesVisible(false);
    } else {
      setIsBeneficiariesLoading(true);
      setTimeout(() => {
        setIsBeneficiariesLoading(false);
        setIsBeneficiariesVisible(true);
      }, 1500);
    }
  };

  const handleLoadLast10 = () => {
    if (isLast10Visible) {
      setIsLast10Visible(false);
    } else {
      setIsLast10Loading(true);
      setTimeout(() => {
        setIsLast10Loading(false);
        setIsLast10Visible(true);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className=" bg-white flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {customer.name}
            </h2>
            <p className="text-sm text-gray-600">
              Transaction ID: {customer.transactionId}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {alertStatus === "FRAUD" || alertStatus === "DISCARDED" ? (
              <Button
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  if (onAction && customerId) onAction(customerId, "OPEN");
                  onClose();
                }}
              >
                Reopen Case
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    if (onAction && customerId)
                      onAction(customerId, "DISCARDED");
                    onClose();
                  }}
                >
                  Discard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 gap-1"
                    >
                      Mark as False Positive
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleMaskAsFalsePositive("contacted")}
                    >
                      Customer Contacted
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleMaskAsFalsePositive("not_contacted")}
                    >
                      Customer Not Contacted
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    isSuspended
                      ? "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:text-white font-bold"
                      : "text-red-600 border-red-200 hover:bg-red-50"
                  }
                  onClick={() => setIsSuspended(true)}
                >
                  {isSuspended ? "Suspended" : "Suspend Account"}
                </Button>
                <Button
                  size="sm"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                  onClick={() => setIsMarkFraudModalOpen(true)}
                >
                  Mark as Fraud
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* AI Recommendation Alert */}
        {/* <div className="mx-6 mt-6 bg-[#EAF9F9] rounded-xl p-5 border border-[#46CDCF11]">
          <div className="flex items-center space-x-8">
            <div className="bg-[#C8EFEF] rounded-xl px-5 py-4 flex items-center space-x-4 border border-[#46CDCF] shadow-sm shrink-0">
              <img
                src={feather}
                className="w-10 h-10 object-contain"
                alt="AI Recommendation"
              />
              <div className="text-[#0F172A] font-bold text-[15px] leading-tight">
                Recommended <br /> by AI
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="font-bold text-[#0F172A] text-[18px]">
                  Potential Fraud
                </h4>
                <div className="bg-[#FF3B30] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Probability: HIGH (87%)
                </div>
              </div>
              <p className="text-[#334155] text-[14px] leading-relaxed font-medium max-w-[95%]">
                Couple of transactions in quick succession, New or suspected
                beneficiary and transition amount or type deviated from customer
                behaviour. Suggested action: block account and escalate for
                investigation.
              </p>
            </div>
          </div>
        </div> */}

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-lg">Customer Information</CardTitle>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowMoreInfo((prev) => !prev)}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold transition-all shadow-sm shadow-blue-200"
                >
                  {showMoreInfo ? "Show Less" : "More"}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${showMoreInfo ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto animate-in fade-in slide-in-from-top-2 duration-300">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50/50">
                      <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">DOB</th>
                      <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">GENDER</th>
                      <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">CITY</th>
                      <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">CNIC</th>
                      <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">PASSPORT NUMBER</th>
                      <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">CUST_ONBOARD DATE</th>
                      {showMoreInfo && (
                        <>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">MARITAL STATUS</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">EDUCATIONAL LEVEL</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">ADDRESS</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">CNIC EXPIRY</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">PASSPORT EXPIRY</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">BLACKLIST FLAG</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b last:border-0">
                      <td className="p-3 text-sm text-gray-900 whitespace-nowrap">{customer.dob}</td>
                      <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{customer.gender}</td>
                      <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{customer.city}</td>
                      <td className="p-3 text-sm font-mono text-gray-900 whitespace-nowrap">{customer.cnic}</td>
                      <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">{customer.passport}</td>
                      <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{customer.customerSince}</td>
                      {showMoreInfo && (
                        <>
                          <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{customer.maritalStatus}</td>
                          <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{customer.education}</td>
                          <td className="p-3 text-sm text-gray-600 min-w-[240px]">{customer.address}</td>
                          <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{customer.cnicExpiry}</td>
                          <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{customer.passportExpiry}</td>
                          <td className="p-3 text-sm whitespace-nowrap">
                            <Badge
                              className={
                                customer.blacklistFlag === "Yes"
                                  ? "bg-red-100 text-red-700 border-red-200"
                                  : "bg-green-100 text-green-700 border-green-200"
                              }
                            >
                              {customer.blacklistFlag}
                            </Badge>
                          </td>
                        </>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Alert on Transactions */}
          <Card className="overflow-hidden border-gray-100 shadow-sm">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-all py-4 group"
              onClick={handleLoadAlerts}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                  Alert on Transactions
                  {isAlertLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isAlertVisible ? "rotate-180 text-blue-600" : ""}`} />
                  )}
                </CardTitle>
              </div>
            </CardHeader>
            {(isAlertLoading || isAlertVisible) && (
              <CardContent className={isAlertLoading ? "py-12" : ""}>
                {isAlertLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    <p className="text-sm font-medium text-gray-500 animate-pulse">
                      Scanning transactions for alerts...
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto animate-in fade-in slide-in-from-top-2 duration-500">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium text-gray-700">
                            Transaction ID
                          </th>
                          <th className="text-left p-3 font-medium text-gray-700">
                            Date/Time ID
                          </th>
                          <th className="text-left p-3 font-medium text-gray-700">
                            Type
                          </th>
                          <th className="text-left p-3 font-medium text-gray-700">
                            Amount
                          </th>
                          <th className="text-left p-3 font-medium text-gray-700">
                            Risk Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.alertTransactions.map((transaction, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3 font-mono text-sm">
                              {transaction.id}
                            </td>
                            <td className="p-3 text-sm">
                              <div>{transaction.date}</div>
                              <div className="text-gray-600">
                                {transaction.time}
                              </div>
                            </td>
                            <td className="p-3">{transaction.type}</td>
                            <td className="p-3 font-semibold">
                              PKR {transaction.amount.toLocaleString()}
                            </td>
                            <td className="p-3">
                              <span
                                className={`font-bold ${getRiskScoreColor(transaction.riskScore)}`}
                              >
                                {transaction.riskScore}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Previous Attacks */}
          <Card className="overflow-hidden border-gray-100 shadow-sm">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-all py-4 group"
              onClick={handleLoadAttacks}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                  Previous Attacks, Suspensions or Blocks
                  {isAttacksLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isAttacksVisible ? "rotate-180 text-blue-600" : ""}`} />
                  )}
                </CardTitle>
                <div className="flex items-center gap-6">
                  <div className="flex gap-3">
                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2 flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider leading-none mb-1">
                          Total Attacks
                        </p>
                        <p className="text-xl font-bold text-red-700 leading-none tracking-tight">
                          {totalAttacks}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            {(isAttacksLoading || isAttacksVisible) && (
              <CardContent className={isAttacksLoading ? "py-12" : ""}>
                {isAttacksLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    <p className="text-sm font-medium text-gray-500 animate-pulse">
                      Retrieving historical security events...
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto animate-in fade-in slide-in-from-top-2 duration-500">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium text-gray-700">
                            Type
                          </th>
                          <th className="text-left p-3 font-medium text-gray-700">
                            Date/Time ID
                          </th>
                          <th className="text-left p-3 font-medium text-gray-700">
                            Fraud Type
                          </th>
                          <th className="text-left p-3 font-medium text-gray-700">
                            Amount
                          </th>
                          <th className="text-left p-3 font-medium text-gray-700">
                            Risk Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.previousAttacks.map((attack, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={
                                  attack.type === "Suspension" ||
                                  attack.type === "Attack"
                                    ? "bg-red-50 text-red-700 border-red-200 uppercase text-[10px] font-bold"
                                    : "bg-gray-50 text-gray-700 border-gray-200 uppercase text-[10px] font-bold"
                                }
                              >
                                {attack.type}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm">
                              <div>{attack.date}</div>
                              <div className="text-gray-600">{attack.time}</div>
                            </td>
                            <td className="p-3">{attack.fraudType}</td>
                            <td className="p-3 font-semibold">
                              PKR {attack.amount.toLocaleString()}
                            </td>
                            <td className="p-3">
                              <span
                                className={`font-bold ${getRiskScoreColor(attack.riskScore)}`}
                              >
                                {attack.riskScore}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Transaction History */}
          <Card className="overflow-hidden border-gray-100 shadow-sm">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors py-4 group"
              onClick={handleLoadHistory}
            >
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <CardTitle className="text-lg flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                  Transaction History 
                  {isHistoryLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isHistoryVisible ? "rotate-180 text-blue-600" : ""}`} />
                  )}
                </CardTitle>
                <div
                  className="flex flex-wrap items-center gap-2 xl:justify-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    type="button"
                    size="sm"
                    variant={txnFilterMode === "all" ? "default" : "outline"}
                    disabled={isHistoryLoading || !isHistoryVisible}
                    onClick={() => setTxnFilterMode("all")}
                    className={
                      txnFilterMode === "all"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border-gray-200 text-gray-600 hover:bg-white"
                    }
                  >
                    All trans
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        variant={txnFilterMode === "count" ? "default" : "outline"}
                        disabled={isHistoryLoading || !isHistoryVisible}
                        onClick={() => setTxnFilterMode("count")}
                        className={
                          txnFilterMode === "count"
                            ? "bg-blue-600 text-white hover:bg-blue-700 gap-2"
                            : "border-gray-200 text-gray-600 hover:bg-white gap-2"
                        }
                      >
                        No. of trans ({txnCountFilter})
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {["5", "10", "20", "50"].map((count) => (
                        <DropdownMenuItem
                          key={count}
                          onClick={() => {
                            setTxnFilterMode("count");
                            setTxnCountFilter(count);
                          }}
                        >
                          {count}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DatePickerWithRange
                    value={txnDateRange}
                    onChange={(nextRange) => {
                      setTxnFilterMode("days");
                      setTxnDateRange(nextRange);
                    }}
                    onTriggerClick={() => setTxnFilterMode("days")}
                    placeholder="No. of Days"
                    className="w-full sm:w-auto"
                    buttonClassName={
                      txnFilterMode === "days"
                        ? "h-9 bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                        : "h-9 border-gray-200 bg-white text-gray-600 hover:bg-white"
                    }
                  />

                  <span className="text-sm text-gray-500">
                    {filteredTransactionHistory.length}/{transactionHistory.length}
                  </span>

                  <Button
                    type="button"
                    size="sm"
                    disabled={isHistoryLoading || !isHistoryVisible}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isHistoryLoading || !isHistoryVisible) return;
                      setIsTxnDetailsExpanded((prev) => !prev);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold transition-all shadow-sm shadow-blue-200 disabled:bg-blue-200 disabled:text-white disabled:shadow-none"
                  >
                    {isTxnDetailsExpanded ? "Show Less" : "More"}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${isTxnDetailsExpanded ? "rotate-180" : ""}`}
                    />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {(isHistoryLoading || isHistoryVisible) && (
              <CardContent className={isHistoryLoading ? "py-12" : ""}>
                {isHistoryLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 animate-pulse">
                      Fetching transaction history...
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto animate-in fade-in slide-in-from-top-2 duration-500">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50/50">
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">TRANSACTION ID</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">DATE/TIME</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">AMOUNT</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">SOURCE</th>
                          {isTxnDetailsExpanded && (
                            <>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">CHANNEL_TYPE</th>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">USER_ID</th>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">TRAN_TYPE</th>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">CURRENCY_CODE</th>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">CHANNEL_NAME</th>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">TRANSACTION_STATUS</th>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">BENE_IBAN</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactionHistory.map((transaction: any) => (
                          <tr key={transaction.id} className="border-b last:border-0 hover:bg-gray-50/30">
                            <td className="p-3 text-sm font-mono text-gray-900 whitespace-nowrap">{transaction.id}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{transaction.date}</td>
                            <td className="p-3 text-sm font-bold text-gray-900 whitespace-nowrap">PKR {transaction.amount?.toLocaleString()}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{transaction.channelName || transaction.fromAcct || "-"}</td>
                            {isTxnDetailsExpanded && (
                              <>
                                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{transaction.channelType || "-"}</td>
                                <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">{transaction.userId || "-"}</td>
                                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{transaction.type || "-"}</td>
                                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{transaction.currency || "PKR"}</td>
                                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{transaction.channelName || "-"}</td>
                                <td className="p-3 text-sm whitespace-nowrap">
                                  <Badge className={transaction.status === "Success" ? "bg-green-100 text-green-700 hover:bg-green-100 border-0" : "bg-red-100 text-red-700 hover:bg-red-100 border-0"}>
                                    {transaction.status || "-"}
                                  </Badge>
                                </td>
                                <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">{transaction.toAcct || "-"}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* List of All Device */}
          <Card className="overflow-hidden border-gray-100 shadow-sm">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors py-4 group"
              onClick={handleLoadDevices}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                  List of All Device
                  {isDevicesLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isDevicesVisible ? "rotate-180 text-blue-600" : ""}`} />
                  )}
                </CardTitle>
                <Button
                  type="button"
                  size="sm"
                  disabled={isDevicesLoading || !isDevicesVisible}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDevicesLoading || !isDevicesVisible) return;
                    setIsDeviceDetailsExpanded((prev) => !prev);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold transition-all shadow-sm shadow-blue-200 disabled:bg-blue-200 disabled:text-white disabled:shadow-none"
                >
                  {isDeviceDetailsExpanded ? "Show Less" : "More"}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${isDeviceDetailsExpanded ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>
            </CardHeader>
            {(isDevicesLoading || isDevicesVisible) && (
              <CardContent className={isDevicesLoading ? "py-12" : ""}>
                {isDevicesLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    <p className="text-sm font-medium text-gray-500 animate-pulse">
                      Scanning registered devices...
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto animate-in fade-in slide-in-from-top-2 duration-500">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50/50">
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">DEVICE ID</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">DEVICE NAME</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">USER ID</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">LOGOUT DATE/TIME</th>
                          {isDeviceDetailsExpanded && (
                            <>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">DEVICE OS</th>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">OS TYPE</th>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">DEVICE STATUS</th>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">LAST LOGIN DATE/TIME</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {(customer.devices || []).map((device: any) => (
                          <tr key={device.id} className="border-b last:border-0 hover:bg-gray-50/30">
                            <td className="p-3 text-sm font-mono text-gray-900 whitespace-nowrap">{device.id}</td>
                            <td className="p-3 text-sm text-gray-900 whitespace-nowrap">{device.name}</td>
                            <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">{device.userId}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{device.logout}</td>
                            {isDeviceDetailsExpanded && (
                              <>
                                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{device.os}</td>
                                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{device.osType}</td>
                                <td className="p-3 text-sm whitespace-nowrap">
                                  <Badge className={device.status === "Active" ? "bg-green-100 text-green-700 border-0" : "bg-gray-100 text-gray-600 border-0"}>
                                    {device.status}
                                  </Badge>
                                </td>
                                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{device.lastLogin}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* List of All Customer Added Beneficiaries */}
          <Card className="overflow-hidden border-gray-100 shadow-sm">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors py-4 group"
              onClick={handleLoadBeneficiaries}
            >
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <CardTitle className="text-lg flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                  List of All Customer Added Beneficiaries
                  {isBeneficiariesLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isBeneficiariesVisible ? "rotate-180 text-blue-600" : ""}`} />
                  )}
                </CardTitle>
                <div
                  className="flex flex-wrap items-center gap-2 xl:justify-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { id: "all", label: "All" },
                    { id: "recent", label: "Recent Beneficiary" },
                  ].map((filter) => (
                    <Button
                      key={filter.id}
                      type="button"
                      size="sm"
                      variant={
                        beneficiaryFilterMode === filter.id
                          ? "default"
                          : "outline"
                      }
                      disabled={isBeneficiariesLoading || !isBeneficiariesVisible}
                      onClick={() =>
                        setBeneficiaryFilterMode(
                          filter.id as "all" | "recent" | "days",
                        )
                      }
                      className={
                        beneficiaryFilterMode === filter.id
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-gray-200 text-gray-600 hover:bg-white"
                      }
                    >
                      {filter.label}
                    </Button>
                  ))}

                  {beneficiaryFilterMode === "recent" && (
                    <select
                      value={beneficiaryCountFilter}
                      onChange={(e) => setBeneficiaryCountFilter(e.target.value)}
                      className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                    </select>
                  )}

                  <DatePickerWithRange
                    value={beneficiaryDateRange}
                    onChange={(nextRange) => {
                      setBeneficiaryFilterMode("days");
                      setBeneficiaryDateRange(nextRange);
                    }}
                    onTriggerClick={() => setBeneficiaryFilterMode("days")}
                    placeholder="Recent days"
                    className="w-full sm:w-auto"
                    buttonClassName={
                      beneficiaryFilterMode === "days"
                        ? "h-9 bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                        : "h-9 border-gray-200 bg-white text-gray-600 hover:bg-white"
                    }
                  />

                  <span className="text-sm text-gray-500">
                    {filteredBeneficiaries.length}/{beneficiaries.length}
                  </span>

                  <Button
                    type="button"
                    size="sm"
                    disabled={isBeneficiariesLoading || !isBeneficiariesVisible}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isBeneficiariesLoading || !isBeneficiariesVisible) return;
                      setIsBeneficiaryDetailsExpanded((prev) => !prev);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold transition-all shadow-sm shadow-blue-200 disabled:bg-blue-200 disabled:text-white disabled:shadow-none"
                  >
                    {isBeneficiaryDetailsExpanded ? "Show Less" : "More"}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${isBeneficiaryDetailsExpanded ? "rotate-180" : ""}`}
                    />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {(isBeneficiariesLoading || isBeneficiariesVisible) && (
              <CardContent className={isBeneficiariesLoading ? "py-12" : ""}>
                {isBeneficiariesLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    <p className="text-sm font-medium text-gray-500 animate-pulse">
                      Retrieving beneficiary list...
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto animate-in fade-in slide-in-from-top-2 duration-500">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50/50">
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">BENEFICIARY ID</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">CUSTOMER CNIC</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">DATE/TIME ADDED</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">CUSTOMER ACCOUNT NO</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">BENEFICIARY ACCOUNT NO</th>
                          {isBeneficiaryDetailsExpanded && (
                            <>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">BENE_IBAN</th>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">BENE_NAME</th>
                              <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">BANK_NAME</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBeneficiaries.map((ben: any) => (
                          <tr key={ben.id} className="border-b last:border-0 hover:bg-gray-50/30">
                            <td className="p-3 text-sm font-mono text-gray-900 whitespace-nowrap">{ben.id}</td>
                            <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">{ben.custCnic}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{ben.addDateTime}</td>
                            <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">{ben.custAcctNo}</td>
                            <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">{ben.acctNo}</td>
                            {isBeneficiaryDetailsExpanded && (
                              <>
                                <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">{ben.iban}</td>
                                <td className="p-3 text-sm text-gray-900 whitespace-nowrap">{ben.name}</td>
                                <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{ben.bank}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* New Transaction Details Tabs */}
          <Card className="overflow-hidden">
            <CardHeader
              className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors group"
              onClick={handleLoadDetailed}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                  Detailed Transactions
                  {isDetailedLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isDetailedVisible ? "rotate-180 text-blue-600" : ""}`} />
                  )}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    {[
                      { id: "all", label: "ALL" },
                      { id: "ibft", label: "IBFT" },
                      { id: "pos", label: "POS" },
                      { id: "cash", label: "CASH WITHDRAWAL" },
                      { id: "atm_on_us", label: "ATM WITHDRAWAL (ON-US)" },
                      { id: "atm_of_us", label: "ATM DIFF ATM (OF-US)" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDetailTab(tab.id);
                          if (!isDetailedVisible) handleLoadDetailed();
                        }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                          activeDetailTab === tab.id
                            ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            {(isDetailedLoading || isDetailedVisible) && (
              <CardContent className="p-6 pt-0">
                {isDetailedLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <div className="h-14 w-14 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    <p className="text-sm font-medium text-gray-500 animate-pulse">
                      Analyzing detailed transaction records...
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
                    <table className="w-full bg-white">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          {[
                            "Trans Date",
                            "Issuer Amount",
                            "Resp Code",
                            "Proc Code",
                            "MCC",
                            "Merchant Name",
                            "Merchant Location",
                            "Country Code",
                            "POS Mode",
                            "Sec ORG Code",
                            "From Account",
                            "Ben ORG Code",
                            "Ben Account",
                            "Message Type",
                          ].map((header) => (
                            <th
                              key={header}
                              className="p-4 text-left font-medium text-gray-900 text-sm whitespace-nowrap"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(activeDetailTab === "all"
                          ? [
                              ...(customer.ibftTransactions || []),
                              ...(customer.posTransactions || []),
                              ...(customer.cashWithdrawals || []),
                              ...(customer.atmOnUsTransactions || []),
                              ...(customer.atmOfUsTransactions || []),
                            ]
                          : activeDetailTab === "ibft"
                            ? customer.ibftTransactions
                            : activeDetailTab === "pos"
                              ? customer.posTransactions
                              : activeDetailTab === "atm_on_us"
                                ? customer.atmOnUsTransactions
                                : activeDetailTab === "atm_of_us"
                                  ? customer.atmOfUsTransactions
                                  : customer.cashWithdrawals
                        )?.map((tx: any, i: number) => (
                          <tr
                            key={i}
                            className="border-b bg-white hover:bg-gray-50 transition-colors last:border-0"
                          >
                            <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                              {tx.date}
                            </td>
                            <td className="p-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                              {tx.amount.toLocaleString()}
                            </td>
                            <td className="p-4 text-sm text-gray-600 text-center">
                              {tx.respCode}
                            </td>
                            <td className="p-4 text-sm text-gray-600 font-mono text-center">
                              {tx.procCode}
                            </td>
                            <td className="p-4 text-sm text-gray-600 text-center">
                              {tx.mcc}
                            </td>
                            <td className="p-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                              {tx.merchantName}
                            </td>
                            <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                              {tx.location}
                            </td>
                            <td className="p-4 text-sm text-gray-600 text-center">
                              {tx.country}
                            </td>
                            <td className="p-4 text-sm text-gray-600 text-center">
                              {tx.posMode}
                            </td>
                            <td className="p-4 text-sm text-gray-600 text-center">
                              {tx.secOrg}
                            </td>
                            <td className="p-4 text-sm font-mono text-gray-600 whitespace-nowrap">
                              {tx.fromAcc}
                            </td>
                            <td className="p-4 text-sm text-gray-600 text-center">
                              {tx.benOrg}
                            </td>
                            <td className="p-4 text-sm font-mono text-gray-600 whitespace-nowrap">
                              {tx.benAcc}
                            </td>
                            <td className="p-4 text-sm text-gray-600 text-center">
                              {tx.msgType}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* List of All Customer Accounts */}
          <Card className="overflow-hidden border-gray-100 shadow-sm">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors py-4 group"
              onClick={handleLoadAccounts}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                  List of All Customer Accounts
                  {isAccountsLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isAccountsVisible ? "rotate-180 text-blue-600" : ""}`} />
                  )}
                </CardTitle>
              </div>
            </CardHeader>
            {(isAccountsLoading || isAccountsVisible) && (
              <CardContent className={isAccountsLoading ? "py-12" : ""}>
                {isAccountsLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    <p className="text-sm font-medium text-gray-500 animate-pulse">
                      Fetching account details...
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto animate-in fade-in slide-in-from-top-2 duration-500">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50/50">
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">ACCT_NO</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">STATUS</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">IBAN</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">CURRENT_BALANCE</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">JOINT_ACCT</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">ACCT_HOLDER_ADDRESS</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">ACCT_AGE</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">ACCT_TYPE</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">BRANCH_CODE</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">GL_CODE</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">CURRENCY_CODE</th>
                          <th className="text-left p-3 font-medium text-gray-700 text-sm whitespace-nowrap">ACCT_OPENING_DATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(customer.accounts || []).map((acc: any, index: number) => (
                          <tr key={index} className="border-b last:border-0 hover:bg-gray-50/30">
                            <td className="p-3 text-sm font-mono text-gray-900 whitespace-nowrap">{acc.number}</td>
                            <td className="p-3 text-sm whitespace-nowrap">
                              <Badge className="bg-green-100 text-green-700 border-none">{acc.status}</Badge>
                            </td>
                            <td className="p-3 text-sm font-mono text-gray-500 whitespace-nowrap">{acc.iban}</td>
                            <td className="p-3 text-sm font-bold text-gray-900 whitespace-nowrap">PKR {acc.balance.toLocaleString()}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{acc.joint}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap max-w-[200px] truncate">{acc.address}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{acc.age}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{acc.type}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap font-mono">{acc.branch}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap font-mono">{acc.glCode}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap font-bold">{acc.currency}</td>
                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{acc.openingDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* List of All Last 10 Transactions section hidden */}
        </div>
      </div>

      {/* Mark as Fraud Modal */}
      <MarkFraudModal
        isOpen={isMarkFraudModalOpen}
        onClose={() => setIsMarkFraudModalOpen(false)}
        onSubmit={handleFraudSubmit}
      />
    </div>
  );
}
