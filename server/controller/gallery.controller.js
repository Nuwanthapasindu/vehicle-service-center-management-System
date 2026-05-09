const mongoose = require("mongoose");
const Gallery = require("../model/Gallery");
const File = require("../model/File");
const fileController = require("./file.controller");
const AppError = require("../error/AppError");

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

/**
 * Create gallery image records (supports multiple, with rollback on failure)
 */
module.exports.createGalleryImage = async (data) => {
  const imageIds = data.images || (data.image ? [data.image] : []);

  if (!imageIds || imageIds.length === 0) {
    throw new AppError("At least one image ID is required", 400);
  }

  // 1. Validate format of every ID up-front
  const invalidIds = imageIds.filter((id) => !OBJECT_ID_REGEX.test(String(id)));
  if (invalidIds.length > 0) {
    throw new AppError(
      `Invalid image ID format: ${invalidIds.join(", ")}`,
      400
    );
  }

  // 2. Verify all referenced File documents actually exist
  const existingFiles = await File.find({
    _id: { $in: imageIds.map((id) => new mongoose.Types.ObjectId(id)) },
  }).select("_id");

  if (existingFiles.length !== imageIds.length) {
    const foundIds = new Set(existingFiles.map((f) => f._id.toString()));
    const missing = imageIds.filter((id) => !foundIds.has(id.toString()));
    throw new AppError(
      `File(s) not found for ID(s): ${missing.join(", ")}`,
      404
    );
  }

  // 3. Insert sequentially and track created IDs for rollback
  const createdIds = [];
  try {
    for (const id of imageIds) {
      const doc = await new Gallery({ image: id }).save();
      createdIds.push(doc._id);
    }

    return {
      message: `${createdIds.length} gallery image(s) created successfully`,
      payload: createdIds,
    };
  } catch (error) {
    // 4. Rollback: remove any records that were created before the failure
    if (createdIds.length > 0) {
      await Gallery.deleteMany({ _id: { $in: createdIds } }).catch(() => {
        // Best-effort cleanup; log but don't mask the original error
      });
    }
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

    const fileRef = galleryImage.image;

    // Delete gallery record FIRST — establishes correct application state
    await Gallery.findByIdAndDelete(id);

    // Best-effort file cleanup after record is removed
    if (fileRef) {
      try {
        await fileController.deleteFileById(fileRef);
      } catch {
        // File cleanup failed but gallery record is already gone — acceptable
      }
    }

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

    // Collect file references before deleting gallery records
    const galleryImages = await Gallery.find({ _id: { $in: ids } });
    const fileRefs = galleryImages
      .filter((img) => img.image)
      .map((img) => img.image);

    // Delete gallery records FIRST — establishes correct application state
    const deleteResult = await Gallery.deleteMany({ _id: { $in: ids } });

    // Best-effort file cleanup — use allSettled so one failure doesn't block others
    const fileResults = await Promise.allSettled(
      fileRefs.map((fileId) => fileController.deleteFileById(fileId))
    );

    const failedCleanups = fileResults.filter((r) => r.status === "rejected");

    return {
      message: `${deleteResult.deletedCount} gallery record(s) deleted successfully`,
      ...(failedCleanups.length > 0 && {
        warning: `${failedCleanups.length} associated file(s) could not be cleaned up`,
      }),
    };
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

