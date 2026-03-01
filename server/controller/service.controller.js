const Service = require("../model/Service");
const File = require("../model/File");
const AppError = require("../error/AppError");
const {
  validatedCreateService,
  validatedUpdateService,
  validatedQueryServices,
  validatedBulkPriceUpdate,
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
    const existingService = await Service.findOne({ name: value.name, isDeleted: false });
    if (existingService) {
      throw new AppError("Service with this name already exists", 400);
    }

    // if user upload a image check if it is a valid image otherwise delete it    
   if(value.image){
    const image = await File.findById(value.image);
    if(!image){
      throw new AppError("Image not found", 404);
    }
    // check if image is a image
    if(!image.fileType.startsWith("image/")){
      deleteFileById(image._id);
      throw new AppError("Image is not a valid image", 400);
    }
   }
    
    const newService = new Service(value);
    await newService.save();
    return `'${value.name}' created successfully`;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
