import React, {useState, useEffect} from 'react'
import {motion} from 'framer-motion'

import {Star} from 'lucide-react'


export default function ExerciseDifficultyStars({exercise}){

    const [rating, setRating] = useState(2)
    const [isLoading, setIsLoading] = useState(true)

    const getDifficultyRating = (name = "")=> {
      const n = name.toLowerCase()
    
      const level5 = [
        "muscle up", "one arm", "one-hand", "planche", "front lever", "skin the cat", "drop push", "jack burpee", 
        "back lever", "human flag", "iron cross", "superman push", "archer pull",
        "clap push", "plyometric push", "single arm push", "90 degree", "pirate",
      ]     
      if (level5.some(k => n.includes(k))) return 5
    
      const level4 = [
        "handstand", "snatch", "clean", "jerk", "thruster", "pistol squat", "tuck", "reverse grip bench", "pendlay",
        "burpee", "box jump", "plyo", "explosive", "deadlift", "barbell squat", "oly", "complex", "dips",
        "weighted dip", "weighted pull", "renegade row", "bosu", "exercise ball", "ball pike",
      ] 
      if (level4.some(k => n.includes(k))) return 4
    
      const level3 = [
        "bench press", "press", "row", "squat", "pull-up", "pull up", "pulldown", "around world",
        "lunge", "clean", "shrug", "raise", "dip", "hammer curl", "bench", "incline", "decline"
      ] 
      if (level3.some(k => n.includes(k))) return 3

      const level2 = [
        "machine", "cable", "smith", "resistance band", "band", "seated",
        "lying", "kneeling", "chair", "step", "wall", "bodyweight", "floor",
        "curl", "kickback", "pushdown", "push-up", "push up", "fly", "concentration", "dip",
        "wrist curl", "reverse curl", "preacher", "swing",
        "lever", "thrust"
      ]    
      if (level2.some(k => n.includes(k))) return 2
    
      const level1 = [
        "stretch", "mobility", "warm", "extension", "rotation", "skater", "mountain climber",
        "plank", "dead bug", "bird dog", "walk", "hold", "run", "jump rope", "calf raise beginner"
      ] 
      if (level1.some(k => n.includes(k))) return 1
    
      return 2
    }

    useEffect(() => {
      if (!exercise.name || exercise.name.trim() === "") {
        return
      }

      const rating = getDifficultyRating(exercise.name)
      setRating(rating)
      setIsLoading(false)
    }, [exercise])
    

    return (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Star size={18} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Difficulty</p>
            <div className="flex gap-1">
              {
                !isLoading && rating
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-300"
                      }
                    />
                  ))
                : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-6 h-6 border-2 border-slate-200 border-t-secondary rounded-full"
                    />
                  </motion.div>
              }
            </div>
          </div>
        </div>
    )
}