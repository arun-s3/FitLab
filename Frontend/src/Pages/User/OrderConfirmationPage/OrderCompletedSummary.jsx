import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {motion} from 'framer-motion'

import apiClient from '../../../Api/apiClient'
import {format} from "date-fns"

import OrderStepper from '../../../Components/OrderStepper/OrderStepper'
import {SiteButtonSquare, SiteButton} from '../../../Components/SiteButtons/SiteButtons'


export default function OrderCompletedSummary(){

    const [orderSuccessDetails, setOrderSuccessDetails] = useState(null)

    const {user} = useSelector((state)=> state.user)

    const navigate = useNavigate()

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(()=> {
      const loadOrderCompletedDetails = async ()=> {
        try{
          const response = await apiClient.get(`${baseApiUrl}/order/latest`)
          if(response?.data?.order) {
            setOrderSuccessDetails(response.data.order)
          }
        }
        catch(error){
          console.error(error)
        }
      }
      loadOrderCompletedDetails()
    }, [])

    return (
        <div className="container mx-auto px-[1rem] py-[2rem]">
            <motion.h1
              className="text-4xl font-bold text-center mb-[3rem]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: "spring" }}
            >
              Completed!
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <OrderStepper stepNumber={4} />
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto mb-[3rem]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="bg-green-600 text- rounded-lg p-[1.5rem] flex justify-between items-center shadow-lg">
                <div>
                  <motion.h2
                    className="text-2xl text-white font-bold mb-[8px]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Order Completed
                  </motion.h2>
                  <motion.p
                    className="text-green-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                     {
                      orderSuccessDetails ?
                        format(new Date(orderSuccessDetails.estimtatedDeliveryDate), "MMMM dd, yyyy" )
                        : ''
                     }
                  </motion.p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SiteButton
                    customStyle={{ filter: "none" }}
                    clickHandler={() => navigate("/orders")}
                  >
                    View order
                  </SiteButton>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="max-w-2xl mx-auto text-center mb-[3rem]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <h2 className="text-[2rem] font-bold mb-[1.5rem]"> Thank you! </h2>
              <p className="text-[1.5rem] mb-[1.5rem]">
                Your order{" "}
                <motion.span
                  className="text-purple-600 font-medium inline-block"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, type: "spring" }} 
                >
                  { orderSuccessDetails ? orderSuccessDetails.fitlabOrderId : '' }
                </motion.span>{" "}
                has been placed!
              </p>
              <p className="text-gray-600 mb-[2rem]">
                {`We sent an email ${
                  user && user.email ? `to ${user.email}` : ""
                } with your order confirmation and receipt. If the email hasn't arrived within two minutes, 
                  please do check your spam folder for the mail`}
              </p>

              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <SiteButtonSquare clickHandler={()=> navigate("/shop")}>
                  Continue Shopping
                </SiteButtonSquare>
              </motion.div>
            </motion.div>
        </div>
    )
}