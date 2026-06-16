const fs = require('fs');
const path = require('path');

const filePath = path.join('c:/Users/LENOVO/CRM/PETSFOLIO-SALES-CRM-IN-REACT-INFASTA/src/data.js');
let data = fs.readFileSync(filePath, 'utf8');

data = data.replace(/2026-06-04T/g, '2026-06-14T');
data = data.replace(/2026-06-05T/g, '2026-06-15T');
data = data.replace(/2026-06-06T/g, '2026-06-16T');
data = data.replace(/2026-06-07T/g, '2026-06-12T');
data = data.replace(/2026-06-08T/g, '2026-06-13T');

fs.writeFileSync(filePath, data);
console.log('Dates updated successfully.');
