import React,{useState, useEffect, useRef} from 'react'
import './AdminAddAndEditCategoryPage.css'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useLocation, useOutletContext} from 'react-router-dom'

import {BiCategory} from "react-icons/bi"
import {MdOutlineCategory, MdArrowDropDown} from "react-icons/md"
import {CgDetailsMore} from "react-icons/cg"
import {CiCalendarDate} from "react-icons/ci"
import {TbCirclesRelation} from "react-icons/tb"
import {RiDiscountPercentLine} from "react-icons/ri"
import {SlBadge} from "react-icons/sl"
import {IoIosClose} from "react-icons/io"

import {toast as sonnerToast} from 'sonner'

import apiClient from '../../../Api/apiClient'

import AdminTitleSection from '../../../Components/AdminTitleSection/AdminTitleSection'
import FileUpload from '../../../Components/FileUpload/FileUpload'
import CategoryDisplay from '../../../Components/CategoryDisplay/CategoryDisplay'
import useFlexiDropdown from '../../../Hooks/FlexiDropdown'
import { SiteButtonSquare } from '../../../Components/SiteButtons/SiteButtons'
import {createCategory, getAllCategories, getCategoryNames, updateCategory, resetStates} from '../../../Slices/categorySlice'
import {CustomHashLoader} from '../../../Components/Loader/Loader'
import PlaceholderIcon from '../../../Components/PlaceholderIcon/PlaceholderIcon'
import {DateSelector} from '../../../Components/Calender/Calender'
import {handleImageCompression} from '../../../Utils/compressImages'
import {handleInputValidation, displaySuccess, displayErrorAndReturnNewFormData, cancelErrorState} from '../../../Utils/fieldValidator'


