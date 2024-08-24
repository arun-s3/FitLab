import React, { useEffect } from'react'
import {useSelector} from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateAdminRoutes(){

    const {adminToken} = useSelector(state=>state.admin)

    useEffect(()=>{
        console.log("Inside PrivateAdminRoutes")
    })

    console.log("adminToken inside PrivateAdminRoutes-->"+adminToken)
    return adminToken? <Outlet/> : <Navigate to="/admin/signin"/> 
}