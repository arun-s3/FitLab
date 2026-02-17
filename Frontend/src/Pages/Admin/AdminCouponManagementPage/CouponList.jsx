import React, {useState} from 'react'
import './CouponList.css'

import { ArrowUpDown, Edit2, Trash2 } from "lucide-react"
import { BsToggle2On, BsToggle2Off } from "react-icons/bs";


export default function CouponList({ coupons, onEdit, onDelete, onDeactivate, onSort, sortConfig }){

  const [showItemsOf, setShowItemsOf] = useState('')
  const [showCustomersOf, setShowCustomersOf] = useState('')
  const [order, setOrder] = useState(-1)

  const tableHeaders = [
    {value: 'Code', icon: true, sortBy:'code'}, {value: 'Description', icon: false}, {value: 'Discount', icon: false},
    {value: 'Applicable To', icon: false}, {value: 'Start Date', icon: true, sortBy:'startDate'}, {value: 'Expiry', icon: true, sortBy:'endDate'},
    {value: 'Used/ Usage-limit', icon: true, sortBy:'usageLimit'}, {value: 'Status', icon: false}, {value: 'Actions', icon: false}
  ]

  const changeSortOrder = ()=> {
    setOrder(order=> order === -1 ? 1 : -1)
  }

  return (
    <div className={`mt-[1.5rem] overflow-hidden 
      ${coupons.length > 0 ? 'bg-white shadow-md rounded-lg' : 'flex justify-center items-center'}`} id='CouponList'>
      {
        coupons.length > 0 ?
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-inputBorderLow">
              <tr>
                { tableHeaders.map( (header)=> (
                  <th key={header.value} className="px-[12px] py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider
                     cursor-pointer" onClick={()=> {
                      header.sortBy && onSort(header.sortBy, order)
                      changeSortOrder()
                     }} >
                    <div className="flex items-center">
                      {header.value}
                      {header.icon && <ArrowUpDown className="h-4 w-4 ml-1 hover:text-purple-700 hover:scale-110 transition duration-100"/>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              { coupons.map((coupon, index)=> (
                <tr key={coupon?._id} className={`${(index % 2 == 0) ? 'bg-transparent': 'bg-[#eee]'} hover:bg-[rgb(249, 245, 252)]`}>
                  <td className="pl-[1rem] py-4 max-w-[120px]">
                    <div className={`text-sm font-medium line-clamp-2 break-words overflow-hidden
                         ${coupon.status === 'active' ? 'text-green-500' : 'text-red-500' } `}>
                    {coupon && coupon?.code && coupon.code} 
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                    {coupon?.description && coupon?.description.length > 12 ? coupon?.description.substring(0, 12) + '...' : coupon.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 capitalize">
                    {
                      coupon?.discountType === 'percentage' ? `${coupon?.discountValue} %` 
                        : coupon?.discountType === 'fixed' ? `&#8377; ${coupon?.discountValue}`
                        : `${coupon?.discountType}`
                    }
                    </div>
                    <p className='text-[11px] text-muted'>
                      Max Discount - {`${coupon?.maxDiscount ? "&#8377;" + coupon.maxDiscount : 'Nil'}`} 
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  
                    <div className="text-sm text-gray-500">
                      {coupon?.applicableType === "allProducts" || coupon?.applicableType === "products" ? (
                        <span className="relative" onMouseEnter={()=> setShowItemsOf(coupon?.code)} onMouseLeave={()=> setShowItemsOf("")}>
                          <span> Products - </span>
                          <span className={`text-[11px] ${coupon.status === 'active' ? 'text-secondary' : 'text-muted' }
                            hover:underline hover:font-medium transition duration-300 cursor-pointer`}>
                            {coupon?.applicableType === "allProducts" ? "[All]" : "[See products]"}
                          </span>
                      
                          {showItemsOf === coupon.code && (
                            coupon?.applicableType === "allProducts" ? (
                              <div className={`absolute bottom-[100%] left-[50%] py-[10px] px-[10px] bg-white border border-dropdownBorder
                                 rounded-[4px] z-[10] capitalize text-muted opacity-100 transition-opacity duration-1000 ease-in
                                ${coupon?.applicableProducts?.length > 6 ? "h-[10rem] overflow-y-scroll" : "h-fit"} `}>
                                Applies to all products
                              </div>
                            ) : (
                              <ul className={`absolute bottom-[100%] left-[50%] py-[10px] px-[22px] list-disc bg-white
                                ${coupon?.applicableProducts?.length > 6 ? "h-[10rem] overflow-y-scroll" : "h-fit"} 
                                  border border-dropdownBorder rounded-[4px] z-[10]`}>
                                {coupon?.applicableProducts?.filter(product=> !product.variantOf).map((product) => (
                                  <li key={product.title} className="capitalize text-primaryDark">
                                    {product.title}
                                  </li>
                                ))}
                              </ul>
                            )
                          )}
                        </span>
                      ) : (
                        <span className="relative" onMouseEnter={()=> setShowItemsOf(coupon?.code)} onMouseLeave={()=> setShowItemsOf("")}>
                          <span> Categories -</span>
                          <span className="text-[11px] text-secondary hover:underline hover:font-medium transition duration-300 cursor-pointer">
                            [See categories]
                          </span>
                      
                          {showItemsOf === coupon.code && (
                            <ul className={`absolute bottom-[100%] left-[50%] py-[10px] px-[22px] list-disc bg-white 
                              ${coupon?.applicableCategories?.length > 6 ? "h-[10rem] overflow-y-scroll" : "h-fit"} border
                               border-dropdownBorder rounded-[4px] z-[10]`}>
                              {coupon?.applicableCategories?.map((category) => (
                                <li key={category.name} className="capitalize text-primaryDark">
                                  {category.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </span>
                      )}
                      <p className='relative text-[11px]'> Customer Specific - {`${coupon?.customerSpecific ? 'Yes' : 'No'}`} 
                      { 
                        coupon?.customerSpecific && 
                        <span className="text-[11px] text-secondary hover:underline hover:font-medium cursor-pointer"
                          onMouseEnter={()=> setShowCustomersOf(coupon?.code)} onMouseLeave={()=> setShowCustomersOf("")}>
                          <span className={`${coupon.status === 'active' ? 'text-secondary' : 'text-muted' }`}>
                            &nbsp; [See]
                          </span>
                          {
                            showCustomersOf === coupon.code &&
                            <ul className={`absolute bottom-[100%] left-[50%] py-[10px] px-[22px] list-disc bg-white
                              ${coupon?.assignedCustomers?.length > 6 ? "h-[10rem] overflow-y-scroll" : "h-fit"} border border-dropdownBorder
                                 rounded-[4px] z-[10]`}>
                              {
                                coupon.assignedCustomers.map(customer=> (
                                  <li key={customer.username} className="capitalize text-primaryDark">
                                        {customer.username}
                                  </li>
                                ))
                              }
                            </ul>
                          }
                        </span>
                      }
                      </p>
                    </div>
                    
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                    </div>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(coupon?.startDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(coupon?.endDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {`${coupon?.usedCount} / ${coupon?.usageLimit || "unlimited"}`}
                    </div>
                    <p className='text-[11px] text-muted'>
                      Limit / Customer - {`${coupon?.usageLimitPerCustomer ? coupon.usageLimitPerCustomer : 'Not available'}`} 
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`w-[2rem] text-sm text-gray-500 capitalize ${coupon.status === 'active' ? 'text-muted' : 'text-red-500' } `}>
                      {coupon?.status}
                    </div>
                    <button className='w-full' onClick={()=> onDeactivate(coupon._id)}>
                      {
                        coupon.status === 'deactivated' ?
                        <BsToggle2Off className='mt-[2px] h-[20px] w-[20px] text-red-500'/>
                        : coupon.status === 'active' ?
                        <BsToggle2On className='mt-[2px] h-[20px] w-[20px] text-green-500'/>
                        :null
                      }
                    </button>
                  </td>
                  <td className="px-6 py-[1.5rem]">
                    <div className='flex items-center gap-[10px]'>
                      <button onClick={()=> onEdit(coupon)}>
                        <Edit2 className="h-[15x] w-[15px] text-secondary hover:text-purple-900" />
                      </button>
                      <button onClick={()=> onDelete(coupon)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-[15x] w-[15px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        : 
        <h3 className='mt-[12rem] text-[13px] xs-sm2:text-[16px] xs-sm:text-[17px] text-muted capitalize tracking-[0.5px]'>
             No Coupons Available Right Now ! 
        </h3>
      }
    </div>
  )
}


