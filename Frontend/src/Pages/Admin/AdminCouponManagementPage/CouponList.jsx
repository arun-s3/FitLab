import React from 'react'
import './CouponList.css'

import { ArrowUpDown, Edit2, Trash2 } from "lucide-react"



export default function CouponList({ coupons, onEdit, onDelete, onSort, sortConfig }){
  return (
    <div className="mt-[1.5rem] bg-white shadow-md rounded-lg overflow-hidden" id='CouponList'>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-inputBorderLow">
          <tr>
            {["Code", "Description", "Discount Type", "Applicable To", "Start Date", "Expiry", "Used/ Usage-limit", "Status", "Actions"]
              .map((header)=> (
              <th key={header} className="px-[12px] py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider
                 cursor-pointer" onClick={()=> onSort(header.toLowerCase().replace(" ", ""))} >
                <div className="flex items-center">
                  {header}
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {coupons.map((coupon)=> (
            <tr key={coupon._id} >
              <td className="pl-[1rem] py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-green-500">{coupon.code}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{coupon.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 capitalize">{coupon.discountType}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  { 
                  coupon.applicableType === 'allProducts' || coupon.applicableType === 'products' ?
                     <span>
                        <span> Products -</span>
                        <span> {coupon.applicableType === 'allProducts' ? '[All]' : '[See Products]'} </span>
                     </span> 
                    :<span>
                      <span> Categories -</span>
                      <span> [See Categories] </span>
                    </span> 
                  }
                </div>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                </div>
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{new Date(coupon.startDate).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{new Date(coupon.endDate).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{`${coupon.usedCount} / ${coupon.usageLimit || "∞"}`}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 capitalize">{coupon.status}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={()=> onEdit(coupon)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                  <Edit2 className="h-5 w-5" />
                </button>
                <button onClick={()=> onDelete(coupon)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


