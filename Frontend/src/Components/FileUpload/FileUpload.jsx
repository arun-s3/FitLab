import React,{useState, useEffect, useRef} from 'react'
import './FileUpload.css'
import {SiteButtonSquare} from '../SiteButtons/SiteButtons'
import ImageEditor from '../ImageEditor/ImageEditor'
import PopupWindow from '../PopupWindow/PopupWindow'

import {IoCloseSharp} from "react-icons/io5";
import {RiImageEditLine} from "react-icons/ri";
import {FaArrowUp, FaArrowDown} from "react-icons/fa";

export default function FileUpload({images, setImages, thumbnail, setThumbnail}){

    const [error, setError] = useState(null)
    useEffect(()=>{
        if(error){
            setTimeout(()=> setError(""), 2000)
        }
    },[error])

    useEffect(()=>{
        console.log("Images array-->" + JSON.stringify(images))
        images.length && console.log("images[0].url"+ images.length && JSON.stringify(images[0].name))
        setCurrentImageIndex(0)
    },[images])

    const [checkDragging, setCheckDragging] = useState(false)
    const imageDropHeaderRef = useRef(null)
    const fileDropContainerRef = useRef(null)

    const imageEditorWindowRef = useRef(null)

    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const validateAndSetImage = (files)=>{
        console.log("Got files! -->", JSON.stringify(files));
        const newImages = [];
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] === 'image') {
                console.log("Image file -->", JSON.stringify(files[i]));
                
                if (images.find(img => img.name === files[i].name && img.size === files[i].size)) {
                    console.log("Duplicate image -->", JSON.stringify(files[i]));
                    setError("Duplicate Images won't be added!");
                    continue;
                }

                if (files[i].size > (10 * 1024 * 1024)) {
                    console.log("Big image -->", JSON.stringify(files[i]));
                    setError("Please add files each of size below 10Mb!");
                    continue;
                }

                newImages.push({ name: files[i].name, size: files[i].size, url: URL.createObjectURL(files[i]) });
            } else {
                console.log("Not an image -->", JSON.stringify(files[i]));
                setError("Only images will be added!");
                continue;
            }
        }
        setImages([...images, ...newImages]);
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
    }

    const openImageEditor = ()=>{
        imageEditorWindowRef.current.click()
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
                            { checkDragging? 'Drop Images Here' : 'Drag and Drop Product Images Here or'}
                        </span>
                        <span>
                            <label for='file' className={`px-[8px] py-[2px] rounded-[5px] ml-[5px] text-black bg-primary 
                                    cursor-pointer ${checkDragging && 'hidden'}`}> Browse </label>
                            <input type='file' accept='image/*' id='file' className='hidden' onChange={(e)=> imageBrowseHandler(e)} multiple/>
                        </span >
                </h3>
            </div>
            <p className='text-red-500 text-[10px] h-[20px] mt-[5px]'> {error} </p>
            <div className='flex gap-[27px] flex-wrap mt-[20px]'>
                {
                    images.map((image,index)=> 
                        (<div key={image.name} className='flex flex-col'>
                            <figure key={image.name} className='relative w-[75px] h-[75px] rounded-[5px]'>
                                <img src={image.url} alt={image.name} className='w-[75px] h-[75px] rounded-[5px] object-cover'/>
                                <span className='absolute top-0 right-[-17px] h-full flex flex-col justify-between text-secondary cursor-pointer '> 
                                    <span className=' rounded-[4px] text-secondary'>
                                        <IoCloseSharp onClick={(e)=> closeHandler(image.url, index)}/> 
                                    </span>
                                    <span className=' rounded-[4px] text-secondary absolute cursor-pointer
                                            bottom-[40px] text-[15px]' onClick={()=> openImageEditor()} >
                                        <RiImageEditLine/>

                                        <PopupWindow Component={<ImageEditor/>} ref={imageEditorWindowRef}/>

                                    </span>
                                </span>
                            </figure>
                            {/* <button type='button' className='px-[3px] py-[2px] border border-[#dde7a8] rounded-[4px] text-[9px] 
                                    mt-[2px] bg-primary text-secondary font-[550] flex items-center justify-center gap-[3px]'>
                                 Edit <RiImageEditLine/>
                            </button> */}
                        </div>)
                    )
                }
            </div>
            {
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
                        <span onClick={()=> arrowHandler('next')}> <FaArrowDown/> </span>
                    </div>
                </div>
                <div className='w-[46%] mt-[7px]'>
                    <SiteButtonSquare customStyle={{paddingBlock:'6px', width:'12.5rem', fontSize:'12px'}} clickHandler={(e)=> thumbnailSetter(e)}> 
                        Set as thumbnail 
                    </SiteButtonSquare>
                </div>
                </div>
                : ''
            }
        </main>
    )
}