import React, {useState} from 'react'
import './OfferList.css'

import { ArrowUpDown, Edit2, Trash2 } from "lucide-react"



export default function OfferList({ offers, onEdit, onDelete, onSort, sortConfig }){

  const [showItemsOf, setShowItemsOf] = useState('')
  const [showCustomersOf, setShowCustomersOf] = useState('')
  const [order, setOrder] = useState(-1)

  const tableHeaders = [
    {value: 'Name', icon: true, sortBy:'name'}, {value: 'Description', icon: false}, {value: 'Discount', icon: false},
    {value: 'Applicable To', icon: false}, {value: 'Start Date', icon: true, sortBy:'startDate'}, {value: 'Expiry', icon: true, sortBy:'endDate'},
    {value: 'Status', icon: false}, {value: 'Actions', icon: false}
  ]

  const changeSortOrder = ()=> {
    setOrder(order=> order === -1 ? 1 : -1)
  }

  return (
    <div className="mt-[1.5rem] bg-white shadow-md rounded-lg overflow-hidden" id='CouponList'>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-inputBorderLow">
          <tr>
            { tableHeaders.map( (header)=> (
              <th key={header} className="px-[12px] py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider
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
          { offers && offers.length > 0 && offers.map((offer, index)=> (
            <tr key={offer?._id} className={`${(index % 2 == 0) ? 'bg-transparent': 'bg-[#eee]'} hover:bg-[rgb(249, 245, 252)]`}>
              <td className="pl-[1rem] py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-green-500">
                {offer?.name && offer?.name.length > 13 ? offer.name.substring(0,10) + '...' : offer.name} 
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">
                {offer?.description && offer?.description.length > 12 ? offer?.description.substring(0, 12) + '...' : offer.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 capitalize">
                {
                  offer?.discountType === 'percentage' ? `${offer?.discountValue} %` 
                    : offer?.discountType === 'fixed' ? `&#8377; ${offer?.discountValue}`
                    : `${offer?.discountType}`
                }
                </div>
                <p className='text-[11px] text-muted'>
                  Max Discount - {`${offer?.maxDiscount ? "&#8377;" + offer.maxDiscount : 'Nil'}`} 
                </p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">

                <div className="text-sm text-gray-500">
                  {offer?.applicableType === "allProducts" || offer?.applicableType === "products" ? (
                    <span className="relative" onMouseEnter={()=> setShowItemsOf(offer?.name)} onMouseLeave={()=> setShowItemsOf("")}>
                      <span> Products - </span>
                      <span className="text-[11px] text-secondary hover:underline hover:font-medium transition duration-300 cursor-pointer">
                        {offer?.applicableType === "allProducts" ? "[All]" : "[See products]"}
                      </span>
                  
                      {showItemsOf === offer.name && (
                        offer?.applicableType === "allProducts" ? (
                          <div className={`absolute bottom-[100%] left-[50%] py-[10px] px-[10px] bg-white border border-dropdownBorder
                             rounded-[4px] z-[10] capitalize text-muted opacity-100 transition-opacity duration-1000 ease-in
                            ${offer?.applicableProducts?.length > 6 ? "h-[10rem] overflow-y-scroll" : "h-fit"} `}>
                            Applies to all products
                          </div>
                        ) : (
                          <ul className={`absolute bottom-[100%] left-[50%] py-[10px] px-[22px] list-disc bg-white
                            ${offer?.applicableProducts?.length > 6 ? "h-[10rem] overflow-y-scroll" : "h-fit"} 
                              border border-dropdownBorder rounded-[4px] z-[10]`}>
                            {offer?.applicableProducts?.map((product) => (
                              <li key={product.title} className="capitalize text-primaryDark">
                                {product.title}
                              </li>
                            ))}
                          </ul>
                        )
                      )}
                    </span>
                  ) : (
                    <span className="relative" onMouseEnter={()=> setShowItemsOf(offer?.name)} onMouseLeave={()=> setShowItemsOf("")}>
                      <span> Categories -</span>
                      <span className="text-[11px] text-secondary hover:underline hover:font-medium transition duration-300 cursor-pointer">
                        [See categories]
                      </span>
                  
                      {showItemsOf === offer.name && (
                        <ul className={`absolute bottom-[100%] left-[50%] py-[10px] px-[22px] list-disc bg-white 
                          ${offer?.applicableCategories?.length > 6 ? "h-[10rem] overflow-y-scroll" : "h-fit"} border
                           border-dropdownBorder rounded-[4px] z-[10]`}>
                          {offer?.applicableCategories?.map((category) => (
                            <li key={category.name} className="capitalize text-primaryDark">
                              {category.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </span>
                  )}
                  {/* <p className='relative text-[11px]'> Customer Specific - {`${coupon?.customerSpecific ? 'Yes' : 'No'}`} 
                  { 
                    coupon?.customerSpecific && 
                    <span className="text-[11px] text-secondary hover:underline hover:font-medium cursor-pointer"
                      onMouseEnter={()=> setShowCustomersOf(coupon?.code)} onMouseLeave={()=> setShowCustomersOf("")}>
                       &nbsp; [See]
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
                  </p> */}
                </div>

              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {offer.discountType === "percentage" ? `${offer.discountValue}%` : `$${offer.discountValue}`}
                </div>
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{new Date(offer?.startDate).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{new Date(offer?.endDate).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 capitalize">{offer?.status}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={()=> onEdit(offer)} className="mr-4">
                  <Edit2 className="h-[15x] w-[15px] text-secondary hover:text-purple-900" />
                </button>
                <button onClick={()=> onDelete(offer)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-[15x] w-[15px]" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


