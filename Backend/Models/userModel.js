const mongoose = require('mongoose')

// const imageUrl = URL.createObjectURL('/DefaultDp.png')
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        maxlength:100
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        maxlength:100
    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
    profilePic:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    },
    isAdmin:{
        type:Boolean, 
        required:true,
        default:false
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const user = new mongoose.model('User', userSchema)
module.exports = user