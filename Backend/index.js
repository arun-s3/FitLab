const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGOURI)
mongoose.connection.on('connected',()=>{console.log('Connected to the database')})
mongoose.connection.on('error',()=>{console.log('Error while connecting with the databse')})
mongoose.connection.on('disconnected',()=>{console.log('Connected to the database')})

const nocache = require('nocache')
app.use(nocache())

const path = require('node:path')
app.use('/Public',express.static(path.join(__dirname,'/Public')))

app.set("trust proxy", 1)

app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended: true, limit:'10mb'}))
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const cors = require('cors')
app.use(cors({
    origin:['http://localhost:5173', 'https://fitlab.co.in', 'https://www.fitlab.co.in'],
    method:['GET','POST','PUT','PATCH','DELETE'],
    credentials:true
}))

const Server = require("socket.io").Server

let io = new Server(server, {
      cors: {
        origin: ['http://localhost:5173', 'https://fitlab.co.in', 'https://www.fitlab.co.in'],
        methods: ["GET", "POST", 'PUT','PATCH','DELETE'],
        credentials: true,
      },
    })

const textChatBoxSocket = require('./Sockets/textChatSocketHandler.js')
const videoChatSocket = require('./Sockets/videoChatSocketHandler.js')
const notificationSocket = require('./Sockets/notificationsSocketHandler.js')

const activeUsers = new Map()
const adminSessions = new Set() 

textChatBoxSocket(io, activeUsers, adminSessions)
videoChatSocket(io, activeUsers, adminSessions)
notificationSocket(io, activeUsers, adminSessions)

const userRoutes = require('./Routes/userRoutes.js')
const addressRoutes = require('./Routes/userAddressRoutes.js')
const userProductRoutes = require('./Routes/userProductRoutes.js')
const wishlistRoutes = require('./Routes/wishlistRoutes.js')
const couponRoutes = require('./Routes/couponRoutes.js')
const offerRoutes = require('./Routes/offerRoutes.js')
const cartRoutes = require('./Routes/cartRoutes.js')
const orderRoutes = require('./Routes/orderRoutes.js')
const reviewRoutes = require('./Routes/reviewRoutes.js')
const testimonyRoutes = require('./Routes/testimonyRoutes.js')
const paymentRoutes = require('./Routes/paymentRoutes.js')
const walletRoutes = require('./Routes/walletRoutes.js')
const fitnessRoutes = require('./Routes/fitnessRoutes.js')
const contactRoutes = require('./Routes/contactRoutes.js')
const textChatBoxRoutes = require('./Routes/textChatBoxRoutes.js')
const notificationRoutes = require('./Routes/notificationRoutes.js')
const videoSupportSessionRoutes = require('./Routes/videoSupportSessionsRoute.js')
const webhookRoutes = require('./Routes/webhookRoutes.js')
const aiRoutes = require('./Routes/aiRoutes.js')

const adminRoutes = require('./Routes/adminRoutes.js')
const adminProductRoutes = require('./Routes/adminProductRoutes.js')
const adminCategoryRoutes = require('./Routes/adminCategoryRoutes.js')
const adminDashboardRoutes = require('./Routes/dashboardRoutes.js')
const adminCustomerGeographyRoutes = require('./Routes/adminCustomerGeographyRoute.js')

app.use('/', userRoutes)
app.use('/products', userProductRoutes)
app.use('/addresses', addressRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/coupons', couponRoutes)
app.use('/offers', offerRoutes)
app.use('/cart', cartRoutes)
app.use('/order', orderRoutes)
app.use('/review', reviewRoutes)
app.use('/testimony', testimonyRoutes)
app.use('/payment', paymentRoutes)
app.use('/wallet', walletRoutes)
app.use('/fitness', fitnessRoutes)
app.use('/contact', contactRoutes)
app.use('/chat', textChatBoxRoutes)
app.use('/notifications', notificationRoutes)
app.use('/video-chat', videoSupportSessionRoutes)
app.use('/webhook', webhookRoutes)
app.use('/ai', aiRoutes)

app.use('/admin', adminRoutes)
app.use('/admin/products', adminProductRoutes)
app.use('/admin/products/category', adminCategoryRoutes)
app.use('/admin/dashboard', adminDashboardRoutes)
app.use('/admin/locations', adminCustomerGeographyRoutes)
// app.use('/product', productRoutes)

require("./CronJobs/couponCrons.js")
require("./CronJobs/offerCrons.js")

global.io = io

require("./CronJobs/categoryCrons.js")
const walletCron = require("./CronJobs/walletCrons.js")
walletCron(io)

app.use( (error ,req ,res, next)=> {
    const message = error.message||'Internal Server Error'
    const statusCode = error.statusCode||500
    console.log(`From index.js errorHandling middleware message is---> ${message} and statusCode is- ${statusCode}`)
    res.status(statusCode).json({message})
})


const port = process.env.PORT||3000
server.listen(port, ()=>{ console.log(`Listening to port ${port}...`)})