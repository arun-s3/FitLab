import React, { useState, useEffect, useRef } from "react"
import './OfferModal.css'
import { useSelector, useDispatch } from "react-redux"
import {debounce} from 'lodash'

import {X, DiamondPercent, BadgePercent, Plus, Minus, Search, ChevronDown, ChevronUp, RefreshCcw, CalendarSync, Users,
   IndianRupee, ListTodo} from "lucide-react"
import {GoDotFill} from "react-icons/go"
import {CgDetailsMore} from "react-icons/cg"
import {toast as sonnerToast} from 'sonner'
import {toast} from 'react-toastify'

import CategoryDisplay from "../../../Components/CategoryDisplay/CategoryDisplay"
import FileUpload from '../../../Components/FileUpload/FileUpload'
import {updateOffer, resetOfferStates} from '../../../Slices/offerSlice'
import {searchProduct, getAllProducts} from '../../../Slices/productSlice'
import {showUsers} from '../../../Slices/adminSlice'
import {camelToCapitalizedWords} from "../../../Utils/helperFunctions"
import useModalHelpers from '../../../Hooks/ModalHelpers'


export default function OfferModal({ isOpen, onClose, offer, isEditing }){

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
    recurringOffer: false
  })
  
  const [images, setImages] = useState([])  

  const [showCategories, setShowCategories] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState({})
  const [selectedProducts, setSelectedProducts] = useState([])

  const [error, setError] = useState({name: '', startDate: '', endDate: '', discountValue: '', maxDiscount: '', minimumOrderValue: ''})

  const [currentProductPart, setCurrentProductPart] = useState(1)
  const [showSearchResults, setShowSearchResults] = useState(false)

  const [insideProductResults, setInsideProductResults] = useState(false)
  const productSearchRef = useRef(null)

  const [productQueryOptions, setProductQueryOptions] = useState({page: 1, limit: 6})

  const { products, productCounts } = useSelector(state=> state.productStore)
  const { adminLoading, adminError, adminSuccess, adminMessage, allUsers } = useSelector(state => state.admin)
  
  const {offerCreated, offerUpdated} = useSelector(state=> state.offers)
  const dispatch = useDispatch()

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const userGroupValues = ["all", "newUsers", "returningUsers", "VIPUsers"]

  
  useEffect(()=> {
    async function loadOfferDatas(){
      if(offer.applicableProducts.length > 0){
        setSelectedProducts([...offer.applicableProducts])
      }
      setShowCategories(false)

      const convertToBlob = async (url)=> {
        try {
            const response = await fetch(url, {mode: 'cors'})
            return await response.blob()
        } catch (error) {
        }
      }
      const blob = await convertToBlob(offer.offerBanner.url)
      const newImage = {...offer.offerBanner, blob}
      setImages([newImage])

      setFormData({...offer, startDate: offer.startDate.split("T")[0], endDate: offer.endDate.split("T")[0] })
    }

    if (offer){
      loadOfferDatas()
    } 
  }, [offer])

  // useEffect(()=> {
  //   if( Object.keys(error).some(error=> error.trim() !== '') ){
  //     setTimeout(()=> setError({}), 3000)
  //   }
  // }, [error])

  useEffect(()=> {
    if (selectedCategories?.categories) {
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

  useEffect(()=>{
    if(Object.keys(productQueryOptions).length){
        dispatch( getAllProducts({queryOptions: productQueryOptions}) )
    }
  },[productQueryOptions])

  useEffect(()=> {
    if(offerUpdated){
      sonnerToast.success('An offer is successfully updated!')
      dispatch(resetOfferStates())
    }
  }, [offerCreated, offerUpdated])

  useEffect(() => {
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
    const { name, value, type, checked } = e.target
    if (type === "checkbox") {
      setFormData((prev)=> ({ ...prev, [name]: checked }))
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(e.target.selectedOptions, (option)=> option.value)
      setFormData((prev)=> ({ ...prev, [name]: selectedOptions }))
    } else {
      setFormData((prev)=> ({ ...prev, [name]: value }))
    }
  }

  const inputBlurHandler = (e, fieldName)=> { 
    const value = e.target.value.trim()
    const regexPattern = /^\d+$/

    if( (fieldName === 'name' || fieldName === 'startDate' || fieldName === 'endDate' || fieldName === 'discountValue') && !value){
      setError(error=> ( {...error, [fieldName]: `${camelToCapitalizedWords(fieldName)} cannot be empty!`} ) )
      e.target.style.borderColor = '#e74c3c'
      return
    }
    if( !['name', 'startDate', 'endDate'].includes(fieldName) && value  && (!regexPattern.test(value) || value < 0) ){
      setError(error=> ( {...error, [fieldName]: `Please enter a valid ${camelToCapitalizedWords(fieldName)}!`} ) )
      e.target.style.borderColor = '#e74c3c'
    }
    // else if( (fieldName === 'discountValue' || fieldName === 'fixed') && formData.discountType === 'percentage' && !value ){
    //   setError(error=> ( {...error, discountValue: `Discount cannot be empty!`} ) )
    //   e.target.style.borderColor = '#e74c3c'
    // }
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
    const value = Number(formData[type])
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
    if(searchData.trim() !== ''){
        setShowSearchResults(true)
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
    setFormData((prev) => ({ ...prev, applicableType: selectedValue }))
    if (selectedValue === "categories"){
      setShowCategories(true)
      setSelectedProducts([])
      setFormData((prev) => ({ ...prev, applicableProducts: [] }))
    } 
    else if (selectedValue === "products"){
      setShowCategories(false)
      setSelectedCategories({})
      setFormData((prev) => ({ ...prev, applicableCategories: [] }))
    } 
    else{
      setShowCategories(false)
      setFormData((prev) => ({ ...prev, applicableProducts: [], applicableCategories: [] }))
    } 
  }

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

  const handleSubmit = (e)=> {
    e.preventDefault()
    const {name, startDate, endDate, discountType, discountValue, applicableType} =  formData
    if(!name || !startDate || !endDate || !discountType || !discountValue || !applicableType){
      toast.error("Please fill the required fields!")
      return
    }
    if( (formData.discountType === 'percentage' || formData.discountType === 'fixed') && !formData.discountValue  ){
      sonnerToast.error("Please fill the Discount value!")
      return
    } 
    if (new Date(endDate) <= new Date(startDate)) {
      sonnerToast.error("Start date must be before the End date!")
      return
    }
    if(formData.applicableType === 'products' && selectedProducts.length === 0){
      sonnerToast.error("Choose atleast one product!")
      return
    }
    if(formData.applicableType === 'categories' && selectedCategories.length === 0){
      sonnerToast.error("Choose atleast one category!")
      return
    }
    if( Object.values(error).some(error=> error.trim() !== '') ){
      sonnerToast.error("There are some errors in the form. Please correct them before submitting!")
      return
    }

    // let offerId
    // if(isEditing){
    //   offerId = coupon._id
    // } 
    // offer ? dispatch( updateOffer({offerDetails: formData, offerId}) )  : dispatch( createOffer({offerDetails: formData}) ) 
    dispatch( updateOffer({offerDetails: formData, offerId: offer._id}) )
    onClose()
  }

  if (!isOpen) return null

  return (
    <main className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" id='CouponModal'>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-primary">
          <h2 className="text-[22px] text-secondary font-[640] text-gray-900"> Edit Offer </h2>
          <button onClick={onClose} className="text-secondary hover:text-purple-700 transition duration-150 ease-in-out">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto" ref={modalRef}>

          <div className="grid grid-cols-2 gap-4">

            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Offer Name
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} 
                onBlur={(e)=> inputBlurHandler(e, "name")} style={{paddingLeft: '30px'}}/>
              <DiamondPercent className="absolute top-[60%] left-[10px] w-[13px] h-[13px] text-muted"/>
              <span className='error right-0'> {error.name && error.name} </span>
            </div>

            <div className="relative">
              <label htmlFor="targetCustomers" className="block text-sm font-medium text-gray-700">
                Target Customers 
              </label>
              <select id="targetCustomers" name="targetCustomers" value={formData.applicableType} 
                  onChange={handleChange} style={{paddingLeft: '30px'}}>
                {
                  userGroupValues.map(group=> (
                    <option key={group} value={group}> { camelToCapitalizedWords(group) } </option>
                  ))
                }
              </select>
              <Users className="absolute top-[60%] left-[10px] w-[13px] h-[13px] text-muted"/>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="2"
              className="resize-none !pl-[30px]"></textarea>
            <CgDetailsMore className="absolute top-[40%] left-[10px] w-[13px] h-[13px] text-muted"/>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
                Discount Type
              </label>
              <select id="discountType" name="discountType" value={formData.discountType} onChange={handleChange}
                className="text-[13px] text-secondary">
                <option value="percentage"> Percentage </option>
                <option value="fixed"> Fixed Amount </option>
                <option value="freeShipping"> Free Shipping </option>
                <option value="bogo"> Buy 1 Get 1 </option>
              </select>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center">
                <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                  { 'Discount Value ' + `( ${formData?.discountType && formData.discountType === 'percentage' ? '%' : "\u20B9"} )`}
                </label>
                <span className='error'> { error && error.discountValue && error.discountValue} </span>
              </div>
              <input type="text" id="discountValue" name="discountValue" value={formData.discountValue} onChange={handleChange}
                placeholder={`Enter the discount value in ${formData?.discountType && formData.discountType === 'percentage' ? '%' : "\u20B9"}`}
                  onBlur={(e)=> inputBlurHandler(e, "discountValue")} className="h-[2.5rem]" style={{paddingLeft: '30px'}}/>
              <BadgePercent className="absolute top-[60%] left-[10px] w-[13px] h-[13px] text-muted"/>
              <div className="input-contoller">
                <Plus onClick={()=> incDecHandler('discountValue', 1)}/>
                <Minus onClick={()=> incDecHandler('discountValue', -1)}/>
              </div>

            </div>

          </div>

          <div className="relative">
            <div className="flex justify-between items-center">
              <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-700">
                Maximum Discount Value (optional)
              </label>
            </div>
            <input type="text" id="maxDiscount" name="maxDiscount" value={formData.maxDiscount} placeholder='Leave blank for no limit' 
               className="h-[2.5rem] !pl-[30px]" onBlur={(e)=> inputBlurHandler(e, "maxDiscount")} onChange={handleChange}/>
            <IndianRupee className="absolute top-[60%] left-[10px] w-[13px] h-[13px] text-muted"/>
            <div className="input-contoller">
              <Plus onClick={()=> incDecHandler('maxDiscount', 1)}/>
              <Minus onClick={()=> incDecHandler('maxDiscount', -1)}/>
            </div>  
            <span className='error left-0'> {error.maxDiscount && error.maxDiscount} </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} 
                onBlur={(e)=> inputBlurHandler(e, "startDate")}/>
              <span className='error top-0 right-0'> {error.startDate && error.startDate} </span>
            </div>
            <div className="relative">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input type="date" id="endDate" name="endDate"  value={formData.endDate} onChange={handleChange}
                onBlur={(e)=> inputBlurHandler(e, "endDate")}/>
              <span className='error top-0 right-0'> {error.endDate && error.endDate} </span>
            </div>
          </div>

          <div className="relative">
            <div className="flex justify-between items-center">
              <label htmlFor="minimumOrderValue" className="block text-sm font-medium text-gray-700">
                Minimum Order Value (optional)
              </label>
            </div>
            <input type="text" id="minimumOrderValue" name="minimumOrderValue" value={formData.minimumOrderValue}
              placeholder="Enter the minimum order amount required to apply this offer"
               className="h-[2.5rem]" onBlur={(e)=> inputBlurHandler(e, "minimumOrderValue")} onChange={handleChange}/>
            <div className="input-contoller">
              <Plus onClick={()=> incDecHandler('minimumOrderValue', 1)}/>
              <Minus onClick={()=> incDecHandler('minimumOrderValue', -1)}/>
            </div>  
            <span className='error top-0 right-0'> {error.minimumOrderValue && error.minimumOrderValue} </span>
          </div>

          <div className="relative">
            <label htmlFor="applicableType" className="block text-sm font-medium text-gray-700">
              Applicable To
            </label>
            <select id="applicableType" name="applicableType" value={formData.applicableType} className="!pl-[30px]"
                onChange={(e)=> applicableTypeHandler(e)}>
              <option value="allProducts"> All Products </option>
              <option value="categories"> Specific Categories </option>
              <option value="products"> Specific Products </option>
            </select>
            <ListTodo className="absolute top-[60%] left-[10px] w-[13px] h-[13px] text-muted"/>
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

        <div className="grid grid-cols-2 gap-4">

          {/* <div className="relative">
            <label htmlFor="targetCustomers" className="block text-sm font-medium text-gray-700">
              Target Customers 
            </label>
            <select id="targetCustomers" name="targetCustomers" value={formData.applicableType} 
                onChange={handleChange} style={{paddingLeft: '30px'}}>
              {
                userGroupValues.map(group=> (
                  <option key={group} value={group}> { camelToCapitalizedWords(group) } </option>
                ))
              }
            </select>
            <Users className="absolute top-[60%] left-[10px] w-[13px] h-[13px] text-muted"/>
          </div> */}

          <div className="relative">
            <label htmlFor="recurringOffer" className="block text-sm font-medium text-gray-700">
              Recurring Offer (optional)
            </label>
            <select id="recurringOffer" name="recurringOffer" value={formData.recurringOffer}  
                onChange={handleRecurringOffer} style={{paddingLeft: '30px'}}>
              <option value="0"> No </option>
              <option value="1"> Yes </option>
            </select>
            <CalendarSync className="absolute top-[60%] left-[10px] w-[13px] h-[13px] text-muted"/>
          </div>

        </div>
              
        {
          formData.recurringOffer &&
          <div className="relative">
            <label htmlFor="recurringFrequency" className="block text-sm font-medium text-gray-700">
              Recurring Frequency 
            </label>
            <select id="recurringFrequency" name="recurringFrequency" value={formData.recurringFrequency}  
                onChange={handleChange} style={{paddingLeft: '30px'}}>
              {
                ['daily', 'weekly', 'monthly', 'yearly'].map(freq=> (
                  <option key={freq} value={freq}> { camelToCapitalizedWords(freq) } </option>
                ))
              }
            </select>
            <RefreshCcw className="absolute top-[60%] left-[10px] w-[13px] h-[13px] text-muted"/>
          </div>
        }

        <div className='w-full mt-[15px]'>
        
          <FileUpload images={images} setImages={setImages} imageLimit={1} needThumbnail={false} imageType='Offer Banner'
            imagePreview={{status: true, size: 'landscape'}} imageCropperPositionFromTop={'0px'} imageCropperBgBlur={true}
              imageCropperContainerHt='620px' imageCropperControllerStyle={{marginTop:'2rem', gap:'1.5rem', left:'0px'}}
                uploadBox={{beforeUpload:'185px', afterUpload:'90px'}}/>
        
        </div>  

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
             font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-secondary">
                Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
             bg-secondary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
                Update Offer
            </button>
          </div>

        </form>

      </div>
    </main>
  )
}


