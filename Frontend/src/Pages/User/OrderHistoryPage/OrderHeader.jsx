import React from 'react'
import './OrderHistoryPage.css'
import {Link} from 'react-router-dom'

import {ShoppingBag, FileText}  from 'lucide-react'

import {format} from "date-fns"
import apiClient from '../../../Api/apiClient'
import {toast as sonnerToast} from 'sonner'


export default function OrderHeader({order, onViewOrderDetails}){

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    const exportInvoice = async(orderId)=> {
      try{
        const response = await apiClient.get(`${baseApiUrl}/order/invoice/${orderId}`,{responseType: 'blob'})
        if(response?.data) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `invoice_${orderId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
      }
      catch(error){
        if (!error.response) {
          sonnerToast.error("Network error. Please check your internet.")
        } else if (error.response?.status === 404) {
          sonnerToast.error(error.response.data.message || "Error while exporting your invoice. Please try later!")
        } else {
          sonnerToast.error("Something went wrong! Please retry later.")
        }
      }  
    }


    return(
                  
        <div className={`p-[1.5rem] grid grid-cols-4 gap-4 border-b border-dashed
           ${order.orderStatus === 'cancelled' || order.orderStatus === 'returning'? 'border-red-300':'border-mutedDashedSeperation'}`}>
          <div className="space-y-1">
            <h3 className="label">Order placed</h3> 
            <span className="name">{format( new Date(order.orderDate), "MMMM dd, yyyy" )}</span>
          </div>
          <div className="space-y-1">
            <h3 className="label">Total</h3>      
            <span className="name text-secondary">&#8377; {order.absoluteTotalWithTaxes}</span>
          </div>
          {
            order.shippingAddress && order.shippingAddress.firstName &&
              <div className="space-y-1">
                <h3 className="label">Ship to</h3>       
                <span className="name capitalize">{order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName}</span>
              </div>
          }
          {
            order.paymentDetails?.transactionId &&
              <div className="text-right space-y-1">            
                <h3 className="label">Order # {order.paymentDetails.transactionId}</h3>
                <div className="space-x-4 order-details">
                  <Link className="hover:scale-105 transition duration-150" 
                      onClick={onViewOrderDetails}>                  
                    <ShoppingBag className='text-secondary hover:text-primaryDark transition-colors duration-300'/>
                    <span className='text-secondary hover:text-primaryDark transition-colors duration-300'>
                      View order details
                    </span>
                  </Link>
                  <Link className="hover:scale-105 transition duration-150" onClick={()=> exportInvoice(order._id)}>                      
                    <FileText className='text-secondary hover:text-primaryDark transition-colors duration-300'/>
                    <span className='text-secondary hover:text-primaryDark transition-colors duration-300'>
                       View invoice 
                    </span>
                  </Link>
                </div>
              </div>
          }
        </div>

            
    )
}



