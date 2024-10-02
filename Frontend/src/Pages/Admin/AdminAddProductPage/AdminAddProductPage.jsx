import React,{useState, useRef, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import './AdminAddProductPage.css'
import FileUpload from '../../../Components/FileUpload/FileUpload';
import TagGenerator from '../../../Components/TagGenerator/TagGenerator';
import SelectCategoryForAdmin from '../../../Components/SelectCategoryForAdmin/SelectCategoryForAdmin';
import {createProduct} from '../../../Slices/productSlice'
import {handleInputValidation, displaySuccess, displayErrorAndReturnNewFormData, cancelErrorState} from '../../../Utils/fieldValidator'

import imageCompression from 'browser-image-compression';
import {ProductIcon, ProductIcon2} from '../../../Components/Icons/Icons'
import {IoArrowBackSharp} from "react-icons/io5";
import {IoIosArrowRoundBack} from "react-icons/io";
import {GoPackage} from "react-icons/go";
import {MdCurrencyRupee} from "react-icons/md";
import {LuPackage, LuPackageSearch} from "react-icons/lu";
import {RiWeightLine} from "react-icons/ri";
import {AiOutlineSafetyCertificate} from "react-icons/ai";
import {CgDetailsMore} from "react-icons/cg";
import { SiteButtonSquare } from '../../../Components/SiteButtons/SiteButtons';

function PlaceholderIcon({icon, fromTop}){
    return(
        <span className='absolute top-[25%] left-[8px] text-[#6b7280] text-[11px]' style={fromTop? {top: `${fromTop}%`}: null}>
             {icon} 
        </span>
    )
}
export default function AdminAddProductPage(){

    const [tag, setTags] = useState([])
    const [thumbnail, setThumbnail] = useState({})
    const [images, setImages] = useState([])
    const [category, setCategory] = useState([])
    const [productData, setProductData] = useState({})

    const primaryColor = useRef('rgba(215, 241, 72, 1)')
    // const {} = useSelector(state=> state.product)
    const dispatch = useDispatch()

    useEffect(() => {
        setProductData({ ...productData, category: category, images: images, thumbnail: thumbnail });
    }, [category, images, thumbnail]);

    useEffect(()=>{
        console.log("tag-->", JSON.stringify(tag))
        let tagStrings = tag.map(tag=> tag.key)
        console.log("tagStrings-->", tagStrings)
        setProductData({...productData, tags: tagStrings})
    },[tag])

    useEffect(()=>{
        console.log("PRODUCTDATA-->", JSON.stringify(productData))
    },[productData])

    const changeHandler = (e, fieldName)=>{
        console.log(" inside Changehandler")
        setProductData({...productData, [fieldName]: e.target.value})
    }
    
    const inputFocusHandler = (e)=>{ e.target.previousElementSibling.style.display = 'none' }

    const inputBlurHandler = (e, fieldName, options)=>{
         console.log("inside inputBlurHandler, fieldname", fieldName)
         e.target.value.trim()? null : e.target.previousElementSibling.style.display = 'inline-block'
         if(fieldName){
            let uniqueWeights
            if(fieldName=='weights'){
                let weightArr = e.target.value.trim().split(',')
                weightArr = weightArr.map(wt=> wt.trim())
                uniqueWeights = new Set([...weightArr])
                setProductData({...productData, weights: [...uniqueWeights]})
            }
            const value = (fieldName == 'weights') ? Array.from(uniqueWeights) : e.target.value
            const statusObj = (options?.optionalField) ? handleInputValidation(fieldName, value, {optionalField: true}) : handleInputValidation(fieldName, value)
            console.log("statusObj from inputBlurHandler--> ", JSON.stringify(statusObj))
            if(!statusObj.error && statusObj.message.startsWith("Optional")){
                console.log("Inside here----")
                e.target.nextElementSibling.textContent = ''
                e.target.style.borderColor = primaryColor.current
                return
            }
            if(statusObj.error){
                const message = statusObj.message
                const newProductData = displayErrorAndReturnNewFormData(e, message, productData, fieldName)
                setProductData(newProductData)
            }else{
                displaySuccess(e)
            }
         }
    }

    const handleImageCompression = async (file) => {
        const options = {
            maxSizeMB: 1,         
            maxWidthOrHeight: 1024, 
        }
        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error('Error during compression:', error);
        }
    }

    const submitHandler = (e)=>{
        console.log("Inside submitData()--")
        const optionalFields = ["description","tags","weights"]
        if( (Object.keys(productData).length <= 7 && optionalFields.some(field=> Object.keys(productData).includes(field) )) || Object.values(productData).find(inputValues=>inputValues==='undefined')){
            if(!productData.size){
                console.log("No Fields entered!")
                toast.error("Please enter all the fields!")
            }
            else{
                console.log("Check errors"+JSON.stringify(productData))
                toast.error("Please check the fields and submit again!")
            }
        } 
        else{
            console.log("Inside else(no errors) of submitData() ")
            console.log("FormData now-->"+JSON.stringify(productData))
            // const productDataImages = productData.images.map(image=> {
            //     // delete image['blob']
            //     image.url = handleImageCompression(image.url)
            //     return image
            // })
            // setImages([...productDataImages])
            console.log("FormData now AFTER DELETING BLOB FIELD-->"+JSON.stringify(productData))
            dispatch( createProduct(productData) )
            console.log("Dispatched successfully--")
        }
    }

    return(
        <section id='AdminAddProduct'>
            <header className='flex gap-[10px] items-center'>
                <i className='p-[7px] border border-[#c4c6ca] rounded-[4px]'> <IoArrowBackSharp/> </i>
                <h1> Add Product </h1>
                {/* <i className='p-[7px] border border-transparent rounded-[4px]'>  <ProductIcon2/> </i>    <LuPackage/> <ProductIcon/> */}
            </header>
            <main className='flex gap-[10px]'>
                <div className='flex flex-col gap-[15px] basis[60%] w-[60%]'>
                    <div className='flex flex-col gap-[1rem] justify-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            <label for='product-name'> Product Name</label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<GoPackage/>}/>
                                <input type='text' placeholder='Type name here' id='product-name' required className='pl-[21px] w-full' 
                                            onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e, "title")}
                                                onChange={(e)=> changeHandler(e, "title")}/>
                                <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                            </div>
                        </div>
                        <div className='flex gap-[5px] items-center'>
                            <div className='input-wrapper'>
                                <label for='product-price'> Price </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<MdCurrencyRupee/>}/>
                                    <input type='text' id='product-price' required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                       onBlur={(e)=> inputBlurHandler(e, "price")} onChange={(e)=> changeHandler(e, "price")}/>
                                    <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                                </div>
                            </div>
                            <div className='input-wrapper'>
                                <label for='product-stock'> Stock </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<LuPackageSearch/>}/>
                                    <input type='text' placeholder='' id='product-stock' required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                            onBlur={(e)=> inputBlurHandler(e, "stock")} onChange={(e)=> changeHandler(e, "stock")}/>
                                    <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                                </div>
                            </div>
                            <div className='input-wrapper'>
                                <label for='product-weight'> Weights Available (optional) </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<RiWeightLine/>}/>
                                    <input type='text' placeholder='' id='product-weight' required  className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                         onBlur={(e)=> inputBlurHandler(e, "weights", {optionalField: true})}  onChange={(e)=> changeHandler(e, "weights")} />
                                    {/* <span className='text-[8px]'>(Enter each weight seperated by commas)</span>  */}
                                    <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p>
                                </div>
                            </div>
                        </div>
                        <div className='input-wrapper'>
                            <label for='product-brand'> Brand </label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<AiOutlineSafetyCertificate/>}/>
                                <input type='text' placeholder='Brand name' id='product-brand' required  className='pl-[21px] w-full' 
                                   onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e , "brand")} onChange={(e)=> changeHandler(e, "brand")}/>
                                <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            <label for='product-description'> Description (optional) </label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<CgDetailsMore/>} fromTop={8} />
                                <textarea placeholder='Type description here' rows='7' cols='70' maxlength='2000' id='product-description'
                                    required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e, "description", {optionalField: true})}
                                     onChange={(e)=> changeHandler(e, "description")} />
                                <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper categories'>

                            <SelectCategoryForAdmin category={category} setCategory={setCategory}/>
                            
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            
                            <TagGenerator tag={tag} setTags={setTags} SetPlaceholderIcon={PlaceholderIcon}/> 

                        </div>
                    </div>
                    <div className='mt-[1rem]'>
                        <SiteButtonSquare customStyle={{paddingInline:'50px', paddingBlock:'9px', borderRadius:'7px'}}
                                            clickHandler={(e)=>{ submitHandler(e)}}> Submit </SiteButtonSquare>
                    </div>
                </div>
                <div className='w-full h-screen basis-[37%]'>

                     <FileUpload images={images} setImages={setImages} thumbnail={thumbnail} setThumbnail={setThumbnail}/>
                     
                </div>
            </main>
        </section>
    )
}