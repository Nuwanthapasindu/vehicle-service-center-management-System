const path = require("path");
const fs = require("fs");
const process = require("process");

function folderCrate() {
  // LOG FILE FOLDER CREATE
  if (!fs.existsSync(path.join(process.cwd(), "storage",))) {
    fs.mkdirSync(path.join(process.cwd(), "storage"));
  }

  if (!fs.existsSync(path.join(process.cwd(), "storage", "uploads")))
    fs.mkdirSync(path.join(process.cwd(), "storage", "uploads"));
  
  if (!fs.existsSync(path.join(process.cwd(), "storage", "logs")))
    fs.mkdirSync(path.join(process.cwd(), "storage", "logs"));
}

module.exports = folderCrate;