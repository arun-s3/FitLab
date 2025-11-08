const mongoose = require("mongoose")
const Testimony = require('../Models/testimonyModel')
const Address = require('../Models/addressModel')

const {errorHandler} = require('../Utils/errorHandler')


const createOrUpdateTestimony = async (req, res, next) => {
  try {
    console.log("Inside createOrUpdateTestimony...")

    const { rating, title, comment } = req.body
    const userId = req.user._id

    let testimony = await Testimony.findOne({ userId })

    if (testimony) {
      testimony.rating = rating
      testimony.title = title
      testimony.comment = comment
      await testimony.save()

      return res.status(200).json({
        success: true,
        message: "Your testimony has been updated successfully!",
        testimony
      })
    }

    testimony = await Testimony.create({ userId, rating, title, comment })

    res.status(201).json({
      success: true,
      message: "Your testimony has been submitted successfully!",
      testimony
    })

  }
  catch (error) {
    console.log("Error in createOrUpdateTestimony -->", error.message)
    next(error)
  }
}


const getTopTestimonies = async (req, res, next)=> {
  try {
    console.log("Inside getTopTestimonies...")

    const testimonies = await Testimony.find({})
      .populate('userId', 'firstName lastName username profilePic')
      .sort({ rating: -1, createdAt: -1 })
      .limit(10)

    const testimoniesWithDistrict = await Promise.all(
      testimonies.map(async (testimony) => {
        let district = null
        const userId = testimony.userId?._id

        if (userId) {
          let address = await Address.findOne({ userId, defaultAddress: true })

          if (!address) {
            address = await Address.findOne({ userId, type: 'home' })
          }

          if (!address) {
            address = await Address.findOne({ userId })
          }

          if (address) {
            district = address.district
          }
        }

        return {
          ...testimony.toObject(),
          district: district || '',
        }
      })
    )

    res.status(200).json({
      success: true,
      count: testimoniesWithDistrict.length,
      testimonies: testimoniesWithDistrict,
    });
  }
  catch (error) {
    console.log("Error in getTopTestimonies -->", error.message)
    next(error)
  }
}



module.exports = {createOrUpdateTestimony, getTopTestimonies}
