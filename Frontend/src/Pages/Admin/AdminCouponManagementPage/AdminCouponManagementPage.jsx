import React, {useState, useEffect, useRef} from 'react'
import './AdminCouponManagementPage.css'
import {useOutletContext} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux"


import { Plus, Search } from "lucide-react"

import AdminHeader from '../../../Components/AdminHeader/AdminHeader'
import CouponList from "./CouponList"
import CouponModal from "./CouponModal"
import CouponDeleteModal from "./CouponDeleteModal"
import {getAllCoupons, resetCouponStates} from '../../../Slices/couponSlice'




export default function AdminCouponManagementPage(){

    const [coupons, setCoupons] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" })

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [editingCoupon, setEditingCoupon] = useState(null)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [couponToDelete, setCouponToDelete] = useState(null)

    const [queryOptions, setQueryOptions] = useState({page: 1, limit: 6})

    const {setHeaderZIndex} = useOutletContext()
    setHeaderZIndex(0)

    const {coupons: allCoupons } = useSelector(state=> state.coupons)
    const dispatch = useDispatch()
    
  
    useEffect(() => {
      dispatch( getAllCoupons({queryOptions}) )
    }, [])

    useEffect(() => {
      if(allCoupons.length > 0){
        setCoupons(allCoupons)
      }
    }, [allCoupons])
  
    // useEffect(() => {
    //   const filtered = coupons.filter(
    //     (coupon) =>
    //       coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       coupon.description.toLowerCase().includes(searchTerm.toLowerCase()),
    //   )
    //   setFilteredCoupons(filtered)
    // }, [searchTerm, coupons])
  
    const handleSort = (key) => {
      const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
      setSortConfig({ key, direction })
      const sorted = [...coupons].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1
        return 0
      })
      setCoupons(sorted)
    }
  
    const handleEditCoupon = (updatedCoupon) => {
      // Replace this with actual API call
      const updatedCoupons = coupons.map((coupon) => (coupon.id === updatedCoupon.id ? updatedCoupon : coupon))
      setCoupons(updatedCoupons)
      setIsModalOpen(false)
      setEditingCoupon(null)
    }
  
    const handleDeleteCoupon = () => {
      // Replace this with actual API call
      const updatedCoupons = coupons.filter((coupon) => coupon.id !== couponToDelete.id)
      setCoupons(updatedCoupons)
      setIsDeleteModalOpen(false)
      setCouponToDelete(null)
    }


    return(
        <section id='AdminCouponManagementPage'>

            <header>

                <AdminHeader heading='Coupon Management' subHeading="Manage and track Coupons with Advanced controls and Analytics"/>

            </header>

            <main>

                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                      <div className="relative">
                        <input type= "text" placeholder="Search coupons..." value={searchTerm} 
                            className="w-[20rem] h-[36px] text-[15px] pl-10 pr-4 py-2 rounded-[6px] border border-gray-300 tracking-[0.2px]  placeholder:text-[12px]
                                  focus:outline-none focus:ring-2 focus:ring-secondary" onChange={(e)=> setSearchTerm(e.target.value)}/>
                        <Search className="absolute left-3 top-2.5 h-[17px] w-[17px] text-gray-400" />
                      </div>
                      <button onClick={()=> setIsModalOpen(true)} className="bg-secondary text-[15px] text-white px-[12px] py-[6px]
                       rounded-md hover:bg-purple-700 transition duration-300 flex items-center">
                        <Plus className="h-5 w-5 mr-2" />
                        Create Coupon
                      </button>
                    </div>

                    <CouponList coupons={coupons} onEdit={(coupon)=> { setEditingCoupon(coupon); setIsModalOpen(true); }}
                      onDelete={(coupon)=> { setCouponToDelete(coupon); setIsDeleteModalOpen(true); }}
                        onSort={handleSort} sortConfig={sortConfig} />

                    <CouponModal isOpen={isModalOpen} onClose={()=> { setIsModalOpen(false); setEditingCoupon(null); }}
                        coupon={editingCoupon} />

                    <CouponDeleteModal isOpen={isDeleteModalOpen} onClose={()=> setIsDeleteModalOpen(false)}
                        onConfirm={handleDeleteCoupon}  itemName={couponToDelete?.code} />
                        
                </div>

            </main>

        </section>
    )
}