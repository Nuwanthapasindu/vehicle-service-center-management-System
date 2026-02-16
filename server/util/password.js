const bcrypt = require("bcryptjs");

module.exports.hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  return hashPassword;
};
module.exports.comparePassword = (password, hashedPassword) => {
  const compardPassword = bcrypt.compareSync(password, hashedPassword);
  return compardPassword;
};
