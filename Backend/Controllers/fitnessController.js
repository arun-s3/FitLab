const {errorHandler} = require('../Utils/errorHandler')

const exerciseUrl = process.env.EXERCISEDB_URL
const exerciseKey = process.env.EXERCISEDB_KEY


const targetBodyParts = async(req, res, next)=> {
    try {
        console.log("Inside targetBodyParts of fitnessController")   

        const response = await fetch(`${exerciseUrl}/bodyparts`);

        if (!response.ok) {
          return next(errorHandler(400, "Failed to fetch bodyparts"))
        }

        const data = await response.json()
        console.log("bodyparts----->", JSON.stringify(data))
        return res.status(200).json({ bodyparts: data });
    }
    catch (error) {
        console.log("Error in targetBodyParts:", error.message)
        next(error)
    }
}


module.exports = {targetBodyParts}