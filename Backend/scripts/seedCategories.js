require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env"),
})

const mongoose = require("mongoose")
const Category = require("../Models/categoryModel")

const data = require("./seedData/categories_raw.json")

async function seedCategories() {
    try {
        await mongoose.connect(process.env.MONGOURI)
        console.log("MongoDB Connected...")

        await Category.deleteMany({})
        console.log("🧹 Existing categories removed")

        // Inserting all categories (flat)
        try {
            const inserted = await Category.insertMany(data, { ordered: false });
            console.log(`${inserted.length} categories inserted`)
        } catch (err) {
            console.error("INSERT ERROR:")
            console.error(err.writeErrors || err)
        }

        process.exit();
    } catch (error) {
        console.error("--Error seeding categories:", error)
        process.exit(1);
    }
}

seedCategories()
