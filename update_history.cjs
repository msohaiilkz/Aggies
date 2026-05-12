const fs = require('fs');
const path = 'c:/Users/DELL/Downloads/code/client/src/pages/CustomerDetailsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

const tHistory = `[
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
    ]`;

content = content.replace(/"transactionHistory": \[\]/g, `"transactionHistory": ${tHistory}`);

fs.writeFileSync(path, content, 'utf8');
console.log('Replaced');
