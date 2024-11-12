import React,{useState, useEffect, useRef} from 'react'
import './AdminAddAndEditCategoryPage.css'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useLocation} from 'react-router-dom'

import {IoArrowBackSharp} from "react-icons/io5";
import {BiCategory} from "react-icons/bi";
import {MdOutlineCategory, MdArrowDropDown} from "react-icons/md";
import {CgDetailsMore} from "react-icons/cg";
import {CiCalendarDate} from "react-icons/ci";
import {TbCirclesRelation} from "react-icons/tb";
import {RiDiscountPercentLine} from "react-icons/ri";
import {SlBadge} from "react-icons/sl";
import {IoIosClose} from "react-icons/io";
import {toast} from 'react-toastify';

import FileUpload from '../../../Components/FileUpload/FileUpload';
import { SiteButtonSquare } from '../../../Components/SiteButtons/SiteButtons';
import {createCategory, getAllCategories, getCategoryNames, updateCategory, resetStates} from '../../../Slices/categorySlice'
import {SearchInput} from '../../../Components/FromComponents/FormComponents'
import {CustomHashLoader} from '../../../Components/Loader/Loader'
import PlaceholderIcon from '../../../Components/PlaceholderIcon/PlaceholderIcon';
import {DateSelector} from '../../../Components/Calender/Calender'
import {handleImageCompression} from '../../../Utils/compressImages'
import {handleInputValidation, displaySuccess, displayErrorAndReturnNewFormData, cancelErrorState} from '../../../Utils/fieldValidator'


