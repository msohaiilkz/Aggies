const fs = require('fs');
const path = 'c:/Users/DELL/Downloads/code/client/src/pages/CustomerDetailsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Global replaces
content = content.replace(/group-hover:text-blue-600 transition-colors uppercase/g, 'group-hover:text-blue-600 transition-colors');
content = content.replace(/LIST OF ALL DEVICE/g, 'List of All Device');
content = content.replace(/LIST OF ALL CUSTOMER ACCOUNTS/g, 'List of All Customer Accounts');
content = content.replace(/LIST OF ALL CUSTOMER ADDED BENEFICIARIES/g, 'List of All Customer Added Beneficiaries');
content = content.replace(/LIST OF ALL LAST 10 TRANSACTIONS/g, 'List of All Last 10 Transactions');

// Splits
const c_info = "          {/* Customer Information */}";
const c_alert = "          {/* Alert on Transactions */}";
const c_prev = "          {/* Previous Attacks */}";
const c_hist = "          {/* Transaction History */}";
const c_new_tabs = "          {/* New Transaction Details Tabs */}";
const c_dev = "          {/* List of All Device */}";
const c_acc = "          {/* List of All Customer Accounts */}";
const c_bene = "          {/* List of All Customer Added Beneficiaries */}";
const c_last10 = "          {/* List of All Last 10 Transactions */}";

const parts = content.split(c_info);
const before_cards = parts[0];
const rest1 = c_info + parts[1];

const p2 = rest1.split(c_alert);
const block_info = p2[0];
const rest2 = c_alert + p2[1];

const p3 = rest2.split(c_prev);
const block_alert = p3[0];
const rest3 = c_prev + p3[1];

const p4 = rest3.split(c_hist);
const block_prev = p4[0];
const rest4 = c_hist + p4[1];

const p5 = rest4.split(c_new_tabs);
const block_hist = p5[0];
const rest5 = c_new_tabs + p5[1];

const p6 = rest5.split(c_dev);
const block_new_tabs = p6[0];
const rest6 = c_dev + p6[1];

const p7 = rest6.split(c_acc);
const block_dev = p7[0];
const rest7 = c_acc + p7[1];

const p8 = rest7.split(c_bene);
const block_acc = p8[0];
const rest8 = c_bene + p8[1];

const p9 = rest8.split(c_last10);
const block_bene = p9[0];
const block_last10 = c_last10 + p9[1];

const newContent = before_cards + 
  block_info + 
  block_alert + 
  block_prev + 
  block_hist + 
  block_dev + 
  block_bene + 
  block_new_tabs + 
  block_acc + 
  block_last10;

fs.writeFileSync(path, newContent, 'utf8');
console.log('Done');
