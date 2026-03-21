require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env"),
})

const mongoose = require("mongoose")
const Category = require("../Models/categoryModel")
const data = require("./seedData/categories_raw.json")

async function linkCategories() {
    try {
        await mongoose.connect(process.env.MONGOURI)
        console.log("MongoDB Connected...")

        // For creating a map: name --> category document
        const categories = await Category.find({})
        const categoryMap = {}

        categories.forEach((cat) => {
            categoryMap[cat.name] = cat
        })

        // Looping through original data
        for (const item of data) {
            if (item.parentName) {
                const child = categoryMap[item.name]
                const parent = categoryMap[item.parentName]

                if (!child || !parent) {
                    console.log(`Missing: ${item.name} or parent ${item.parentName}...`)
                    continue
                }

                child.parentCategory = parent._id
                await child.save();

                // Pushing into parent's subCategory
                parent.subCategory.push(child._id)
                await parent.save();
            }
        }

        console.log("Parent-child relationships linked!")

        process.exit();
    } catch (error) {
        console.error("--Error linking categories:", error)
        process.exit(1);
    }
}

linkCategories()
