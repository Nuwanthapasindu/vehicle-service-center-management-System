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
 * Get all gallery images (with optional pagination)
 */
module.exports.getAllGalleryImages = async (query = {}) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 0; // 0 means return all
    const skip = (page - 1) * limit;

    let mongoQuery = Gallery.find().populate("image", "filePath fileName").sort({ createdAt: -1 });

    if (limit > 0) {
      mongoQuery = mongoQuery.limit(limit).skip(skip);
    }

    const [images, total] = await Promise.all([
      mongoQuery,
      Gallery.countDocuments()
    ]);

    return {
      images,
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1
    };
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

/**
 * Delete multiple gallery images
 */
module.exports.deleteMultipleGalleryImages = async (data) => {
  try {
    const ids = data.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError("No IDs provided for deletion", 400);
    }

    const galleryImages = await Gallery.find({ _id: { $in: ids } });

    // Delete associated files
    const fileDeletionPromises = galleryImages
      .filter(img => img.image)
      .map(img => fileController.deleteFileById(img.image));
    
    await Promise.all(fileDeletionPromises);

    // Delete gallery records
    await Gallery.deleteMany({ _id: { $in: ids } });

    return { message: `${galleryImages.length} images deleted successfully` };
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
