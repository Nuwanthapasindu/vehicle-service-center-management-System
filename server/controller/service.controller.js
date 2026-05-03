const Service = require("../model/Service");
const File = require("../model/File");
const Package = require("../model/Package");
const AppError = require("../error/AppError");
const {
  validatedCreateService,
  validatedUpdateService,
  validatedQueryServices,
} = require("../validation/service.validation");
const { deleteFileById } = require("./file.controller");

/**
 * Create a new service
 * @param {Object} payload - Service data
 * @returns {Promise<Object>} - Created service
 */
module.exports.createService = async (payload) => {
  const { value, error } = validatedCreateService(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  try {
    const existingService = await Service.findOne({
      name: value.name,
      isDeleted: false,
    });
    if (existingService) {
      throw new AppError("Service with this name already exists", 400);
    }

    // if user upload a image check if it is a valid image otherwise delete it
    if (value.image) {
      const image = await File.findById(value.image);
      if (!image) {
        throw new AppError("Image not found", 404);
      }
      // check if image is a image
      if (!image.fileType.startsWith("image/")) {
        deleteFileById(image._id);
        throw new AppError("Image is not a valid image", 400);
      }
    }

    const newService = new Service(value);
    await newService.save();
    return `${value.name} created successfully`;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Get services with pagination and filtering
 * @param {Object} queryPayload - Query parameters
 * @returns {Promise<Object>} - Paginated services
 */
module.exports.getServices = async (queryPayload) => {
  const { error } = validatedQueryServices(queryPayload);
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
      query["prices.model"] = model;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      // Filtering out documents where at least one price falls in the range
      // Because prices is an array of objects
      query.prices = {
        $elemMatch: {},
      };
      if (minPrice !== undefined)
        query.prices.$elemMatch.price = {
          ...query.prices.$elemMatch.price,
          $gte: minPrice,
        };
      if (maxPrice !== undefined)
        query.prices.$elemMatch.price = {
          ...query.prices.$elemMatch.price,
          $lte: maxPrice,
        };
    }

    const sortOption = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const skip = (page - 1) * limit;

    const services = await Service.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "image",
        select: ["-_id", "filePath", "fileType"],
      })
      .select(["-isDeleted", "-deletedAt", "-__v"]);

    const total = await Service.countDocuments(query);

    return {
      services,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Get service by ID
 * @param {string} id - Service ID
 * @returns {Promise<Object>} - Service
 */
module.exports.getServiceById = async (id) => {
  if (!id) throw new AppError("Service id is required", 400);

  try {
    const service = await Service.findById(id)
      .populate({
        path: "image",
        select: ["_id", "filePath", "fileType"],
      })
      .select(["-isDeleted", "-deletedAt", "-__v"]);

    if (!service || service.isDeleted) {
      throw new AppError("Service not found", 404);
    }
    return service;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Update a service
 * @param {string} id - Service ID
 * @param {Object} payload - Update data
 * @returns {Promise<Object>} - Updated service
 */
module.exports.updateService = async (id, payload) => {
  let imageChanged = false;
  if (!id) throw new AppError("Service id is required", 400);

  // Prevent users from manually altering soft-delete statuses during standard updates
  if (payload.isDeleted !== undefined) delete payload.isDeleted;
  if (payload.deletedAt !== undefined) delete payload.deletedAt;

  const { error } = validatedUpdateService(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  try {
    if (payload.image) {
      const uploadedFile = await File.findById(payload.image);
      if (!uploadedFile) {
        throw new AppError("Uploaded image file not found", 404);
      }
      if (!uploadedFile.fileType.startsWith("image/")) {
        await deleteFileById(payload.image);
        throw new AppError("Uploaded file must be an image", 400);
      }
      imageChanged = true;
    }

    if (payload.name) {
      const existingService = await Service.findOne({
        name: payload.name,
        _id: { $ne: id },
        isDeleted: false,
      });
      if (existingService) {
        throw new AppError("Service name already in use", 400);
      }
    }

    if (imageChanged) {
      const oldImage = await Service.findById(id);
      if (oldImage.image) {
        await deleteFileById(oldImage.image);
      }
    }

    const updatedService = await Service.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedService || updatedService.isDeleted) {
      throw new AppError("Service not found", 404);
    }

    return `${updatedService.name} updated successfully.`;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Delete a service
 * @param {string} id - Service ID
 * @returns {Promise<string>} - Success message
 */
module.exports.deleteService = async (id) => {
  if (!id) throw new AppError("Service id is required", 400);

  try {
    const service = await Service.findOne({ _id: id, isDeleted: false });
    if (!service) {
      throw new AppError("Service not found", 404);
    }

    service.isDeleted = true;
    service.deletedAt = Date.now();
    await service.save();

    // Cascading update: Remove this service from all packages
    await Package.updateMany(
      { servicesIncluded: id },
      { $pull: { servicesIncluded: id } },
    );

    if (service.image) {
      await deleteFileById(service.image);
    }

    return "Service deleted successfully.";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Get all services for job card
 * @returns {Promise<Object>} - Services
 */
module.exports.getAllServicesForJobCard = async () => {
  try {
    const services = await Service.find({ isDeleted: false })
      .select(["-isDeleted", "-deletedAt", "-__v", "-createdAt", "-updatedAt"])
      .populate({
        path: "image",
        select: ["-_id", "filePath", "fileType"],
      });

    return services;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
