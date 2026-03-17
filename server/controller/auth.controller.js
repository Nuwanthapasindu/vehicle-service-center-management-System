const User = require("../model/User");
const Auth = require("../model/Auth");
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
const { sendSms } = require("../util/smsSender");
const otpGenerator = require("../util/otp");

module.exports.register = async (payload) => {
  const otp = otpGenerator();
  //  VALIDATING PAYLOAD
  const { error } = validatedRegister(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  //   CHECK IF USER ALREADY EXISTS
  const existingAuth = await Auth.findOne({ userName: payload.userName });
  if (existingAuth) throw new AppError("Username already exists", 400);

  const existingUser = await User.findOne({ mobile: payload.mobile });
  if (existingUser) throw new AppError("Mobile number already registered", 400);

  try {
    const newUser = new User({
      name: payload.name,
      mobile: payload.mobile,
      address: payload.address,
    });
    const savedUser = await newUser.save();

    const newAuth = new Auth({
      user: savedUser._id,
      userName: payload.userName,
      password: hashPassword(payload.password),
      verificationOtp: otp,
    });
    await newAuth.save();

    // Send OTP via SMS
    try {
      await sendSms(savedUser.mobile, `Your verification code is: ${otp}`);
    } catch (smsError) {
      // role back auth and user
      await Promise.all([
        Auth.findByIdAndDelete(newAuth._id),
        User.findByIdAndDelete(savedUser._id),
      ]);
      throw new AppError("Failed to send verification SMS", 500);
    }

    return "User registration success. Please verify your mobile number.";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
module.exports.login = async (payload) => {
  // VALIDATE PAYLOAD
  const { error } = validatedLogin(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  try {
    // CHECK USER BY USERNAME
    const auth = await Auth.findOne({ userName: payload.userName }).populate(
      "user",
    );
    if (!auth) throw new AppError("Invalid username or password", 400);

    // CHECK PASSWORD
    const passwordCheck = comparePassword(payload.password, auth.password);
    if (!passwordCheck) throw new AppError("Invalid username or password", 400);

    const { user } = auth;

    // CHECK USER IS VERIFIED (Active)
    if (!user.isActive) {
      // If verificationOtp is present, maybe they haven't verified?
      if (auth.verificationOtp) throw new AppError("Account not verified", 401);
    }

    // CREATE ACCESS TOKEN
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { algorithm: "HS512", expiresIn: "1h" },
    );

    // CREATE REFRESH TOKEN
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { algorithm: "HS512", expiresIn: "30d" },
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
    // FIND AUTH BY OTP
    const auth = await Auth.findOne({ verificationOtp: payload.otp }).populate(
      "user",
    );
    if (!auth) throw new AppError("Invalid OTP", 400);

    // Update Auth and User
    auth.verificationOtp = null; // Clear OTP
    await auth.save();

    await User.findByIdAndUpdate(auth.user._id, { isActive: true });

    return "Account verified successfully";
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
      process.env.REFRESH_TOKEN_SECRET,
    );
    const tokenUser = await User.findById(decodedToken.id);
    if (!tokenUser || !tokenUser.isActive || tokenUser.isDeleted) throw new AppError("Invalid refresh token", 400);
    // CREATE NEW JWT TOKEN
    const token = jwt.sign(
      {
        id: tokenUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
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

    // FIND USER BY MOBILE
    const user = await User.findOne({ mobile: payload.mobile });
    if (!user) throw new AppError("No registered user found with this mobile", 400);

    // FIND AUTH FOR THIS USER
    const auth = await Auth.findOne({ user: user._id });
    if (!auth) throw new AppError("No registered user found with this mobile", 400);

    // CHECK IF ALREADY VERIFIED
    if (!auth.verificationOtp && user.isActive) {
      throw new AppError("Account already verified", 400);
    }

    // UPDATE OTP IN AUTH
    auth.verificationOtp = otp;
    await auth.save();

    // SEND SMS
    try {
      await sendSms(user.mobile, `Your verification code is: ${otp}`);
    } catch (smsError) {
      throw smsError;
    }

    return "OTP resent successfully";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
module.exports.authenticatedUser = async (authUser) => {
  if (!authUser) throw new AppError("Unauthorized", 401);
  return authUser;
};
module.exports.forgotPassword = async (payload) => {

  try {
    const otp = otpGenerator();
    // VALIDATE PAYLOAD (Reusing resendAccountVerification as it accepts mobile)
    const { error } = validatedResendAccountVerification(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    // FIND USER BY MOBILE
    const user = await User.findOne({ mobile: payload.mobile });
    if (!user) throw new AppError("No registered user found with this mobile", 400);

    // FIND AUTH FOR THIS USER
    const auth = await Auth.findOne({ user: user._id });
    if (!auth) throw new AppError("No registered user found with this mobile", 400);

    // UPDATE OTP IN AUTH (Reusing verificationOtp for password reset verification)
    auth.verificationOtp = otp;
    await auth.save();

    user.isActive = false;
    await user.save();

    // SEND SMS
    try {
      await sendSms(user.mobile, `Your password reset code is: ${otp}`);
    } catch (smsError) {
      // role back auth and user
      auth.verificationOtp = null;
      user.isActive = true;
      await Promise.resolve([auth.save(), user.save()]);
      throw smsError;
    }

    return "Password reset OTP sent successfully";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
module.exports.resetPassword = async (payload) => {
  // VALIDATE PAYLOAD
  const { error } = validatedResetPassword(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  try {
    // FIND AUTH BY OTP
    const auth = await Auth.findOne({ verificationOtp: payload.otp }).populate(
      "user",
    );
    if (!auth) throw new AppError("Invalid OTP", 400);

    // UPDATE PASSWORD
    auth.password = hashPassword(payload.password);
    auth.verificationOtp = null; // Clear OTP
    await auth.save();

    // Ensure User is active
    if (!auth.user.isActive) {
      await User.findByIdAndUpdate(auth.user._id, { isActive: true });
    }

    // Send SMS Notification
    try {
      await sendSms(
        auth.user.mobile,
        "Your password has been reset successfully.",
      );
    } catch (smsError) {
      // Handle SMS notification failure
      console.error("SMS notification failed:", smsError);
    }

    return "Password reset successfully";
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};
