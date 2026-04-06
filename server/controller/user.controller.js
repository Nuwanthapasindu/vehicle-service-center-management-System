const User = require("../model/User");
const Auth = require("../model/Auth");
const AppError = require("../error/AppError");
const { hashPassword, comparePassword } = require("../util/password");
const { validatedUpdateProfile } = require("../validation/user.validation");
const { USER_ROLES } = require("../util/constants");

module.exports.updateProfile = async (payload, mobile) => {
  const { error } = validatedUpdateProfile(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  const user = await User.findOne({ mobile });
  if (!user) throw new AppError("User not found", 404);

  if (payload.phoneNumber && payload.phoneNumber !== mobile) {
    const mobileExists = await User.findOne({ mobile: payload.phoneNumber });
    if (mobileExists) throw new AppError("Mobile number already in use", 400);
  }

  if (payload.newPassword) {
    const auth = await Auth.findOne({ user: user._id });
    if (!auth) throw new AppError("Auth credentials not found", 404);

    const isMatch = comparePassword(payload.currentPassword, auth.password);
    if (!isMatch) throw new AppError("Incorrect current password", 400);

    auth.password = hashPassword(payload.newPassword);
    await auth.save();
  }

  user.name = payload.fullName;
  user.mobile = payload.phoneNumber;
  user.address = payload.address;
  const savedUser = await user.save();

  const { isDeleted, deletedAt, __v, ...safeUser } = savedUser.toObject();
  return safeUser;
};

module.exports.searchCustomersByMobile = async (mobile) => {
  if (!mobile) throw new AppError("Mobile number is required", 400);

  const customers = await User.find({
    mobile: { $regex: `^${mobile}`, $options: "i" },
    role: USER_ROLES.CUSTOMER,
    isDeleted: false,
  }).select("-__v -createdAt -updatedAt -isDeleted");

  return customers;
};
