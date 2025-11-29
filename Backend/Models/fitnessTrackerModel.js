const mongoose = require("mongoose");
const ExerciseSchema = require("./ExerciseModel");

const FitnessTrackerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number,
      default: 0
    },
    exercises: [ExerciseSchema],
    totalWorkoutVolume: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FitnessTracker", FitnessTrackerSchema);
