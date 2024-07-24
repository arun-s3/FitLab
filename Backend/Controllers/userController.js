const User = require('../Models/userModel')
const bcryptjs = require('bcryptjs')

const tester = async(req,res)=>{ res.send("UserTest-- Success")}



module.exports = {tester}