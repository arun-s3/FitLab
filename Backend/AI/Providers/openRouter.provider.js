const axios = require("axios")


async function callOpenRouter(prompt, model = "anthropic/claude-3.5-sonnet") {
  const res = await axios.post("https://openrouter.ai/api/v1/chat/completions",
    {
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,  
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        // "HTTP-Referer": process.env.OPENROUTER_SITE_URL,
        // "X-Title": process.env.OPENROUTER_APP_NAME,
      },
      timeout: 50000,
    }
  )

  return res.data.choices[0].message.content
}


module.exports = {callOpenRouter}
