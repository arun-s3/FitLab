

const regexPatterns = {

    productNamePattern: /^([a-zA-Z]){3,}[a-zA-Z0-9\s,'-]{0,100}$/,
    pricePattern: /^\d+(\.\d{1,2})?$/,
    stockPattern: /^\d{1,}$/,
    weightPattern: /^\d+(\.\d{1,3})?$/,
    brandPattern: /^(?!^\d+$)[a-zA-Z0-9\s,'-]{1,50}$/,     
    descriptionPattern: /^[\w\s.,"'!-]{30,2000}$/,

    validator: function(fieldName, value, errorMessage){
        const currentPattern = Object.keys(this).find( (pattern,index)=> {
            if(pattern.toString().match(fieldName.toString())) return pattern[index]
        } )
        if(currentPattern){
            if(!Array.isArray(value) && this[currentPattern].test(value)){
                return {error: false, message:"success"}
            }
            if(Array.isArray(value) && value.every(item=> this[currentPattern].test(item))){
                return {error: false, message:"success"}
            }
            else{
                console.log("validation failed errorMessage before return from regexPatterns.validator", JSON.stringify({error: true, message:errorMessage.toString() }))
                return {
                    error: true,
                    message: errorMessage 
                }
            }
        }
        else{
            console.log("No such Field found!")
        }
    }
}

export const handleInputValidation = (fieldName, value)=>{
    console.log("fieldName-->",fieldName)
    console.log("value-->",value)

    if(!value.trim().length){
        return{
            error: true,
            message: "This field cannot be empty"
        }
    }
    else{
        switch(fieldName){
            case "productName":
                return regexPatterns.validator(fieldName, value, "Please enter a valid product name!.")
            case "price":
                return regexPatterns.validator(fieldName, value, "Please enter a valid price!.")
            case "stock":
                return regexPatterns.validator(fieldName, value, "Please enter a valid stock number!.")
            case "weight":
                return regexPatterns.validator(fieldName, value, "Please enter a valid Mobile number!")
            case "brand":
                return regexPatterns.validator(fieldName, value, "Please enter a valid Brand number!")
            case "description":
                return regexPatterns.validator(fieldName, value, "Please enter a valid product Description! Must have atleast 30 characters.")
        }
    }
}

export const displaySuccess = (e)=>{
    console.log("Success!")
    e.target.nextElementSibling.style.visibility = 'hidden'
    e.target.style.borderColor = 'green'
}
export const displayError = (e, message, formData, fieldName)=>{
    e.target.style.borderColor = 'red'
    e.target.nextElementSibling.style.visibility = 'visible'
    console.log("msg from displayError-->"+message)
    delete formData[fieldName]
    e.target.nextElementSibling.innerText = message.toString()
}