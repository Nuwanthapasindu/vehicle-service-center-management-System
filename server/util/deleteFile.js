const fs = require('fs');
const path = require('path');
const process = require('process');

module.exports = function(filePath) {
    // CHECK FILE EXIST
    if (fs.existsSync(path.join(process.cwd(), filePath))) {
        // DELETE FILE
        fs.unlinkSync(path.join(process.cwd(), filePath));
    }
}