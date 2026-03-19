const File = require('../model/File');
const AppError = require('../error/AppError');
const path = require('path');
const deleteFile = require('../util/deleteFile');

/**
 * Upload and save supplier payment slip file metadata
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>} - File metadata
 * @throws {AppError} - If no file is provided or save fails
 */
module.exports.singleFileUpload = async (file) => {
    if (!file) {
        throw new AppError("No file uploaded.", 400);
    }

    try {
        // Save file metadata to database
        const newFile = new File({
            originalName: file.originalname,
            fileName: file.filename,
            filePath: path.join("storage", "uploads", file.filename), // Absolute path
            fileType: file.mimetype,
            fileSize: file.size,
        });

        const fileDoc = await newFile.save();

        return fileDoc;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
};


/**
 * Upload and save multiple supplier payment slip files metadata
 * @param {Array<Object>} files - Array of Multer file objects
 * @returns {Promise<Array<Object>>} - Array of saved file metadata
 * @throws {AppError} - If no files are provided or save fails
 */
module.exports.multipleFileUpload = async (files) => {
    if (!files || files.length === 0) {
        throw new AppError("No files uploaded.", 400);
    }
    try {
        const fileDocs = files.map(file => {
            return new File({
                originalName: file.originalname,
                fileName: file.filename,
                filePath: path.join("storage", "uploads", file.filename), // Absolute path
                fileType: file.mimetype,
                fileSize: file.size,
            });
        })

        const savedFiles = await File.insertMany(fileDocs);
        return savedFiles;

    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

/**
 * Get file metadata by ID
 * @param {string} fileId - File ID
 * @returns {Promise<Object>} - File metadata
 * @throws {AppError} - If file not found
 */
module.exports.getFileById = async (fileId) => {
    try {
        const file = await File.findById(fileId);

        if (!file) {
            throw new AppError("File not found.", 404);
        }

        return {
            id: file._id,
            originalName: file.originalName,
            fileName: file.fileName,
            fileUrl: `/uploads/${file.fileName}`,
            fileType: file.fileType,
            fileSize: file.fileSize,
            uploadedAt: file.createdAt,
        };
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};

/**
 * Delete a file by its ID
 * @param {string} fileId - File ID
 * @returns {Promise<string>} - Success message
 * @throws {AppError} - If file not found
 * @throws {AppError} - If there is an internal server error
 */
module.exports.deleteFileById = async (fileId) => {
    try {
        const fileExists = await File.findById(fileId);
        if (!fileExists) {
            throw new AppError("File not found.", 404);
        }
        await File.findByIdAndDelete(fileId);
        // DELETE FILE FROM STORAGE
        deleteFile(fileExists.filePath);
        return "File deleted successfully.";

    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
}