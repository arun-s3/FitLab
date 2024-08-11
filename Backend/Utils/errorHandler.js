
const errorHandler = (statusCode, message)=>{
    const error = new Error()
    error.statusCode = statusCode
    error.message = message
    console.log("error object inside errorHandler of backend-->"+JSON.stringify(error))
    throw error
}

module.exports = {errorHandler}