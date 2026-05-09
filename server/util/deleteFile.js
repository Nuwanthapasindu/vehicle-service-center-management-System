const fs = require('fs');
const path = require('path');
const process = require('process');

module.exports = function(filePath) {
    const fullPath = path.join(process.cwd(), filePath);
    try {
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (error) {
        // Tolerate "file already gone" — rethrow anything else
        if (error.code !== 'ENOENT') {
            throw new Error(`Failed to delete file at ${filePath}: ${error.message}`);
        }
    }
}