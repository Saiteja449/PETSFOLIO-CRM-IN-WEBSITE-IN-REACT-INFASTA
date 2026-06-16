const fs = require('fs');
const path = require('path');

const filePath = path.join('c:/Users/LENOVO/CRM/PETSFOLIO-SALES-CRM-IN-REACT-INFASTA/src/data.js');
let data = fs.readFileSync(filePath, 'utf8');

data = data.replace(/status:\s*"Not Interested"/gi, 'status: "Not Attended"');

fs.writeFileSync(filePath, data);
console.log('Statuses updated successfully.');