export default function AdminAddAndEditCategoryPage(  {editCategory}){

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [images, setImages] = useState([]) 

    const [parentCategory, setParentCategory] = useState()
    const [relatedCategory, setRelatedCategory] = useState([])
    const [relatedCategoryError, setRelatedCategoryError] = useState(false)

    const commonBadges = useRef(["New", "Bestseller", "Top-rated"])
    const badgeListRef = useRef(null)

    const [categoryData, setCategoryData] = useState({})
    const [allCategoryNames, setAllCategoryNames] = useState([])

    const [radioCheckedCategory, setRadioCheckedCategory] = useState('')
    const [manualCheckCategory, setManualCheckCategory] = useState({})

    const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['parentCatDropdown', 'relatedCatDropdown', 'badgeDropdown'])
    
    const dispatch = useDispatch()
    const {success, loading, error, tempDatas, categories, categoryCreated, categoryUpdated} = useSelector((state)=> state.categoryStore)

    const navigate = useNavigate()
    const location = useLocation()
    const editCategoryItem = useRef(null)

    const primaryColor = useRef('rgba(215, 241, 72, 1)')

    const hiddenInputRef = useRef(null)

    const {setPageBgUrl} = useOutletContext() 
    setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.95),rgba(255,255,255,0.95)), url('/Images/admin-bg1.png')`)

    useEffect(()=>{
        setCategoryData({...categoryData, images, parentCategory, relatedCategory, startDate, endDate})
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

    useEffect(()=> {
        if(radioCheckedCategory){
            setParentCategory(radioCheckedCategory)
        }else setParentCategory(null)
    },[radioCheckedCategory])

    useEffect(()=> {
        const relatedCategories = Object.keys(manualCheckCategory).filter(cat=> manualCheckCategory[cat] == true)
        setRelatedCategory(relatedCategories)
    },[manualCheckCategory])

    useEffect(() => {
        if(location?.state?.category){
           editCategoryItem.current = location.state.category;
           dispatch(getCategoryNames({id: location.state.category._id}))
        }
   },[location])

   useEffect(()=> {
       if(error){
           sonnerToast.error(error)
           dispatch(resetStates())
       }
    }, [error])

   const loadCategoryInfo = async(id)=> {
        try{
            const response = await apiClient.get(`/admin/products/category/${id}`)
            if(response && response.status === 200){
                return {
                    parentCategory: response.data.category.parentCategory.name,
                    relatedCategory: response.data.category.relatedCategory.map(cat=> cat.name)
                }
            }
        }
        catch(error){
            if (!error.response) {
              sonnerToast.error("Network error. Please check your internet.")
            }else {
              sonnerToast.error("Something went wrong! Please retry later.")
              navigate(-1)
            }
        }
   }

    useEffect(()=>{
        if(editCategoryItem.current){
        const convertToBlob = async (url) => {
            try {
                const response = await fetch(url, {mode: 'cors'});
                return await response.blob();
            } catch (error) {
                sonnerToast.error("Error while loading the thumbnail!")
            }
        }
        const loadCategoryData = async () => {   
                setCategoryData({
                    "categoryName": editCategoryItem.current.name,
                    "categoryDescription": editCategoryItem.current.description,
                    "categoryDiscount": editCategoryItem.current?.discount || null,
                    "categoryBadge": editCategoryItem.current?.badge ||null,
                    "startDate": editCategoryItem.current?.seasonalActivation?.startDate || null,
                    "endDate": editCategoryItem.current?.seasonalActivation?.endDate || null,
                })

                setStartDate(new Date(editCategoryItem.current?.seasonalActivation?.startDate) || null)
                setEndDate(new Date(editCategoryItem.current?.seasonalActivation?.endDate) || null)

                const categoryParentAndRelated = await loadCategoryInfo(editCategoryItem.current._id)
                setParentCategory(categoryParentAndRelated.parentCategory || null)
                setRelatedCategory(categoryParentAndRelated.relatedCategory || [])
                const blob = await convertToBlob(editCategoryItem.current.image.url);
                const newImage = {...editCategoryItem.current.image, blob};
                setImages([newImage]);
        }
        loadCategoryData()
       }
    },[tempDatas])

    useEffect(()=>{
        if(categoryCreated){
            categoryCreated && sonnerToast.success('Created category succesfully!')
            dispatch(resetStates())
            setTimeout(()=> {navigate('/admin/category', {
                replace: true, 
                state: { from: location.pathname }
            })}, 1000)
        }
        if(editCategory && categoryUpdated){
            categoryUpdated && sonnerToast.success('Updated category succesfully!')
            dispatch(resetStates())
            setTimeout(()=> {navigate("/admin/category", {
                replace: true,
                state: { from: location.pathname },
            })}, 1000)
        }
    },[categoryCreated, categoryUpdated])

    const changeHandler = (e, fieldName)=>{
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
         if(!fieldName=='categoryBadge'){
            e.target.value.trim()? null : e.target.previousElementSibling.style.display = 'inline-block'
         }else{
            e.target.parentElement.firstElementChild.style.display = 'inline-block'
         }
         if(fieldName){
            const value = e.target.value
            const statusObj = (options?.optionalField) ? handleInputValidation(fieldName, value, {optionalField: true}) : handleInputValidation(fieldName, value)
            if(!statusObj.error && statusObj.message.startsWith("Optional")){
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
        relatedCategoryError && setRelatedCategoryError('')
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
                if(relatedCategory.length < 2){
                    e.target.checked = true
                    setRelatedCategory([...relatedCategory, name])
                }else{
                    e.target.checked = false
                    closeList()
                }
            }else{
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
        const requiredFields = ["categoryName","categoryDescription","images"]
        if( (Object.keys(categoryData).length >= 3 && requiredFields.every(field=> Object.keys(categoryData).includes(field) )) && Object.values(categoryData).find(inputValues=> inputValues !== 'undefined')){
            const formData = new FormData()
            const {images, ...rest} = categoryData
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
                    sonnerToast.info("The image has been compressed as its size exceeded 5 MB!")
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
            editCategory? dispatch( updateCategory( {formData, id: editCategoryItem.current._id}) ) : dispatch( createCategory( {formData}) )
            sonnerToast.info("Uploading the informations...")
        } 
        else{
            if(!Object.keys(categoryData).length){
                sonnerToast.error("Please enter all the fields!", {description: "Some required details are missing. Fill them in to continue."})
            }
            else{
                sonnerToast.error("Please check the fields and submit!", {description: "Some required details are wrong. Check them and continue."})
            }
        }
    }


    return(
        <section id='AdminAddAndEditCategoryPage'>

            <header>
                    {/* <input type='search' placeholder='Search Categories' className='w-[12rem] h-[35px] border-dotted bg-[#fefff8]
                             rounded-[7px] placeholder:text-[11px]' /> */}
                <AdminTitleSection heading={ editCategory ? 'Edit Category' : 'Add Category'} 
                        subHeading={ editCategory ? "Update the Category information" : "Create and organize categories here"}/>
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
                        <div className='relative' ref={dropdownRefs.parentCatDropdown}>
                            <span className='absolute -top-[1.3rem] left-0 text-[10px] text-muted whitespace-nowrap'>
                                 {`You can replace the parent category using the dropdown below.`} 
                            </span>
                            <PlaceholderIcon icon={<MdOutlineCategory/>} fromTop={35}/>
                            <div className={`w-[20rem] h-[2.4rem] border border-primary rounded-[5px] pr-0 text-[12px]
                                 bg-white relativecursor-pointer 
                                 ${openDropdowns.parentCatDropdown ? '!rounded-bl-none !rounded-br-none' : '!rounded-bl-[5px] !rounded-br-[5px]'}`} 
                                     onClick={(e)=> toggleDropdown('parentCatDropdown')} >
                                <span className='absolute top-[10px] left-[25px]'> {categoryData.parentCategory && categoryData.parentCategory} </span>
                                <i className='w-full h-full flex items-center justify-end pr-[5px] cursor-pointer'> <MdArrowDropDown/> </i>
                            </div>
                            {
                                openDropdowns.parentCatDropdown && 
                                    <div className='absolute top-[38px] flex flex-col justify-center items-center gap-[3px] w-full h-fit 
                                        py-[10px] px-[10%] rounded-[5px] bg-white border border-primary rounded-tl-none 
                                        rounded-tr-none z-[5]'>
                                        {/* {allCategoryNames.map(name=>
                                             <span className='text-[11px] text-secondary capitalize w-full text-left pl-[20px] hover:bg-primary cursor-pointer' 
                                                        onClick={(e)=> selectListHandler(name,'parentCategory',e)} > 
                                                    {name}
                                             </span>
                                        )} */}
                                        <CategoryDisplay type='radioType' radioCheckedCategory={radioCheckedCategory} 
                                                setRadioCheckedCategory={setRadioCheckedCategory} styler={{borderBottomNone:true}}/>
                                    </div>
                            }
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
                        <div className='category-labels' id='relative-category'>
                        <h5> Related Categories </h5>
                            <p> 
                                Select related categories to link this category with others. This will help improve product discovery
                                by showing customers similar categories.
                            </p>
                        </div>
                        <div className='relative' ref={dropdownRefs.relatedCatDropdown}>
                            <span className='absolute -top-[1.3rem] left-0 text-[10px] text-muted whitespace-nowrap'>
                                 {`You can replace the related category using the dropdown below.`} 
                            </span>
                            <PlaceholderIcon icon={<TbCirclesRelation/>} fromTop={35}/>
                            <div className={`w-[20rem] h-[3rem] border border-primary rounded-[5px] flex justify-center items-center pr-0 
                                text-[12px] bg-white cursor-pointer 
                                ${openDropdowns.relatedCatDropdown ? '!rounded-bl-none !rounded-br-none' : '!rounded-bl-[5px] !rounded-br-[5px]'}`}
                                        onClick={(e)=> {
                                            toggleDropdown('relatedCatDropdown') 
                                            if(relatedCategoryError) setRelatedCategoryError('')
                                        }}>
                                {relatedCategory && 
                                 <div className='flex items-center gap-[5px] ml-[10%]'>
                                 { relatedCategory.map(cat=> (
                                     <span className=' flex items-center gap-[2px] border border-secondary rounded-[10px] px-[9px] py-[1px] text-[10px] text-secondary'> 
                                         <span> {cat} </span>
                                         <IoIosClose className='w-[15px] h-[15px]' onClick={(e)=> {
                                            setRelatedCategory(relatedCat=> relatedCat.filter(rcat=> rcat !== cat))
                                            setManualCheckCategory(catObj=> {
                                                return {...catObj, [cat]:false}
                                            })
                                         }}/>
                                     </span>
                                 )) }
                                 </div>
                                }
                                <i className='w-full h-full flex items-center justify-end pr-[5px] cursor-pointer'> <MdArrowDropDown/> </i>
                            </div>
                            {
                                openDropdowns.relatedCatDropdown &&
                                    <div className='absolute top-[47px] flex flex-col justify-center items-center gap-[3px] w-full h-fit py-[10px]
                                            px-[10%] rounded-[5px] bg-white border border-primary rounded-tl-none rounded-tr-none z-[5]'>

                                        <CategoryDisplay type='manualCheckboxType' manualCheckCategory={manualCheckCategory} 
                                                setManualCheckCategory={setManualCheckCategory} setRelatedCategoryError={setRelatedCategoryError} 
                                                styler={{borderBottomNone:true}}/>
                                        {relatedCategoryError && <p className='error mb-[1rem]'> {relatedCategoryError} </p>}

                                    </div>  
                            }
                             
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
                        <div className='relative' ref={dropdownRefs.badgeDropdown}>
                            <PlaceholderIcon icon={<SlBadge/>} />
                            <div className={`w-[20rem] h-[2.4rem] border border-primary rounded-[5px] pr-0 flex items-center justify-between
                                ${openDropdowns.badgeDropdown ? '!rounded-bl-none !rounded-br-none' : '!rounded-bl-[5px] !rounded-br-[5px]'}`}>
                                <input type='text' id='category-badge' required className='pl-[23px]' style={{width:'17rem', height:'100%', border:'none', borderRadius:'none'}}
                                    onFocus={(e)=> badgeFocusHandler(e)} onBlur={()=> hiddenInputRef.current.click()} 
                                        onClick={(e)=> toggleDropdown('badgeDropdown')} 
                                         onChange={(e)=> changeHandler(e, "categoryBadge")} value={categoryData.categoryBadge}
                                    placeholder='You can enter a badge or choose one from the dropdown'
                                />
                                <i className='pr-[5px] cursor-pointer'> <MdArrowDropDown/> </i>
                            </div>
                            <input type='hidden' ref={hiddenInputRef} onClick={(e)=> inputBlurHandler(e, "categoryBadge", {optionalField: true})} value={categoryData.categoryBadge}/>
                            <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p> {/* Should come this in the place of <i>*/}
                            {
                                openDropdowns.badgeDropdown &&
                                    <div className='absolute top-[34px] flex flex-col justify-center items-center gap-[3px] w-full h-full
                                                rounded-[5px] bg-white border border-primary rounded-tl-none rounded-tr-none '
                                                 ref={badgeListRef}>
                                        {commonBadges.current.map(name=>
                                             <span className='text-[11px] text-secondary capitalize w-full text-center hover:bg-primary cursor-pointer' 
                                                        onClick={(e)=> selectListHandler(name,'categoryBadge',e)} > 
                                                    {name}
                                             </span>
                                        )}
                                    </div>
                            }
                            
                        </div> 
                    </div>

                    <div className='w-[20%] mt-[2rem]'>
                        <SiteButtonSquare customStyle={{paddingInline:'50px', paddingBlock:'9px', borderRadius:'7px'}}
                                                clickHandler={(e)=>{ submitHandler(e)}}>
                                 {loading? <CustomHashLoader loading={loading}/> : 'Submit'}   
                        </SiteButtonSquare>
                    </div>
                </div>

                <div className='w-full basis-[35%] mt-[15px]'>

                <FileUpload images={images} setImages={setImages} imageLimit={1} needThumbnail={false} imageType='Category'
                    imagePreview={{status: true, imageName: `${categoryData?.categoryName ? categoryData?.categoryName : 'Category Name'}`}}
                        imageCropperBgBlur={false}/>

                </div>
            </main>

        </section>
    )
}