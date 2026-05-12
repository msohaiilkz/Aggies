const fs = require('fs');
const path = 'c:/Users/DELL/Downloads/code/client/src/pages/CustomerDetailsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex1 = /                        \{expandedTxns\.includes\(transaction\.id\) && \(\r?\n                          <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">\r?\n                            <div>\r?\n                              <h4 className="text-sm text-gray-600 mb-1">Channel Type<\/h4>[\s\S]*?<p className="font-medium font-mono">\{transaction\.toAcct \|\| "-"}<\/p>\r?\n                            <\/div>\r?\n                          <\/div>\r?\n                        \)}\r?\n/g;

const regex2 = /                        \{expandedTxns\.includes\(transaction\.id\) && \(\r?\n                          <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">\r?\n                            <div>\r?\n                              <h4 className="text-sm text-gray-600 mb-1">Channel Type<\/h4>[\s\S]*?<\/Badge>\r?\n                            <\/div>\r?\n                          <\/div>\r?\n                        \)}/g;

const correctReplacement = `                        {expandedTxns.includes(transaction.id) && (
                          <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div>
                              <h4 className="text-sm text-gray-600 mb-1 font-bold tracking-wider">CHANNEL_TYPE</h4>
                              <p className="font-medium">{transaction.channelType || "-"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-600 mb-1 font-bold tracking-wider">USER_ID</h4>
                              <p className="font-medium font-mono">{transaction.userId || "-"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-600 mb-1 font-bold tracking-wider">TRAN_TYPE</h4>
                              <p className="font-medium">{transaction.type || "-"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-600 mb-1 font-bold tracking-wider">CURRENCY_CODE</h4>
                              <p className="font-medium text-gray-600">{transaction.currency || "PKR"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-600 mb-1 font-bold tracking-wider">CHANNEL_NAME</h4>
                              <p className="font-medium">{transaction.channelName || "-"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-600 mb-1 font-bold tracking-wider">TRANSACTION_STATUS</h4>
                              <Badge className={transaction.status === "Success" ? "bg-green-100 text-green-700 hover:bg-green-100 border-0" : "bg-red-100 text-red-700 hover:bg-red-100 border-0"}>
                                {transaction.status || "-"}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-600 mb-1 font-bold tracking-wider">BENE_IBAN</h4>
                              <p className="font-medium font-mono text-gray-900">{transaction.toAcct || "-"}</p>
                            </div>
                          </div>
                        )}`;

let replaced = false;

if (regex1.test(content)) {
    content = content.replace(regex1, '');
    replaced = true;
}

if (regex2.test(content)) {
    content = content.replace(regex2, correctReplacement);
    replaced = true;
}

if (replaced) {
    fs.writeFileSync(path, content, 'utf8');
    console.log('Fixed successfully');
} else {
    console.log('Regex did not match anything');
}
