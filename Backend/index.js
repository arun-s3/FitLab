const express = require('express')
const app = express()

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

app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended: true, limit:'10mb'}))
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const cors = require('cors')
app.use(cors({
    origin:'http://localhost:5173',
    method:['GET','POST','PUT','PATCH','DELETE'],
    credentials:true
}))

const userRoutes = require('./Routes/userRoutes.js')
const adminRoutes = require('./Routes/adminRoutes.js')
const adminProductRoutes = require('./Routes/adminProductRoutes.js')
const userProductRoutes = require('./Routes/userProductRoutes.js')
const adminCategoryRoutes = require('./Routes/adminCategoryRoutes.js')

app.use('/', userRoutes)
app.use('/admin', adminRoutes)
app.use('/products', userProductRoutes)
app.use('/admin/products', adminProductRoutes)
app.use('/admin/products/category', adminCategoryRoutes)
// app.use('/product', productRoutes)

app.use((error,req,res,next)=>{
    const message = error.message||'Internal Server Error'
    const statusCode = error.statusCode||500
    console.log(`From index.js errorHandling middleware message is---> ${message} and statusCode is- ${statusCode}`)
    res.status(statusCode).json({message:message})
})

const port = process.env.PORT||3000
app.listen(port, ()=>{ console.log(`Listening to port ${port}...`)})