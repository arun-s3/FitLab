import React, {useState, useEffect, useRef} from "react"
import {useSelector, useDispatch} from "react-redux"
import {motion, AnimatePresence} from "framer-motion"

import { X, Calendar, Users, Clock, Flag} from "lucide-react"
import {toast as sonnerToast} from 'sonner'

import {createList, updateList} from "../../../../Slices/wishlistSlice"
import FileUpload from "../../../../Components/FileUpload/FileUpload"
import {handleImageCompression} from '../../../../Utils/compressImages'
import {SiteSecondaryFillButton} from "../../../../Components/SiteButtons/SiteButtons"
import {CustomHashLoader} from "../../../../Components/Loader/Loader"
import useModalHelpers from '../../../../Hooks/ModalHelpers'


export default function WishlistModal({ isOpen, onClose, listDetails, setLoadingListCard}) {

  const [wishlistDetails, setWishlistDetails] = useState({
    name: "",
    description: "",
    isPublic: false,
    sharedWith: "",
    reminderDate: "",
    expiryDate: "",
    priority: 2,
    thumbnail: null,
  })

  const [thumbnailPic, setThumbnailPic] = useState([])  

  const {loading} = useSelector((state) => state.wishlist)
  const dispatch = useDispatch()

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  useEffect(() => {
    async function loadListDetails(){
      const { reminderDate, expiryDate, createdAt, _id, thumbnail, ...rest } = listDetails
      const formatDate = (date)=> date ? new Date(date).toISOString().split("T")[0] : ""
      setWishlistDetails({
        ...rest,
        reminderDate: formatDate(reminderDate),
        expiryDate: formatDate(expiryDate),
        thumbnail: thumbnail || null,
      })
      if (thumbnail){
        const convertToBlob = async (url)=> {
          try {
              const response = await fetch(url, {mode: 'cors'})
              return await response.blob()
          } catch (error) {
              console.log("Error in convertToBlob-->", error.message)
          }
        }
        const blob = await convertToBlob(thumbnail.url)
        const newImage = {...thumbnail, blob}
        setThumbnailPic([newImage])
      }
    }
    if (listDetails) {
      loadListDetails()
    }
  }, [listDetails])

  useEffect(()=> {
    if(thumbnailPic && thumbnailPic.length > 0){
      setWishlistDetails(details=> ({...details, thumbnail: thumbnailPic[0]}))
    }
  }, [thumbnailPic])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setWishlistDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  }

  const fieldVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  }

  const closeModal = ()=> {
    setWishlistDetails({
      name: "",
      description: "",
      isPublic: false,
      sharedWith: "",
      reminderDate: "",
      expiryDate: "",
      priority: 2,
      thumbnail: null,
    })
    setThumbnailPic([])
    onClose()
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    // setLoadingListCard({[listDetails._id]: true})
    const formData = new FormData()
    const {thumbnail, ...rest} = wishlistDetails
    for (const key in rest) {
      formData.append(key, wishlistDetails[key])
    }
    if(listDetails){
      formData.append('listId', listDetails._id)
    }

    const compressedImageBlobs = async(image)=>{
        if(image.size > (5*1024*1024)){
            const newBlob = await handleImageCompression(image.blob)
            sonnerToast.info("The image has been compressed as its size exceeded 5 MB!")
            return newBlob
        }else{
            return image.blob
        }
    } 

    const newBlob = await compressedImageBlobs(thumbnail)
    formData.append('image', newBlob, 'listThumbnail')

    if(!wishlistDetails.name){
      console.log("No name entered!")
      sonnerToast.error("Please enter the name!")
      return
    }

    listDetails
      ? dispatch(updateList({ updateListDetails: formData }))
      : dispatch(createList({ wishlistDetails: formData }))

    closeModal()
  }

  if (!isOpen) return null

  return (
      <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 mob:p-3 s-sm:p-4 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white rounded-[8px] shadow-2xl w-full t:max-w-[95%] mob:max-w-[90%] xxs-sm:max-w-[380px] xs-sm2:max-w-[420px] 
                       xs-sm:max-w-[460px] s-sm:max-w-md"
          >
            <div className="flex justify-between items-center p-4 mob:p-5 border-b border-gray-200">
              <h2 className="text-lg mob:text-xl text-secondary font-semibold">
                {listDetails ? "Update Wishlist" : "Create New Wishlist"}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9, rotate: -90 }}
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              ref={modalRef}
              className="p-4 mob:p-6 space-y-2 max-h-[35rem] s-sm:max-h-[38rem] overflow-y-auto"
            >
              <motion.div variants={fieldVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name{" "}
                  <span className="text-[11px] text-red-500">(*Required)</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={wishlistDetails.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-secondary
                   focus:border-secondary"
                />
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={wishlistDetails.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-secondary 
                    focus:border-secondary resize-none"
                />
              </motion.div>

              <motion.div variants={fieldVariants} className="!mt-6">
                <FileUpload
                  images={thumbnailPic}
                  setImages={setThumbnailPic}
                  imageLimit={1}
                  needThumbnail={false}
                  imageType="List Thumbnail"
                  imagePreview={{
                    status: true,
                    size: "landscape",
                    imageName: wishlistDetails?.name || "List Thumbnail",
                  }}
                  imageCropperPositionFromTop={"0px"}
                  imageCropperBgBlur={true}
                  uploadBox={{
                    beforeUpload: "85px",
                    afterUpload: "55px",
                  }}
                />
              </motion.div>

              <motion.div variants={fieldVariants} className="flex items-center flex-wrap gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={wishlistDetails.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-secondary"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Make this wishlist public
                </label>
              </motion.div>

              <motion.div variants={fieldVariants} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shared With (comma-separated emails)
                </label>
                <input
                  type="text"
                  name="sharedWith"
                  value={wishlistDetails.sharedWith}
                  onChange={handleChange}
                  className="w-full pl-10 py-2 text-sm border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
                />
                <Users className="absolute left-3 top-[35px] w-4 h-4 text-gray-400" />
              </motion.div>

              <motion.div variants={fieldVariants} className="grid grid-cols-1 s-sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder Date
                  </label>
                  <input
                    type="date"
                    name="reminderDate"
                    value={wishlistDetails.reminderDate}
                    onChange={handleChange}
                    className="w-full pl-10 py-2 text-sm border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
                  />
                  <Calendar className="absolute left-3 top-[35px] w-4 h-4 text-gray-400" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={wishlistDetails.expiryDate}
                    onChange={handleChange}
                    className="w-full pl-10 py-2 text-sm border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
                  />
                  <Clock className="absolute left-3 top-[35px] w-4 h-4 text-gray-400" />
                </div>
              </motion.div>

              <motion.div variants={fieldVariants} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={wishlistDetails.priority}
                  onChange={handleChange}
                  className="w-full pl-10 py-2 text-sm border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
                >
                  <option value="3">Low</option>
                  <option value="2">Medium</option>
                  <option value="1">High</option>
                </select>
                <Flag className="absolute left-3 top-[35px] w-4 h-4 text-gray-400" />
              </motion.div>

              <motion.div
                variants={fieldVariants}
                className="flex flex-col xxs-sm:flex-row justify-end gap-3 pt-4"
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 
                             hover:bg-gray-50 focus:ring-2 focus:ring-secondary"
                >
                  Cancel
                </button>
                <SiteSecondaryFillButton
                  shouldSubmit={true}
                  className="text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  {loading ? (
                    <CustomHashLoader loading={loading} />
                  ) : listDetails ? (
                    "Update Wishlist"
                  ) : (
                    "Create Wishlist"
                  )}
                </SiteSecondaryFillButton>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
  )
}
