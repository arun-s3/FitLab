import React from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import {Star} from 'lucide-react'


export default function ExerciseDifficultyStars({exercise}){

    const calculateDifficultyStars = (exercise) => {
        const eq = (exercise?.equipment || "").toLowerCase()
        const force = (exercise?.force || "").toLowerCase()
        const mechanic = (exercise?.mechanic || "").toLowerCase()
        const level = (exercise?.level || "").toLowerCase()
        const name = (exercise?.name || "").toLowerCase()
    
        let score = 0
    
        // 1. Equipment-based difficulty
        if (eq.includes("body")) score += 1
        else if (eq.includes("band")) score += 2
        else if (eq.includes("dumbbell")) score += 3
        else if (eq.includes("kettlebell")) score += 4
        else if (eq.includes("barbell")) score += 5
        else if (eq.includes("machine") || eq.includes("cable")) score += 4
        else if (eq.includes("weighted")) score += 6
        else score += 2
    
        // 2. Force difficulty
        if (force.includes("pull") || force.includes("push")) score += 1
        if (force.includes("static") || force.includes("isometric")) score += 0.5
    
        // 3. Mechanic
        if (mechanic.includes("compound")) score += 1.5
        if (mechanic.includes("isolation")) score += 0.5
    
        // 4. Level
        if (level.includes("intermediate")) score += 1
        if (level.includes("expert") || level.includes("advanced")) score += 2
    
        // 5. Special exercise names
        if (name.includes("plyometric") || name.includes("jump")) score += 2
        if (name.includes("muscle up") || name.includes("planche") || name.includes("flag")) score += 3
    
        // ---------- NORMALIZE SCORE TO 1–5 ----------
        // Assume raw score range ~2 to ~15
        const normalized = Math.round((score / 15) * 5)
    
        // clamp to 1–5
        return Math.max(1, Math.min(5, normalized))
    }
    

    return (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Star size={18} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Difficulty</p>
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < calculateDifficultyStars(exercise)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-slate-300"
                  }
                />
              ))}
            </div>
          </div>
        </div>
    )
}