const crypto = require("crypto");

module.exports = () => {
  return crypto.randomInt(999999).toString().padStart(6, 0);
};
