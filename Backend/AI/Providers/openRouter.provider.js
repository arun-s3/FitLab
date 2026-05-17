const axios = require("axios")


// async function callOpenRouter(prompt, model = "anthropic/claude-3.5-sonnet") {
//   const res = await axios.post("https://openrouter.ai/api/v1/chat/completions",
//     {
//       model,
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: 900,  
//       temperature: 0.7,
//       response_format: {
//         type: "json_object"
//       }
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         // "HTTP-Referer": process.env.OPENROUTER_SITE_URL,
//         // "X-Title": process.env.OPENROUTER_APP_NAME,
//       },
//       timeout: 50000,
//     }
//   )

//   return res.data.choices[0].message.content
// }


async function callOpenRouter(
  prompt,
  model = "deepseek/deepseek-chat-v3-0324:free"
) {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 900,
      temperature: 0.5,
      response_format: {
        type: "json_object"
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 50000
    }
  )

 const content = res.data.choices[0].message.content

console.log("RAW AI RESPONSE:\n", content)

try {
  return JSON.parse(content)
} catch (err) {
  console.log("JSON PARSE ERROR:", err.message)
  return null
}
}


module.exports = {callOpenRouter}
