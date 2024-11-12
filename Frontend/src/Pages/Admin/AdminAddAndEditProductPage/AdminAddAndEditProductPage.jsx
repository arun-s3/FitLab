import React,{useState, useRef, useEffect} from 'react'
import './AdminAddAndEditProductPage.css'
import {useLocation, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {ProductIcon, ProductIcon2} from '../../../Components/Icons/Icons'
import {IoArrowBackSharp} from "react-icons/io5";
import {IoIosArrowRoundBack} from "react-icons/io";
import {GoPackage} from "react-icons/go";
import {MdCurrencyRupee} from "react-icons/md";
import {LuPackage, LuPackageSearch} from "react-icons/lu";
import {RiWeightLine} from "react-icons/ri";
import {AiOutlineSafetyCertificate} from "react-icons/ai";
import {CgDetailsMore} from "react-icons/cg";
import {toast} from 'react-toastify';

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
    const [subcategory, setSubcategory] = useState('')
    const [productData, setProductData] = useState({})

    const [categoryImgPreview, setCategoryImgPreview] = useState('')
    const categoryBgImage = {
        backgroundImage: `linear-gradient(to right, rgba(243, 230, 251, 0.85), rgba(243, 230, 251, 0.85)), url('${categoryImgPreview}')`,
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
        console.log("SubCategory---->", subcategory)
        if(category.length == 0) setCategoryImgPreview('')

        setProductData({ ...productData, category: category, subcategory, images: images, thumbnail: thumbnail });
    }, [category, subcategory, images, thumbnail]);

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
                    "price": editProductItem.current.price,
                    "stock": editProductItem.current.stock,
                    "weights": editProductItem.current.weights || [],
                    "brand": editProductItem.current.brand,
                    "description": editProductItem.current.description || '',
                });
                setCategory(editProductItem.current.category);
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
        if(editProduct && (productCreated || productUpdated)){
            productCreated && toast.success('Created product succesfully!')
            productUpdated && toast.success('Updated product succesfully!')
            dispatch(resetStates())
            setTimeout(()=> {navigate('/admin/products/list', {replace: true})}, 1000)
        }
    },[productCreated, productUpdated])

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

    const submitHandler = async (e)=>{
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
            console.log("ProductData now-->"+JSON.stringify(productData))
            const formData = new FormData()
            const {images, thumbnail, ...rest} = productData
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
                toast.error('Please select a Thumbnail!')
            }
            console.log("PRODUCTDATA BEFORE DISPATCHING-->", JSON.stringify(productData))
            editProduct?  dispatch( updateProduct({formData, id: editProductItem.current._id}) ) : dispatch( createProduct({formData}) )
            console.log("Dispatched successfully--")
        }
    }

    return(
        <section id='AdminAddProduct'> 
            <header className='flex gap-[10px] items-center'>
                <i className='p-[7px] border border-[#c4c6ca] rounded-[4px]'> <IoArrowBackSharp/> </i>
                <h1>{ editProduct ? 'Edit Product' : 'Add Product'}</h1>
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
                                                onChange={(e)=> changeHandler(e, "title")} value={productData.title}/>
                                <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                            </div>
                        </div>
                        <div className='flex gap-[5px] items-center'>
                            <div className='input-wrapper'>
                                <label for='product-price'> Price </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<MdCurrencyRupee/>}/>
                                    <input type='text' id='product-price' required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                       onBlur={(e)=> inputBlurHandler(e, "price")} onChange={(e)=> changeHandler(e, "price")} value={productData.price}/>
                                    <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                                </div>
                            </div>
                            <div className='input-wrapper'>
                                <label for='product-stock'> Stock </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<LuPackageSearch/>}/>
                                    <input type='text' placeholder='' id='product-stock' required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                            onBlur={(e)=> inputBlurHandler(e, "stock")} onChange={(e)=> changeHandler(e, "stock")} value={productData.stock}/>
                                    <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current)}></p>
                                </div>
                            </div>
                            <div className='input-wrapper'>
                                <label for='product-weight'> Weights Available (optional) </label>
                                <div className='relative'>
                                    <PlaceholderIcon icon={<RiWeightLine/>}/>
                                    <input type='text' placeholder='' id='product-weight' required  className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} 
                                         onBlur={(e)=> inputBlurHandler(e, "weights", {optionalField: true})}  onChange={(e)=> changeHandler(e, "weights")} 
                                            value={productData.weights}/>
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
                                   onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e , "brand")} onChange={(e)=> changeHandler(e, "brand")}
                                    value={productData.brand}/>
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
                                     onChange={(e)=> changeHandler(e, "description")} value={productData.description}/>
                                <p className='error' onClick={(e)=> cancelErrorState(e, primaryColor.current, {optionalField: true})}></p>
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
                            <SelectSubCategoryForAdmin category={category} setCategory={setCategory} setSubcategory={setSubcategory} categoryImgPreview={categoryImgPreview} setCategoryImgPreview={setCategoryImgPreview}/>                    
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            
                            <TagGenerator tag={tag} setTags={setTags} SetPlaceholderIcon={PlaceholderIcon} {...(editProduct && {editTags: editProductItem?.current?.tags} )}/> 

                        </div>
                    </div>
                    <div className='mt-[1rem]'>
                        <SiteButtonSquare customStyle={{paddingInline:'50px', paddingBlock:'9px', borderRadius:'7px'}}
                                            clickHandler={(e)=>{ submitHandler(e)}}>
                             {loading? <CustomHashLoader loading={loading}/> : 'Submit'}  
                        </SiteButtonSquare>
                    </div>
                </div>
                <div className='w-full h-screen basis-[37%]'>
 
                     <FileUpload images={images} setImages={setImages} imageLimit={6} needThumbnail={true}  thumbnail={thumbnail} setThumbnail={setThumbnail} thumbnailIndexOnEditProduct={thumbnailIndexOnEditProduct} />

                </div>
            </main>
        </section>
    )
}