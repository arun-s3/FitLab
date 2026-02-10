import React,{useState, useRef, useEffect} from 'react'
import './AdminAddAndEditProductPage.css'
import {useLocation, useNavigate, useOutletContext} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {motion} from 'framer-motion'

import {ProductIcon, ProductIcon2} from '../../../Components/Icons/Icons'
import {IoArrowBackSharp} from "react-icons/io5";
import {IoIosArrowRoundBack} from "react-icons/io";
import {GoPackage} from "react-icons/go";
import {MdCurrencyRupee} from "react-icons/md";
import {LuPackage, LuPackageSearch} from "react-icons/lu";
import {LiaWeightSolid} from "react-icons/lia";
import {BsLightningCharge} from "react-icons/bs";
import {AiOutlineSafetyCertificate} from "react-icons/ai";
import {CgDetailsMore} from "react-icons/cg";
import {TbWeight} from "react-icons/tb";
import {IoColorPaletteOutline} from "react-icons/io5";
import {toast as sonnerToast} from 'sonner'
import {toast} from 'react-toastify'

import AdminTitleSection from '../../../Components/AdminTitleSection/AdminTitleSection'
import FileUpload from '../../../Components/FileUpload/FileUpload';
import TagGenerator from '../../../Components/TagGenerator/TagGenerator';
import PlaceholderIcon from '../../../Components/PlaceholderIcon/PlaceholderIcon'
import SelectCategoryForAdmin,{SelectSubCategoryForAdmin} from '../../../Components/SelectCategoryForAdmin/SelectCategoryForAdmin';
import {createProduct, updateProduct, resetStates} from '../../../Slices/productSlice'
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons';
import {CustomHashLoader} from '../../../Components/Loader/Loader'
import {handleImageCompression} from '../../../Utils/compressImages'
import {handleInputValidation, displaySuccess, displayErrorAndReturnNewFormData, cancelErrorState} from '../../../Utils/fieldValidator'


