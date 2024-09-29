const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    filename: (req, file, callback)=>{
        callback(null, path.join(__dirname, '../public/Images'))
    },
    destination: (req, file, callback)=>{
        callback(null, Date.now()+'-'+file.originalname)
    }
})

const upload = multer({storage,
    limit: {
        fileSize: 5 * 1024 * 12024
    },
    fileFilter: (req, file, callback)=>{
        const typesAllowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
        if( typesAllowed.includes(file.mimetype) ){
            callback(null, true)
        }
        else{
            callback(new Error('Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed!'), false)
        }
    }
})

module.exports = upload