import React, {useState, useEffect} from 'react'
import './OfferList.css'
import {useDispatch, useSelector} from 'react-redux'

import { ArrowUpDown, BadgePercent, DiamondPercent, Edit2, ImageUpscale, IndianRupee, Link2, MessageSquareQuote, Scaling,
   ShoppingCart, Trash2 } from "lucide-react"
import { BsToggle2On, BsToggle2Off } from "react-icons/bs"
import {format} from "date-fns"


export default function OfferList({ offers, onEdit, onDelete, onSort, onDeactivate }){

  const [showItemsOf, setShowItemsOf] = useState('')
  const [showCustomersOf, setShowCustomersOf] = useState('')
  const [order, setOrder] = useState(-1)

  const [scaledImg, setScaledImg] = useState([])

  useEffect(()=> {
    console.log('SCALEDIMG--->', scaledImg)
  },[scaledImg])

  const tableHeaders = [
    {value: 'Offer', icon: true, sortBy:'name'}, {value: 'Target Users', icon: false}, 
    {value: 'Discount', icon: false}, {value: 'Recurring Offer', icon: false}, {value: 'Start Date', icon: true, sortBy:'startDate'},
    {value: 'Expiry', icon: true, sortBy:'endDate'}, {value: 'Redemption Count', icon: true, sortBy:'redemptionCount'},
    {value: 'Status', icon: false}, {value: 'Actions', icon: false}
  ]

  const changeSortOrder = ()=> {
    setOrder(order=> order === -1 ? 1 : -1)
  }

  return (
    <div className="mt-[1.5rem] bg-white shadow-md rounded-lg overflow-hidden" id='CouponList'>
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-inputBorderLow">
          <tr>
            { tableHeaders.map( (header)=> (
              <th key={header.value} className="p-3 max-w-[270px] text-left text-[12px] font-medium text-gray-500 uppercase tracking-wider
                 cursor-pointer" onClick={()=> {
                  header.sortBy && onSort(header.sortBy, order)
                  changeSortOrder()
                 }} >
                <div className="flex items-center min-w-0">
                  <span> {header.value} </span>
                  {header.icon && <ArrowUpDown className="h-4 w-4 ml-1 hover:text-purple-700 hover:scale-110 transition duration-100"/>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          { offers && offers.length > 0 ? offers.map((offer, index)=> (
            <tr key={offer?._id} className={`${(index % 2 == 0) ? 'bg-transparent': 'bg-[#eee]'} relative hover:bg-[rgb(249, 245, 252)]`}>
            {
            scaledImg.some(img=> img.id === offer._id) &&
              <img src={ scaledImg.find(img=> img.id === offer._id).url } className='fixed top-[30%] left-[35%] w-[900px] h-[300px]
                 inset-0 bg-black bg-opacity-50 object-cover rounded-[4px] shadow-lg z-[100]'/> 
            }
              <td className="pl-4 py-4 max-w-[280px] border-r border-dashed border-[#A399A880]">
                <div className="min-w-0 mb-4 flex items-center gap-[10px]">
                  <BadgePercent className='w-[15px] h-[15px] text-muted'/>
                  <span className={`text-sm font-medium capitalize line-clamp-2 break-words overflow-hidden block
                        ${offer.status === 'active' ? 'text-green-500' : 'text-red-500' }`}>
                    {offer != null && offer?.name && offer.name}  
                  </span>
                </div>
                {
                  offer.offerBanner ?
                  <figure className='relative w-[150px] h-[50px] p-[2px] rounded-[4px]'>
                    <img src={offer.offerBanner.url} alt={offer.offerBanner.name} className='w-[150px] h-[50px] object-cover
                      border border-primaryDark rounded-[4px]'/> 
                    <i className='absolute bottom-[-10px] left-[5px] w-[12%] h-[50%] z-[20] cursor-pointer'
                       onMouseEnter={()=> setScaledImg(images=> [...images, {id: offer._id, url: offer.offerBanner.url}] )} 
                        onMouseLeave={()=> setScaledImg(images=> images.filter(img=> img.id !== offer._id))}> 
                    <Scaling className='w-[15px] h-[15px] text-white hover:transition hover:scale-110 hover:duration-500'/>
                    </i>
                  </figure> 
                  : null
                }
                {
                  offer?.description ?
                  <div className="mt-[10px] flex items-start gap-[10px] min-w-0">
                    <MessageSquareQuote className='mt-[5px] w-[15px] h-[15px] text-muted'/>
                    <span className='text-[12.5px] text-gray-500 capitalize line-clamp-2 break-words overflow-hidden'>
                         {offer.description} 
                    </span>
                  </div>
                  : null
                }

                <div className='mt-[5px]'>

                <div className='flex items-start gap-[10px] min-w-0'>
                  <Link2 className='w-[15px] h-[15px] text-muted'/>
                  <div>
                    <p className='text-[12.5px] text-gray-500 font-[500]'> Applicable to : </p>
                    <div className="text-sm text-gray-500">
                      {offer?.applicableType === "allProducts" || offer?.applicableType === "products" ? (
                      <span className="relative" onMouseEnter={()=> setShowItemsOf(offer?.name)} onMouseLeave={()=> setShowItemsOf("")}>
                      <span className='text-[12.5px]'> Products - </span>
                      <span className={`text-[11px] ${offer.status === 'active' ? 'text-secondary' : 'text-muted' } 
                        hover:underline hover:font-medium transition duration-300 cursor-pointer`}>
                        {offer?.applicableType === "allProducts" ? "All" : "See products"}
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
                            {offer?.applicableProducts?.filter(product=> !product.variantOf).map((product)=> (
                              <li key={product.title} className="capitalize text-muted">
                                {product.title}
                              </li>
                            ))}
                          </ul>
                          )
                        )}
                      </span>
                      ) : (
                      <span className="relative" onMouseEnter={()=> setShowItemsOf(offer?.name)} onMouseLeave={()=> setShowItemsOf("")}>
                        <span className='text-[12.5px]'> &#8226; Categories -</span>
                        <span className={`text-[11px] ${offer.status === 'active' ? 'text-secondary' : 'text-muted' } 
                          hover:underline hover:font-medium transition duration-300 cursor-pointer`}>
                          See categories
                        </span>
                        
                        {showItemsOf === offer.name && (
                          <ul className={`absolute bottom-[100%] left-[50%] py-[10px] px-[22px] list-disc bg-white 
                            ${offer?.applicableCategories?.length > 6 ? "h-[10rem] overflow-y-scroll" : "h-fit"} border
                             border-dropdownBorder rounded-[4px] z-[10]`}>
                            {offer?.applicableCategories?.map((category)=> (
                              <li key={category.name} className="capitalize text-muted">
                                {category.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </span>
                      )}
                    </div>
                  </div>
                </div>
                
                </div>
              </td>
              <td className="pl-[1rem] py-4 whitespace-nowrap">
                <div className="text-sm capitalize text-gray-500">
                { offer.targetUserGroup } 
                </div>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap">

              </td> */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm capitalize ${offer.status === 'active' ? 'text-secondary' : 'text-muted' } `}>
                {
                  offer?.discountType === 'percentage' ? `${offer?.discountValue} %` 
                    : offer?.discountType === 'fixed' ? `₹ ${offer?.discountValue}`
                    : `${offer?.discountType}`
                }
                </div>
                {
                  offer?.maxDiscount ?
                  <div className='flex items-center gap-[3px] min-w-0'>
                    <IndianRupee className='w-[13px] h-[13px] text-muted'/>
                    <p className='text-[11px] text-muted'>
                      Max Discount - {`${"₹" + offer.maxDiscount}`} 
                    </p>
                  </div>
                  :null
                }
                {
                  offer?.minimumOrderValue ?
                  <div className='flex items-center gap-[3px] min-w-0'>
                    <ShoppingCart className='w-[13px] h-[13px] text-muted'/>
                    <p className='text-[11px] text-muted'>
                      Min Order - {`${"₹" + offer.minimumOrderValue}`} 
                    </p>
                  </div>
                  :null
                }
              </td>
              <td className="pl-[1rem] py-4 whitespace-nowrap">
                <div className="text-sm text-muted capitalize">
                  {offer?.recurringOffer ? `Yes (${offer.recurringFrequency})` : 'No'} 
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
                <div className="text-sm text-gray-500 capitalize">
                { offer?.redemptionCount ? offer?.redemptionCount : '---' }
                </div>
                {
                  offer?.usedCount ?
                  <p className='text-[11px] text-muted'>
                    Used Count - {offer.usedCount} 
                  </p>
                  : null
                }
                {
                  offer?.conversionRate ?
                  <p className={`text-[11px] ${offer.status === 'active' ? 'text-secondary' : 'text-muted' } `}>
                    Conversion Rate - { offer.conversionRate + ' %' } 
                  </p>
                  : null
                }
              </td>
              <td className="px-6 py-4 whitespace-nowrap relative">
                <div className={`w-[2rem] text-sm text-gray-500 capitalize 
                  ${offer.status === 'active' ? 'text-muted' : 'text-red-500' }`}>
                  {offer?.status}
                </div>
                <button className='w-full' onClick={()=> onDeactivate(offer._id)}>
                  {
                    offer.status === 'deactivated' ?
                    <BsToggle2Off className='mt-[2px] h-[20px] w-[20px] text-red-500'/>
                    : offer.status === 'active' ?
                    <BsToggle2On className='mt-[2px] h-[20px] w-[20px] text-green-500'/>
                    :null
                  }
                </button>
                {
                  offer?.lastUsedAt ? 
                  <div className={` absolute !text-[11px] text-gray-500 capitalize 
                    ${offer.status === 'active' ? 'text-green-500' : 'text-red-500' }`}>
                    { 'Last Used -' + format( new Date(offer.lastUsedAt), "MMMM dd, yyyy" ) }
                  </div>
                  : null
                }
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
          ))
        : <h2 className='text-[15px] text-muted capitalize'> No Offers Available! </h2>}
        </tbody>
      </table>
    </div>
  )
}


