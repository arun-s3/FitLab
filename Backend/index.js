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

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const cors = require('cors')
app.use(cors({
    origin:'http://localhost/:5173',
    method:['GET','POST','PUT','PATCH','DELETE'],
    credentials:true
}))

const userRoutes = require('./Routes/userRoutes.js')
const adminRoutes = require('./Routes/adminRoutes.js')
app.use((error,req,res,next)=>{
    const message = error.message||'Internal Server Error'
    const statusCode = error.statusCode||500
    res.status(statusCode).json({errorMessage:message})
})
app.use('/', userRoutes)
app.use('/admin', adminRoutes)



const port = process.env.PORT||3000
app.listen(port, ()=>{ console.log(`Listening to port ${port}...`)})