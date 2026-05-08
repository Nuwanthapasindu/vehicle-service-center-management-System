const Gallery = require("../model/Gallery");
const fileController = require("./file.controller");
const AppError = require("../error/AppError");

/**
 * Create a new gallery image record
 */
module.exports.createGalleryImage = async (data) => {
  try {
    if (!data.image) {
      throw new AppError("Image ID is required", 400);
    }

    const newGallery = new Gallery({
      title: data.title || "",
      description: data.description || "",
      image: data.image,
    });

    return await newGallery.save();
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
