const Package = require("../model/Package");
const Service = require("../model/Service");
const File = require("../model/File");
const AppError = require("../error/AppError");
const {
  validatedCreatePackage,
  validatedUpdatePackage,
  validatedQueryPackages,
} = require("../validation/package.validation");
const { deleteFileById } = require("./file.controller");

/**
 * Create a new package
 * @param {Object} payload - Package data
 * @returns {Promise<Object>} - Created package
 */
module.exports.createPackage = async (payload) => {
  const { value, error } = validatedCreatePackage(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  try {
    if (value.image) {
      const uploadedFile = await File.findById(value.image);
      if (!uploadedFile) {
        throw new AppError("Uploaded image file not found", 404);
      }
      if (!uploadedFile.fileType.startsWith("image/")) {
        await deleteFileById(value.image);
        throw new AppError("Uploaded file must be an image", 400);
      }
    }

    if (value.servicesIncluded && value.servicesIncluded.length > 0) {
      const existingServices = await Service.find({
        _id: { $in: value.servicesIncluded },
      });
      if (existingServices.length !== value.servicesIncluded.length) {
        throw new AppError(
          "One or more included services are invalid or do not exist",
          400,
        );
      }
    }

    const existingPackage = await Package.findOne({
      name: value.name,
      isDeleted: false,
    });
    if (existingPackage) {
      throw new AppError("Package with this name already exists", 400);
    }

    const newPackage = new Package(value);
    await newPackage.save();

    return `${value.name} package created successfully`;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
