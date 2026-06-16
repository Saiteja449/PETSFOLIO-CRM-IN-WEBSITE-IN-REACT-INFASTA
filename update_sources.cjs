const fs = require('fs');
const path = require('path');

const filePath = path.join('c:/Users/LENOVO/CRM/PETSFOLIO-SALES-CRM-IN-REACT-INFASTA/src/data.js');
let data = fs.readFileSync(filePath, 'utf8');

data = data.replace(/source:\s*"Meta"/g, 'source: "Meta Ads"');
data = data.replace(/source:\s*"Whatsapp"/g, 'source: "WhatsApp"');
data = data.replace(/source:\s*"Social Media"/g, 'source: "Meta Ads"');
data = data.replace(/source:\s*"Google Search"/g, 'source: "Website Form"');
data = data.replace(/source:\s*"Referral"/g, 'source: "Call"');
data = data.replace(/source:\s*"Walk-in"/g, 'source: "Manual Entry"');
data = data.replace(/source:\s*"Email Campaign"/g, 'source: "Email"');

fs.writeFileSync(filePath, data);
console.log('Sources updated successfully.');
