import React,{useState, useEffect, useRef} from 'react'
import './AdminAddAndEditCategoryPage.css'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import {IoArrowBackSharp} from "react-icons/io5";
import {BiCategory} from "react-icons/bi";
import {MdOutlineCategory, MdArrowDropDown} from "react-icons/md";
import {CgDetailsMore} from "react-icons/cg";
import {CiCalendarDate} from "react-icons/ci";
import {TbCirclesRelation} from "react-icons/tb";
import {RiDiscountPercentLine} from "react-icons/ri";
import {SlBadge} from "react-icons/sl";
import {toast} from 'react-toastify';

import FileUpload from '../../../Components/FileUpload/FileUpload';
import { SiteButtonSquare } from '../../../Components/SiteButtons/SiteButtons';
import {createCatgeory, resetStates} from '../../../Slices/categorySlice'
import {SearchInput} from '../../../Components/FromComponents/FormComponents'
import {CustomHashLoader} from '../../../Components/Loader/Loader'
import PlaceholderIcon from '../../../Components/PlaceholderIcon/PlaceholderIcon';
import {DateSelector} from '../../../Components/Calender/Calender'
import {handleImageCompression} from '../../../Utils/compressImages'
import {handleInputValidation, displaySuccess, displayErrorAndReturnNewFormData, cancelErrorState} from '../../../Utils/fieldValidator'


