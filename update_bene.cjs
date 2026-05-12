const fs = require('fs');
const path = 'c:/Users/DELL/Downloads/code/client/src/pages/CustomerDetailsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

const replace2 = `                          <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div>
                              <h4 className="text-sm text-gray-600 mb-1 font-bold tracking-wider">BENE_IBAN</h4>
                              <p className="font-medium font-mono text-gray-900">{ben.iban}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-600 mb-1 font-bold tracking-wider">BENE_NAME</h4>
                              <p className="font-medium text-gray-900">{ben.name}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-600 mb-1 font-bold tracking-wider">BANK_NAME</h4>
                              <p className="font-medium text-gray-900">{ben.bank}</p>
                            </div>
                          </div>`;

const regex1 = /                          <div>\s*<h4 className="text-sm text-gray-600 mb-1">Beneficiary IBAN<\/h4>\s*<p className="font-medium font-mono">{ben\.iban}<\/p>\s*<\/div>/g;
const regex2 = /                          <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">\s*<div>\s*<h4 className="text-sm text-gray-600 mb-1">Beneficiary Name<\/h4>\s*<p className="font-medium text-gray-900">{ben\.name}<\/p>\s*<\/div>\s*<div>\s*<h4 className="text-sm text-gray-600 mb-1">Bank Name<\/h4>\s*<p className="font-medium text-gray-900">{ben\.bank}<\/p>\s*<\/div>\s*<\/div>/g;

if (regex1.test(content) && regex2.test(content)) {
    content = content.replace(regex1, '');
    content = content.replace(regex2, replace2);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Replaced successfully');
} else {
    console.log('Regex did not match');
}
