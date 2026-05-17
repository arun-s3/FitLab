const { callOpenRouter } = require("./Providers/openRouter.provider")
const { callGemini } = require("./Providers/gemini.provider")

async function generateAIResponse(prompt) {
    // const openRouterModels = ["openai/gpt-4.1-mini", "anthropic/claude-3.5-sonnet", "mistralai/mistral-large"]

    // const openRouterModels = [
    //     "deepseek/deepseek-chat-v3-0324:free",
    //     "meta-llama/llama-3.3-70b-instruct:free",
    //     "google/gemma-3-27b-it:free",
    // ]

    const openRouterModels = ["meta-llama/llama-3.1-8b-instruct", "qwen/qwen-2.5-72b-instruct", "openai/gpt-4.1-mini"]

    for (const model of openRouterModels) {
        try {
            const response = await callOpenRouter(prompt, model)
            return response
        } catch (error) {
            console.error(error.response?.data || error.message)
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