export default function AdminAddAndEditCategoryPage(){

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [images, setImages] = useState([]) 

    const [categoryData, setCategoryData] = useState({})

    const dispatch = useDispatch()
    const {success, loading, error} = useSelector((state)=> state.categoryStore)

    const navigate = useNavigate()

    const primaryColor = useRef('rgba(215, 241, 72, 1)')

    const hiddenInputRef = useRef(null)

    useEffect(()=>{
        console.log("CATEGORYDATA-->", JSON.stringify(categoryData))
    },[categoryData])

    useEffect(()=>{
        console.log("Images-->", JSON.stringify(images))
        setCategoryData({...categoryData, images})
    },[images])

    useEffect(()=>{
        console.log(`Inside useEffect for success-${success}`)
        if(success){
            success && toast.success('Created Category succesfully!')
            // productUpdated && toast.success('Updated product succesfully!')
            dispatch(resetStates())
            // setTimeout(()=> {navigate('/admin/products/category/list', {replace: true})}, 1000)
        }
    },[success])

    const changeHandler = (e, fieldName)=>{
        console.log(" inside Changehandler")
        setCategoryData({...categoryData, [fieldName]: e.target.value})
    }
    
    const inputFocusHandler = (e)=>{ e.target.previousElementSibling.style.display = 'none' }
    const badgeFocusHandler = (e)=>{ e.target.parentElement.previousElementSibling.style.display = 'none' }

    const inputBlurHandler = (e, fieldName, options)=>{
         console.log("inside inputBlurHandler, fieldname", fieldName)
         if(!fieldName=='categoryBadge'){
            e.target.value.trim()? null : e.target.previousElementSibling.style.display = 'inline-block'
         }else{
            e.target.parentElement.firstElementChild.style.display = 'inline-block'
         }
         if(fieldName){
            let uniqueWeights
            if(fieldName=='weights'){
                let weightArr = e.target.value.trim().split(',')
                weightArr = weightArr.map(wt=> wt.trim())
                uniqueWeights = new Set([...weightArr])
                setCategoryData({...categoryData, weights: [...uniqueWeights]})
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
                const newCategoryData = displayErrorAndReturnNewFormData(e, message, categoryData, fieldName)
                setCategoryData(newCategoryData)
            }else{
                displaySuccess(e)
            }
         }
    }

    const submitHandler = async (e)=>{

        if(!images.length) delete categoryData['images']
        console.log("Inside submitData()--", JSON.stringify(categoryData))
        const requiredFields = ["categoryName","categoryDescription","images"]

        if( (Object.keys(categoryData).length <= 7 && requiredFields.every(field=> Object.keys(categoryData).includes(field) )) || Object.values(categoryData).find(inputValues=>inputValues==='undefined')){
            console.log("Inside else(no errors) of submitData() ")
            console.log("categoryData now-->"+JSON.stringify(categoryData))
            const formData = new FormData()
            const {images, ...rest} = categoryData
            console.log("Image-->", JSON.stringify(images))
            console.log("rest-->", JSON.stringify(rest))
            for (let field in rest){
                if( Array.isArray(rest[field]) ){
                    rest[field].forEach((item) => {
                        formData.append(`${field}[]`, item); 
                    });
                }else{
                    formData.append(field, rest[field])
                }
            }
            const compressedImageBlobs = async(image)=>{
                if(image.size > (5*1024*1024)){
                    const newBlob = await handleImageCompression(image.blob)
                    return newBlob
                }else{
                    return image.blob
                }
            } 
            const newBlob = await compressedImageBlobs(images[0])
            formData.append('image', newBlob, 'categoryImg')

            console.log("CATEGORYDATA BEFORE DISPATCHING-->", JSON.stringify(categoryData))
            dispatch( createCatgeory({formData}) )
            // editProduct?  dispatch( updateProduct({formData, id: editProductItem.current._id}) ) : dispatch( createProduct({formData}) )
            console.log("DISPATCHED SUCCESSFULLY--")
        } 
        else{
            if(!categoryData.size){
                console.log("No Fields entered!")
                toast.error("Please enter all the fields!")
            }
            else{
                console.log("Check errors"+JSON.stringify(categoryData))
                toast.error("Please check the fields and submit again!")
            }
        }
    }


    return(
        <section id='AdminAddAndEditCategoryPage'>
            <header>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-[10px]'>
                        <i className='p-[7px] h-[33px] border border-[#c4c6ca] mt-[-6px] rounded-[4px] self-center'> <IoArrowBackSharp/> </i>
                        <div className='flex flex-col'>
                            <h1> Categories </h1>
                            <h5 className='text-[12px] font-[500] text-secondary tracking-[0.2px] mt-[-2px]'> Add, Edit or Block categories</h5>
                        </div>
                    </div>
                    {/* <input type='search' placeholder='Search Categories' className='w-[12rem] h-[35px] border-dotted bg-[#fefff8]
                             rounded-[7px] placeholder:text-[11px]' /> */}
                </div>
            </header>
            <main className='flex gap-[10px]'>
                <div className='flex flex-col gap-[15px] basis-[65%] w-[65%]' id='category-content'>
                    <div className='category-content-wrapper'>
                        <div className='category-labels'>
                            <label for='category-name'> Category Name </label>
                            <p>
                                Enter a unique and descriptive name for the category. This will help customers easily identify and navigate 
                                to the products. Keep it concise, under 50 characters.
                            </p>
                        </div>
                        <div className='relative'>
                            <PlaceholderIcon icon={<BiCategory/>} />
                            <input type='text' id='category-name' required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                onBlur={(e)=> inputBlurHandler(e, "categoryName")} onChange={(e)=> changeHandler(e, "categoryName")} value={categoryData.categoryName}/>
                            <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                        </div>
                    </div>
                    <div className='category-content-wrapper'>
                        <div className='category-labels'>
                        <h5> Parent Category </h5>
                            <p> 
                                Choose a parent category from the list to organize it under a broader group. This helps organize
                                products, improving navigation and customer experience. If this is a standalone category, select 'None'.
                            </p>
                        </div>
                        <div className='relative'>
                            <PlaceholderIcon icon={<MdOutlineCategory/>} fromTop={35}/>
                            <div className='w-[20rem] h-[2.4rem] border border-primary rounded-[5px] pr-0 text-[12px] bg-white'>
                                <i className='w-full h-full flex items-center justify-end pr-[5px]'> <MdArrowDropDown/> </i>
                            </div>
                        </div>
                    </div>
                    <div className='category-content-wrapper'>
                        <div className='self-start category-labels'>
                            <label for='category-description'> Category Description </label>
                            <p>
                                Provide a concise description of the category. This will help customers understand the types of
                                products offered within this category. Keep it informative and under 200 words.
                            </p>
                        </div>
                        <div className='relative'>
                            <PlaceholderIcon icon={<CgDetailsMore/>} fromTop={14}/>
                            <textarea rows='7' cols='70' maxlength='500' id='category-description'
                                    required className='pl-[21px] w-[20rem] h-[7rem] resize-none border border-primary rounded-[5px] 
                                        text-[12px] overflow-hidden placeholder:text-[9px] placeholder:text-[#6b7280] '
                                            onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e, "categoryDescription")} 
                                                onChange={(e)=> changeHandler(e, "categoryDescription")} value={categoryData.categoryDescription} />
                            <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                        </div>
                    </div>
                    <div className='category-content-wrapper'>
                        <div className='category-labels'>
                            <h5> Seasonal Category Activation </h5>
                            <p>
                                Set the start and end dates for seasonal activation of this category. This allows you to automatically
                                display or hide the category for time-limited promotions or seasonal products.
                            </p>
                        </div>
                        <div className='relative calender'>
                            <DateSelector dateGetter={{startDate, endDate}} dateSetter={{setStartDate, setEndDate}} />
                        </div>
                    </div>
                    <div className='category-content-wrapper'>
                        <div className='category-labels'>
                        <h5> Related Categories </h5>
                            <p> 
                                Select related categories to link this category with others. This will help improve product discovery
                                by showing customers similar categories.
                            </p>
                        </div>
                        <div className='relative'>
                            <PlaceholderIcon icon={<TbCirclesRelation/>} fromTop={35}/>
                            <div className='w-[20rem] h-[2.4rem] border border-primary rounded-[5px] pr-0 text-[12px] bg-white'>
                                <i className='w-full h-full flex items-center justify-end pr-[5px]'> <MdArrowDropDown/> </i>
                            </div>
                        </div>
                    </div>
                    <div className='category-content-wrapper'>
                        <div className='category-labels'>
                            <label for='category-discount'> Category Discount </label>
                            <p> 
                                Enter a discount percentage to apply across all products in this category. This can be used to run special
                                promotions or sales. 
                            </p>
                        </div>
                        <div className='relative'>
                            <PlaceholderIcon icon={<RiDiscountPercentLine/>} />
                            <input type='text' id='category-discount' required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                onBlur={(e)=> inputBlurHandler(e, "categoryDiscount", {optionalField: true})} onChange={(e)=> changeHandler(e, "categoryDiscount")} value={categoryData.categoryDiscount}/>
                            <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p>
                        </div>
                    </div>
                    <div className='category-content-wrapper'>
                        <div className='category-labels'>
                            <label for='category-badge'> Category Badge </label>
                            <p> 
                                Enter or choose one from the dropdown list, a short badge for this category. This badge will be displayed prominently on the
                                website. Keep it concise and under 15 characters.
                            </p>
                        </div>
                        <div className='relative'>
                            <PlaceholderIcon icon={<SlBadge/>} />
                            <div className='w-[20rem] h-[2.4rem] border border-primary rounded-[5px] pr-0 flex items-center justify-between'>
                                <input type='text' id='category-badge' required className='pl-[23px]' style={{width:'17rem', height:'100%', border:'none', borderRadius:'none'}}
                                    onFocus={(e)=> badgeFocusHandler(e)} onBlur={()=> hiddenInputRef.current.click()}
                                         onChange={(e)=> changeHandler(e, "categoryBadge")} value={categoryData.categoryBadge}/>
                                <i className='pr-[5px]'> <MdArrowDropDown/> </i>
                            </div>
                            <input type='hidden' ref={hiddenInputRef} onClick={(e)=> inputBlurHandler(e, "categoryBadge", {optionalField: true})} value={categoryData.categoryBadge}/>
                            <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p> {/* Should come this in the place of <i>*/}
                        </div>
                    </div>
                    <div className='w-[20%] mt-[2rem]'>
                        <SiteButtonSquare customStyle={{paddingInline:'50px', paddingBlock:'9px', borderRadius:'7px'}}
                                                clickHandler={(e)=>{ submitHandler(e)}}>
                                 {loading? <CustomHashLoader loading={loading}/> : 'Submit'}   
                        </SiteButtonSquare>
                    </div>
                </div>
                <div className='w-full h-screen basis-[35%] mt-[15px]'>

                <FileUpload images={images} setImages={setImages} imageLimit={1} needThumbnail={false} categoryImgPreview={{categoryName: `${categoryData?.categoryName ? categoryData?.categoryName : 'Category Name'}`}}/>

                </div>
            </main>
        </section>
    )
}