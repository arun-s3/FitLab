import React, { useState, useEffect, useRef } from "react"
import './AdminCreateOfferPage.css'
import { useSelector, useDispatch } from "react-redux"
import {debounce} from 'lodash'

import { X, DiamondPercent, BadgePercent, BadgeIndianRupee, IndianRupee, Plus, Minus, Search, ChevronDown,
   ChevronUp, ListTodo, CalendarSync, RefreshCcw,
   Dot} from "lucide-react"
import { RiCoupon4Line } from "react-icons/ri"
import {MdOutlineCategory, MdArrowDropDown} from "react-icons/md"
import {CgDetailsMore} from "react-icons/cg"
import {TbShoppingCartDiscount} from "react-icons/tb"
import {GoDotFill} from "react-icons/go"
import {toast} from 'react-toastify'

import AdminTitleSection from "../../../Components/AdminTitleSection/AdminTitleSection"
import PlaceholderIcon from '../../../Components/PlaceholderIcon/PlaceholderIcon'
import CategoryDisplay from "../../../Components/CategoryDisplay/CategoryDisplay"
import FileUpload from '../../../Components/FileUpload/FileUpload'
import {handleImageCompression} from '../../../Utils/compressImages'
import {CustomHashLoader} from '../../../Components/Loader/Loader'
import {DateSelector} from '../../../Components/Calender/Calender'
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {handleInputValidation, displaySuccess, displayErrorAndReturnNewFormData, cancelErrorState} from '../../../Utils/fieldValidator'
import {createOffer, updateOffer, resetOfferStates} from '../../../Slices/offerSlice'
import {searchProduct, getAllProducts} from '../../../Slices/productSlice'
import {showUsers} from '../../../Slices/adminSlice'
import {camelToCapitalizedWords} from "../../../Utils/helperFunctions"



export default function AdminCreateOfferPage(){


  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    minimumOrderValue: "",
    applicableType: "allProducts",
    applicableCategories: [],
    applicableProducts: [],
    targetCustomers: 'all',
    recurringOffer: false,
  })

  const [showCategories, setShowCategories] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState({})
  const [selectedProducts, setSelectedProducts] = useState([])

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const [images, setImages] = useState([])  

  const [error, setError] = useState({name: '', startDate: '', endDate: '', discountValue: '', maxDiscount: '', minimumOrderValue: ''})

  const [currentProductPart, setCurrentProductPart] = useState(1)
  const [productQueryOptions, setProductQueryOptions] = useState({page: 1, limit: 6})
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [insideProductResults, setInsideProductResults] = useState(false)

  const productSearchRef = useRef(null)

  // const [switchApplicableType, setSwitchApplicableType] = useState(false)

  const [customerQueryOptions, setCustomerQueryOptions] = useState({page: 1, limit: 6})

  const { products, productCounts } = useSelector(state=> state.productStore)
  
  const {loading, offerCreated} = useSelector(state=> state.offers)
  const dispatch = useDispatch()

  const userGroupValues = ["all", "newUsers", "returningUsers", "VIPUsers"]

  
//   useEffect(() => {
//     if (offer){
//       if(offer.applicableProducts.length > 0){
//         setSelectedProducts([...offer.applicableProducts])
//       }
//       setShowCategories(false)
//       // if(offer.applicableCategories.length > 0){
//       //   setSelectedCategories({categories: [...offer.applicableCategories]})
//       // }
//       setFormData({...offer, startDate: offer.startDate.split("T")[0], endDate: offer.endDate.split("T")[0] })
//     } else {
//       setFormData({
//         name: "",
//         description: "",
//         discountType: "percentage",
//         discountValue: "",
//         maxDiscount: "",
//         startDate: "",
//         endDate: "",
//         minimumOrderValue: "",
//         applicableType: "allProducts",
//         applicableCategories: [],
//         applicableProducts: [],
//       })
//     }

