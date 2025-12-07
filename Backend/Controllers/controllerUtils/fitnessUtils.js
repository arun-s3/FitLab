
const muscleGroups = {

  chest: [
    "chest",
    "upper chest",
    "pectorals",
    "sternocleidomastoid",
    "serratus anterior"
  ],

  back: [
    "back",
    "upper back",
    "lower back",
    "latissimus dorsi",
    "lats",
    "rhomboids",
    "trapezius",
    "traps",
    "spine",
    "levator scapulae",
    "rear deltoids",
  ],

  shoulders: [
    "shoulders",
    "deltoids",
    "delts",
    "rear deltoids",
    "rotator cuff",
    "trapezius",
    "serratus anterior",
  ],

  biceps: [
    "biceps",
    "brachialis",
    "forearms",
    "wrist flexors",
    "wrist extensors"
  ],

  triceps: [
    "triceps",
    "forearms",
    "wrist extensors"
  ],

  forearms: [
    "forearms",
    "wrist flexors",
    "wrist extensors",
    "hands",
    "grip muscles",
    "wrists"
  ],

  quadriceps: [
    "quadriceps",
    "quads",
    "hip flexors",
    "abductors",
    "adductors"
  ],

  hamstrings: [
    "hamstrings",
    "glutes",
    "groin",
    "inner thighs"
  ],

  glutes: [
    "glutes",
    "hamstrings",
    "hip flexors",
    "abductors",
    "adductors"
  ],

  calves: [
    "calves",
    "soleus",
    "shins",
    "ankles",
    "feet",
    "ankle stabilizers"
  ],

  abs: [
    "abs",
    "abdominals",
    "obliques",
    "lower abs",
    "core",
    "serratus anterior"
  ],
};

const calculateHealthScore = (profile) => {
  if (!profile) return null

  const { weight, height, bodyFatPercentage, bloodPressure, glucose, age } = profile

  const heightMeters = height / 100
  const bmi = weight / (heightMeters * heightMeters)

  // Normalize BMI-- 18.5–24.9 = Good
  const bmiScore = Math.max(0, 100 - Math.abs(bmi - 22) * 5)

  const systolicDiff = Math.abs((bloodPressure?.systolic || 120) - 120)
  const diastolicDiff = Math.abs((bloodPressure?.diastolic || 80) - 80)
  const bpScore = Math.max(0, 100 - (systolicDiff + diastolicDiff) * 1.2)

  // Body Fat % → Ideal: 15–20% (generic)
  const bfScore = bodyFatPercentage
    ? Math.max(0, 100 - Math.abs(bodyFatPercentage - 18) * 2)
    : 50

  // Glucose -- Ideal: 100
  const glucoseScore = glucose
    ? Math.max(0, 100 - Math.abs(glucose - 100) * 1)
    : 60

  // Age -- Perfect: 30
  const ageScore = Math.max(0, 100 - Math.abs(age - 30) * 0.7)

  const finalScore = (bmiScore + bpScore + bfScore + glucoseScore + ageScore) / 5

  return Math.round(finalScore);
};


module.exports = {muscleGroups, calculateHealthScore}