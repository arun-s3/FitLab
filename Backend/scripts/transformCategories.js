const fs = require("fs");
const path = require("path");

// 👉 Update file name if needed
const raw = require("../Data/fitlab_cleaned_v2.json");

const idToNameMap = {};

// Step 1: map _id → name
raw.forEach(cat => {
  idToNameMap[cat._id.$oid] = cat.name;
});

// Step 2: transform
const cleaned = raw.map(cat => ({
  name: cat.name,
  description: cat.description,
  discount: cat.discount || 0,
  badge: cat.badge || null,

  parentName: cat.parentCategory
    ? idToNameMap[cat.parentCategory.$oid]
    : null,

  relatedCategory: [],

  seasonalActivation: {
    startDate: cat.seasonalActivation?.startDate?.$date || null,
    endDate: cat.seasonalActivation?.endDate?.$date || null
  },

  image: cat.image,

  isBlocked: cat.isBlocked || false,
  isActive: cat.isActive !== false
}));

// Step 3: write new file
fs.writeFileSync(
  path.join(__dirname, "../Data/fitlab_cleaned_final.json"),
  JSON.stringify(cleaned, null, 2)
);

console.log("✅ Transformed file created: fitlab_cleaned_final.json");