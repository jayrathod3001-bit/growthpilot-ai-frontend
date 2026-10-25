var fs = require('fs');  
var content = fs.readFileSync('src/utils/taskManager.js');  
var str = content.toString('utf8');  
if(str.charCodeAt(0) === 0xFEFF) str = str.slice(1);  
fs.writeFileSync('src/utils/taskManager.js', str, 'utf8');  
console.log('done');  
