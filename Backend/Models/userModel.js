const mongoose = require('mongoose')

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
    firstName:{
        type:String,
        default: null
    },
    lastName:{
        type:String,
        default: null
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
    dob:{
        type:Date
    },
    gender:{ 
        type:String,
        enum:["male", "female"]
    },
    weight: {  
      type:Number,
      min:1,
      max:400,
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
    },
    riskyUserStatus: {
      type: Boolean,
      default:false
    },
    riskyUserNotes: {
      type: String,
      default: null,
      maxlength: 500
    },
    fitnessGoal: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "general_fitness", "endurance", "strength", "flexibility", "recovery", "not_set"],
      default: "not_set"
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    hasAcceptedTerms: {
      type: Boolean,
      default: false
    },
    termsAcceptedAt: {
      type: Date,
    },
    termsVersion: {
      type: String
    }
},{timestamps:true})

const user = new mongoose.model('User', userSchema)
module.exports = user