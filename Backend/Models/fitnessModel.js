const mongoose = require("mongoose")

const fitnessSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  thumbnailUrl: { type: String },
})


const Fitness = mongoose.model("Fitness", fitnessSchema)
module.exports = Fitness
