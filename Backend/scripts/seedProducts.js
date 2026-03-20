require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") })
const mongoose = require("mongoose")
const Product = require("../Models/productModel")

const products = require("./seedData/products") 

const placeholderImage1 = {
    name: "placeholder1",
    size: 12345,
    url: "https://via.placeholder.com/300",
    public_id: "placeholderImg1",
    isThumbnail: "true",
}

const placeholderImage2 = {
    name: "placeholder2",
    size: 12335,
    url: "https://via.placeholder.com/300",
    public_id: "placeholderImg2",
    isThumbnail: "false",
}

const placeholderImage3 = {
    name: "placeholder3",
    size: 12445,
    url: "https://via.placeholder.com/300",
    public_id: "placeholderImg3",
    isThumbnail: "false",
}

const placeholderThumbnail = {
    name: "placeholder4",
    size: 12245,
    url: "https://via.placeholder.com/300",
    public_id: "placeholderThumbnail",
}


const finalProducts = products.map((product) => ({
    ...product,
    stock: 10,
    images: [placeholderImage1, placeholderImage2, placeholderImage3],
    thumbnail: placeholderThumbnail,

    isBlocked: false,

    weight: product.weight || null,
    motorPower: product.motorPower || null,
    size: product.size || null,
    color: product.color || null,

    variantOf: null,
    variantType: null,
    variants: [],

    averageRating: 0,
    totalReviews: 0,
}))

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGOURI)
        console.log("✅ MongoDB Connected")

        await Product.deleteMany({})
        console.log("🧹 Old products removed")

        await Product.insertMany(finalProducts)

        console.log(`✅ ${finalProducts.length} products inserted`)

        process.exit()
    } catch (error) {
        console.error("❌ Error seeding products:", error)
        process.exit(1)
    }
}

seedProducts()
