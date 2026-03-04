const { callOpenRouter } = require("./Providers/openRouter.provider")
const { callGemini } = require("./Providers/gemini.provider")


async function generateAIResponse(prompt) {
    const openRouterModels = ["openai/gpt-4.1-mini", "anthropic/claude-3.5-sonnet", "mistralai/mistral-large"]

    for (const model of openRouterModels) {
        try {
            const response = await callOpenRouter(prompt, model)
            return response
        } catch (error) {
            console.error(error)
        }
    }

    try {
        return await callGemini(prompt)
    } catch (error) {
        console.error(error)
    }

    throw new Error("All AI providers failed")
}


module.exports = { generateAIResponse }
