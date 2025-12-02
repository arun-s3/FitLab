
export function estimateCalories({bodyPart, equipment = "None", sets = [], duration = 0, userWeight = 75}){

  const bodyPartFactor = MET_BY_BODY_PART[bodyPart] || 1
  const equipmentFactor = EQUIPMENT_MULTIPLIER[equipment] || 1
  const durationMin = Math.max(duration / 60, 1)

  let totalWeight = 0
  let totalReps = 0
  let avgRPE = 6

  for (const s of sets) {
    totalWeight += (s.weight || 0) * (s.reps || 0)
    totalReps += s.reps || 0
    avgRPE = s.rpe ? (avgRPE + s.rpe) / 2 : avgRPE
  }

  const effortScore = totalWeight * (avgRPE / 10)

  const exerciseType = totalWeight > 0 ? "strength" : "cardio"

  let MET = 5 

  if (exerciseType === "strength") {
    const intensityScore = (effortScore / durationMin) * avgRPE

    if (intensityScore <= 20) MET = 3.5
    else if (intensityScore <= 50) MET = 5
    else if (intensityScore <= 90) MET = 7
    else MET = 9.5
  }

  if (exerciseType === "cardio") {
    if (durationMin < 15) MET = 6
    else if (durationMin <= 30) MET = 8
    else MET = 12
  }

  const calories = MET * userWeight * (durationMin / 60)

  return Math.max(1, Math.round(calories * bodyPartFactor * equipmentFactor))
}
