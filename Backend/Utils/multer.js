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
    // fileFilter: (req, file, callback)=>{
    //     const typesAllowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
    //     if( typesAllowed.includes(file.mimetype) ){
    //         callback(null, true)
    //     }
    //     else{
    //         callback(new Error('Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed!'), false)
    //     }
    // }
})

module.exports = upload