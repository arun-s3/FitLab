const mongoose = require("mongoose");
const ExerciseSchema = require("./exerciseModel");

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
    totalDuration: {
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
