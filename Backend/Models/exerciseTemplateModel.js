const mongoose = require("mongoose");

const ExerciseTemplateSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true 
        },
        name: {
            type: String, 
            required: true 
        },
        bodyPart: {
            type: String, 
            required: true 
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
            default: "" 
        },
        lastUsedAt: {
            type: Date, 
            default: null 
        }
    },{ timestamps: true });

module.exports = mongoose.model("ExerciseTemplate", ExerciseTemplateSchema);
