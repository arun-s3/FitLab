const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
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
    is_admin:{
        type:Boolean,
        required:true,
        default:false
    },
    is_verified:{
        type:Boolean,
        required:true,
        default:false
    },
    is_Blocked:{
        type:Boolean,
        required:true,
        default:false
    }
})

const user = new mongoose.model('User', userSchema)
module.exports = user