export default function AdminAddAndEditProductPage({ editProduct }){

    const [tag, setTags] = useState([])
    const [thumbnail, setThumbnail] = useState({})
    const [thumbnailIndexOnEditProduct, setThumbnailIndexOnEditProduct] = useState(0)
    const [images, setImages] = useState([])
    const [category, setCategory] = useState([])
    const [subCategory, setSubCategory] = useState('')
    const [productData, setProductData] = useState({targetMuscles: []})

    const {setPageBgUrl} = useOutletContext() 
    setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.9),rgba(255,255,255,0.9)), url('/Images/admin-bg.jpg')`)

    const [variantsDisabledMsg, setVariantsDisabledMsg] = useState(false)

    const [startedSubmission, setStartedSubmission] = useState(false)

    const [categoryImgPreview, setCategoryImgPreview] = useState('')
    const categoryBgImage = {
        backgroundImage: `linear-gradient(to right, rgba(243, 230, 251, 0.85), rgba(243, 230, 251, 0.85)), url('/Images${categoryImgPreview}')`,
        backgroundPosition:'center',
        backgroundSize:'cover'
    }

    const editProductItem = useRef(null)

    const primaryColor = useRef('rgba(215, 241, 72, 1)')

    const dispatch = useDispatch()
    const {productCreated, productUpdated, loading, error} = useSelector((state)=> state.productStore)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        console.log("Images-->", JSON.stringify(images))
        console.log("Thumbnail-->", JSON.stringify(thumbnail))
        console.log("SubCategory---->", subCategory)
        if(category.length == 0) setCategoryImgPreview('')

        setProductData({ ...productData, category: category, subCategory, images: images, thumbnail: thumbnail });
    }, [category, subCategory, images, thumbnail]);

    useEffect(()=>{
        // console.log("tag-->", JSON.stringify(tag))
        let tagStrings = tag.map(tag=> tag.key)
        tagStrings = [...new Set(tagStrings)]
        console.log("tagStrings-->", tagStrings)
        setProductData({...productData, tags: tagStrings})
    },[tag])
    
    useEffect(()=>{
        console.log("PRODUCTDATA-->", JSON.stringify(productData))
        if(categoryImgPreview){
            console.log("categoryImgPreview-->", categoryImgPreview)
        }
    },[productData, categoryImgPreview])

    useEffect(() => {
        console.log("Inside useEffect() for editProduct----")
        const convertToBlob = async (url) => {
            try {
                const response = await fetch(url, { mode: 'cors' });
                return await response.blob();
            } catch (error) {
                console.log("Error in convertToBlob-->", error.message);
            }
        }
        const loadProductData = async () => {
            if (location?.state?.product) {
                console.log("location.state-->", JSON.stringify(location.state));
                editProductItem.current = location.state.product;    
                setProductData({
                    "title": editProductItem.current.title,
                    "price": editProductItem.current.prices || [],
                    "stock": editProductItem.current.stocks || [],
                    [`${editProductItem.current.variantType}s`] 
                        : editProductItem.current[`${editProductItem.current.variantType}s`] || [],
                    "brand": editProductItem.current.brand,
                    "subtitle": editProductItem.current.subtitle || '',
                    "targetMuscles":  editProductItem.current.targetMuscles || [],
                    "description": editProductItem.current.description || '',
                    "additionalInformation": editProductItem.current.additionalInformation || []
                });
                setCategory(editProductItem.current.category)
                setSubCategory(editProductItem.current.subCategory)
                images.forEach((img,index)=> console.log(`image[${index}]from state of location on Edit-->`, JSON.stringify(img)))
                console.log("thumbnail from state of location on Edit-->", JSON.stringify(thumbnail))
                const newImages = await Promise.all(
                    editProductItem.current.images.map(async (img) => {
                        const blob = await convertToBlob(img.url);
                        // const url = await convertBlobToUrl(blob)
                        // console.log("imageUrl after conversion from blob--->", url)
                        return {...img, blob};
                    })
                );
                setImages(newImages);
                const thumbnailBlob = await convertToBlob(editProductItem.current.thumbnail.url);
                setThumbnail({ ...editProductItem.current.thumbnail, blob: thumbnailBlob});
                console.log("editProductItem.current.tags-->", editProductItem.current.tags);
                console.log("isThumbnails from parent-->", newImages.map(img=> img.isThumbnail))
                const foundThumbnailIndex = newImages.map(img=> img.isThumbnail).findIndex(el=> el=='true')
                console.log("FOUND THUMBNAIL INDEX-->", foundThumbnailIndex)
                setThumbnailIndexOnEditProduct(foundThumbnailIndex)
            }
        };
        loadProductData();  
    },[location]);
    
    useEffect(()=>{
        console.log(`Inside useEffect for productCreated, productUpdated success, productUpdated-${productUpdated} productCreated-${productCreated}`)
        if(productCreated || (editProduct && productUpdated)){
            productCreated && sonnerToast.success('Created product succesfully!')
            productUpdated && sonnerToast.success('Updated product succesfully!')
            dispatch(resetStates())
            navigate("/admin/products", { replace: true })
            // setTimeout(()=> {navigate('/admin/products', {replace: true})}, 1000)
        }
    },[productCreated, productUpdated])

    const muscleGroups = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Quadriceps", "Hamstrings", "Glutes", "Calves",
        "Core", "Abs", "Full Body", "Cardio"]

    const muscleGroupPics = {
        chest: "/Images/MuscleGroups/chest.jpg",
        back: "/Images/MuscleGroups/back.jpg",
        shoulders: "/Images/MuscleGroups/shoulders.jpg",
        biceps: "/Images/MuscleGroups/biceps.jpg",
        triceps: "/Images/MuscleGroups/triceps.jpg",
        forearms: "/Images/MuscleGroups/forearms.jpg",
        quadriceps: "/Images/MuscleGroups/quads.jpg",
        hamstrings: "/Images/MuscleGroups/hams.jpg",
        glutes: "/Images/MuscleGroups/glutes.jpg",
        calves: "/Images/MuscleGroups/calves.jpg",
        abs: "/Images/MuscleGroups/abs.jpg",
    }

    const changeHandler = (e, fieldName)=> {
        console.log(" inside Changehandler")
        setProductData({...productData, [fieldName]: e.target.value})
    }

    const additionalInfoChangeHandler = (e)=> {
        const value = e.target.value
        const lines = value.split(/\r?\n/)
        setProductData({...productData, additionalInformation: lines})
    }

    const additionalInfoBlurHandler = (e)=> {
            console.log("if(fieldName == 'additionalInformation')")
            const infoArr = productData?.additionalInformation.filter(info=> info !== null && info.trim() !== "")
            console.log("infoArr---->", JSON.stringify(infoArr))
            setProductData({...productData, additionalInformation: [...infoArr] })
    }
    
    const inputFocusHandler = (e)=>{ e.target.previousElementSibling.style.display = 'none' }

    const inputBlurHandler = (e, fieldName, options, limits)=>{
         console.log("inside inputBlurHandler, fieldname", fieldName)
         e.target.value.trim()? null : e.target.previousElementSibling.style.display = 'inline-block'
         if(fieldName){
            let uniqueArr
            const arrayFields = ['weights', 'stock', 'price', 'sizes', 'motorPowers', 'colors']
            if(arrayFields.some(field=> field === fieldName)){
                let arr = e.target.value.trim().split(',')
                arr = arr.map(el=> el.trim())
                uniqueArr = new Set([...arr])
                fieldName === 'weights' 
                    ? setProductData({...productData, weights: [...uniqueArr]})
                    : fieldName === 'stock' 
                    ? setProductData({...productData, stock: [...uniqueArr]})
                    : fieldName === 'price' 
                    ? setProductData({...productData, price: [...uniqueArr]})
                    : fieldName === 'sizes' 
                    ? setProductData({...productData, sizes: [...uniqueArr]})
                    : fieldName === 'motorPowers' 
                    ? setProductData({...productData, motorPowers: [...uniqueArr]})
                    : setProductData({...productData, colors: [...uniqueArr]})
            }
            const value = (arrayFields.some(field=> field === fieldName)) ? Array.from(uniqueArr) : productData[fieldName]
            const statusObj = (options?.optionalField) 
                ? handleInputValidation(fieldName, value, {optionalField: true}, limits) 
                : handleInputValidation(fieldName, value, limits)
            console.log("statusObj from inputBlurHandler--> ", JSON.stringify(statusObj))
            if(!statusObj.error && statusObj.message.startsWith("Optional")){
                console.log("Inside here----")
                // e.target.nextElementSibling.textContent = ''
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

    // const handleImageCompression = async (file) => {
    //     console.log("Inside imageCompressor")
    //     const options = {
    //         maxSizeMB: 2,         
    //         maxWidthOrHeight: 1024, 
    //     }
    //     try {
    //         console.log("Compressing..")
    //         const compressedFile = await imageCompression(file, options);
    //         return compressedFile
    //     } catch (error) {
    //         console.error('Error during compression:', error)
    //     }
    // }
 
    const handleMuscleChange = (muscle) => {
        setProductData((datas) => ({
          ...datas,
          targetMuscles: datas?.targetMuscles?.includes(muscle)
            ? datas.targetMuscles.filter((m) => m !== muscle)
            : [...datas?.targetMuscles, muscle]
        }))
    }

    const submitHandler = async (e)=>{
        console.log("Inside submitData()--")
        setStartedSubmission(true)

        const checkVariantDataValidity = (variantAttribute)=> {
            if(productData[variantAttribute] && productData[variantAttribute].length !== productData['stock'].length ){
                console.log(`Enter stock quantities for each ${variantAttribute} variant — exactly one per variant!`)
                sonnerToast.error(`Enter stock quantities for each ${variantAttribute} variant — exactly one per variant!`)
                return false
            }
            if(productData[variantAttribute] && productData[variantAttribute].length !== productData['price'].length ){
                console.log(`Enter prices for each ${variantAttribute} variant — exactly one per variant!`)
                sonnerToast.error(`Enter prices for each ${variantAttribute} variant — exactly one per variant!`)
                return false
            }
            return true
        }
        const variantAttributes = ['weights', 'sizes', 'motorPowers', 'colors']
        const doesMultipleVariantAttrExists = variantAttributes.filter(attribute=> productData[attribute]).length > 1
        console.log("doesMultipleVariantAttrExists---->", doesMultipleVariantAttrExists)
        if(doesMultipleVariantAttrExists){
            sonnerToast.error("Only one variant attribute (weights, sizes, motor power, or colors) can be selected!")
            return
        }

        const userSelectedVariantAttr = variantAttributes.find(attribute=> productData[attribute])
        console.log("userSelectedVariantAttr-->", userSelectedVariantAttr)
        if( !checkVariantDataValidity(userSelectedVariantAttr) ) return

        const optionalFields = ["description", "additionalInformation", "tags", ...variantAttributes]
        const requiredFields = Object.keys(productData).filter(field=> !optionalFields.includes(field))
        const isRequiredFieldsMissing = requiredFields.some(field=> productData[field] === undefined || productData[field].toString().trim() === '')
        console.log("productData---->", productData)
        console.log("Object.keys(productData).length----->", Object.keys(productData).length)
        console.log("Object.keys(productData).find(field=> !optionalFields.includes(field)---->", Object.keys(productData).find(field=> !optionalFields.includes(field)))
        console.log("Required fields---->", requiredFields)
        // if( (Object.keys(productData).length <= 9 && optionalFields.some(field=> !Object.keys(productData).includes(field) )) || 
        //         Object.keys(productData).find(field=> !optionalFields.includes(field) && (productData[field] === undefined || productData[field].toString().trim() === ''))){
        if(isRequiredFieldsMissing){
            if(!Object.keys(productData).length){
                console.log("No Fields entered!")
                toast.error("Please enter all the fields!")
            }
            else{
                console.log("Check errors"+JSON.stringify(productData))
                sonnerToast.error("Please check the fields and submit again!")
            }
        } 
        else{
            console.log("Inside else(no errors) of submitData() ")
            console.log("ProductData now-->"+JSON.stringify(productData))

            const formData = new FormData()
            const {images, thumbnail, ...rest} = productData

            rest.variantType = userSelectedVariantAttr

            console.log("Images-->", JSON.stringify(images))
            console.log("Thumbnail-->",JSON.stringify(thumbnail))
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

            const compressedImageBlobs = async(images)=>{
                return await Promise.all( images.map( async(image)=> {
                    if(image.size > (5*1024*1024)){
                        const newBlob = await handleImageCompression(image.blob)
                        sonnerToast.info("Some images have been compressed as its size exceeded 5 MB!")
                        return newBlob
                    }else{
                        return image.blob
                    }
                }) )
            } 

            const newBlobs = await compressedImageBlobs(images)

            newBlobs.forEach((blob, index) => {
                formData.append('images', blob, `productImg${index}`);
            })
            const thumbnailIndex = images.findIndex(img=> img.isThumbnail)
            console.log("thumbnailIndex-->", thumbnailIndex)
            if(thumbnailIndex !== -1){
                formData.append('thumbnail', newBlobs[thumbnailIndex], 'productThumbnail')
                formData.append('thumbnailImageIndex', thumbnailIndex)
            }else{
                console.log("thumbnail not found in the images")
                sonnerToast.error('Please select a Thumbnail!')
            }

            console.log("PRODUCTDATA BEFORE DISPATCHING-->", JSON.stringify(productData))

            editProduct?  dispatch( updateProduct({formData, id: editProductItem.current._id}) ) : dispatch( createProduct({formData}) )
            sonnerToast.info("Uploading your product...")
            console.log("Dispatched successfully--")
            setStartedSubmission(false)
        }
    }
    

    return(
        <section id='AdminAddProduct'> 
            <header>
                {/* <i className='p-[7px] border border-[#c4c6ca] rounded-[4px]'> <IoArrowBackSharp/> </i>
                <h1>{ editProduct ? 'Edit Product' : 'Add Product'}</h1> */}
                <AdminTitleSection heading={ editProduct ? 'Edit Product' : 'Add Product'} 
                        subHeading={ editProduct ? "Update the product information" : "Fill in the details to add a new product"}/>
            </header>
            <main className='flex gap-[10px]'>
                <div className='flex flex-col gap-[15px] basis[60%] w-[60%]'>

                    <div className='flex flex-col gap-[5px] justify-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            <label for='product-name'> Product Name</label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<GoPackage/>}/>
                                <input type='text' placeholder='Type name here' id='product-name' required className='pl-[21px] w-full' 
                                            onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e, "title")}
                                                onChange={(e)=> changeHandler(e, "title")} value={productData.title}/>
                                <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                            </div>
                        </div>
                        <div className='flex gap-[5px] items-center'>
                            <div className='input-wrapper'>
                                <label for='product-price'> Price </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<MdCurrencyRupee/>} fromTop={35}/>
                                    <input type='text' id='product-price' required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                       onBlur={(e)=> inputBlurHandler(e, "price")} onChange={(e)=> changeHandler(e, "price")} value={productData.price}/>
                                    <span className='text-[10px] text-[#7e7d81] absolute left-0 -bottom-[31px]'>
                                        For multiple variants, enter the price for each variants separated by commas.
                                    </span> 
                                    <p className='error !absolute !top-[68px] left-0 !h-0 !mt-0' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                                </div>
                            </div>
                            <div className='input-wrapper'>
                                <label for='product-stock'> Stock </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<LuPackageSearch/>} fromTop={35}/>
                                    <input type='text' placeholder='' id='product-stock' required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                            onBlur={(e)=> inputBlurHandler(e, "stock")} onChange={(e)=> changeHandler(e, "stock")} value={productData.stock}/>
                                    <span className='text-[10px] text-[#7e7d81] absolute left-0 -bottom-[31px]'>
                                        For multiple variants, enter stock values for each variant separated by commas.
                                    </span> 
                                    <p className='error !absolute !top-[68px] right-0 !h-0 !mt-0' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                                </div>
                            </div>
                        </div>
                        <div className='input-wrapper mt-[2.5rem]'>
                            <label for='product-brand'> Brand </label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<AiOutlineSafetyCertificate/>}/>
                                <input type='text' placeholder='Brand name' id='product-brand' required  className='pl-[21px] w-full' 
                                   onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e , "brand")} onChange={(e)=> changeHandler(e, "brand")}
                                    value={productData.brand}/>
                                <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            <label for='product-subtitle' className='flex items-center gap-[10px]'>
                                 <span> Subtitle </span>
                                 <span className=' text-[10px] text-secondary'> (The subtitle should contain the primary information about the product.)  </span>
                            </label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<CgDetailsMore/>} fromTop={14} />
                                <textarea placeholder='Type subtitles here' rows='3' cols='70' maxlength='2000' id='product-subtitle'
                                    required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e, "subtitle")}
                                     onChange={(e)=> changeHandler(e, "subtitle")} value={productData.subtitle}/>
                                <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper categories'>
                        
                        <SelectCategoryForAdmin category={category} setCategory={setCategory} {...(editProduct && { editCategory: editProductItem?.current?.category})}/>
                            
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper' 
                        style={ categoryImgPreview? categoryBgImage : {}}>
                        <div className='input-wrapper categories'>
                            <SelectSubCategoryForAdmin category={category} setCategory={setCategory} setSubCategory={setSubCategory} categoryImgPreview={categoryImgPreview} setCategoryImgPreview={setCategoryImgPreview}/>                    
                        </div>
                    </div>

                    <div className='flex flex-col gap-[1rem] justify-center product-input-wrapper' 
                        onMouseEnter={()=> !category.length ? setVariantsDisabledMsg(true) : setVariantsDisabledMsg(false)}
                        onMouseLeave={()=> setVariantsDisabledMsg(false)}
                    >
                    <div className='flex gap-8 items-center'> 
                        <div className='input-wrapper'>  
                            <label for='product-price'> Weights Available (For strength based products only) </label>
                            <div className='relative'>  
                                <PlaceholderIcon icon={<TbWeight/>} fromTop={20}/>
                                <input type='text' id='product-weights' required className='pl-[21px] disabled:cursor-not-allowed ' 
                                    placeholder='In Kg (Optional field)' onFocus={(e)=> inputFocusHandler(e)} 
                                    onBlur={(e)=> inputBlurHandler(e, "weights", {optionalField: true})} onChange={(e)=> changeHandler(e, "weights")} 
                                    value={productData.weights} disabled={category?.[0] !== 'strength'}
                                />
                                <p className='mt-[4px] text-[10px] text-[#7e7d81] left-0 -bottom-[31px]'>
                                        For multiple variants, enter weight values for each variant separated by commas.
                                </p> 
                                <p className='error !absolute !top-[72px] right-0 !h-0 !mt-0' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                            </div>
                        </div>
                        <div className='input-wrapper'>
                            <label for='product-stock'> Motor Powers (For cardio based products only) </label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<BsLightningCharge/>} fromTop={20}/>
                                <input type='text' placeholder='Eg: 5.5 (Optional field)' id='product-motorPowers' required className='pl-[21px] disabled:cursor-not-allowed ' 
                                    onFocus={(e)=> inputFocusHandler(e)} 
                                    onBlur={(e)=> inputBlurHandler(e, "motorPowers", {optionalField: true})} onChange={(e)=> changeHandler(e, "motorPowers")} 
                                    value={productData.motorPowers} disabled={category?.[0] !== 'cardio'}/>
                                <p className='mt-[4px] text-[10px] text-[#7e7d81] left-0 -bottom-[31px]'>
                                    For multiple variants, enter power values for each variant separated by commas.
                                </p> 
                                <p className='error !absolute !top-[72px] right-0 !h-0 !mt-0' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p>
                            </div>
                        </div> 
                        </div>
                        <div className='flex gap-8 items-center'>
                            <div className='input-wrapper'>
                                <label for='product-brand'>  Colors (For accessory based products) </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<IoColorPaletteOutline/>} fromTop={20}/>
                                    <input type='text' placeholder='Eg: red (Optional field)' id='product-colors' required  className='pl-[21px] w-full disabled:cursor-not-allowed ' 
                                       onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e , "colors", {optionalField: true})} onChange={(e)=> changeHandler(e, "colors")}
                                        value={productData.colors} disabled={category?.[0] !== 'accessories'}/>
                                    <p className='mt-[4px] text-[10px] text-[#7e7d81]  left-0 -bottom-[31px]'>
                                        For multiple variants, enter color values for each variant separated by commas.
                                    </p> 
                                    <p className='error !absolute !top-[72px] right-0 !h-0 !mt-0' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p>
                                </div>
                                <p className='error mt-[5px]' onClick={(e)=> cancelErrorState(e, primaryColor.current)}> 
                                    {variantsDisabledMsg && "Please choose a category first!"}
                                </p>
                            </div>
                            <div className='input-wrapper !-mt-[24px]'>  
                                <label for='product-brand'>  Sizes (For supplement based products only) </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<LiaWeightSolid/>} fromTop={20}/>
                                    <input type='text' placeholder='Eg: 2L, 500ml, 2Kg, 2 serving (Optional field)' id='product-sizes' required  className='pl-[21px] w-full disabled:cursor-not-allowed ' 
                                       onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e , "sizes", {optionalField: true})} 
                                       onChange={(e)=> changeHandler(e, "sizes")}
                                        value={productData.sizes} disabled={category?.[0] !== 'supplements'}/>
                                    <p className='mt-[4px] text-[10px] text-[#7e7d81]  left-0 -bottom-[31px]'> 
                                        For multiple variants, enter size values for each variant separated by commas.
                                    </p> 
                                    <p className='error !absolute !top-[72px] right-0 !h-0 !mt-0' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            <label for='product-description'> Description (optional)</label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<CgDetailsMore/>} fromTop={8} />
                                <textarea placeholder='Type description here' rows='7' cols='70' maxlength='2000' id='product-description'
                                    required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                     onChange={(e)=> changeHandler(e, "description")} value={productData.description}/>
                                <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p>
                            </div>
                        </div>
                    </div>

                    <div className='product-input-wrapper relative'>
                        <p className='label'> Target Muscles (optional)</p>
                        <div className="mt-4 grid grid-cols-4 gap-2 overflow-visible pl-2">
                          {muscleGroups.map((muscle, index) => (
                            <span key={muscle}
                              className="flex items-center space-x-2 cursor-pointer text-[11.6px]
                                !text-gray-700 hover:text-secondary">
                                <input
                                  type="checkbox"
                                  checked={productData?.targetMuscles?.includes(muscle)}
                                  onChange={() => handleMuscleChange(muscle)}
                                  className="!w-[12px] !h-[12px] !text-secondary !rounded-[2px] focus:ring-2 !ring-secondary !outline-secondary"
                                />
                                <span className="text-[11px] text-inherit dark:text-gray-300"> {muscle} </span>
                            </span>
                          ))}
                        </div>
                        {/* {   productData.targetMuscles &&
                            <img src={muscleGroupPics.find(pic=> productData.targetMuscles.some(muscle=> pic.includes(muscle.toLowerCase())))} 
                                className='absolute right-[-31px] w-[30%] h-auto rounded-[8px]'/>
                        } */}
                        {productData.targetMuscles && (
                          (() => {
                            const match = Object.keys(muscleGroupPics).find((muscle, picIndex) =>
                              productData.targetMuscles.some((m, muscleIndex) =>
                                m.toLowerCase().includes(muscle) && muscleIndex === productData.targetMuscles.length - 1
                              )
                            );
                            return (
                              match && (
                                <img
                                  src={muscleGroupPics[match]}
                                  alt={match}
                                  className="absolute -right-[30rem] -bottom-[9rem] w-[45%] h-auto rounded-[13px] outline outline-2 outline-primary"
                                />
                              )
                            );
                          })()
                        )
                        }
                    </div>

                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            <label for='product-additionalInfo'> Additional Information (optional) </label>
                            <div className='relative'>
                                <PlaceholderIcon icon={<CgDetailsMore/>} fromTop={7} />
                                <textarea placeholder='Type the additional informations and parameters of the product here line by line' rows='8' cols='70' maxlength='2000' id='product-additionalInformation'
                                    required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> additionalInfoBlurHandler(e)}
                                     onChange={(e)=> additionalInfoChangeHandler(e)} value={productData?.additionalInformation && productData.additionalInformation.join('\n')} />
                                <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            
                            <TagGenerator tag={tag} setTags={setTags} SetPlaceholderIcon={PlaceholderIcon} {...(editProduct && {editTags: editProductItem?.current?.tags} )}/> 

                        </div>
                    </div>
                    <div className='mt-[1rem] flex items-center gap-[1rem]'>
                        <motion.div whileTap={{ scale: 0.98 }} >
                            <SiteButtonSquare 
                                tailwindClasses={`hover:!bg-primaryDark transition duration-300`} 
                                customStyle={{paddingInline:'50px', paddingBlock:'9px', borderRadius:'7px'}}
                                                clickHandler={(e)=>{ submitHandler(e)}}>
                                 {loading? <CustomHashLoader loading={loading}/> : 'Submit'}  
                            </SiteButtonSquare>
                        </motion.div>
                        <p className='text-[11.5px] text-red-500 tracking-[0.5px]'> 
                            {(startedSubmission && !productData.subCategory) ? '*Please select a subcategory!' : '' } 
                        </p>
                    </div>
                </div>
                <div className='w-full basis-[37%]'>
 
                     <FileUpload images={images} setImages={setImages} imageLimit={6} needThumbnail={true} imageType='Product'
                         thumbnail={thumbnail} setThumbnail={setThumbnail} thumbnailIndexOnEditProduct={thumbnailIndexOnEditProduct} 
                            imageCropperBgBlur={false} editingMode={editProduct}/>

                </div>
            </main>
        </section>
    )
}