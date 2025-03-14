const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    filename: (req, file, callback)=>{
        callback(null, Date.now()+'-'+file.originalname)
    },
    destination: (req, file, callback)=>{
        callback(null, path.join(__dirname, '../Public/Images'))
    }
})

const upload = multer({storage,
    limits: {
        fileSize: 10 * 1024 * 12024
    },

})

module.exports = upload