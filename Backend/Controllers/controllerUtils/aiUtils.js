function parseAIJsonResponse(aiText) {
  
  console.log("aiText-------->", aiText)
  if (!aiText || typeof aiText !== "string") return null

  try {
    const cleaned = aiText
      .replace(/```json\s*/i, "")
      .replace(/```/g, "")
      .trim()

    const parsed = JSON.parse(cleaned)

    if (typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Parsed AI response is not an object")
    }

    return parsed
  }
  catch (error) {
    console.error("Failed to parse AI JSON:", error.message)
    return null
  }
}

function getPeriodRange(periodType, baseDate = new Date()) {
  const date = new Date(baseDate)

  if (periodType === "week") {
    const day = date.getDay() || 7 // Sunday - 7
    const periodStart = new Date(date)
    periodStart.setDate(date.getDate() - day + 1)
    periodStart.setHours(0, 0, 0, 0)

    const periodEnd = new Date(periodStart)
    periodEnd.setDate(periodStart.getDate() + 6)
    periodEnd.setHours(23, 59, 59, 999)

    return { periodStart, periodEnd }
  }

  if (periodType === "month") {
    const periodStart = new Date(date.getFullYear(), date.getMonth(), 1)
    periodStart.setHours(0, 0, 0, 0)

    const periodEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    periodEnd.setHours(23, 59, 59, 999)

    return { periodStart, periodEnd }
  }

  throw new Error("Invalid periodType")
}


module.exports = {parseAIJsonResponse, getPeriodRange}