//   }, [offer])

  // useEffect(()=> {
  //   if( Object.keys(error).some(error=> error.trim() !== '') ){
  //     setTimeout(()=> setError({}), 3000)
  //   }
  // }, [error])

  useEffect(()=> {
    if (selectedCategories?.categories) {
      console.log("selectedCategories?.categories--->", selectedCategories.categories)
      setFormData(formData=> ({
          ...formData,
          applicableCategories: Array.isArray(formData.applicableCategories) 
              ? [...selectedCategories.categories]
              : [...selectedCategories.categories]
      }))
      if(selectedCategories?.categories.length <= 0){
        setError(error=> ( {...error, applicableCategories: 'Choose atleast one category'} ) )
      }else{
        setError(error=> {
          const {applicableCategories, ...rest} = error
          return rest
         })
      }
    }

    if(selectedProducts){
      console.log("selectedProducts--->", selectedProducts)
      setFormData(formData=> (
        { ...formData, applicableProducts: [...selectedProducts.map(product=> product.title)] }
      ))
      if(selectedProducts.length > 0){
        setError(error=> {
         const {applicableProducts, ...rest} = error
         return rest
        })
      }
      // if(selectedProducts.length === 0){
      //   console.log("Inside if(selectedProducts.length === 0 && !switchApplicableType)")
      //   setError(error=> ( {...error, applicableProducts: 'Choose atleast one product!'} ) )
      // }
    }
  },[selectedCategories, selectedProducts])

  useEffect(()=> {
    console.log("formData--->", formData)
  },[formData])

  useEffect(()=> {
    console.log("formData on first launch--->", formData)
  }, [])

  useEffect(()=> {
    if(startDate){
      setFormData(formData=> (
        {...formData, startDate}
      ))
    }
    if(endDate){
      setFormData(formData=> (
        {...formData, endDate}
      ))
    }
  },[startDate, endDate])

  useEffect(()=>{
    if(Object.keys(productQueryOptions).length){
        console.log('OUERYOPTIONS--------->', JSON.stringify(productQueryOptions))
        dispatch( getAllProducts({queryOptions: productQueryOptions}) )
    }
    // if(Object.keys(customerQueryOptions).length){
    //   dispatch( showUsers({queryOptions: customerQueryOptions}) )
    // }
  },[productQueryOptions, customerQueryOptions])

  useEffect(()=> {
    if(offerCreated){
      toast.success('An offer is successfully created!')
      dispatch(resetOfferStates())
    }
    setFormData({})
    setImages([])
    setStartDate(null); setEndDate();
    setSelectedCategories({}); setSelectedProducts([]); setShowCategories(false); setShowSearchResults(false)
  }, [offerCreated])

  useEffect(()=> {
    const handleClickOutside = (e) => {
      const isOutside = !productSearchRef.current?.contains(e.target)
      if (isOutside) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return ()=> {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [productSearchRef])

  const handleChange = (e)=> {
    console.log("Inside handleChange...")
    const { name, value, type, checked } = e.target
    console.log("Value--->", value)
    if (type === "checkbox") {
      setFormData((prev) => (
        { ...prev, discountType: prev.discountType || "percentage", recurringOffer: prev.recurringOffer ?? false,
           applicableType: prev.applicableType ?? 'allProducts',  [name]: checked }
      ))
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(e.target.selectedOptions, (option)=> option.value)
      // setFormData((prev) => ({ ...prev, [name]: selectedOptions }))
      setFormData((prev) => (
        { ...prev, discountType: prev.discountType || "percentage", recurringOffer: prev.recurringOffer ?? false,
          applicableType: prev.applicableType ?? 'allProducts',  [name]: selectedOptions }
      ))
    } else {
      // setFormData((prev) => ({ ...prev, [name]: value }))
      setFormData((prev) => (
        { ...prev, discountType: prev.discountType || "percentage", recurringOffer: prev.recurringOffer ?? false,
          applicableType: prev.applicableType ?? 'allProducts',  [name]: value }
      ))
    }
  }

//   const handleChange = (e) => {
//     console.log("Inside handleChange...");
//     const { name, value, type, checked } = e.target;
    
//     setFormData((prev) => {
//         console.log("Previous State: ", prev);
        
//         const updatedState = {
//             ...prev,
//             [name]: type === "checkbox" ? checked : type === "select-multiple"
//                 ? Array.from(e.target.selectedOptions, (option) => option.value)
//                 : value
//         };

//         console.log("Updated State: ", updatedState);
//         return updatedState;
//     });
// };


  const handleRecurringOffer = (e)=> {
    const value = Boolean(parseInt(e.target.value))
    setFormData((prev)=> ({ ...prev, [e.target.name]: value }))
    if(value){
      setFormData((prev)=> ({ ...prev, recurringFrequency: 'weekly' }))
    }else{
      setFormData((prev)=> {
        const {recurringFrequency, ...rest} = prev
        return rest
      })
    }
  }

  const inputBlurHandler = (e, fieldName)=> { 
    console.log("inside inputBlurHandler, fieldname", fieldName)
    const value = e.target.value.trim()
    console.log("value--->", value)
    const regexPattern = /^\d+$/

    if( (fieldName === 'name' || fieldName === 'startDate' || fieldName === 'endDate' || fieldName === 'discountValue') && !value){
      console.log("Inside if(fieldName === 'code' || fieldName === 'startDate' || fieldName === 'endDate' && !value)")
      setError(error=> ( {...error, [fieldName]: `${camelToCapitalizedWords(fieldName)} cannot be empty!`} ) )
      e.target.style.borderColor = '#e74c3c'
      return
    }
    if( !['name', 'startDate', 'endDate'].includes(fieldName) && value  && (!regexPattern.test(value) || value < 0) ){
      setError(error=> ( {...error, [fieldName]: `Please enter a valid ${camelToCapitalizedWords(fieldName)}!`} ) )
      e.target.style.borderColor = '#e74c3c'
    }
    else if( (fieldName === 'discountValue' || fieldName === 'fixed') && formData.discountType === 'percentage' && !value ){
      setError(error=> ( {...error, discountValue: `Discount cannot be empty!`} ) )
      e.target.style.borderColor = '#e74c3c'
    }
    else if(fieldName === 'discountValue' && formData[fieldName] > 100){
      setError(error=> ( {...error, discountValue: 'Discount value must be less than 100!'} ) )
      e.target.style.borderColor = '#e74c3c'
    }
    else{
      setError(error=> ( {...error, [fieldName]: ''} ) )
      e.target.style.borderColor = value ? '#07bc0c' : 'rgb(209, 213, 219)'
    }
  }

  const incDecHandler = (type, operate)=> {
    console.log("Inside incDecHandler")
    const value = Number(formData[type])
    console.log("Number(formData[type])-->", value)
    if( (formData[type] && value) || formData[type] == '0' ){
      if(formData[type] >= 0){
        if(operate === 1){
          setFormData(formdata=> ({...formData, [type]: value + 1}))
        }else{
          value !== 0 && setFormData(formdata=> ({...formData, [type]: value - 1}))
        }
      }
    }else return
  }

  const debouncedProductSearch = useRef(
      debounce((searchData)=> {
          setProductQueryOptions(productQueryOptions=> (
              {...productQueryOptions, searchData: searchData}
          ))
      }, 600) 
  ).current; 

  const searchProducts = (e)=> {
    const searchData = e.target.value
    console.log('searchData--->', searchData)
    if(searchData.trim() !== ''){
        setShowSearchResults(true)
        console.log("Getting searched products--")
        debouncedProductSearch(searchData)
    } 
    else{
      setShowSearchResults(false)
      if(selectedProducts.length === 0){
        setError(error=> ( {...error, applicableProducts: 'Choose atleast one product!'} ) )
      }
    } 
  }

  const nextProducts = ()=> {
    setProductQueryOptions(productQueryOptions=> (
      {...productQueryOptions, page: currentProductPart + 1}
    ))
    setCurrentProductPart(part=> part++)
  }

  const previousProducts = ()=> {
    setProductQueryOptions(productQueryOptions=> (
      {...productQueryOptions, page: currentProductPart - 1}
    ))
    setCurrentProductPart(part=> part--)
  }

  const productCheckHandler = (e, productName)=> {
    const checked = e.target.checked
    console.log("checked-->", checked)
    // setSwitchApplicableType(false)
    if(checked){
      setSelectedProducts( products=> [...products, {title: productName}] )
    }else{
      setSelectedProducts( products=> products.filter(product=> product.title !== productName) )
      if(selectedProducts.length === 0){
        setError(error=> ( {...error, applicableProducts: 'Choose atleast one product!'} ) )
      }
    }
  }

  const applicableTypeHandler = (e)=> {
    const selectedValue = e.target.value
    // setSwitchApplicableType(true)
    setFormData((prev)=> ({ ...prev, applicableType: selectedValue }))
    if (selectedValue === "categories"){
      setShowCategories(true)
      setSelectedProducts([])
      // setError(error=> {
      //   const {applicableCategories, ...rest} = error
      //   return rest
      // })
      setFormData((prev) => ({ ...prev, applicableProducts: [] }))
    } 
    else if (selectedValue === "products"){
      setShowCategories(false)
      setSelectedCategories({})
      // setError(error=> {
      //   const {applicableProducts, ...rest} = error
      //   return rest
      // })
      setFormData((prev) => ({ ...prev, applicableCategories: [] }))
    } 
    else{
      setShowCategories(false)
      setFormData((prev) => ({ ...prev, applicableProducts: [], applicableCategories: [] }))
    } 
  }

  const radioClickHandler = (e, group)=>{
    const checkStatus = formData.targetCustomers === group
    console.log("checkStatus-->", checkStatus)
    if(checkStatus){
        setFormData(formData => {
          const [targetCustomers, ...rest] = formData
          return rest
        })
        return
    }else{
        setFormData((prev) => ({ ...prev, targetCustomers: group }))
        const changeEvent = new Event('change', {bubbles:true})
        e.target.dispatchEvent(changeEvent)
    }
  }

  const radioChangeHandler = (e, group)=>{
    e.target.checked = formData.targetCustomers === group 
  }

  const handleSubmit = async()=> {
    console.log("formData--->", formData)
    const {name, discountType, discountValue, applicableType, startDate, endDate} =  formData
    if(!name || !startDate || !endDate || !discountType || !discountValue || !applicableType){
      toast.error("Please fill the required fields!")
      return
    }
    if( (formData.discountType === 'percentage' || formData.discountType === 'fixed') && !formData.discountValue  ){
      toast.error("Please fill the Discount value!")
      return
    } 
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("Start date must be before the End date!")
      return
    }
    if(formData.applicableType === 'products' && selectedProducts.length === 0){
      toast.error("Choose atleast one product!")
      return
    }
    if(formData.applicableType === 'categories' && selectedCategories.length === 0){
      toast.error("Choose atleast one category!")
      return
    }
    if( Object.values(error).some(error=> error.trim() !== '') ){
      toast.error("There are some errors in the form. Please correct them before submitting!")
      return
    }

    // let offerId
    // if(isEditing){
    //   offerId = coupon._id
    // } 
    // offer ? dispatch( updateOffer({offerDetails: formData, offerId}) )  : dispatch( createOffer({offerDetails: formData}) ) 
    let newBlob
    if(images.length > 0){
      const compressedImageBlob = async(image)=>{
        if(image.size > (5*1024*1024)){
            const newBlob = await handleImageCompression(image.blob)
            return newBlob
        }else{
            return image.blob
        }
      } 
      newBlob = await compressedImageBlob(images[0])
    }

    const offerData = new FormData()
    Object.keys(formData).forEach((key)=> {
        if (Array.isArray(formData[key])) {
            formData[key].forEach((item) => offerData.append(key, item))
        }else{
            offerData.append(key, formData[key])
        }
    })

    if(images.length > 0){
      offerData.append('offerBanner', newBlob, 'offerImg')
    }

    dispatch( createOffer({offerDetails: offerData}) ) 
  }



  return (
     <section id='AdminCreateOfferPage'>

        <header>
                {/* <input type='search' placeholder='Search Categories' className='w-[12rem] h-[35px] border-dotted bg-[#fefff8]
                         rounded-[7px] placeholder:text-[11px]' /> */}
            <AdminTitleSection heading='Create Offer' subHeading="Create and configure offers, user targeting, recurring options, banners 
              and other options for better sales."/>

        </header>

        <main className='flex gap-[10px]'>
          
            <div className='flex flex-col gap-[15px] basis-[65%] w-[65%]' id='offer-content'>

                <div className='offer-content-wrapper'>
                    <div className='offer-labels'>
                      <label for='name'> Offer Name </label>
                      <p>
                        Enter a unique and descriptive offer name that clearly identifies the promotion. Keep it concise yet
                        informative. Maximum 50 characters recommended.
                      </p>
                    </div>
                    <div className='relative'>
                        <PlaceholderIcon icon={<DiamondPercent className="w-[13px] h-[13px]"/>}/>
                        <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} 
                            onBlur={(e)=> inputBlurHandler(e, "name")} style={{paddingLeft: '30px'}}/>
                        <p className='error'> {error.name && error.name}  </p>
                    </div>
                </div>
                
                <div className='offer-content-wrapper'>
                    <div className='self-start offer-labels'>
                      <label for='description'> Description (optional) </label>
                      <p>
                        Provide a clear and detailed description of the offer, including eligibility, benefits, and any important terms.
                        Keep it concise yet informative to help users understand the promotion effectively.
                      </p>
                    </div>
                    <div className='relative'>
                        <PlaceholderIcon icon={<CgDetailsMore/>} fromTop={14}/>
                        <textarea rows='3' cols='50' maxlength='500' id='description' name='description'
                               className='pl-[21px] w-[20rem] h-[5rem] resize-none border border-primary rounded-[5px] 
                                  text-[12px] overflow-hidden placeholder:text-[9px] placeholder:text-[#6b7280] '
                                        value={formData.description} onChange={handleChange} />
                    </div>
                </div>

                <div className='offer-content-wrapper'>
                    <div className='offer-labels'>
                      <label for='discountType'> Discount Type </label>
                      <p>
                        Select the discount type that best suits your offer: Percentage for a percentage off, 
                        Fixed for a set discount, Buy One Get One for BOGO deals, or Free Shipping for shipping discounts.
                      </p>
                    </div>
                    <div className='relative'>
                        <PlaceholderIcon icon={<TbShoppingCartDiscount />} fromTop={40} className='h-[12px] w-[12px]'/>
                        <select id="discountType" name="discountType" value={formData.discountType} onChange={handleChange}
                            className="text-[13px] text-secondary pl-[1.5rem]">
                            <option value="percentage"> Percentage </option>
                            <option value="fixed"> Fixed Amount </option>
                            <option value="freeShipping"> Free Shipping </option>
                            <option value="bogo"> Buy 1 Get 1 </option>
                        </select>
                    </div>
                </div>

                <div className='offer-content-wrapper'>
                    <div className='offer-labels'>
                      <h5> Offer Starting and Expiry Dates </h5>
                      <p>
                        Set the offer's start and expiry dates to define its active period. The offer will be valid only
                        within this specified timeframe. Ensure the start date is today or later to avoid conflicts.
                      </p>
                    </div>
                    <div className='relative' id='calender'>
                        <DateSelector dateGetter={{startDate, endDate}} dateSetter={{setStartDate, setEndDate}} />
                    </div>
                </div>

                <div className='offer-content-wrapper'>
                    <div className='offer-labels'>
                      <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                        { 'Discount Value ' + `( ${formData?.discountType && formData.discountType === 'percentage' ? '%' : "\u20B9"} )`}
                      </label>
                      <p>
                        Enter the discount value based on the selected discount type. This value determines the reduction
                        applied during checkout. Required for offer activation.
                      </p>
                    </div>
                    <div className='relative'>
                      {
                        (()=>{
                          const CurrentIcon = formData?.discountType && formData.discountType === 'percentage' ? BadgePercent : BadgeIndianRupee
                          return <PlaceholderIcon icon={<CurrentIcon className='h-[13px] w-[13px]'/>} fromTop={23}/>
                        })()
                      }
                      <PlaceholderIcon icon={<BadgePercent className='h-[13px] w-[13px]'/>} fromTop={23}/>
                      <input type="text" id="discountValue" required name="discountValue" value={formData.discountValue} onChange={handleChange}
                        placeholder={`Enter the discount value in ${formData?.discountType && formData.discountType === 'percentage' ? '%' : "\u20B9"}`}
                          onBlur={(e)=> inputBlurHandler(e, "discountValue")} className="h-[2.5rem] " style={{paddingLeft: '30px'}}/>
                      <div className="input-contoller">
                          <Plus onClick={()=> incDecHandler('discountValue', 1)}/>
                          <Minus onClick={()=> incDecHandler('discountValue', -1)}/>
                      </div>
                      <p className='error'> {error && error.discountValue && error.discountValue}  </p>
                    </div>
                </div>

                <div className='offer-content-wrapper'>
                    <div className='offer-labels'>
                        <label for='maxDiscount'> Maximum Discount Value (optional)</label>
                        <p>
                        Set the maximum discount limit a user can avail from this offer. This applies to  -based discounts
                        to prevent excessive reductions. Leave blank for no limit.
                        </p>
                    </div>
                    <div className='relative'>
                        <PlaceholderIcon icon={<IndianRupee className="h-[11px] w-[11px]"/>} fromTop={23}/>
                        <input type="text" id="maxDiscount" name="maxDiscount" value={formData.maxDiscount} 
                          placeholder='Leave blank for no limit' className="h-[2.5rem]" onBlur={(e)=> inputBlurHandler(e, "maxDiscount")}
                           onChange={handleChange} style={{paddingLeft: '30px'}}/>
                        <div className="input-contoller">
                          <Plus onClick={()=> incDecHandler('maxDiscount', 1)}/>
                          <Minus onClick={()=> incDecHandler('maxDiscount', -1)}/>
                        </div>
                        <p className='error'> {error.maxDiscount && error.maxDiscount}  </p>
                    </div>
                </div>

                <div className='offer-content-wrapper'>
                    <div className='offer-labels'>
                        <label for='minimumOrderValue'> Minimum Order Value (optional) </label>
                        <p>
                        Specify the minimum order amount required for this offer to be applicable. Orders below this value
                        will not qualify for the discount. Leave blank or set to 0 for no restriction.
                        </p>
                    </div>
                    <div className='relative'>
                        {/* <PlaceholderIcon icon={<IndianRupee className="h-[11px] w-[11px]"/>} fromTop={23}/> */}
                        <input type="text" id="minimumOrderValue" name="minimumOrderValue" value={formData.minimumOrderValue}
                          placeholder="Enter the minimum order amount required to apply this offer"
                           className="h-[2.5rem]" onBlur={(e)=> inputBlurHandler(e, "minimumOrderValue")} onChange={handleChange}/>
                        <div className="input-contoller">
                          <Plus onClick={()=> incDecHandler('minimumOrderValue', 1)}/>
                          <Minus onClick={()=> incDecHandler('minimumOrderValue', -1)}/>
                        </div>
                        <p className='error'> {error.minimumOrderValue && error.minimumOrderValue}  </p>
                    </div>
                </div>

                <div className='px-[3px] py-[15px] border-b border-dashed border-mutedDashedSeperation' id='applicableType-section'>
                    <div className="flex items-center justify-between gap-[10px]">
                      <div className='offer-labels'>
                        <label for='applicableType' className="mb-[17px]"> Applicable To </label>
                        <p>
                          Choose whether this offer applies to all products, specific products, or specific categories.
                          Selecting ‘specific products’ or ‘specific categories’ will require you to specify the applicable items before saving.
                        </p>
                      </div>
                      <div className='relative'>
                          <PlaceholderIcon icon={<ListTodo className='h-[13px] w-[13px]'/>} fromTop={37}/>
                          <select id="applicableType" name="applicableType" value={formData.applicableType} 
                            className="pl-[2rem] pr-0 w-[20rem] h-[2.4rem] border border-primary text-[12px] text-secondary rounded-[5px]"
                             onChange={(e)=> applicableTypeHandler(e)}>
                            <option value="allProducts"> All Products </option>
                            <option value="categories"> Specific Categories </option>
                            <option value="products"> Specific Products </option>
                          </select>
                      </div>
                    </div>

                    {formData.applicableType === "categories" && (
                      <div className="mt-[1rem]" id='applicableCategories-section'>
                        <label htmlFor="applicableCategories" id='choices' className="block text-[13px] font-[550] text-muted tracking-[0.5px]">
                          {/* { !isEditing ? 'Select Categories' : 'Selected Categories' } */}
                          Select Categories
                        </label>
                        <div id="applicableCategories" className="mt-[5px] px-[15px] py-[7px] border border-dropdownBorder rounded-[5px]">
                          {/* {categories.map((category)=> (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))} */}
                          {
                            showCategories &&
                            <CategoryDisplay type='checkboxType' filter={selectedCategories} setFilter={setSelectedCategories} />
                          }        
                          {/* {
                          !showCategories &&
                          <h5 className="mt-[10px] mb-[5px] text-[12px] text-muted font-[450] hover:underline transition duration-150 cursor-pointer" 
                            onClick={()=> { setFormData(formData=> (
                                  {...formData, applicableCategories: []}
                                  ));
                                 setShowCategories(true)}}>
                          Choose different Categories
                          </h5>
                          } */}
                        </div>
                        {
                           formData?.applicableCategories?.length > 0 && showCategories &&
                          <div className="mt-[10px] flex gap-[10px]">
                            { 
                              formData.applicableCategories.map(category=> (
                                <div key={category._id} className="px-[5px] py-[2px] flex items-center gap-[4px]">
                                  <GoDotFill className="w-[10px] h-[10px] text-primaryDark"/>
                                  <span className="text-[11px] text-secondary capitalize"> {category} </span>
                                </div>
                              ))
                            }
                          </div>
                          }
                        <p className="mt-[4px] h-[17px] text-[10px] text-red-500 tracking-[0.2px] visible">
                          {error.applicableCategories && error.applicableCategories} 
                        </p>
                      </div>
                    )}
          
                    {formData.applicableType === "products" && (
                      <div className="mt-[1rem]" id='applicableProducts'>
                        <label htmlFor="applicableProductsSearch" className="block !text-[12px] !text-muted !font-medium">
                          Select Products 
                        </label>
                        <div className="relative">
                          <input type='text' placeholder="Search products here..." id='applicableProductsSearch' 
                            className="mt-[5px] w-full h-[2rem] text-[12px] px-[5px] pl-[35px] py-[2px] placeholder:text-[11px] border-muted
                              border-dotted rounded-[4px] focus:border-secondary focus:outline-none focus:ring-0" onChange={(e)=> searchProducts(e)} 
                                onBlur={()=> {
                                  !insideProductResults && setShowSearchResults(false)
                                  if(selectedProducts.length === 0){
                                    setError(error=> ( {...error, applicableProducts: 'Choose atleast one product!'} ) )
                                  }
                                }}/>
                          <Search className="absolute top-[14px] left-[12px] w-[14px] h-[14px] text-muted"/>
                          {
                            showSearchResults && 
                            <ul className="absolute top-[110%] w-full bg-white list-none flex flex-col gap-[7px] px-[7px] py-[10px] border
                             border-dropdownBorder rounded-[4px] z-[10]" onMouseEnter={()=> setInsideProductResults(true)} 
                                onMouseLeave={()=> setInsideProductResults(false)} ref={productSearchRef}>
                              { 
                                products.length > 0 ?
                                products.map(product=> (
                                  <li key={product._id} className="flex items-center gap-[7px]">
                                      <input type='checkbox' id='selectProducts' className="h-[13px] w-[13px] border border-primary rounded-[3px]
                                        focus:ring-0 focus:outline-none checked:bg-primary checked:border-primary checked:text-white 
                                          appearance-none active:bg-primary active:border-primary active:text-white cursor-pointer"
                                           onChange={(e)=> productCheckHandler(e, product.title)}
                                           checked={ selectedProducts.some(item=> item.title === product.title) || false }/>
                                      <label htmlFor='selectProducts' id='choices' className="text-[12px] capitalize cursor-pointer hover:text-secondary hover:font-medium">
                                         {product.title} 
                                      </label>
                                  </li>
                                ))
                                : <h6 className="mx-auto text-[14px] text-muted font-[500]"> No such product available! </h6>
                              }
                              {
                                productQueryOptions.page > 1 &&
                                <i className="px-[10px] py-[5px] w-full bg-primary" onClick={()=> previousProducts()}>
                                  <ChevronUp className="mx-auto w-[15px] h-[15px] text-center text-secondary"/>
                                </i>
                              }
                              {
                                products.length > 5 &&
                                <i className="px-[10px] py-[5px] w-full bg-primary" onClick={()=> nextProducts()}>
                                  <ChevronDown className="mx-auto w-[15px] h-[15px] text-center text-secondary"/>
                                </i>
                              }
                            </ul>
                          }
                        </div>
                        {
                          selectedProducts.length > 0 &&
                          <div className="mt-[10px] px-[10px] py-[5px]">
                            <div className="flex gap-[10px]">
                            {
                              selectedProducts.map(product=> (
                                <div key={product.title} className="px-[5px] py-[2px] flex items-center gap-[5px] border border-inputBorderSecondary
                                   rounded-[12px]">
                                  <X className="h-[8px] w-[8px] text-muted cursor-pointer" 
                                    onClick={()=> {
                                      const newSelectedProducts = selectedProducts.filter(item=> item.title !== product.title )
                                      setSelectedProducts(newSelectedProducts)
                                      if(newSelectedProducts.length === 0){
                                        setError(error=> ( {...error, applicableProducts: 'Choose atleast one product!'} ) )
                                      }
                                    }}/>
                                  <span className="text-[11px] text-secondary capitalize"> {product.title} </span>
                                </div>
                              ))
                            }
                            </div>
                          </div>
                        }
                      <p className="mt-[3px] h-[17px] text-[10px] text-red-500 tracking-[0.2px] visible">
                          {error.applicableProducts && error.applicableProducts} 
                        </p>
                      </div>
                    )}
                </div>

                <div className='offer-content-wrapper'>
                    <div className='offer-labels'>
                      <label for='targetCustomers'> Target Customers (optional) </label>
                      <p>
                        Select the customer group eligible for this offer. Choose ‘All Users’ for everyone,
                        ‘New Users’ for first-time buyers, ‘Returning Users’ for repeat customers, or ‘VIP Users’ for exclusive members.
                        Tailor your promotions to target specific user segments.
                        This helps in optimizing marketing strategies by offering exclusive deals to the right audience,
                        boosting engagement and overall sales performance.
                      </p>
                    </div>
                    <div className='relative'>
                        <div className='flex flex-col gap-[1rem]'>
                          {
                            userGroupValues.map(group=> (
                                <div key={group} className={`px-[15px] py-[7px] w-[13rem] flex items-center justify-between
                                      rounded-[5px] cursor-pointer hover:border-primaryDark hover:bg-primaryLight
                                         ${formData.targetCustomers === group ? 'border-2 border-primaryDark bg-primaryLight': 
                                              'border border-mutedDashedSeperation'}`} onClick={(e)=> radioClickHandler(e, group)}> 
                                  <input type='radio' className='w-[12px] h-[12px] border border-primaryDark cursor-pointer
                                     checked:bg-primaryDark focus:ring-0 focus:text-primaryDark' id='targetCustomers'
                                      onClick={(e)=> radioClickHandler(e, group)} onChange={(e)=> radioChangeHandler(e, group)}
                                        checked={formData.targetCustomers === group}/>
                                  <span className='text-[13px]'> { camelToCapitalizedWords(group) } </span>
                                </div>
                            ))
                          }
                        </div>
                    </div>
                </div>

                <div className='offer-content-wrapper'>
                    <div className='offer-labels'>
                      <label for='recurringOffer'> Recurring Offer (optional) </label>
                      <p>
                        Enable this option to make the offer repeat automatically at set intervals. Useful for weekly, monthly,
                        or seasonal promotions to maintain customer engagement and drive consistent sales.
                      </p>
                    </div>
                    <div className='relative'>
                        <PlaceholderIcon icon={<CalendarSync className='h-[13px] w-[13px]'/>} fromTop={37} />
                        <select id="recurringOffer" name="recurringOffer" onChange={handleRecurringOffer}
                            className="text-[13px] text-secondary pl-[2rem]">
                            <option value="0"> No </option>
                            <option value="1"> Yes </option>
                        </select>
                    </div>
                </div>

                {
                  formData.recurringOffer &&
                  <div className='offer-content-wrapper'>
                    <div className='offer-labels'>
                      <label for='recurringFrequency'> Recurring Frequency </label>
                      <p>
                        Specify how often the recurring offer should be applied, such as daily, weekly, or monthly.
                        Ensure the frequency aligns with your promotional strategy to maximize customer engagement and sales impact.
                      </p>
                    </div>
                    <div className='relative'>
                        <PlaceholderIcon icon={<RefreshCcw className='h-[13px] w-[13px]'/>} fromTop={37} />
                        <select id="recurringFrequency" name="recurringFrequency" value={formData?.recurringFrequency} 
                          onChange={handleChange} className="text-[13px] text-secondary pl-[2rem]">
                            <option value="daily"> Daily </option>
                            <option value="weekly"> Weekly </option>
                            <option value="monthly"> Monthly </option>
                            <option value="yearly"> Yearly </option>
                        </select>
                    </div>
                  </div>
                }
                
                <div className='w-[20%] mt-[2rem]'>

                    <SiteButtonSquare customStyle={{paddingInline:'50px', paddingBlock:'9px', borderRadius:'7px'}}
                                            clickHandler={()=>{ handleSubmit()}}>
                             {loading? <CustomHashLoader loading={loading}/> : 'Submit'}   
                    </SiteButtonSquare>

                </div>

            </div>

            <div className='w-full basis-[35%] mt-[15px]'>

            <FileUpload images={images} setImages={setImages} imageLimit={1} needThumbnail={false} imageType='Offer Banner'
              imagePreview={{status: true, size: 'landscape'}}/>

            </div>  
            {/*  categoryImgPreview={{categoryName: `${categoryData?.categoryName ? categoryData?.categoryName : 'Category Name'}`}} in FileUpload */}
        </main>

    </section>
  )
}


