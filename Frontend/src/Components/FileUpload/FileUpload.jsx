import React,{useState, useEffect, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import './FileUpload.css'

import {SiteButtonSquare} from '../SiteButtons/SiteButtons'
import ImageEditor from '../ImageEditor/ImageEditor'
import PopupWindow from '../PopupWindow/PopupWindow'
import ImageCropper from '../ImageCropper/ImageCropper'
import {handleImageCompression} from '../../Utils/compressImages'

import {IoCloseSharp} from "react-icons/io5";
import {RiImageEditLine} from "react-icons/ri";
import {FaArrowUp, FaArrowDown} from "react-icons/fa";
import {toast} from 'react-toastify'
// import { uploadImages } from 'Frontend/src/Slices/productSlice'

export default function FileUpload({images, setImages, imageLimit, needThumbnail, thumbnail, setThumbnail, thumbnailIndexOnEditProduct, categoryImgPreview}){

    const [error, setError] = useState(null)
    const [imageMessage, setImageMessage] = useState('')
    const imageMessageDisplay = useRef(null)
    const [displayCompressButton, setDisplayCompressButton] = useState(false)

    const [imageCropperState, setImageCropperState] = useState(false)
    const [imageCropperDefaultIndex, setImageCropperDefaultIndex] = useState(0)
    // const [readyToCropImages, setReadyToCropImages] = useState([])
    const [croppedImages, setCroppedImages] = useState([]);
    const [imageCropperError, setImageCropperError] = useState('')


    useEffect(()=>{
        if(error){
            console.log("ERROR!")
            setTimeout(()=> setError(""), 3000)
        }
        if(error && error == 'Please add files each of size below 3Mb!'){
            console.log("Inside useEffect for error of image size between 3 and 5mb")
            imageMessageDisplay.current.parentElement.style.visibility = 'visible'
            imageMessageDisplay.current.style.display = 'none'
            setImageMessage('Please upload images smaller than 3MB. Images between 3MB and 5MB can be compressed or deleted.')
            setDisplayCompressButton(true)
        }
        if(!images.length){
            setError('')
            setImageMessage('')
            setDisplayCompressButton(false)
        }
    },[error, images])

    useEffect(()=>{
        console.log("Images array-->" + JSON.stringify(images))
        images.length && console.log("images[0].url"+ images.length && JSON.stringify(images[0].name))
        thumbnail && console.log("thumbnail.url"+ JSON.stringify(thumbnail))
        console.log("Images array with isThumbnail -->", images.map(img => img.isThumbnail));
        if(images.length){
            console.log("thumbnailIndexOnEditProduct received from parent-->",thumbnailIndexOnEditProduct)
            setCurrentImageIndex(thumbnailIndexOnEditProduct);
        }
    },[thumbnailIndexOnEditProduct])

    let windowRef = useRef(null)
    const [editedImage, setEditedImage] = useState({})

    useEffect(()=>{
        window.addEventListener('message', (event) => {
            if (event.data.type === 'edited-image') {
                const updatedImage = event.data.payload;
                windowRef.current.close()
                // IMP----> IF wanted base64Url set as editedImage's url use the commented
                // const reader = new FileReader()
                // reader.onload = ()=>{
                //     const base64URL = reader.result
                //     setEditedImage({...updatedImage, url:base64URL})
                // }
                // reader.onprogress = (event)=>{
                //     const progress = (event.loaded/event.total)*100
                //     console.log("LOADING..."+ progress)
                //     windowRef.current.postMessage({type:'loading-img', progress}, '*')
                // }
                // reader.readAsDataURL(updatedImage.blob)
                updatedImage.url = URL.createObjectURL(updatedImage.blob)
                setEditedImage({...updatedImage})
                console.log("RECEIVED EDITED IMAGE FROM IMAGE EDITOR-->", JSON.stringify(updatedImage))
                // setEditedImage(updatedImage)
            }
        });        
    })
    useEffect(() => {
        console.log("editedImage in editedimage useEffect-->", JSON.stringify(editedImage))
        if(editedImage.size > (5*1024*1024)){
            imageMessageDisplay.current.parentElement.style.visibility = 'visible'
            imageMessageDisplay.current.style.display = 'inline-block'
            setImageMessage('Compressing ')
        }   
        if( editedImage && editedImage.blob && imageMessageDisplay.current){
            console.log("Inside if imageMessageDisplay.current")
            const compressAndPutToImages = async()=>{
                try{
                    console.log("Inside async compressAndPutToImages")
                    const compressedBlob = await handleImageCompression(editedImage.blob)
                    const compressedImgObj = {...editedImage, blob: compressedBlob, size: compressedBlob.size}
                    console.log("Size now-->", compressedImgObj.size)
                    setImages((prevImages) => 
                        prevImages.map((image) => 
                            image.name === editedImage.name ? { ...image, ...compressedImgObj } : image
                        )
                    )
                    setImageMessage(null)
                    imageMessageDisplay.current.parentElement.style.visibility = 'hidden'
                    imageMessageDisplay.current.style.display = 'none'
                }
                catch(error){
                    console.log("Error inside compressAndPutToImages during compression of edited image--", error.message)
                }
            }
            compressAndPutToImages()
        }
    }, [editedImage]); 

    useEffect(()=> {
        const newImages = images.map(image=> {
            let newImage = image
            croppedImages.forEach(cImg=> {
                if(cImg.name === image.name){
                    newImage = cImg
                }
            })
            return newImage
        })
        setImages(newImages)
        setImageCropperError('')
    },[croppedImages])
      

    const [checkDragging, setCheckDragging] = useState(false)
    const imageDropHeaderRef = useRef(null)
    const fileDropContainerRef = useRef(null)

    // const windowRef = useRef(null)
    const editorPath = useRef(null)

    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const validateAndSetImage = (files)=>{
        console.log("Got files! -->", JSON.stringify(files));
        const newImages = [];
        console.log("IMAGES>LENGTH INSIDE validateAndSetImage-->", images.length)
        if(images.length+1 > imageLimit){
            const imageLabel = (imageLimit > 1)? 'images are' : 'image is'
            setError(`Only ${imageLimit} ${imageLabel} allowed to upload!`)
            return;
        }
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] === 'image') {
                console.log("Image file -->", JSON.stringify(files[i]))
                
                if (images.find(img => img.name === files[i].name)) {
                    console.log("Duplicate image -->", JSON.stringify(files[i]))
                    setError("Duplicate Images won't be added!")
                    continue;
                }

                if (files[i].size > (3 * 1024 * 1024) && files[i].size < (5 * 1024 * 1024)) {
                    console.log("Big image -->", JSON.stringify(files[i]))
                    setError("Please add files each of size below 3Mb!")
                }
                if (files[i].size > (5 * 1024 * 1024)) {
                    console.log("Really big image -->", JSON.stringify(files[i]))
                    setError("Please upload an image smaller than 5MB. Images between 3MB and 5MB can be compressed or deleted. Files larger than 5MB are not allowed.")
                    continue;
                }

                newImages.push({ name: files[i].name, size: files[i].size, url: URL.createObjectURL(files[i]), blob: files[i], isCropped: false});
            } else {
                console.log("Not an image -->", JSON.stringify(files[i]));
                setError("Only images will be added!");
                continue;
            }
        }
        // setReadyToCropImages(newImages)
        setImages([...newImages, ...images])
        setImageCropperState(true)
    }

    const imageBrowseHandler = (e)=>{
        console.log("Inside imageBrowseHandler")
        if(!e.target.files.length){
            console.log("No images found-->"+JSON.stringify(e.target.files))
            return;
        }
        else{
            setError("")
            validateAndSetImage(e.target.files)
        }
    }

    const dragEnterHandler = (e)=>{
        e.dataTransfer.dropEffect = 'copy'
    }
    const dragOverHandler = (e) => {
        e.preventDefault() 
        console.log("Inside dragOverHandler")
        e.dataTransfer.dropEffect = 'copy'
        setCheckDragging(true)
    }
    const dropHandler = (e)=>{
        e.preventDefault()
        setCheckDragging(false)

        console.log("Inside dropHandler")
        if(!e.dataTransfer.files.length){
            console.log("No images found-->"+JSON.stringify(e.dataTransfer.files))
            return;
        }
        else{
            setError("")
            validateAndSetImage(e.dataTransfer.files)
        }
    }
    const dragLeaveHandler = (e)=>{
        setCheckDragging(false)
    }

    const closeHandler = (url)=>{
        setImages(images=> images.filter(image=> image.url !== url))
    }

    const arrowHandler = (prevOrNext)=>{
        if(prevOrNext == 'prev'){
            console.log("Inside prevImg")
            if(currentImageIndex < 1){
                console.log("currentImage.current before assignment(inside if)-->"+ currentImageIndex)
                setCurrentImageIndex(images.length-1)
                console.log("currentImage.current now-->"+ currentImageIndex)
            }
            else{
                setCurrentImageIndex(index=> index-1)
                console.log("currentImage.current after assignment(inside else)-->"+ currentImageIndex)
            }
        }
        if(prevOrNext == 'next'){
            console.log("Inside nextImg")
            if(currentImageIndex >= images.length-1){
                console.log("currentImage.current before assignment(inside if)-->"+ currentImageIndex)
                setCurrentImageIndex(0)
                console.log("currentImage.current now-->"+ currentImageIndex)
            }
            else{
                setCurrentImageIndex(index=> index+1)
                console.log("currentImage.current after assignment(inside else)-->"+ currentImageIndex)
            }
        }
    }
    const thumbnailSetter = (e)=>{
        setThumbnail(images[currentImageIndex])
        const updatedImages = images.map((img, index) => {
            if (index === currentImageIndex) {
                return {...img, isThumbnail:true}
            } else {
                return {...img, isThumbnail:false}
            }
        });
        setImages(updatedImages);
    }

    const findImageSize = (size)=>{
        if(size < (1024*1024)){
            return `${(size/1024).toFixed(2)} kb`
        }else{
            return `${(size/(1024*1024)).toFixed(2)} mb`
        }
    }

    const compressBigImages = async()=>{
        console.log("Inside compressBigImages()")
        setDisplayCompressButton(false)
        setImageMessage('Compressing')
        imageMessageDisplay.current.style.display = 'inline-block'
        const compressedImages = await Promise.all(
            images.map( async (image)=> {   
                if(image.size > (3*1024*1024)){
                    const newBlob = await handleImageCompression(image.blob)
                    return {...image, blob:newBlob, size:newBlob.size}
                }
                return image
            })
        )
        console.log("Compressed images-->", JSON.stringify(compressedImages))
        setImages([...compressedImages])
        setImageMessage(null)
        imageMessageDisplay.current.parentElement.style.visibility = 'hidden'
    }

    const openImageEditor = (imageUrl, name, blob)=>{
        editorPath.current = encodeURIComponent(imageUrl)
        console.log("editorPath.current-->"+editorPath.current)
        windowRef.current = window.open(`../image-editor?name=${name}`, "", "width=1300,height=700,left=300,top=300,resizable=no")
        // windowRef.current.postMessage({type:'target-img', blob, name}, '*')
        const messageHandler = (event) => {
            if (event.source === windowRef.current && event.data === 'child-ready') {
                console.log('Child window is ready. Sending image blob...');
                windowRef.current.postMessage({ type: 'target-img', blob, name }, '*');
                console.log("SENT IMAGE TO IMAGE EDITOR AFTER CHILD-READY", JSON.stringify({ type: 'target-img', blob, name }))
            }
        };
    
        window.addEventListener('message', messageHandler);
    
        windowRef.current.onbeforeunload = () => {
            window.removeEventListener('message', messageHandler);
        };
    }

    const openImageCropper = (index)=> {
        setImageCropperState(true)
        setImageCropperDefaultIndex(index)
    }

    const handleCropComplete = (croppedImg, image, index, mustSkip) => {
        let newCroppedImages 
        if(!mustSkip){
            setCroppedImages((croppedImages) => {
                newCroppedImages = [...croppedImages, { ...image, url: croppedImg, isCropped: true}]
                return newCroppedImages
            })
        }else{
            setCroppedImages((croppedImages) => {
                newCroppedImages = [...croppedImages, { ...image, url: croppedImg, isCropped: false}]
                return newCroppedImages
            })
        }
        if (index === images.length - 1){
            if(newCroppedImages.some(img=> !img.isCropped)){
                imageMessageDisplay.current.parentElement.style.visibility = 'visible'
                imageMessageDisplay.current.style.display = 'none'
                setImageMessage("Make sure you crop every image later before submitting")
                // setTimeout(()=>{
                //     imageMessageDisplay.current.parentElement.style.visibility = 'visible'
                //     imageMessageDisplay.current.style.display = 'none'
                //     setImageMessage("Make sure you crop every image later before submitting")
                // })
                setError("Make sure you crop every image later before submitting")
                toast.warn("Make sure you crop every image later before submitting")
            }
        } 
    }
    
    return(
        <main className='w-full h-screen' id='fileupload'>
            <div className={ `rounded-[5px] border border-dashed h-[17%] w-full flex justify-center
                        items-center ${checkDragging ? 'border-[#5997f0]' : 'border-secondary' }` } 
                                onDragEnter ={(e)=> dragEnterHandler(e)} onDragOver={(e)=> dragOverHandler(e)} 
                                    onDrop={(e)=> dropHandler(e)} ref={fileDropContainerRef} onDragLeave={(e)=> dragLeaveHandler(e)}
                                        style={images.length>0? {height:'17%'} : {height:'33%'}}>
                <h3 className= { `text-center align-middle my-auto text-[13px] ${checkDragging ? 'text-[#5997f0]' : 'text-secondary'}` }> 
                        <span ref={imageDropHeaderRef}> 
                            { checkDragging? 'Drop Images Here' : `Drag and Drop  ${(imageLimit==1)? 'Category Image' : 'Product Images'} Here or`}
                        </span>
                        <span>
                            <label for='file' className={`px-[8px] py-[2px] rounded-[5px] ml-[5px] text-black bg-primary 
                                    cursor-pointer ${checkDragging && 'hidden'}`}> Browse </label>
                            <input type='file' accept='image/*' id='file' className='hidden' onChange={(e)=> imageBrowseHandler(e)} multiple/>
                        </span >
                </h3>
            </div>
            <p className='text-red-500 text-[10px] h-[20px] mt-[5px]'> {error} </p>
            {   imageCropperState &&
                <ImageCropper images={images} onCropComplete={handleCropComplete} imageCropperState={imageCropperState}
                     setImageCropperState={setImageCropperState} imageCropperDefaultIndex={imageCropperDefaultIndex} imageCloseHandler={closeHandler}
                         imageCropperError={imageCropperError} setImageCropperError={setImageCropperError}/>
            }
            <div className='flex gap-[27px] flex-wrap mt-[20px]' id='image-section'>
                {
                    images.map((image,index)=> 
                        (<div key={image.name} className='flex flex-col'>
                            <figure key={image.name} className='relative w-[75px] h-[75px] rounded-[5px]'>
                                <img src={image.url} alt={image.name} className='w-[75px] h-[75px] rounded-[5px] object-cover'/>
                                <span className='absolute top-0 right-[-17px] h-full flex flex-col justify-between text-secondary cursor-pointer '> 
                                    <span className=' rounded-[4px] text-secondary'>
                                        <IoCloseSharp onClick={(e)=> closeHandler(image.url, index)}/> 
                                    </span>
                                    { !categoryImgPreview &&
                                    <span className=' rounded-[4px] text-secondary absolute cursor-pointer
                                            bottom-[40px] text-[15px]' onClick={()=> openImageEditor(image.url, image.name, image.blob)}>
                                        <RiImageEditLine/>
                                    </span> 
                                    }
                                </span>
                                {
                                  !image?.isCropped &&
                                  <span className="absolute bottom-[2px] left-[25%] px-[5px] py-[2px] rounded-[4px] bg-white text-[9px]
                                         font-[650] tracking-[0.6px] text-secondary cursor-pointer" onClick={()=> openImageCropper(index)}>
                                    Crop
                                  </span>
                                }
                            </figure>
                            <span className='text-[11px] text-secondary mt-[5px]'> { findImageSize(image.size) } </span>
                        </div>)
                    )
                }
            </div>
            <h5 className='text-[12px] text-green-500 invisible h-[17px] mt-[5px] leading-[18px] tracking-[0.2px]' id='image-compress-message' 
                                style={displayCompressButton? {color:'red', fontSize:'10px'}:{}}>
                {imageMessage} 
                <span className='text-[18px] hidden' ref={imageMessageDisplay}> {imageMessage && ' ....'}</span>
                { displayCompressButton &&
                    <button className='px-[13px] py-[2px] rounded-[5px] ml-[1rem] text-black bg-primary cursor-pointer ' onClick={()=> compressBigImages()}> 
                        Compress 
                    </button>
                }
            </h5>
            { needThumbnail &&
            images.length ?
                <div id='thumbnail-setter' className='mt-[2rem]'>
                <h4 className='text-[13.5px] font-[500] text-black capitalize mb-[6px] ml-[2px]'> <span className='text-[14px]'>P</span>roduct Thumbnail </h4>
                <div className='flex gap-[15px] h-[200px]'>
                    <figure className='h-[200px] w-[200px] rounded-[10px]'>
                        <img src={images[Number.parseInt(currentImageIndex)].url} alt={images[Number.parseInt(currentImageIndex)].name} 
                                className='h-[200px]  w-[200px] rounded-[10px] object-cover'/>
                    </figure>
                    <div className='flex flex-col justify-between h-full arrows'>
                        <span onClick={()=> arrowHandler('prev')}> <FaArrowUp/> </span>
                        <button className='text-[12px] font-[500] tracking-[0.2px] py-[6px] w-[32px] h-[113px] rounded-[5px] bg-primary' 
                                style={{writingMode:'vertical-rl'}} onClick={()=> openImageEditor(images[currentImageIndex].url, images[currentImageIndex].name, images[currentImageIndex].blob)}> 
                            Edit Image
                        </button>
                        <span onClick={()=> arrowHandler('next')}> <FaArrowDown/> </span>
                    </div>
                </div>
                <div className='w-[46%] mt-[7px] flex flex-col gap-[10px]'>
                    <SiteButtonSquare customStyle={{paddingBlock:'6px', width:'12.5rem', fontSize:'12px'}} clickHandler={(e)=> thumbnailSetter(e)}> 
                        Set as thumbnail 
                    </SiteButtonSquare>
    
                </div>
                </div>
                : ''
            }
            {categoryImgPreview && images.length &&
                <div className='h-[auto] w-full rounded-[10px] flex flex-col gap-[10px] justify-center mt-[2rem] relative' id='category-preview'>
                    <figure className='h-[175px]  w-[175px] rounded-[10px] outline outline-secondary outline-1 outline-offset-[2px]'>
                        <img src={images[0].url} alt={images[0].name} 
                                className='h-[175px]  w-[175px] rounded-[10px] object-cover'/>
                    </figure>
                    <span className='absolute bottom-[52px] left-[10px] text-[10px] font-[550] text-secondary px-[10px] 
                            rounded-[5px] tracking-[0.3px] category-name'> 
                        {(categoryImgPreview.categoryName.length > 20)? `${categoryImgPreview.categoryName[0].toUpperCase() + categoryImgPreview.categoryName.slice(3,20)}...` : categoryImgPreview.categoryName[0].toUpperCase() + categoryImgPreview.categoryName}
                     </span>
                    <SiteButtonSquare customStyle={{paddingBlock:'6px', width:'11rem', borderRadius:'7px', fontSize:'12px'}} 
                                                clickHandler={(e)=> openImageEditor(images[0].url, images[0].name, images[0].blob)} > 
                        Edit Category Image 
                    </SiteButtonSquare>
                </div>
            }
        </main>
    )
}