const cron = require("node-cron")
const axios = require("axios")
const fs = require("fs/promises")
const path = require("path")

const EXERCISE_API_URL = process.env.EXERCISE_API_URL
const DATA_DIR = path.join(__dirname, "..", "Data")

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))


const updateFile = async (endpoint, fileName) => {
    try {
        console.log(`Fetching ${endpoint}...`)

        const response = await axios.get(`${EXERCISE_API_URL}/${endpoint}`, { timeout: 15000 })

        const data = response.data?.data || []

        if (!Array.isArray(data) || data.length === 0) {
            console.log(`${endpoint} returned empty data`)
            return
        }

        const filePath = path.join(DATA_DIR, fileName)

        await fs.writeFile(filePath, JSON.stringify({ data }, null, 2), "utf-8")

        console.log(`${endpoint} updated successfully`)
    } catch (error) {
        console.error(`Error updating ${endpoint}:`, error.message)
    }
}

const startExerciseCron = () => {
    cron.schedule("0 20 * * *", async () => {
        console.log("Starting daily exercise sync job...")

        await updateFile("bodyparts", "exerciseBodyParts.json")

        await delay(60000) 

        await updateFile("equipments", "exerciseEquipments.json")

        await delay(60000) 

        await updateFile("muscles", "exerciseMuscles.json")

        console.log("Daily exercise sync completed.")
    })
}

module.exports = startExerciseCron
