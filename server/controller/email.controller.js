const transporter = require("../config/mailer.config");

module.exports.otpVerification = async (to, htmlToSend, _) => {
  const mail = {
    from: process.env.MAIL_USERNAME,
    to,
    subject: "OTP Verification",
    html: htmlToSend,
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports.forgetPasswordMail = async (to, htmlToSend, _) => {
  const mail = {
    from: process.env.MAIL_USERNAME,
    to,
    subject: "Password Reset",
    html: htmlToSend,
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports.notificationMail = async (to, htmlToSend, subject) => {
  const mail = {
    from: process.env.MAIL_USERNAME,
    to,
    subject,
    html: htmlToSend,
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(error.message);
  }
};
