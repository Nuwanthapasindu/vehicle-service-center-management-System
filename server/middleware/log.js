const fs = require("fs");
const path = require("path");
const process = require("process");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const today = new Date();
  const token = req.headers?.authorization;
  let user = "Public";
  let oldSend = res.send;
  res.send = function (data) {
    oldSend.apply(res, arguments);
    //  LOG FILE PATH
    const logFilePath = path.join(
      process.cwd(),
      "storage",
      "logs",
      `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.log`
    );
    if (token && token.startsWith("Bearer")) {
      try {
        // VALIDATING JWT
        const jwtToken = token.split(" ")[1];
        const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        user = decodedToken.id;
      } catch (error) {
        user = "Public";
      }
    }
    const logDate = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    
    const browser = req.headers["user-agent"];
     logText = `${logDate}  USER: ${user} PATH: ${req.path} (${req.method}) DEVICE: ${browser} RESPONSE: ${data} \n`;
    fs.appendFileSync(logFilePath, logText);
  }
 
  return next();
};
