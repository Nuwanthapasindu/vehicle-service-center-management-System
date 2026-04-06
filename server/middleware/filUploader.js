const multer = require('multer');
const { fileDiskStorage } = require('../config/multer.config');
const AppError = require('../error/AppError');

module.exports.fileUploader = multer({
    storage: fileDiskStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "application/pdf",
            "image/webp",
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError("Only .png, .jpg, .jpeg .webp and .pdf format allowed!", 400));
        }
    }
});