const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "bluebell-products",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        if (!allowedTypes.includes(file.mimetype)) {
            return callback(new Error("INVALID_PHOTO_TYPE"));
        }
        callback(null, true);
    }
}).single("photo");

function uploadProductPhoto(req, res, next) {
    upload(req, res, (error) => {
        if (!error) return next();
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).send("Choose a photo smaller than 5 MB.");
        }
        if (error.message === "INVALID_PHOTO_TYPE") {
            return res.status(400).send("Choose a JPEG, PNG, or WebP photo.");
        }
        if (error instanceof multer.MulterError) {
            return res.status(400).send("Choose one product photo.");
        }
        res.status(502).send("Could not upload the photo. Check your Cloudinary setup and try again.");
    });
}

async function discardUploadedPhoto(file) {
    if (!file) return;
    try {
        await cloudinary.uploader.destroy(file.filename);
    } catch {
        console.error("Could not clean up an unused Cloudinary photo.");
    }
}

module.exports = { uploadProductPhoto, discardUploadedPhoto };
