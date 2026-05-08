const Gallery = require("../model/Gallery");
const fileController = require("./file.controller");
const AppError = require("../error/AppError");

/**
 * Create gallery image records (supports multiple)
 */
module.exports.createGalleryImage = async (data) => {
  try {
    const imageIds = data.images || (data.image ? [data.image] : []);

    if (!imageIds || imageIds.length === 0) {
      throw new AppError("At least one image ID is required", 400);
    }

    const galleryPromises = imageIds.map((id) => {
      const newGallery = new Gallery({
        image: id,
      });
      return newGallery.save();
    });

    const results = await Promise.all(galleryPromises);
    
    return {
      message: `${results.length} gallery image(s) created successfully`,
      payload: results
    };
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Get all gallery images
 */
module.exports.getAllGalleryImages = async () => {
  try {
    return await Gallery.find()
      .populate("image", "filePath fileName")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Delete a gallery image
 */
module.exports.deleteGalleryImage = async (id) => {
  try {
    const galleryImage = await Gallery.findById(id);
    
    if (!galleryImage) {
      throw new AppError("Gallery image not found", 404);
    }

    // Delete file from storage and File model
    if (galleryImage.image) {
      await fileController.deleteFileById(galleryImage.image);
    }

    // Hard delete gallery record
    await Gallery.findByIdAndDelete(id);

    return { message: "Gallery image deleted successfully" };
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
