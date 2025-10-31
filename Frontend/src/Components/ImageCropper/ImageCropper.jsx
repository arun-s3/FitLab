import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import "./ImageCropper.css";
import { getCroppedImg } from "../ImageCropper/ImageCropperUtilities";

import {SiteButtonSquare, SitePrimaryWhiteTextButton, SitePrimaryButtonWithShadow, SitePrimaryMinimalButtonWithShadow} from "../SiteButtons/SiteButtons";

import {toast} from 'react-toastify'
import {toast as sonnerToast} from 'sonner'
import {GoArrowLeft, GoArrowRight} from "react-icons/go";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa6";
import {FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import {IoCloseSharp} from "react-icons/io5";


const ImageCropper = ({ images, onCropComplete, imageCropperState, setImageCropperState, imageCropperDefaultIndex,
   imageCloseHandler, imageCropperError, setImageCropperError, positionFromTop, bgBlur, containerHeight, controllerStyle }) => {


  const [modalIsOpen, setModalIsOpen] = useState(true)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(()=> imageCropperDefaultIndex? imageCropperDefaultIndex : 0)

  const [buildOutline, setBuildOutline] = useState()

  const [startIndex, setStartIndex] = useState(0)
  // const [endIndex, setEndIndex] = useState(3)
  const [endIndex, setEndIndex] = useState(() => Math.min(3, images.length))

  useEffect(()=> {
    if (images.length > 1) setImageCropperError("Crop every Images!")
    if (images.length === 1) setImageCropperError("Crop the Image!")
  },[])

  useEffect(()=> {
    if(buildOutline){
      console.log("buildOutline--->", buildOutline)
    }
  },[buildOutline])

  useEffect(()=> {
    console.log("Images from ImageCropper----->", images)
    // setModalIsOpen(true)
    if (images.length > 0) {
      setStartIndex(0)
      setEndIndex(Math.min(3, images.length))
    }

    if (imageCropperState){
      if(images.every(img=> img.isCropped)){
          console.log("Closing the Crop Modal because everything is cropped...")
          setImageCropperState(false);
      }else{
            console.log("Won't close because there's some image that are not cropped")
      }
  }
  },[images])

  useEffect(() => {
    if (endIndex > images.length) {
      setEndIndex(images.length)
    }
    if (startIndex >= images.length) {
      setStartIndex(Math.max(0, images.length - 3))
      setEndIndex(images.length)
    }
  }, [startIndex, endIndex])

  useEffect(()=> {
    if(imageCropperError === 'Crop every Images'){
      setTimeout(()=> setImageCropperError(''), 5000)
    }else{
      setTimeout(()=> setImageCropperError(''), 3000)
    }
  },[imageCropperError])
  
  if (!images || images.length === 0) return

  const selectImage = (e, index)=> {
    console.log("Inside selectImage")
    setCurrentImageIndex(index)
    setBuildOutline(images[index].name)
  }

  const onCropCompleteHandler = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  const handleCrop = async () => {
    console.log("Cropping the image")
    if (!croppedAreaPixels) {
      console.error("Cropping area not defined yet!")
      return
    }

    const croppedImage = await getCroppedImg(images[currentImageIndex].url, croppedAreaPixels)
    console.log("croppedImage--->", croppedImage)
    onCropComplete(croppedImage, images[currentImageIndex], currentImageIndex, false)

    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const skipCrop = (index)=> {
    console.log("Skipping the image")
    setImageCropperError("Make sure you crop the image later before submitting")
    const unCroppedImage = images[index].url
    onCropComplete(unCroppedImage, images[index], index, true)

    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const showMoreImages = () => {
    setStartIndex((prevIndex) => {
      const newStart = prevIndex + 3
      const newEnd = Math.min(endIndex + 3, images.length)
      setEndIndex(newEnd)
      return newStart < images.length ? newStart : prevIndex
    })
  }
  
  const showLessImages = () => {
    setStartIndex((prevIndex) => {
      const newStart = Math.max(prevIndex - 3, 0)
      setEndIndex(newStart + 3)
      return newStart
    })
  }
  
  const finishCropping = ()=> {
    setModalIsOpen(false)
    setImageCropperState(false)
    if(images.some(img=> !img.isCropped)){
      sonnerToast.warning("Product removed from cart", {duration: 5000})
    }
  }

  return (
    <section id='imageCropper'>
      {modalIsOpen && (
        <main id="image-cropper-container" className={`fixed flex flex-col justify-center items-center gap-[16px] inset-0 
            ${positionFromTop? positionFromTop : 'top-[3rem]'} ${bgBlur && 'backdrop-blur-[5px]'} z-[5]`}>
          <div id="image-cropper-content" className={`w-[400px]  ${images.length > 1 ? 'max-w-[90%]' : '!max-w-[68%]'} text-center 
            p-[20px] bg-white rounded-[8px] border border-secondary`} 
            style={containerHeight ? {height: containerHeight} : images.length > 1 ? {height: '89%'} : {height: '68%'}}>
          {
            images.length > 1 &&
            <div className='flex items-center gap-[30px] flex-wrap my-[10px]' id='image-section'>
              <i className="mr-[-20px] px-[2px] py-[4px] rounded-[4px] bg-primary border-[2px] border-[#e6c5fd] cursor-pointer"
                  onClick={()=> showLessImages()}>
                <FaArrowLeft className="text-secondary"/>
              </i>
                {
                  images.map((image,index)=> 
                         (<div key={image.url} data-label={image.name}
                             className={`relative flex flex-col cursor-pointer rounded-[5px] ${images.length > 0 &&  index >= startIndex && index < endIndex ? '' : 'hidden'}
                                  ${buildOutline && (buildOutline === image.name) ? 'outline outline-[1.7px] outline-secondary outline-offset-[5px]' : ''}
                                    ${image?.isCropped || (index == currentImageIndex)? '' : 'image-list-overlay'}`}
                                      onClick={(e) => selectImage(e, index)}>
                            <figure key={image.name} className='relative w-[75px] h-[75px] rounded-[5px]'>
                                <img src={image.url} alt={image.name} className='w-[75px] h-[75px] rounded-[5px] object-cover'/>
                                <span className='absolute top-0 right-[-22px] h-full flex flex-col justify-between text-secondary cursor-pointer '> 
                                    <span className=' rounded-[4px] text-secondary'>
                                        <IoCloseSharp onClick={(e)=> imageCloseHandler(image.url, index)}/> 
                                    </span>
                                </span>
                                {
                                  !image?.isCropped &&
                                  <span className="absolute bottom-[7px] left-[25%] px-[5px] py-[2px] rounded-[4px] bg-primary text-[9px]
                                         font-[650] tracking-[0.6px] text-secondary z-[5]">
                                    Crop
                                  </span>
                                }
                            </figure>
                          </div>
                        )
                    )
                }
                <i className="ml-[-15px] px-[2px] py-[4px] rounded-[4px] bg-primary border-[2px] border-[#e6c5fd] cursor-pointer"
                      onClick={()=> showMoreImages()}>
                  <FaArrowRight className="text-secondary"/>
                </i>
            </div> 
          }
            {images[currentImageIndex] && (
              <>
                <div className="relative w-full h-[300px] bg-[#333] border-[2px] border-[#ddd] rounded-[6px]">

                  <Cropper image={images[currentImageIndex].url} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop}
                      onZoomChange={setZoom} onCropComplete={onCropCompleteHandler} />

                  <div className={`w-full absolute ${images.length > 1 ? 'top-[22rem]' : 'top-[19rem]'} left-[5%] flex flex-col gap-[1rem] mt-[20px]`}
                    style={controllerStyle ? controllerStyle : {}}>
                    <div className="flex items-center gap-[1rem]">
                      <label htmlFor="zoom-range" className="text-[13px] text-secondary font-[500] tracking-[0.7px]" 
                            style={{color: 'rgba(159, 42, 240, 1)'}}> Zoom: </label>

                      <input type="range" id="zoom-range" min="1" max="3" step="0.1" value={zoom} 
                        onChange={(e) => setZoom(Number(e.target.value))} className={` ${images.length > 1 ? 'w-[200px]' : 'w-[250px]'} h-[3px]`} />

                    </div>
                    <div className={`flex gap-[10px] ${images.length === 1 && 'justify-center'}`}>
                      {
                        images.length > 1 &&
                          <SiteButtonSquare clickHandler={()=> skipCrop(currentImageIndex)} tailwindClasses='!text-[13px]' customStyle={{paddingBlock: '7px', borderRadius: '7px', fontSize: '13px'}}>
                            Skip this Image for now
                          </SiteButtonSquare>
                      }
                      <SiteButtonSquare clickHandler={handleCrop} tailwindClasses='!text-[13px]' customStyle={{paddingBlock: '7px', borderRadius: '7px', fontSize: '13px'}}>
                        Crop Image
                      </SiteButtonSquare>
                    </div>
                    <p className="mt-[-10px] ml-[-50px] h-[5px] text-[10px] text-red-500 font-[500] tracking-[0.5px]"> {imageCropperError} </p>
                  </div>
                </div>
              </>
            )}
            {images.length > 1 && currentImageIndex < images.length  && currentImageIndex >= 0 && (
              <>
              <div className="flex justify-between items-center mt-[10px]">
                <SitePrimaryButtonWithShadow tailwindClasses='text-secondary flex flex-row-reverse items-center gap-[5px] bg-primaryDark hover:bg-green-500'
                     customStyle={{}}  clickHandler={() => setCurrentImageIndex(currentImageIndex != 0 ? currentImageIndex - 1 : images.length-1)}>
                  <span className="text-white text-[12px]"> Previous Image </span>
                  <GoArrowLeft className="text-white"/>

                </SitePrimaryButtonWithShadow>
                <SitePrimaryButtonWithShadow tailwindClasses='text-secondary flex items-center gap-[5px] bg-primaryDark hover:bg-green-500'
                        clickHandler={() => {
                          if(currentImageIndex === images.length-1) setImageCropperError('Make sure you crop every image later before submitting')
                          setCurrentImageIndex(currentImageIndex !== images.length-1? currentImageIndex + 1 : 0)
                        }}>
                  <span className="text-white text-[12px]"> Next Image </span>
                  <GoArrowRight className="text-white"/>
              </SitePrimaryButtonWithShadow>
              </div>
              <div className="mt-[5px] flex justify-between">
                <p className="text-[9px] text-secondary font-[400]"> 
                  All images must be cropped before submission, but cropping can be skipped and completed later if necessary
                  <SitePrimaryMinimalButtonWithShadow tailwindClasses='ml-[10px] text-[10px] px-[7px]' customStyle={{display:'inline-block'}}
                      clickHandler={finishCropping}>
                    Finish 
                  </SitePrimaryMinimalButtonWithShadow> 
                </p>
                {/* SitePrimaryMinimalButtonWithShadow */}
              </div>
              </>
            )}
          </div>
        </main>
      )}
    </section>
  );
};

export default ImageCropper;

