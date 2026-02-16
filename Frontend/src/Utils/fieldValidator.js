

const regexPatterns = {

    usernamePattern: /^[\w-]{5,15}(?!@)$/,

    titlePattern: /^([a-zA-Z]){3,}[a-zA-Z0-9\s,'-]{0,100}$/,
    pricePattern: /^\d+(\.\d{1,2})?$/,
    stockPattern: /^\d{1,}$/,
    sizesPattern: /^\d+(\.\d+)?\s?[a-zA-Z]+(?:\s?[a-zA-Z]+)*$/,
    motorPowersPattern: /^\d+(\.\d+)?\s?(HP|hp|W|w)?$/,
    weightsPattern: /^\d+(\.\d+)?$/,
    colorsPattern: /^[A-Za-z]{3,}(?:\s[A-Za-z]{2,})*$/,
    brandPattern: /^(?!^\d+$)[a-zA-Z0-9\s,'-]{1,50}$/, 
    subtitlePattern: /^[\w\s.,!'"-]{20,300}$/,   
    descriptionPattern: /^[\w\s.,!'"-]{30,2000}$/,

    categoryNamePattern: /^[a-zA-Z\s,'-]{2,50}$/,
    categoryDescriptionPattern: /^[a-zA-Z0-9\s.,'!?&()\n-]{2,160}$/, 
    categoryDiscountPattern: /^(100|[1-9]?[0-9])(\.\d{1,2})?$/,
    categoryBadgePattern: /^[a-zA-Z\s_-]{2,15}$/, 

    addressFirstNamePattern: /^[A-Za-z]{1,49}$/,
    addressLastNamePattern: /^[A-Za-z]{1,49}$/,
    addressNickNamePattern: /^(?=.*[A-Za-z]{3,})[A-Za-z0-9]{3,20}( [A-Za-z0-9]{3,20})?$/,
    addressDistrictPattern: /^[a-zA-Z\s]{1,49}$/,
    addressStatePattern: /^[a-zA-Z\s]{1,49}$/,
    addressStreetPattern: /^[a-zA-Z0-9\s,.-]{3,100}$/,
    addressPincodePattern: /^[1-9][0-9]{5}$/,
    addressLandmarkPattern: /^[a-zA-Z0-9\s,.-]{3,100}$/,
    addressDeliveryInstructionsPattern: /^[a-zA-Z0-9.,'()\-:!?@#$%&+_\[\]"/\\ ]{5,200}$/,
    addressMobileNumberPattern: /^\d{10}$/,
    addressAlternateMobileNumberPattern: /^\d{10}$/,
    addressEmailPattern: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,10})([\.a-z]?)$/,
    

    validator: function(fieldName, value, errorMessage){

        const currentPattern = Object.keys(this).find((pattern) => {
            if( pattern.toLowerCase().includes(fieldName.toLowerCase()) ) return pattern 
        }
        )
        if(currentPattern){
            if(!Array.isArray(value) && this[currentPattern].test(value)){
                 return {error: false, message:"success"}
            }
            if(Array.isArray(value) && value.every(item=> this[currentPattern].test(item))){
                return {error: false, message:"success"}
            }
            else{
                return {
                    error: true,
                    message: errorMessage 
                }
            }
        }
    }
}

export const handleInputValidation = (fieldName, value, options, limits)=>{

    if (Array.isArray(value) && (!value.length || value.some(val => !val.trim()))){
        if( value.some(val=> val.trim()) ){
            const arrayFields = ['weights', 'stock', 'price', 'sizes', 'motorPowers', 'colors']
            if(arrayFields.some(field=> field === fieldName)){
                return{
                    error: true,
                    message: 'Consecutive commas without values between them are not allowed' 
                }
            }
        }
        if( value.every(val=> !val.trim()) ){
            if(options?.optionalField){ 
                return{
                    error: false,
                    message: 'Optional field with no value'
                }
            }
            else return{
                error: true,
                message: "This field cannot be empty"
            }
        }
       
    }
    if(Array.isArray(value) && limits){
        if(value.join('').length < limits.minChar){
            return{
                error: true,
                message: `There must be atleast ${limits.minChar} characters!`
            }
        }
        if(value.join('').length > limits.maxChar){
            return{
                error: true,
                message: `Only ${limits.maxChar} characters are allowed!`
            }
        }
    }
    if(!Array.isArray(value) && !value.trim().length){
        if(options?.optionalField){ 
            return{
                error: false,
                message: 'Optional field with no value'
            }
        }else{
            return{
                error: true,
                message: "This field cannot be empty"
            }
        }
    }
    else{
        switch(fieldName){
            case "username":
                return regexPatterns.validator(fieldName, value,"Username can be alphanumeric. Avoid special characters and must have atleast 5 letters!")

            case "title":
                return regexPatterns.validator(fieldName, value, "Please enter a valid product name!.")
            case "price":
                return regexPatterns.validator(fieldName, value, "Please enter a valid price!.")
            case "stock":
                return regexPatterns.validator(fieldName, value, "Please enter a valid stock number!.")
            case "weights":
                return regexPatterns.validator(fieldName, value, "Please enter a valid Weight!")
            case "sizes":
                return regexPatterns.validator(fieldName, value, "Please enter a valid size!")
            case "motorPowers":
                return regexPatterns.validator(fieldName, value, "Please enter a valid motor power value!")
            case "colors":
                return regexPatterns.validator(fieldName, value, "Please enter a valid color!")
            case "brand":
                return regexPatterns.validator(fieldName, value, "Please enter a valid Brand number!")
            case "subtitle":
                return regexPatterns.validator(fieldName, value, "Please enter a valid product Subtitle! Must have atleast 20 characters and shouldn't cross 300 characters.")
            case "description":
                return regexPatterns.validator(fieldName, value, "Please enter a valid product Description! Must have atleast 30 characters.(Max 2000 characters only allowed)")
            
            case "categoryName":
                return regexPatterns.validator(fieldName, value, "Please enter a valid Category name! Must be under 50 characters.")
            case "categoryDescription":
                return regexPatterns.validator(fieldName, value, "Please enter a valid Category description! Must be under 200 words.")
            case "categoryDiscount":
                return regexPatterns.validator(fieldName, value, "Please enter a valid Discount rate!")
            case "categoryBadge":
                return regexPatterns.validator(fieldName, value, "Please enter a valid Category badge! Must be under 30 characters.")
        
            case "firstName":
                return regexPatterns.validator(fieldName, value, "Please enter a valid First name!.")
            case "lastName":
                return regexPatterns.validator(fieldName, value, "Please enter a valid price!.")
            case "nickName":
                return regexPatterns.validator(fieldName, value, "Please enter a valid Nickname! The nickname must be under 20 characters (letters or digits) and must have atleast 3 characters.")
            case "district":
                return regexPatterns.validator(fieldName, value, "Please enter a valid district!.")
            case "state":
                return regexPatterns.validator(fieldName, value, "Please enter a valid state!")
            case "street":
                return regexPatterns.validator(fieldName, value, "Please enter a valid street! Must be under 100 words.")
            case "pincode":
                return regexPatterns.validator(fieldName, value, "Please enter a valid 6 digit pincode!.")
            case "landmark":
                return regexPatterns.validator(fieldName, value, "Please enter a valid landmark! Must be under 100 words..")
            case "mobile":
            case "alternateMobile":
                return regexPatterns.validator(fieldName, value, "Please enter a valid 10 digit mobile number!.")
            case "email":
                return regexPatterns.validator(fieldName, value, "Please enter a valid email address!")
            case "deliveryInstructions":
                return regexPatterns.validator(fieldName, value, "Please enter a valid instructions! Must have atleast 30 characters and under 200 words. Also ;^*+=~`{}|<> are not allowed")
        }
    }
}

export const displaySuccess = (e, options = {}) => {
    e.target.style.borderColor = 'green'
    if(options.optionalMsg){
    }else{
      let errorElement = e.target.nextElementSibling
        while(!errorElement.classList.contains('error')){
            errorElement = errorElement.nextElementSibling
        }
      if(errorElement){
        errorElement.style.visibility = 'hidden'
      }
    }
}
  
export const displayErrorAndReturnNewFormData = (e, message, formData, fieldName)=>{
    e.target.style.borderColor = 'red'
    let errorDisplayer;

    if (e.target.nextElementSibling.classList.contains('error')){
        errorDisplayer = e.target.nextElementSibling
    }else errorDisplayer = e.target.nextElementSibling.nextElementSibling

    errorDisplayer.style.visibility = 'visible'
    errorDisplayer.style.color = 'rgb(239,68,68)'
    delete formData[fieldName]
    errorDisplayer.innerText = message.toString()
    errorDisplayer.click()

    return formData
}

export const cancelErrorState = (e, borderColor = 'transparent', options)=>{
    let inputElement = e.target.previousElementSibling;
    while (inputElement.tagName !== 'INPUT' && inputElement.tagName !== 'TEXTAREA'){
        inputElement = inputElement.previousElementSibling
    } 

    if(e.target.innerText.endsWith('empty')){
        setTimeout(()=>{
            e.target.innerText = options.optionalMsg ? options.optionalMsg : ''
            conosle.log('ErrorMsg cleared..')
            if(options.optionalMsg) e.target.style.color = 'rgb(125, 124, 140)'
            inputElement.style.borderColor = borderColor    
        }, 2000)
    }
}