
const MET_BY_BODY_PART = {
  neck: 0.95,
  lower_arms: 1.00,
  shoulders: 1.10,
  cardio: 1.30,
  upper_arms: 1.05,
  chest: 1.15,
  lower_legs: 1.20,
  back: 1.20,
  upper_legs: 1.25, 
  waist: 1.15 
}

const EQUIPMENT_MULTIPLIER = {
  body_weight: 1.00,
  dumbbell: 1.05,
  barbell: 1.10,
  olympic_barbell: 1.12,
  ez_barbell: 1.08,
  kettlebell: 1.07,
  trap_bar: 1.11,

  machine: 1.08, // fallback for generic machines
  smith_machine: 1.06,
  leverage_machine: 1.09,
  sled_machine: 1.12,
  assisted: 0.95,

  cable: 1.06,
  band: 1.03,
  resistance_band: 1.04,
  rope: 1.04,

  medicine_ball: 1.03,
  stability_ball: 1.02,
  bosu_ball: 1.02,
  roller: 1.01,
  wheel_roller: 1.02,

  hammer: 1.07,
  tire: 1.10,

  stationary_bike: 1.12,
  stepmill_machine: 1.18,
  elliptical_machine: 1.14,
  skierg_machine: 1.16,
}

// Converts body part string (e.g., "Upper Legs" -> "upper_legs")
export const normalizeBodyPart = (bodyPart = "") => {
  return bodyPart
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_") 
    .replace(/[^a-z0-9_]/g, "")
}

// Converts equipment string (e.g., "Stability Ball" -> "stability_ball")
export const normalizeEquipment = (equipment = "") => {
  if (!equipment || equipment.trim().toLowerCase() === "none") {
    return "body_weight"
  }

  return equipment
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export function estimateCalories(bodyPart, equipment = "None", sets = [], duration = 0, userWeight = 75){

  // console.log("Inside estimateCalories()")
  // console.log(`bodyPart----> ${bodyPart} and equipment----> ${equipment} and duration--> ${duration}`)

  const bodyPartFactor = MET_BY_BODY_PART[normalizeBodyPart(bodyPart)] || 1
  const equipmentFactor = EQUIPMENT_MULTIPLIER[normalizeEquipment(equipment)] || 1
  const durationMin = Math.max(duration / 60, 1)

  // console.log(`bodyPartFactor--> ${bodyPartFactor}, equipmentFactor--> ${equipmentFactor} and durationMin--> ${durationMin}`)

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
