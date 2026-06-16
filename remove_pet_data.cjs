const fs = require('fs');
const path = require('path');

const filePath = path.join('c:/Users/LENOVO/CRM/PETSFOLIO-SALES-CRM-IN-REACT-INFASTA/src/data.js');
let data = fs.readFileSync(filePath, 'utf8');

// Use regex to remove pet properties
data = data.replace(/petName:\s*".*?",?/g, '');
data = data.replace(/petBreed:\s*".*?",?/g, '');
data = data.replace(/petAge:\s*".*?",?/g, '');
data = data.replace(/petWeight:\s*".*?",?/g, '');
data = data.replace(/petMedicalConditions:\s*".*?",?/g, '');

fs.writeFileSync(filePath, data);
console.log('Pet details removed from dummy data successfully.');
