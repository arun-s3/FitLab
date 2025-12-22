const {callOpenRouter} = require("./Providers/openRouter.provider") 
const {callGemini} = require("./Providers/gemini.provider") 


async function generateAIResponse(prompt) {
  const openRouterModels = [
    "openai/gpt-4.1-mini",
    "anthropic/claude-3.5-sonnet",
    "mistralai/mistral-large"
  ]

  for (const model of openRouterModels) {
    try {
      console.log(`Trying OpenRouter model: ${model}`)
      const response = await callOpenRouter(prompt, model)
      console.log(`OpenRouter success: ${model}`)
      return response
    }
    catch (error) {
      console.log(`OpenRouter model failed: ${model}`, error.response?.status, error.response?.data || error.message)
    }
  }

  try {
    console.log("Falling back to Gemini")
    return await callGemini(prompt)
  }
  catch (error) {
    console.log(`Gemini failed: ${model}`, error.response?.status, error.response?.data || error.message)
  }

  throw new Error("All AI providers failed")
}


module.exports = {generateAIResponse}

