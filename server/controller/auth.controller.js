const User = require("../model/User");
const jwt = require("jsonwebtoken");
const AppError = require("../error/AppError");
const { hashPassword, comparePassword } = require("../util/password");
const {
  validatedRegister,
  validatedLogin,
  validatedAccountVerification,
  validatedResendAccountVerification,
  validatedResetPassword,
} = require("../validation/auth.validation");
const mailBuilder = require("../util/mailBuilder");
const {
  otpVerification,
  forgetPasswordMail,
  notificationMail,
} = require("./email.controller");
const otpGenerator = require("../util/otp");
const passwordToken = require("../util/passwordToken");

module.exports.register = async (payload) => {
  const otp = otpGenerator();
  //  VALIDATING PAYLOAD
  const { error } = validatedRegister(payload);
  if (error) throw new AppError(error.details[0].message, 400);
  //   CHECK IF USER ALREADY EXISTS
  try {
    const user = await User.findOne({ email: payload.email });
    if (user) throw new AppError("User already exists", 400);
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
  // CREATE NEW USER
  try {
    const newUser = new User({
      email: payload.email,
      password: hashPassword(payload.password),
      otp,
    });
    await newUser.save();
    mailBuilder(newUser.email, "otp", otpVerification, {
      otp,
    });
    return "User registration success.";
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};
module.exports.login = async (payload) => {
  // VALIDATE PAYLOAD
  const { error } = validatedLogin(payload);
  if (error) throw new AppError(error.details[0].message, 400);
  try {
    //   CHECK AVAILABILITY OF USER BY EMAIL
    const user = await User.findOne({ email: payload.email });
    if (!user) throw new AppError("Invalid email or password", 400);

    //   CHECK PASSWORD
    const passwordCheck = comparePassword(payload.password, user.password);
    if (!passwordCheck) throw new AppError("Invalid email or password", 400);

    //   CHECK USER IS VERIFIED USER
    if (!user.accountVerified && user.otp) {
      throw new AppError("Account not verified", 401);
    }

    //   CREATE ACCESS TOKEN
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS512",
        expiresIn: "1h",
      }
    );

    //   CREATE REFRESH TOKEN
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        algorithm: "HS512",
        expiresIn: "30d",
      }
    );
    return { accessToken, refreshToken };
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};
module.exports.accountVerification = async (payload) => {
  //  VALIDATE PAYLOAD
  const { error } = validatedAccountVerification(payload);
  if (error) throw new AppError(error.details[0].message, 400);
  try {
    // FIND USER BY OTP
    const user = await User.findOne({ otp: payload.otp });
    if (!user) throw new AppError("Invalid OTP", 400);
    await User.findByIdAndUpdate(user._id, {
      accountVerified: true,
      otp: null,
    });
    return "Account verified";
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};
module.exports.refreshToken = async (refreshToken) => {
  if (!refreshToken) throw new AppError("refresh token required", 400);
  // DECODE JWT TOKEN
  try {
    const decodedToken = jwt.decode(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const tokenUser = await User.findById(decodedToken.id);
    if (!tokenUser) throw new AppError("Invalid refresh token", 400);
    // CREATE NEW JWT TOKEN
    const token = jwt.sign(
      {
        id: tokenUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};
module.exports.resendAccountVerification = async (payload) => {
  try {
    const otp = otpGenerator();
    // VALIDATE PAYLOAD
    const { error } = validatedResendAccountVerification(payload);
    if (error) throw new AppError(error.details[0].message, 400);
    // FIND USER BY EMAIL
    const user = await User.findOne({ email: payload.email });
    if (!user) throw new AppError("User not found", 400);
    //  CHECK ACCOUNT IS ACTIVATED OR NOT BEFORE SEND OTP
    if (user.accountVerified)
      throw new AppError("Account already verified", 400);

    // SEND OTP TO USER EMAIL
    await User.findByIdAndUpdate(user._id, {
      otp,
    });
    mailBuilder(user.email, "otp", otpVerification, {
      otp,
    });
    return "OTP resent";
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};
module.exports.authenticatedUser = async (authUser) => {
  if (!authUser) throw new AppError("Unauthorized", 401);
  return authUser;
};
module.exports.forgotPassword = async (payload) => {
  const token = passwordToken();
  // VALIDATE PAYLOAD
  const { error } = validatedResendAccountVerification(payload);
  if (error) throw new AppError(error.details[0].message, 400);
  try {
    // FIND USER BY EMAIL
    const user = await User.findOne({ email: payload.email });
    if (!user) throw new AppError("User not found", 400);
    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: token,
      accountVerified: false,
    });
    // CREATE PASSWORD RESET LINK
    const resetLink = `${process.env.CLIENT_URL}/password-reset?resetToken=${token}`;
    mailBuilder(user.email, "passwordReset", forgetPasswordMail, { resetLink });
    return "Password reset link sended.";
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};
module.exports.resetPassword = async (payload) => {
  // VALIDATE PAYLOAD
  const { error } = validatedResetPassword(payload);
  if (error) throw new AppError(error.details[0].message, 400);
  try {
    //  CHECK USER BY TOKEN
    const user = await User.findOne({
      passwordResetToken: payload.passwordRestToken,
    });
    if (!user) throw new AppError("Invalid token", 400);
    await User.findByIdAndUpdate(user._id, {
      password: hashPassword(payload.password),
      passwordResetToken: null,
      accountVerified: true,
    });
    mailBuilder(
      user.email,
      "notification",
      notificationMail,
      {
        subject: "Password reset successfully",
        message: "Password reset successfully",
      },
      "Password reset successfully"
    );
    return "password reset successfully";
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};
