const mongoose = require("mongoose")


const fitnessSchema = new mongoose.Schema({

  name: {
     type: String,
     unique: true 
  },
  thumbnailUrl: {
     type: String 
  },
  videos: [
    {
      videoId: String,
      title: String,
      thumbnail: String,
      channel: String
    }
  ]
})


const Fitness = mongoose.model("Fitness", fitnessSchema)
module.exports = Fitness
