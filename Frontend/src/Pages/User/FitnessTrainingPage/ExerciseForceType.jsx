import React, {useState, useEffect} from 'react'

import {Zap} from 'lucide-react'


export default function ExerciseForceType({exercise}){

    const [force, setForce] = useState(2)

    const getMovementType = (exerciseName = "")=> {

      const n = exerciseName.toLowerCase().trim()
      if (!n) return null

      const staticKeywords = [
        "plank", "hold", "isometric", "wall sit", "dead bug", "bird dog", "bridge"
      ]
      if (staticKeywords.some(k => n.includes(k))) return "static"

      const pullKeywords = [
        "pull", "row", "curl", "shrug",
        "chin", "lat", "face pull", "pulldown"
      ]
      if (pullKeywords.some(k => n.includes(k))) return "pull"

      const pushKeywords = [
        "push", "press", "dip", "extension", "kickback",
        "bench", "squat", "lunge", "thrust", "pushdown"
      ]
      if (pushKeywords.some(k => n.includes(k))) return "push"

      if (n.includes("raise")) return "push"

      const hybridKeywords = ["clean", "jerk", "snatch", "thruster"]
      if (hybridKeywords.some(k => n.includes(k))) return "push"

      return null
    }

    useEffect(() => {
      if (!exercise.name || exercise.name.trim() === "") {
        return
      }

      const force = getMovementType(exercise.name)
      setForce(force)
    }, [exercise])
    

    return (
            <div className="flex items-center gap-3">
              {
                force &&
                <>
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <Zap size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Movement Type</p>
                      <p className="text-sm font-semibold text-slate-900 capitalize">
                        {force || "Mixed"}
                      </p>
                    </div>
                </>
              }
            </div>
    )
}