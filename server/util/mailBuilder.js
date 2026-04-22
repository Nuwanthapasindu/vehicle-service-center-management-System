const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

module.exports = (to, emailTemplateName, emailFunction, context,subject) => {
  // CHECK EMAIL TEMPLATE EXISTS
  if (!fs.existsSync(path.resolve(`mail/${emailTemplateName}.handlebars`))) {
    console.log(`Email template ${emailTemplateName} does not exist`);
    return;
  }

  //    READ HANDLE BARS FILE
  const emailTemplateSource = fs.readFileSync(
    path.resolve(`mail/${emailTemplateName}.handlebars`),
    "utf8"
  );
  //  EMAIL  TEMPLATE COMPILE
  const template = handlebars.compile(emailTemplateSource);
  const htmlToSend = template({ ...context });
  emailFunction(to, htmlToSend, subject);
};
