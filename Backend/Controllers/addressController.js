const address = require('../Models/addressModel')
const Address = require('../Models/addressModel')
const {errorHandler} = require('../Utils/errorHandler')


const createNewAddress = async(req,res,next)=> {
    try{
        console.log("Inside createNewAddress of addressControler")
        const {id} = req.params
        const {addressData} = req.body

        console.log("addressData from backend--->", JSON.stringify(addressData))
        if(!addressData){
            return next(errorHandler(400, "Please enter all the fields"))
        }

        const optionalFieldNames = ["nickName", "landmark", "alternateMobile",  "deliveryInstructions"];
        const requiredFieldsExists = Object.keys(addressData).filter(
            (field) => !optionalFieldNames.includes(field)).length === 9

        if(!requiredFieldsExists || Object.values(addressData).some((value) => value === undefined)){
            next(errorHandler(400, "Please enter all the required fields"))
        }else{
            const adressAlreadyExists = await Address.findOne({street: addressData.street})
            if(!adressAlreadyExists){
                console.log("Inside if !adressAlreadyExists")
                const newAddress = new Address({...addressData, userId: id})
                if(newAddress){
                    const savedAddress = await newAddress.save()
                    console.log("Saved to database")
                    res.status(201).json({address: savedAddress})
                }else{
                    next(errorHandler(500, "Internal Server error"))
                }
            }else{
                next(errorHandler(409, "Address already exists"))
            } 
        }
    }
    catch(error){
        next(error)
        console.log("Error in createNewAddress--", error.message)
    }
}

const editAddress = async(req,res,next)=> {
    try{
        console.log("Inside editAddress  of addressControler")
        const {id} = req.params
        const {addressData, addressId} = req.body

        console.log("addressId--->", addressId)
        console.log("id--->", id)
        console.log("addressData from backend--->", JSON.stringify(addressData))
        if(!addressData){
            return next(errorHandler(400, "Please enter all the fields"))
        }

        const optionalFieldNames = ["nickName", "landmark", "alternateMobile",  "deliveryInstructions"];
        const requiredFieldsExists = Object.keys(addressData).filter(
            (field) => !optionalFieldNames.includes(field)).length >= 9

        if(!requiredFieldsExists || Object.values(addressData).some((value) => value === undefined)){
            next(errorHandler(400, "Please enter all the required fields"))
        }else{
                console.log("Inside if !adressAlreadyExists")
                const updatedAddress = await Address.findOneAndUpdate({_id: addressId}, {$set: {...addressData}}, {new: true})
                if(updatedAddress){
                    console.log("Updated to database")
                    res.status(200).json({address: updatedAddress})
                }else{
                    next(errorHandler(500, "Internal Server error"))
                }
        }
    }
    catch(error){
        next(error)
        console.log("Error in editAddress--", error.message)
    }
}  

const deleteAddress = async(req,res,next)=> {
    try{
        const {id} = req.params
        const address = await Address.findOne({_id: id})
        if(address){
            await Address.deleteOne({_id: id})
            res.status(200).json({message: 'deleted successfully'})
        }else{
            return res.status(404).json({message: 'Address not found'});
        }
    }
    catch(error){
        next(error)
        console.log("Error in deleteAddress--", error.message)
    }
}

const getAllAddress = async(req,res,next)=> {
    try{
        console.log("Inside getAllAddress")
        const addresses = await Address.find({})
        if(addresses){
            console.log("Addresses-->", JSON.stringify(addresses))
            res.status(200).json({addresses})
        }else{
            next(errorHandler(404, "No addresses found!"))
        }
    }
    catch(error){
        next(error)
        console.log("Error in getAllAddress--", error.message)
    }
}

const getDefaultAddress = async (req, res, next) => {
    try {
      console.log("Inside getDefaultAddress of addressController")
      const {id} = req.params
      console.log("id---->", id)
      const defaultAddress = await Address.findOne({userId: id, defaultAddress: true})
  
      if (!defaultAddress) {
        next(errorHandler(404, "Default address not found for you!"))
      }
  
      res.status(200).json({ message: 'Default address retrieved successfully', address: defaultAddress})
    }catch(error) {
      console.error('Error fetching default address:', error.message)
      next(error)
    }
  }

const setAsDefaultAddress = async (req, res, next) => {
    try {
        console.log("Inside setAsDefaultAddress")
        const {id} = req.params
        console.log("Address ID to set as default:", id)

        const address = await Address.findById(id)
        if (!address) {
            next(errorHandler(404, "No records of such an address!"))
        }
        const updatedAddressResult = await Address.updateOne({ _id: id}, {$set: {defaultAddress: true}})
        if (!updatedAddressResult.modifiedCount) {
            next(errorHandler(500, "Failed to set the address as default!"))
        }

        const result = await Address.updateMany({ _id: {$ne: id}}, {$set: {defaultAddress: false}})
        if (!result.matchedCount) {
            next(errorHandler(500, "Failed to unset default for other addresses"))
        }

        return res.status(200).json({message: "The address is successfully set as default"})
    } catch (error) {
        console.error("Error in setAsDefaultAddress:", error.message)
        next(error)
    }
}


module.exports = {createNewAddress, editAddress, deleteAddress, getAllAddress, getDefaultAddress, setAsDefaultAddress}

