const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + "-" + file.originalname)
    },
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "../Public/Images"))
    },
})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, 
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Only images allowed"), false)
        }
    }
})

module.exports = upload
