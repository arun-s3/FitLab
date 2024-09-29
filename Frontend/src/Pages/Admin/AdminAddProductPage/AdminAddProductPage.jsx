import React,{useState, useRef, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import './AdminAddProductPage.css'
import FileUpload from '../../../Components/FileUpload/FileUpload';
import TagGenerator from '../../../Components/TagGenerator/TagGenerator';
import {createProduct} from '../../../Slices/productSlice'
import {handleInputValidation, displaySuccess, displayError} from '../../../Utils/fieldValidator'

import {ProductIcon, ProductIcon2} from '../../../Components/Icons/Icons'
import {IoArrowBackSharp} from "react-icons/io5";
import {IoIosArrowRoundBack} from "react-icons/io";
import {GoPackage} from "react-icons/go";
import {MdCurrencyRupee} from "react-icons/md";
import {LuPackage, LuPackageSearch} from "react-icons/lu";
import {RiWeightLine} from "react-icons/ri";
import {AiOutlineSafetyCertificate} from "react-icons/ai";
import {CgDetailsMore} from "react-icons/cg";

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
    const [productData, setProductData] = useState({})

    // const {} = useSelector(state=> state.product)
    const dispatch = useDispatch()

    useEffect(()=>{
        setProductData({...productData, images: images})
    },[setImages])

    useEffect(()=>{
        console.log("tag-->", JSON.stringify(tag))
        let tagStrings = tag.map(tag=> tag.key)
        console.log("tagStrings-->", tagStrings)
        setProductData({...productData, tags: tagStrings})
    },[tag])

    useEffect(()=>{
        console.log("productData-->", JSON.stringify(productData))
    },[productData])

    const changeHandler = (e, fieldName)=>{
        console.log(" inside Changehandler")
        setProductData({...productData, [fieldName]: e.target.value})
    }

    const inputFocusHandler = (e)=>{ e.target.previousElementSibling.style.display = 'none' }

    const inputBlurHandler = (e, fieldName)=>{
         console.log("inside inputBlurHandler, fieldname", fieldName)
         e.target.value.trim()? null : e.target.previousElementSibling.style.display = 'inline-block'
         if(fieldName){
            const value = e.target.value
            const statusObj = handleInputValidation(fieldName, value)
            console.log("statusObj from inputBlurHandler--> ", JSON.stringify(statusObj))
            if(statusObj.error){
                const message = statusObj.message
                displayError(e, message, productData, fieldName)
            }else{
                displaySuccess(e)
            }
         }
    }

    return(
        <section id='AdminAddProduct'>
            <div className='flex gap-[10px] items-center header'>
                <i className='p-[7px] border border-[#c4c6ca] rounded-[4px]'> <IoArrowBackSharp/> </i>
                <h1> Add Product </h1>
                {/* <i className='p-[7px] border border-transparent rounded-[4px]'>  <ProductIcon2/> </i>    <LuPackage/> <ProductIcon/> */}
            </div>
            <main className='flex gap-[10px] mr-[2rem]'>
                <div className='flex flex-col gap-[15px] basis[60%] w-[60%]'>
                    <div className='flex flex-col gap-[1rem] justify-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            <label for='product-name'> Product Name</label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<GoPackage/>}/>
                                <input type='text' placeholder='Type name here' id='product-name' required className='pl-[21px] w-full' 
                                            onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e, "productName")}
                                                onChange={(e)=> changeHandler(e, "productName")}/>
                                <p className='error'></p>
                            </div>
                        </div>
                        <div className='flex gap-[5px] items-center'>
                            <div className='input-wrapper'>
                                <label for='product-price'> Price </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<MdCurrencyRupee/>}/>
                                    <input type='text' id='product-price' required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                       onBlur={(e)=> inputBlurHandler(e, "price")} onChange={(e)=> changeHandler(e, "price")}/>
                                    <p className='error'></p>
                                </div>
                            </div>
                            <div className='input-wrapper'>
                                <label for='product-stock'> Stock </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<LuPackageSearch/>}/>
                                    <input type='text' placeholder='' id='product-stock' required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                            onBlur={(e)=> inputBlurHandler(e, "stock")} onChange={(e)=> changeHandler(e, "stock")}/>
                                    <p className='error'></p>
                                </div>
                            </div>
                            <div className='input-wrapper'>
                                <label for='product-weight'> Weight </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<RiWeightLine/>}/>
                                    <input type='text' placeholder='' id='product-weight' required  className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                         onBlur={(e)=> inputBlurHandler(e, "weight")}  onChange={(e)=> changeHandler(e, "weight")} />
                                    <p className='error'></p>
                                </div>
                            </div>
                        </div>
                        <div className='input-wrapper'>
                            <label for='product-brand'> Brand </label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<AiOutlineSafetyCertificate/>}/>
                                <input type='text' placeholder='Brand name' id='product-brand' required  className='pl-[21px] w-full' 
                                   onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e , "brand")} onChange={(e)=> changeHandler(e, "brand")}/>
                                <p className='error'></p>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            <label for='product-description'> Description </label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<CgDetailsMore/>} fromTop={8} />
                                <textarea placeholder='Type description here' rows='7' cols='70' maxlength='2000' id='product-description'
                                    required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e, "description")}
                                     onChange={(e)=> changeHandler(e, "description")}/>
                                <p className='error'></p>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper categories'>
                            <h4 className='text-[11.6px] text-secondary'> Select category / categories </h4> 
                                <div className='flex justify-between items-center mt-[10px] text-black'>
                                  <div>
                                      <label for= 'strength'>Strength</label>
                                      <input type='checkbox' id='strength' />
                                  </div>
                                  <div>
                                      <label for= 'cardio'>Cardio</label>
                                      <input type='checkbox' id='cardio' />
                                  </div>
                                  <div>
                                      <label for= 'supplements'>Supplements</label>
                                      <input type='checkbox' id='supplements' />
                                  </div>
                                  <div>
                                      <label for= 'accessories'>Acessories</label>
                                      <input type='checkbox' id='accessories' />
                                  </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            
                            <TagGenerator tag={tag} setTags={setTags} SetPlaceholderIcon={PlaceholderIcon}/> 

                        </div>
                    </div>
                    <div>
                        <button onClick={()=>console.log("ProductData-->", JSON.stringify(productData))}> Click here </button>
                    </div>
                </div>
                <div className='w-full h-screen basis-[37%]'>

                     <FileUpload images={images} setImages={setImages} thumbnail={thumbnail} setThumbnail={setThumbnail}/>
                     
                </div>
            </main>
        </section>
    )
}