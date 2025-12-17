function parseAIJsonResponse(aiText) {
    
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

module.exports = {parseAIJsonResponse}