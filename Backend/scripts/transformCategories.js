const fs = require("fs")
const path = require("path")

const raw = require("./seedData/categories.json")

const idToNameMap = {}

//mapping _id --> name
raw.forEach((cat) => {
    idToNameMap[cat._id.$oid] = cat.name
});

// transformation
const cleaned = raw.map((cat) => ({
    name: cat.name,
    description: cat.description,
    discount: cat.discount || 0,
    badge: cat.badge || null,

    parentName: cat.parentCategory ? idToNameMap[cat.parentCategory.$oid] : null,

    relatedCategory: [],

    seasonalActivation: {
        startDate: cat.seasonalActivation?.startDate?.$date || null,
        endDate: cat.seasonalActivation?.endDate?.$date || null,
    },

    image: cat.image,

    isBlocked: cat.isBlocked || false,
    isActive: cat.isActive !== false,
}))

// writing new file
fs.writeFileSync(path.join(__dirname, "./seedData/categories_raw.json"), JSON.stringify(cleaned, null, 2));

console.log("Transformed file created: categories_raw.json")
