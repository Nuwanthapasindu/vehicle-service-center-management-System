const crypto = require("crypto");

module.exports = () => {
  return crypto.randomBytes(20).toString("hex"); // generate random string of 20 characters.
};
