import React, {useRef, useState, useEffect} from "react"
import { motion, AnimatePresence } from "framer-motion"

import { X, Camera, ArrowLeft } from "lucide-react"
import {toast as sonnerToast} from 'sonner'

import FileUpload from "../FileUpload/FileUpload"
import {SiteButtonSquare} from '../SiteButtons/SiteButtons'


export default function SelfieModal({ isOpen, onClose, onCapture, userSystemPic, setUserSystemPic}) {

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const videoContainerRef = useRef(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [streamActive, setStreamActive] = useState(false)
  const [capturedPic, setCapturedPic] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

    useEffect(()=> {
        if(userSystemPic && userSystemPic.length > 0){
          setCapturedPic(null)
        }
    }, [userSystemPic])

    useEffect(()=> {
      if(error){
        setTimeout(()=> setError(null), 3500)
      }
    }, [error])

  const startCamera = async () => {
    try {
      setError(null)
      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      videoContainerRef.current.style.display = 'flex'

      videoRef.current.srcObject = stream
      videoRef.current.play().catch((err) => console.error("[v0] Play error:", err))
      setCameraActive(true)
      setStreamActive(true)
    }
    catch (error){
      setError("Unable to access camera. Please check permissions.")
      alert("Unable to access camera. Please check permissions: " + error.message)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {

      if(userSystemPic) setUserSystemPic([])

      const context = canvasRef.current.getContext("2d")
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)
      const photoData = canvasRef.current.toDataURL("image/jpeg")
      setCapturedPic(photoData)
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => {
        track.stop()
      })
      setCameraActive(false)
      setStreamActive(false)
      videoContainerRef.current.style.display = 'none'
    }
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  const handleRetake = () => {
    setCameraActive(false)
    setStreamActive(false)
    videoContainerRef.current.style.display = 'none'
  }

  const submitPhoto = ()=> {
    if(capturedPic){
      onCapture(capturedPic)
      sonnerToast.info('Uploading profile pic...')
      onClose()
    }
    else if(userSystemPic && userSystemPic.length > 0){
      onCapture(userSystemPic[0].url)
      sonnerToast.info('Uploading profile pic...')
      onClose()
    }
    else{
      setError("No photo to Submit!")
    }
  }
  

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-h-[42rem] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 
                bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900"
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Change Profile Photo</h2>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X size={24} className="text-slate-600 dark:text-slate-300" />
                </motion.button>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900">
                
                <p className="text-red-800 text-[12px] h-[7px] dark:text-red-200">{error && error}</p>

                {!cameraActive && 
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="mb-6"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <Camera size={40} className="text-white" />
                      </div>
                    </motion.div>
                    <p className="text-slate-600 dark:text-slate-300 text-center mb-8 max-w-sm">
                      Click the button below to start your camera and capture a selfie
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startCamera}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                    >
                      Open Camera
                    </motion.button>

                    <div className="my-4 w-full flex justify-between items-center">
                      <hr className="h-[2px] w-[45%]"/>
                      <span className="text-[15px] text-muted"> Or </span>
                      <hr className="h-[2px] w-[45%]"/>
                    </div>

                    <FileUpload 
                      images={userSystemPic} 
                      setImages={setUserSystemPic} 
                      imageLimit={1} 
                      needThumbnail={false} 
                      imageType='Profile pic'
                      imagePreview={{
                        status: true,
                        size: "landscape",
                        imageName: null,
                      }}
                      imageCropperPositionFromTop={"0px"}
                      imageCropperBgBlur={true}
                      uploadBox={{
                        beforeUpload: "85px",
                        afterUpload: "55px",
                      }}
                    />

                    {
                      capturedPic && 
                        <motion.div className="w-[300px] h-auto border-2 border-secondary rounded-[8px]">
                          <img 
                            className="p-[5px] w-full h-auto object-cover rounded-[8px]"
                            src={capturedPic}
                            alt='Profile pic'
                          />
                        </motion.div>
                    }

                  </motion.div>
                }
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    ref={videoContainerRef}
                    className="flex-col items-center gap-4 hidden"
                  >
                    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex gap-4 w-full justify-center flex-wrap">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={capturePhoto}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg
                          hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg flex items-center gap-2"
                      >
                        <Camera size={20} />
                        Capture
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRetake}
                        className="px-6 py-3 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all 
                          duration-200 shadow-lg flex items-center gap-2"
                      >
                        <ArrowLeft size={20} />
                        Back
                      </motion.button>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                      Position your face in the center and click Capture
                    </p>
                  </motion.div>
              </div>

              <motion.div
                className='w-full pb-6 xxs-sm:w-auto text-center'
              >    
                {
                  !cameraActive && 
                    <SiteButtonSquare 
                      tailwindClasses={`hover:!bg-primaryDark !px-[32px] transition duration-300`}
                      customStyle={{fontWeight:'600', paddingBlock:'9px', borderRadius:'7px'}} 
                      clickHandler={()=> submitPhoto()}>
                        Submit Photo
                    </SiteButtonSquare>
                }
              </motion.div>

            </div>
          </motion.div>

          <canvas 
            ref={canvasRef} 
            className="hidden" 
          />

        </>
      )}
    </AnimatePresence>
  )
}