export default function AdminAddAndEditCategoryPage({editCategory}){

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [images, setImages] = useState([]) 

    const [parentCategory, setParentCategory] = useState()
    const [relatedCategory, setRelatedCategory] = useState([])

    const commonBadges = useRef(["New", "Bestseller", "Top-rated"])
    const badgeListRef = useRef(null)

    const [categoryData, setCategoryData] = useState({})
    const [allCategoryNames, setAllCategoryNames] = useState([])

    const dispatch = useDispatch()
    const {success, loading, error, tempDatas, categories, categoryCreated, categoryUpdated} = useSelector((state)=> state.categoryStore)

    const navigate = useNavigate()
    const location = useLocation()
    const editCategoryItem = useRef(null)

    const primaryColor = useRef('rgba(215, 241, 72, 1)')

    const hiddenInputRef = useRef(null)

    useEffect(()=>{
        console.log("CATEGORYDATA-->", JSON.stringify(categoryData))
    },[categoryData])

    useEffect(()=>{
        console.log("Images-->", JSON.stringify(images))
        const seasonalActivation = (startDate || endDate) ? { startDate: startDate || null, endDate: endDate || null } : undefined
        setCategoryData({...categoryData, images, parentCategory, relatedCategory, ...(seasonalActivation && {seasonalActivation})})
    },[images, parentCategory, relatedCategory, startDate, endDate])

    // useEffect(()=>{
    //     console.log(`Inside useEffect for success-${success}`)
    //     if(success){
    //         success && toast.success('Created Category succesfully!')
    //         // productUpdated && toast.success('Updated product succesfully!')
    //         dispatch(resetStates())
    //         // setTimeout(()=> {navigate('/admin/products/category/list', {replace: true})}, 1000)
    //     }
    // },[success])

    useEffect(()=>{
        dispatch(getAllCategories)
        setAllCategoryNames(categories.map(cat=> cat.name))
    },[categories])

    useEffect(() => {
        if(location?.state?.category){
           console.log("location.state-->", JSON.stringify(location.state));
           console.log("location.state.category._id-->", JSON.stringify(location.state.category._id));
           editCategoryItem.current = location.state.category;
           dispatch(getCategoryNames({id: location.state.category._id}))
        }
   },[location])

    useEffect(()=>{
        if(editCategoryItem.current){
            console.log("Inside useEffect() for tempDatas----")
        const convertToBlob = async (url) => {
            try {
                const response = await fetch(url, {mode: 'cors'});
                return await response.blob();
            } catch (error) {
                console.log("Error in convertToBlob-->", error.message);
            }
        }
        const loadCategoryData = async () => {   
                console.log("tempDatas.relatedCategoryNames-->",tempDatas.relatedCategoryNames) 
                console.log("tempDatas.parentCategoryName-->",tempDatas.parentCategoryName) 
                setCategoryData({
                    "categoryName": editCategoryItem.current.name,
                    "categoryDescription": editCategoryItem.current.description,
                    "categoryDiscount": editCategoryItem.current?.discount || null,
                    "categoryBadge": editCategoryItem.current?.badge ||null,
                    "startDate": editCategoryItem.current?.seasonalActivation?.startDate || null,
                    "endDate": editCategoryItem.current?.seasonalActivation?.endDate || null,
                })
                setRelatedCategory(tempDatas?.relatedCategoryNames || [])
                setParentCategory(tempDatas?.parentCategoryName || null)

                console.log('image from state of location on Edit-->', JSON.stringify(editCategoryItem.current.image))
                const blob = await convertToBlob(editCategoryItem.current.image.url);
                const newImage = {...editCategoryItem.current.image, blob};
                setImages([newImage]);
        }
        loadCategoryData()
       }
    },[tempDatas])

    useEffect(()=>{
        console.log(`Inside useEffect for productCreated, productUpdated success, productUpdated-${categoryUpdated} productCreated-${categoryCreated}`)
        if(editCategory && (categoryCreated || categoryUpdated)){
            categoryCreated && toast.success('Created category succesfully!')
            categoryUpdated && toast.success('Updated category succesfully!')
            dispatch(resetStates())
            setTimeout(()=> {navigate('/admin/products/category', {replace: true})}, 1000)
        }
    },[categoryCreated, categoryUpdated])

    const changeHandler = (e, fieldName)=>{
        console.log(" inside Changehandler")
        if(fieldName == 'categoryBadge'){
            const listNode = badgeListRef.current
            listNode.style.visibility = 'hidden'
            listNode.previousElementSibling.style.borderBottomLeftRadius = '5px'
            listNode.previousElementSibling.style.borderBottomRightRadius = '5px'
        }
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
            const value = e.target.value
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

    const showList = (e)=>{
        console.log("Inside showList")
        const listNode = e.target.id == 'category-badge' ? badgeListRef.current : e.currentTarget.nextElementSibling
        if(listNode.style.visibility === 'visible'){
            listNode.style.visibility = 'hidden'
            e.currentTarget.style.borderBottomLeftRadius = '5px'
            e.currentTarget.style.borderBottomRightRadius = '5px'
        }else{
            listNode.style.visibility = 'visible'
            e.currentTarget.style.borderBottomLeftRadius = '0px'
            e.currentTarget.style.borderBottomRightRadius = '0px'
        }
    }

    const selectListHandler = (name, categoryType, e)=>{
        if(categoryType=='parentCategory'){
            setParentCategory(name)
            closeList()
        }
        if(categoryType == 'categoryBadge'){
            setCategoryData({...categoryData, [categoryType]:name})
            closeList()
        }
        if(categoryType=='relatedCategory'){
            if(e.target.checked){
                console.log("Inside if e.target.checked")
                if(relatedCategory.length < 2){
                    console.log("Only 2 related categories allowed")
                    e.target.checked = true
                    setRelatedCategory([...relatedCategory, name])
                }else{
                    console.log("closing--")
                    e.target.checked = false
                    closeList()
                }
            }else{
                console.log("Inside else e.target.checked")
                e.target.checked = false
                setRelatedCategory(relatedCat=> relatedCat.filter(cat=> cat!==name))
            }   
        } 
        
        function closeList(){
            const listNode = (categoryType=='parentCategory'||'categoryBadge') ? e.target.parentElement : e.target.parentElement.parentElement
            listNode.style.visibility = 'hidden'
            listNode.previousElementSibling.style.borderBottomLeftRadius = '5px'
            listNode.previousElementSibling.style.borderBottomRightRadius = '5px'
        }
    }

    const submitHandler = async (e)=>{

        if(!images.length) delete categoryData['images']
        console.log("Inside submitData()--", JSON.stringify(categoryData))
        const requiredFields = ["categoryName","categoryDescription","images"]
        console.log("(Object.keys(categoryData).length >= 3)-->", Object.keys(categoryData).length >= 3)
        console.log("requiredFields.every(field=> Object.keys(categoryData).includes(field) )-->", requiredFields.every(field=> Object.keys(categoryData).includes(field) ))
        console.log("Object.values(categoryData).find(inputValues=> inputValues !== 'undefined')-->", Object.values(categoryData).find(inputValues=> inputValues !== 'undefined'))
        if( (Object.keys(categoryData).length >= 3 && requiredFields.every(field=> Object.keys(categoryData).includes(field) )) && Object.values(categoryData).find(inputValues=> inputValues !== 'undefined')){
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

            for(let field in categoryData){
                !categoryData[field] && delete categoryData[field]
            }
            console.log("CATEGORYDATA BEFORE DISPATCHING-->", JSON.stringify(categoryData))
            editCategory? dispatch( updateCategory( {formData, id: editCategoryItem.current._id}) ) : dispatch( createCategory( {formData}) )
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
                            <div className='w-[20rem] h-[2.4rem] border border-primary rounded-[5px] pr-0 text-[12px] bg-white relativecursor-pointer' 
                                     onClick={(e)=> showList(e)} >
                                <span className='absolute top-[10px] left-[25px]'> {categoryData.parentCategory && categoryData.parentCategory} </span>
                                <i className='w-full h-full flex items-center justify-end pr-[5px] cursor-pointer'> <MdArrowDropDown/> </i>
                            </div>
                            <div className='absolute top-[38px] flex flex-col justify-center items-center gap-[3px] w-full h-fit py-[10px]
                                    rounded-[5px] bg-white border border-primary rounded-tl-none rounded-tr-none z-[5] invisible'>
                                {allCategoryNames.map(name=>
                                     <span className='text-[11px] text-secondary capitalize w-full text-left pl-[20px] hover:bg-primary cursor-pointer' 
                                                onClick={(e)=> selectListHandler(name,'parentCategory',e)} > 
                                            {name}
                                     </span>
                                )}
                            </div>      
                        </div>
                    </div>
                    <div className='category-content-wrapper'>
                        <div className='self-start category-labels'>
                            <label for='category-description'> Category Description </label>
                            <p>
                                Provide a concise description of the category. This will help customers understand the types of
                                products offered within this category. Keep it informative and under 160 characters.
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
                        <div className='relative' id='calender'>
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
                            <div className='w-[20rem] h-[2.4rem] border border-primary rounded-[5px] flex justify-center items-center pr-0 text-[12px] bg-white cursor-pointer'
                                        onClick={(e)=> showList(e)} >
                                {relatedCategory &&
                                 <div className='flex items-center gap-[5px] ml-[10%]'>
                                 { relatedCategory.map(cat=> (
                                     <span className=' flex items-center gap-[2px] border border-secondary rounded-[10px] px-[9px] py-[1px] text-[10px] text-secondary'> 
                                         <span> {cat} </span>
                                         <IoIosClose onClick={(e)=> setRelatedCategory(relatedCat=> relatedCat.filter(rcat=> rcat !== cat))}/>
                                     </span>
                                 )) }
                                 </div>
                                }
                                <i className='w-full h-full flex items-center justify-end pr-[5px] cursor-pointer'> <MdArrowDropDown/> </i>
                            </div>
                            <div className='absolute top-[38px] flex flex-col justify-center items-center gap-[3px] w-full h-fit py-[10px]
                                    rounded-[5px] bg-white border border-primary rounded-tl-none rounded-tr-none z-[5] invisible'>
                                {allCategoryNames.map(name=>(
                                    <div key={name} className='flex items-center justify-start gap-[5px] w-full pl-[20px]'>
                                        <input type='checkbox' className='text-[11px] border border-primary w-[15px] h-[15px] rounded-[2px] hover:bg-primary cursor-pointer' 
                                                onChange={(e)=> selectListHandler(name,'relatedCategory',e)} value={name} checked={relatedCategory.some(cat=> cat==name) || false} />
                                        <span className='text-[11px] text-secondary capitalize'> {name} </span>
                                    </div>
                                    )
                                )}
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
                                    onFocus={(e)=> badgeFocusHandler(e)} onBlur={()=> hiddenInputRef.current.click()} onClick={(e)=> showList(e)}
                                         onChange={(e)=> changeHandler(e, "categoryBadge")} value={categoryData.categoryBadge}/>
                                <i className='pr-[5px] cursor-pointer'> <MdArrowDropDown/> </i>
                            </div>
                            <input type='hidden' ref={hiddenInputRef} onClick={(e)=> inputBlurHandler(e, "categoryBadge", {optionalField: true})} value={categoryData.categoryBadge}/>
                            <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p> {/* Should come this in the place of <i>*/}
                            <div className='absolute top-[34px] flex flex-col justify-center items-center gap-[3px] w-full h-full
                                        rounded-[5px] bg-white border border-primary rounded-tl-none rounded-tr-none 
                                            invisible' ref={badgeListRef}>
                                {commonBadges.current.map(name=>
                                     <span className='text-[11px] text-secondary capitalize w-full text-center hover:bg-primary cursor-pointer' 
                                                onClick={(e)=> selectListHandler(name,'categoryBadge',e)} > 
                                            {name}
                                     </span>
                                )}
                            </div>
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