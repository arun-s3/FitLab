const mongoose = require("mongoose")

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  bodyPart: {
    type: String,
    required: true,
    trim: true
  },
  equipment: {
    type: String,
    default: null
  },
  sets: [
    {
      weight: {
         type: Number, 
         default: 0 
      }, 
      reps: {
        type: Number,
        required: true 
      },
      rpe: {
          type: Number,
          min: 1,
          max: 10,
          default: null
        }
    }
  ],
  notes: {
    type: String,
    trim: true,
    default: ""
  },
  totalVolume: {
    type: Number,
    default: 0
  }
})

module.exports = ExerciseSchema