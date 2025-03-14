import React, { useState, useEffect, useRef } from "react"
import './CouponModal.css'
import { useSelector, useDispatch } from "react-redux"
import {debounce} from 'lodash'

import { X, DiamondPercent, BadgePercent, Plus, Minus, Search, ChevronDown, ChevronUp } from "lucide-react"
import { RiCoupon4Line } from "react-icons/ri"
import {toast} from 'react-toastify';

import CategoryDisplay from "../../../Components/CategoryDisplay/CategoryDisplay"
import {handleInputValidation, displaySuccess, displayErrorAndReturnNewFormData, cancelErrorState} from '../../../Utils/fieldValidator'
import {createCoupon, updateCoupon, resetCouponStates} from '../../../Slices/couponSlice'
import {searchProduct, getAllProducts} from '../../../Slices/productSlice'
import {showUsers} from '../../../Slices/adminSlice'
import {camelToCapitalizedWords} from "../../../Utils/helperFunctions"



export default function CouponModal({ isOpen, onClose, coupon, isEditing }){


  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    minimumOrderValue: "",
    usageLimitPerCustomer: "",
    applicableType: "allProducts",
    applicableCategories: [],
    applicableProducts: [],
    customerSpecific: false,
    assignedCustomers: [],
  })

  const [showCategories, setShowCategories] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState({})
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedCustomers, setSelectedCustomers] = useState([])

  const [error, setError] = useState({code: '', startDate: '', endDate: '', discountValue: '', maxDiscount: '', minimumOrderValue: '',
     usageLimit: '', usageLimitPerCustomer: ''})

  const [currentProductPart, setCurrentProductPart] = useState(1)
  const [productQueryOptions, setProductQueryOptions] = useState({page: 1, limit: 6})
  const [showSearchResults, setShowSearchResults] = useState({products: false, customers: false})

  const [customerQueryOptions, setCustomerQueryOptions] = useState({page: 1, limit: 6})

  const { products, productCounts } = useSelector(state=> state.productStore)
  const { adminLoading, adminError, adminSuccess, adminMessage, allUsers } = useSelector(state => state.admin)
  
  const {couponCreated, couponUpdated} = useSelector(state=> state.coupons)
  const dispatch = useDispatch()
 

  useEffect(() => {
    if (coupon){
      if(coupon.applicableProducts.length > 0){
        setSelectedProducts([...coupon.applicableProducts])
      }
      if(coupon?.assignedCustomers && coupon.assignedCustomers.length > 0){
        setSelectedCustomers([...coupon.assignedCustomers])
      }
      setShowCategories(false)
      // if(coupon.applicableCategories.length > 0){
      //   setSelectedCategories({categories: [...coupon.applicableCategories]})
      // }
      setFormData({...coupon, startDate: coupon.startDate.split("T")[0], endDate: coupon.endDate.split("T")[0] })
    } else {
      setFormData({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        maxDiscount: "",
        startDate: "",
        endDate: "",
        usageLimit: "",
        minimumOrderValue: "",
        usageLimitPerCustomer: "",
        applicableType: "allProducts",
        applicableCategories: [],
        applicableProducts: [],
        customerSpecific: false,
        assignedCustomers: [],
      })
    }

  }, [coupon])

  useEffect(()=> {
    if( Object.keys(error).some(error=> error.trim() !== '') ){
      setTimeout(()=> setError({}), 3000)
    }
  }, [error])

  useEffect(()=> {
    if(selectedCategories?.categories && selectedCategories.categories.length > 0){
      console.log("selectedCategories?.categories--->", selectedCategories.categories)
      setFormData(formData=> (
        { ...formData, applicableCategories: [ ...new Set([...formData.applicableCategories, ...selectedCategories.categories]) ] }
      ))
    }
    if(selectedProducts){
      console.log("selectedProducts--->", selectedProducts)
      setFormData(formData=> (
        { ...formData, applicableProducts: [...selectedProducts.map(product=> product.title)] }
      ))
    }
    if(selectedCustomers){
      console.log("selectedCustomers--->", selectedCustomers)
      setFormData(formData=> (
        { ...formData, assignedCustomers: [...selectedCustomers.map(customer=> customer.username)] }
      ))
    }
  },[selectedCategories, selectedProducts, selectedCustomers])

  useEffect(()=> {
    console.log("formData--->", formData)
  },[formData])

  useEffect(()=>{
    if(Object.keys(productQueryOptions).length){
        console.log('OUERYOPTIONS--------->', JSON.stringify(productQueryOptions))
        dispatch( getAllProducts({queryOptions: productQueryOptions}) )
    }
    if(Object.keys(customerQueryOptions).length){
      dispatch( showUsers({queryOptions: customerQueryOptions}) )
  }
  },[productQueryOptions, customerQueryOptions])

  useEffect(()=> {
    if(couponCreated){
      toast.success('A coupon is successfully created!')
      dispatch(resetCouponStates())
    }
    if(couponUpdated){
      toast.success('A coupon is successfully updated!')
      dispatch(resetCouponStates())
    }
  }, [couponCreated, couponUpdated])

  const handleChange = (e)=> {
    console.log("Inside handleChange...")
    const { name, value, type, checked } = e.target
    console.log("Value--->", value)
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(e.target.selectedOptions, (option)=> option.value)
      setFormData((prev) => ({ ...prev, [name]: selectedOptions }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const inputBlurHandler = (e, fieldName)=> { 
    console.log("inside inputBlurHandler, fieldname", fieldName)
    const value = e.target.value.trim()
    console.log("value--->", value)
    const regexPattern = /^\d+$/

    if( (fieldName === 'code' || fieldName === 'startDate' || fieldName === 'endDate' || fieldName === 'discountValue') && !value){
      console.log("Inside if(fieldName === 'code' || fieldName === 'startDate' || fieldName === 'endDate' && !value)")
      setError(error=> ( {...error, [fieldName]: `${camelToCapitalizedWords(fieldName)} cannot be empty!`} ) )
      e.target.style.borderColor = '#e74c3c'
      return
    }
    if( !['code', 'startDate', 'endDate'].includes(fieldName) && value  && (!regexPattern.test(value) || value < 0) ){
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
    else if(fieldName === 'usageLimitPerCustomer' && formData[fieldName] > 10){
      setError(error=> ( {...error, usageLimitPerCustomer: 'Usage / customer cannot be more than 10!'} ) )
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
        setShowSearchResults(results=> ({...results, products: true}))
        console.log("Getting searched products--")
        debouncedProductSearch(searchData)
    } 
    else{
      setShowSearchResults(results=> ({...results, products: false}))
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
    if(checked){
      setSelectedProducts( products=> [...products, {title: productName}] )
    }else{
      setSelectedProducts( products=> products.filter(product=> product.title !== productName) )
    }
  }

  const debouncedCustomersSearch = useRef(
    debounce((searchData)=> {
        setCustomerQueryOptions(customerQueryOptions=> (
            {...customerQueryOptions, searchData: searchData}
        ))
    }, 600) 
).current; 

  const searchCustomers = (e)=> {
    const searchData = e.target.value
    console.log('searchData--->', searchData)
    if(searchData.trim() !== ''){
        setShowSearchResults(results=> ({...results, customers: true}))
        console.log("Getting searched customers--")
        debouncedCustomersSearch(searchData)
    } 
    else{
      setShowSearchResults(results=> ({...results, customers: false}))
    } 
  }

  const nextCustomers = ()=> {
    setCustomerQueryOptions(customerQueryOptions=> (
      {...customerQueryOptions, page: currentCustomerPart + 1}
    ))
    setCurrentCustomerPart(part=> part++)
  }

  const previousCustomers = ()=> {
    setCustomerQueryOptions(customerQueryOptions=> (
      {...customerQueryOptions, page: currentCustomerPart - 1}
    ))
    setCurrentCustomerPart(part=> part--)
  }

  const customerCheckHandler = (e, username)=> {
    const checked = e.target.checked
    console.log("checked-->", checked)
    if(checked){
      setSelectedCustomers( users=> [...users, {username}] )
    }else{
      setSelectedCustomers( users=> users.filter(user=> user.username !== username) )
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

  const handleSubmit = (e)=> {
    e.preventDefault()
    const {code, startDate, endDate} =  formData
    if(!code || !startDate || !endDate){
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
    if( Object.values(error).some(error=> error.trim() !== '') ){
      toast.error("There are some errors in the form. Please correct them before submitting!")
      return
    }

    let couponId
    if(isEditing){
      couponId = coupon._id
    } 
    coupon ? dispatch( updateCoupon({couponDetails: formData, couponId}) )  : dispatch( createCoupon({couponDetails: formData}) ) 
    onClose()
  }

  if (!isOpen) return null

  return (
    <main className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" id='CouponModal'>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-primary">
          <h2 className="text-[22px] text-secondary font-[640] text-gray-900"> { coupon ? "Edit Coupon" : "Create Coupon" } </h2>
          <button onClick={onClose} className="text-secondary hover:text-purple-700 transition duration-150 ease-in-out">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

          <div className="grid grid-cols-2 gap-4">

            <div className="relative">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Coupon Code
              </label>
              <input type="text" id="code" name="code" value={formData.code} onChange={handleChange} 
                onBlur={(e)=> inputBlurHandler(e, "code")} style={{paddingLeft: '30px'}}/>
              <RiCoupon4Line className="absolute top-[60%] left-[10px] w-[13px] h-[13px] text-muted"/>
              <span className='error right-0'> {error.code && error.code} </span>
            </div>

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
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="2"
              className="resize-none"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">

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

            <div className="relative">
              <div className="flex justify-between items-center">
                <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-700">
                  Maximum Discount Value (optional)
                </label>
              </div>
              <input type="text" id="maxDiscount" name="maxDiscount" value={formData.maxDiscount} placeholder='Leave blank for no limit' 
                 className="h-[2.5rem]" onBlur={(e)=> inputBlurHandler(e, "maxDiscount")} onChange={handleChange}/>
              <div className="input-contoller">
                <Plus onClick={()=> incDecHandler('maxDiscount', 1)}/>
                <Minus onClick={()=> incDecHandler('maxDiscount', -1)}/>
              </div>  
              <span className='error left-0'> {error.maxDiscount && error.maxDiscount} </span>
            </div>

          </div>

          <div className="relative">
            <div className="flex justify-between items-center">
              <label htmlFor="minimumOrderValue" className="block text-sm font-medium text-gray-700">
                Minimum Order Value (optional)
              </label>
            </div>
            <input type="text" id="minimumOrderValue" name="minimumOrderValue" value={formData.minimumOrderValue}
              placeholder="Enter the minimum order amount required to apply this coupon"
               className="h-[2.5rem]" onBlur={(e)=> inputBlurHandler(e, "minimumOrderValue")} onChange={handleChange}/>
            <div className="input-contoller">
              <Plus onClick={()=> incDecHandler('minimumOrderValue', 1)}/>
              <Minus onClick={()=> incDecHandler('minimumOrderValue', -1)}/>
            </div>  
            <span className='error top-0 right-0'> {error.minimumOrderValue && error.minimumOrderValue} </span>
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

          <div className="grid grid-cols-2 gap-4">

            <div className="relative">
              <div className="flex justify-between items-center">
                <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">
                  Usage Limit (optional)
                </label>
              </div>
              <input type="text" id="usageLimit" name="usageLimit" value={formData.usageLimit} className="h-[2.5rem]"
                onChange={handleChange} onBlur={(e)=> inputBlurHandler(e, "usageLimit")}/>
              <div className="input-contoller">
                <Plus onClick={()=> incDecHandler('usageLimit', 1)}/>
                <Minus onClick={()=> incDecHandler('usageLimit', -1)}/>
              </div>
              <span className='error right-0'> {error.usageLimit && error.usageLimit} </span>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center">
                <label htmlFor="usageLimitPerCustomer" className="block text-sm font-medium text-gray-700">
                  Usage Limit Per Customer (optional)
                </label>
              </div>
              <input type="text" id="usageLimitPerCustomer" name="usageLimitPerCustomer" className="h-[2.5rem]"
                value={formData.usageLimitPerCustomer} onChange={handleChange} onBlur={(e)=> inputBlurHandler(e, "usageLimitPerCustomer")}/>
              <div className="input-contoller">
                <Plus onClick={()=> incDecHandler('usageLimitPerCustomer', 1)}/>
                <Minus onClick={()=> incDecHandler('usageLimitPerCustomer', -1)}/>
              </div>
              <span className='error'> {error.usageLimitPerCustomer && error.usageLimitPerCustomer} </span>
            </div>
          </div>

          <div>
            <label htmlFor="applicableType" className="block text-sm font-medium text-gray-700">
              Applicable To
            </label>
            <select id="applicableType" name="applicableType" value={formData.applicableType}  
                onChange={(e)=> applicableTypeHandler(e)}>
              <option value="allProducts"> All Products </option>
              <option value="categories"> Specific Categories </option>
              <option value="products"> Specific Products </option>
            </select>
          </div>

          {formData.applicableType === "categories" && (
            <div className="px-[30px]" id='applicableCategories-section'>
              <label htmlFor="applicableCategories" className="block text-[13px] font-[550] text-gray-700 tracking-[0.5px]">
                { !isEditing ? 'Select Categories' : 'Selected Categories' }
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

                {
                 isEditing && formData.applicableCategories && formData.applicableCategories?.length > 0 && !showCategories &&
                // <div className="mt-[5px] px-[10px] py-[5px] border border-dropdownBorder rounded-[4px]">
                /* <h5 className="mb-[5px] text-[12px] text-muted font-[450]"> Selected Categories </h5> */
                <div className="mt-[5px] flex gap-[10px]">
                  {
                    formData.applicableCategories.map(category=> (
                      <div key={category._id} className="px-[5px] py-[2px] flex items-center gap-[5px] border border-inputBorderSecondary
                         rounded-[12px]">
                        <X className="h-[8px] w-[8px] text-muted cursor-pointer" 
                          onClick={()=> setFormData(formData=> (
                            {...formData, applicableCategories: [...formData.applicableCategories.filter(cat=> cat.name !== category.name)]}
                          ))}/>
                        <span className="text-[11px] text-secondary capitalize"> {category.name} </span>
                      </div>
                    ))
                  }
                </div>
                // </div>
                }
                {
                isEditing && !showCategories &&
                <h5 className="mt-[10px] mb-[5px] text-[12px] text-muted font-[450] hover:underline transition duration-150 cursor-pointer" 
                  onClick={()=> { setFormData(formData=> (
                        {...formData, applicableCategories: []}
                        ));
                       setShowCategories(true)}}>
                Choose different Categories
                </h5>
                }
              </div>
            </div>
          )}

          {formData.applicableType === "products" && (
            <div className="px-[20px]" id='applicableProducts'>
              <label htmlFor="applicableProductsSearch" className="block text-[13px] font-medium text-gray-700">
                Select Products 
              </label>
              <div className="relative">
                <input type='text' placeholder="Search products here..." id='applicableProductsSearch' 
                  className="mt-[5px] w-full h-[1.7rem] text-[12px] px-[5px] pl-[35px] py-[2px] placeholder:text-[11px] border-muted
                    border-dotted rounded-[4px] focus:border-secondary focus:outline-none focus:ring-0" onChange={(e)=> searchProducts(e)} />
                <Search className="absolute top-[12px] left-[12px] w-[14px] h-[14px] text-muted"/>
                {
                  showSearchResults.products && 
                  <ul className="absolute top-[110%] w-full bg-white list-none flex flex-col gap-[7px] px-[7px] py-[10px] border
                   border-dropdownBorder rounded-[4px]">
                    { 
                      products.length > 0 ?
                      products.map(product=> (
                        <li key={product._id} className="flex items-center gap-[7px]">
                            <input type='checkbox' id='selectProducts' className="h-[15px] w-[15px] border border-primary rounded-[3px]
                              focus:ring-0 focus:outline-none checked:bg-primary checked:border-primary checked:text-white 
                                appearance-none active:bg-primary active:border-primary active:text-white cursor-pointer"
                                 onChange={(e)=> productCheckHandler(e, product.title)}
                                 checked={ selectedProducts.some(item=> item.title === product.title) || false }/>
                            <label htmlFor='selectProducts' className="text-[12px] capitalize cursor-pointer hover:text-secondary hover:font-medium">
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
                <div className="mt-[5px] px-[10px] py-[5px] border border-dropdownBorder rounded-[4px]">
                <h5 className="mb-[5px] text-[12px] text-muted font-[450]"> Selected Products </h5>
                <div className="flex gap-[10px]">
                  {
                    selectedProducts.map(product=> (
                      <div key={product.title} className="px-[5px] py-[2px] flex items-center gap-[5px] border border-inputBorderSecondary
                         rounded-[12px]">
                        <X className="h-[8px] w-[8px] text-muted cursor-pointer" 
                          onClick={()=> setSelectedProducts(products=> products.filter(item=> item.title !== product.title ))}/>
                        <span className="text-[11px] text-secondary capitalize"> {product.title} </span>
                      </div>
                    ))
                  }
                </div>
                </div>
              }
            </div>
          )}

          <div className="flex items-center">
            <input type="checkbox" id="customerSpecific" name="customerSpecific" checked={formData.customerSpecific}
              onChange={handleChange} className="mt-[-1px] h-[4px] w-[4px] p-[7px] rounded-[3px] text-secondary focus:ring-secondary border-gray-300"/>
            <label htmlFor="customerSpecific" className="ml-2 block text-sm text-gray-900">
              Customer-specific coupon
            </label>
          </div>
          {/* {formData.customerSpecific && (
            <div>
              <label htmlFor="assignedCustomers" className="block text-sm font-medium text-gray-700">
                Select Customers
              </label>
              <select multiple id="assignedCustomers" name="assignedCustomers" value={formData.assignedCustomers} onChange={handleChange}>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          )} */}
          {formData.customerSpecific && (
            <div className="px-[20px]" id='customers'>
              <label htmlFor="customersSearch" className="block text-[13px] font-medium text-gray-700">
                Select Customers 
              </label>
              <div className="relative">
                <input type='text' placeholder="Search customers here..." id='customersSearch' 
                  className="mt-[5px] w-full h-[1.7rem] text-[12px] px-[5px] pl-[35px] py-[2px] placeholder:text-[11px] border-muted
                    border-dotted rounded-[4px] focus:border-secondary focus:outline-none focus:ring-0" onChange={(e)=> searchCustomers(e)} />
                <Search className="absolute top-[12px] left-[12px] w-[14px] h-[14px] text-muted"/>
                {
                  showSearchResults.customers && 
                  <ul className="absolute top-[110%] w-full bg-white list-none flex flex-col gap-[7px] px-[7px] py-[10px] border
                   border-dropdownBorder rounded-[4px]">
                    { 
                      allUsers.length > 0 ?
                      allUsers.map(user=> (
                        <li key={user._id} className="flex items-center gap-[7px]">
                            <input type='checkbox' id='selectProducts' className="h-[15px] w-[15px] border border-primary rounded-[3px]
                              focus:ring-0 focus:outline-none checked:bg-primary checked:border-primary checked:text-white 
                                appearance-none active:bg-primary active:border-primary active:text-white cursor-pointer"
                                 onChange={(e)=> customerCheckHandler(e, user.username)}
                                 checked={ selectedCustomers.includes(user.username) || false }/>
                            <label htmlFor='selectProducts' className="text-[12px] capitalize cursor-pointer hover:text-secondary hover:font-medium">
                               {user.username} 
                            </label>
                        </li>
                      ))
                      : <h6 className="mx-auto text-[14px] text-muted font-[500]"> No Records! </h6>
                    }
                    {
                      customerQueryOptions.page > 1 &&
                      <i className="px-[10px] py-[5px] w-full bg-primary" onClick={()=> previousCustomers()}>
                        <ChevronUp className="mx-auto w-[15px] h-[15px] text-center text-secondary"/>
                      </i>
                    }
                    {
                      allUsers.length > 5 &&
                      <i className="px-[10px] py-[5px] w-full bg-primary" onClick={()=> nextCustomers()}>
                        <ChevronDown className="mx-auto w-[15px] h-[15px] text-center text-secondary"/>
                      </i>
                    }
                  </ul>
                }
              </div>
              {
                selectedCustomers.length > 0 &&
                <div className="mt-[5px] px-[10px] py-[5px] border border-dropdownBorder rounded-[4px]">
                <h5 className="mb-[5px] text-[12px] text-muted font-[450]"> Selected Users </h5>
                <div className="flex gap-[10px]">
                  {
                    selectedCustomers.map(customer=> (
                      <div key={customer.username} className="px-[5px] py-[2px] flex items-center gap-[5px] border border-inputBorderSecondary
                         rounded-[12px]">
                        <X className="h-[8px] w-[8px] text-muted cursor-pointer" 
                          onClick={()=> setSelectedCustomers(users=> users.filter(user=> user.username !== customer.username ))}/>
                        <span className="text-[11px] text-secondary capitalize"> {customer.username} </span>
                      </div>
                    ))
                  }
                </div>
                </div>
              }
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
             font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-secondary">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
             bg-secondary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
              {coupon ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>

        </form>

      </div>
    </main>
  )
}


