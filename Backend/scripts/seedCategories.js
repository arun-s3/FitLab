require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

console.log("FULL ENV:", process.env);
console.log("MONGOURI:", process.env.MONGOURI);const mongoose = require("mongoose");
const Category = require("../Models/categoryModel");

const data = require("../Data/fitlab_cleaned_final.json");

console.log("DATA LENGTH:", data.length);
console.log("FIRST ITEM:", data[0]);

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log("✅ MongoDB Connected");

    // ⚠️ Optional: clear existing data (use carefully)
    await Category.deleteMany({});
    console.log("🧹 Existing categories removed");

    // Insert all categories (flat)
    try {
      const inserted = await Category.insertMany(data, { ordered: false });
      console.log(`✅ ${inserted.length} categories inserted`);
    } catch (err) {
      console.error("❌ INSERT ERROR:");
      console.error(err.writeErrors || err);
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();