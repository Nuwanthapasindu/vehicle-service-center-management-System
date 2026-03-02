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

/**
 * Get packages with pagination and filtering
 * @param {Object} queryPayload - Query parameters
 * @returns {Promise<Object>} - Paginated packages
 */
module.exports.getPackages = async (queryPayload) => {
  const { error } = validatedQueryPackages(queryPayload);
  if (error) throw new AppError(error.details[0].message, 400);

  try {
    const {
      name,
      model,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = queryPayload;

    const query = { isDeleted: false };

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (model) {
      query.applicableVehicalModels = model;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      // Filtering out documents where at least one price falls in the range
      query.pricingTiers = {
        $elemMatch: {},
      };
      if (minPrice !== undefined) {
        query.pricingTiers.$elemMatch.price = {
          ...query.pricingTiers.$elemMatch.price,
          $gte: minPrice,
        };
      }
      if (maxPrice !== undefined) {
        query.pricingTiers.$elemMatch.price = {
          ...query.pricingTiers.$elemMatch.price,
          $lte: maxPrice,
        };
      }
    }

    const sortOption = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const skip = (page - 1) * limit;

    const packages = await Package.find(query)
      .sort(sortOption)
      .select("-isDeleted -deletedAt")
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "servicesIncluded",
          select: ["name", "description"],
        },
        {
          path: "image",
          select: ["filePath", "fileType"],
        },
      ]);

    const total = await Package.countDocuments(query);

    return {
      packages,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Get package by ID
 * @param {string} id - Package ID
 * @returns {Promise<Object>} - Package
 */
module.exports.getPackageById = async (id) => {
  if (!id) throw new AppError("Package id is required", 400);

  // check id is a valid object id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid package id", 400);
  }

  try {
    const pkg = await Package.findById(id)
      .populate([
        {
