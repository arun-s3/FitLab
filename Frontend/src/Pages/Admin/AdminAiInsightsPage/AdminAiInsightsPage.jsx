import React, { useState, useEffect, useRef } from "react"
import './FutureRevenueChart.css'
import {useOutletContext} from 'react-router-dom'

import {TrendingUp, TrendingUpDown} from "lucide-react"
import {BsFillCartCheckFill} from "react-icons/bs"
import {HiUserGroup} from "react-icons/hi"
import {MdTipsAndUpdates} from "react-icons/md"
import {IoPricetagsOutline} from "react-icons/io5"
import {RiUserHeartLine} from "react-icons/ri"
import {toast as sonnerToast} from 'sonner'
import {toast} from 'react-toastify'
import axios from 'axios'

import AiInsightCards from "../../../Components/AiInsightCards/AiInsightCards"
import FutureRevenueChart from "./FutureRevenueChart"
import AdminTitleSection from "../../../Components/AdminTitleSection/AdminTitleSection"


export default function AdminAiInsightsPage(){
    
    const [dashboardDatas, setDashboardDatas] = useState(null)
    const [dashboardInsights, setDashboardInsights] = useState(null)

    const [sourceDatasForAnalysis, setSourceDatasForAnalysis] = useState(null)

    const [generateAiInsights, setGenerateAiInsights] = useState(false)

    const [futureMonthlyRevenueTrends, setFutureMonthlyRevenueTrends] = useState(null)

    const [propabilityAndSuggestionInsights, setPropabilityAndSuggestionInsights] = useState(null)
    
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(null)

    const {setPageBgUrl} = useOutletContext()
    setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.94),rgba(255,255,255,0.94)), url('/Images/admin-aiInsights.png')`)

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    const insightsTemplates = [
        {
          id: 1,
          icon: TrendingUp,
          title: "Revenue & Growth Performance Insights",
          description: "",
          color: "bg-lime-500",
          textColor: "text-lime-500",
          bgLight: "bg-lime-50",
          bgDark: "dark:bg-lime-950/30",
        },
        {
          id: 2,
          icon: BsFillCartCheckFill,
          title: "Order Completion Analysis and Rate",
          description: "",
          color: "bg-orange-500",
          textColor: "text-orange-500",
          bgLight: "bg-orange-50",
          bgDark: "dark:bg-orange-950/30",
        },
        {
          id: 3,
          icon: HiUserGroup,
          title: "Customer Growth & Retention",
          description: "",
          color: "bg-slate-500",
          textColor: "text-slate-500",
          bgLight: "bg-slate-50",
          bgDark: "dark:bg-slate-950/30", 
        },
        {
          id: 4,
          icon: IoPricetagsOutline,
          title: "Discount & Promotion Effectiveness",
          description: "",
          color: "bg-purple-500",
          textColor: "text-purple-500",
          bgLight: "bg-purple-50",
          bgDark: "dark:bg-purple-950/30",
        },
        {
          id: 5,
          icon: RiUserHeartLine,
          title: "Customer Trust and Score",
          description: "",
          color: "bg-purple-500",
          textColor: "text-purple-500",
          bgLight: "bg-purple-50",
          bgDark: "dark:bg-purple-950/30",
        },
        {
          id: 6,
          icon: MdTipsAndUpdates,
          title: "Suggestions and Tips",
          description: "",
          color: "bg-green-500",
          textColor: "text-green-500",
          bgLight: "bg-green-50",
          bgDark: "dark:bg-green-950/30",
        },
        {
          id: 7,
          icon: TrendingUpDown,
          title: "Business Growth Probability",
          description: "",
          color: "bg-yellow-500",
          textColor: "text-yellow-500",
          bgLight: "bg-yellow-50",
          bgDark: "dark:bg-yellow-950/30",
        },
    ]

    const reccomendationTemplateTitles = ["Suggestions and Tips", "Business Growth Probability"]

    const showError = ()=> {
      sonnerToast.error("Something went wrong! Please check your network and retry later!")
      setError("Something went wrong! Please check your network and retry later!")
    }
    
    const getInsightDataSources = async()=> {
        console.log("Inside getInsightDataSources...") 
        setLoading(true)
        try {  
            const latestInsightResponse = await axios.get(`${baseApiUrl}/ai/insights/business`, { withCredentials: true })

            if(latestInsightResponse.status === 200){ 
                console.log("latestInsightResponse.data.businessInsightDoc------->", latestInsightResponse.data.businessInsightDoc)     
                const businessInsightDoc = latestInsightResponse.data.businessInsightDoc    
                if (businessInsightDoc) {
                    console.log("Returning cached AI response")
                    setDashboardInsights(businessInsightDoc.insights)
                    return
                }else{
                    setGenerateAiInsights(true) 
                }
            }

            if(latestInsightResponse.status === 404){
                sonnerToast.error(error.response.data.message)
                setError(error.response.data.message)
            } 

        }catch (error) {
          console.error("Error while fetching latest insight datas", error.message)
          showError()
        }finally{
          setLoading(false)
        }
    }
    
    useEffect(()=> {
      getInsightDataSources() 
    }, [])

    useEffect(() => {
        const fetchAllStats = async ()=> {
            setLoading(true)

            let newStats = {}
                        
            const [
                orderOverTimeRes, avgOrdersRes, monthlyRevenueRes, userGrowthRes, discountImpactRes, refundRequestRes
            ] = await Promise.allSettled([
                axios.get(`${baseApiUrl}/admin/dashboard/orders/stats/monthly`, { withCredentials: true }),
                axios.get(`${baseApiUrl}/admin/dashboard/orders/average`, { withCredentials: true }),
                axios.get(`${baseApiUrl}/admin/dashboard/revenue/monthly`, { withCredentials: true }),
                axios.get(`${baseApiUrl}/admin/dashboard/customers/monthly`, { withCredentials: true }),
                axios.get(`${baseApiUrl}/admin/dashboard/coupons/impact`, { withCredentials: true }),
                axios.get(`${baseApiUrl}/admin/dashboard/payments/refunds`, { withCredentials: true })
            ])
        
            if (orderOverTimeRes.status === 'fulfilled'){ 
                const response = orderOverTimeRes.value
                console.log("orderOverTimeRes response----->", response.data.ordersOverTime) 
                newStats = {...newStats, ordersOverTime: response.data.ordersOverTime} 
            }else{
                console.log("Error in total revenue:", orderOverTimeRes.reason.message)
                showError()
            }
        
            if (avgOrdersRes.status === 'fulfilled'){
                const response = avgOrdersRes.value
                console.log("avgOrdersRes ----->", response.data.averageOrderTotal) 
                newStats = {...newStats, averageOrders: response.data.averageOrderTotal} 
            }else{
                console.log("Error in avg orders:", avgOrdersRes.reason.message)
                showError()
            } 

            if (monthlyRevenueRes.status === 'fulfilled') { 
                const response = monthlyRevenueRes.value
                console.log("monthlyRevenueRes ----->", response.data.revenueDatas) 
                newStats = {...newStats, monthlyRevenueDatas: response.data.revenueDatas}
            }else{
              console.log("Error in total orders:", totalOrdersResponse.reason.message) 
              showError()
            }

            if (userGrowthRes.status === 'fulfilled') {
                const response = userGrowthRes.value
                console.log("userGrowthResponse response----->", response.data.monthlyUserGrowthData) 
                newStats = {...newStats, monthlyUserGrowthDatas: response.data.monthlyUserGrowthData}
            }else{
              console.log("Error in total orders:", userGrowthRes.reason.message) 
              showError()
            }

            if (discountImpactRes.status === 'fulfilled'){
                const response = discountImpactRes.value
                console.log("discountImpactRes response----->", response.data) 
                newStats = {...newStats, couponDiscountImpacts: response.data}
            }
            else{
                console.log("Error in user coupon redemption response:", discountImpactRes.reason.message)
                showError()
            }

            if (refundRequestRes.status === 'fulfilled'){
                const response = refundRequestRes.value
                console.log("refundRequestRes ----->", response.data.refundRequestDatas) 
                newStats = {...newStats, refundRequestDatas: response.data.refundRequestDatas}
            }
            else{
                console.log("Error in refundRequestRes response:", refundRequestRes.reason.message)
                showError()
            }

            setDashboardDatas(newStats)

            setLoading(false)
            setGenerateAiInsights(false)
        }
        
        if(generateAiInsights){
            fetchAllStats();
        }
    }, [generateAiInsights])

    useEffect(()=> {
      if(dashboardDatas){
        const insightDatatypes = [
            "ordersOverTime", "averageOrders", "monthlyRevenueDatas", "monthlyUserGrowthDatas", "couponDiscountImpacts", "refundRequestDatas"
        ]
        const everyInsightDatatypesExists = insightDatatypes.every(datatype=> Object.keys(dashboardDatas).includes(datatype))
        if(everyInsightDatatypesExists){
          const sourceDatas = {analysisType: "fitlabDashboardDatas", dashboardDatas}
          setSourceDatasForAnalysis(sourceDatas)
        }
      }
    }, [dashboardDatas])

    useEffect(()=> {
      console.log("propabilityAndSuggestionInsights----->", propabilityAndSuggestionInsights) 
      if(propabilityAndSuggestionInsights){
        setFutureMonthlyRevenueTrends(propabilityAndSuggestionInsights["Probable Monthly Revenue Trends"])
      }
    }, [propabilityAndSuggestionInsights])
    

    return (
       <section id='AdminAiInsightsPage'>   

          <header>  
              <AdminTitleSection 
                  heading='AI Analysis and Insights'
                  subHeading="AI-powered insights enabling smarter decisions, performance tracking, trend analysis, and growth optimization"
              />    
          </header> 

          <main className='w-full'> 

            <AiInsightCards 
                insightsTemplates={insightsTemplates}
                requiredSourceDatas={sourceDatasForAnalysis}
                existingAiInsights={dashboardInsights}
                sectionTitle="Business Insights"
                sectionSubtitle="Insights generated from your customers, orders, coupons, refunds, payments and revenues"
                cardStyles="grid grid-cols-1 md:grid-cols-2 gap-6"
                sourceDatasLoading={loading}
                excludeAndReturnItemTitles={["Probable Monthly Revenue Trends" , "Suggestions and Tips", "Business Growth Probability"]}
                onReturnExclusiveDatas={(insights)=> setPropabilityAndSuggestionInsights(insights)} 
                parentFetchError={error}
            />

            <div className="mt-8">

              <FutureRevenueChart 
                monthlyRevenueTrends={futureMonthlyRevenueTrends}
                parentFetchError={error}
              />

            </div>

            <AiInsightCards 
                insightsTemplates={insightsTemplates.filter(template=> reccomendationTemplateTitles.some(title=> title === template.title))}
                existingAiInsights={dashboardInsights}
                sectionTitle="Recommendations and Probability Insights"
                sectionSubtitle="Insights generated from your order statuses, customers, orders, refunds, coupons, payments and revenues"
                cardStyles="grid grid-cols-1 gap-6"
                sourceDatasLoading={loading}
                parentFetchError={error}
            />

          </main>   

      </section>
  )
}


