import React, { useEffect } from'react'
import {useSelector} from 'react-redux'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import UserPresenceErrorPage from '../../Pages/Admin/AdminErrorPages/UserPresenceErrorPage'

export default function PrivateAdminRoutes(){

    const {adminToken, admin} = useSelector(state=> state.admin)
    const {userToken, user} = useSelector(state=> state.user)

    const navigate = useNavigate()

    useEffect(()=>{
        console.log("Inside PrivateAdminRoutes")
    })
    useEffect(()=> {
        console.log("Inside useEffect of PrivateAdminRoutes")
        if(userToken && !user.isAdmin){
            console.log("Inside useEffect of PrivateAdminRoutes, userToken && !user.isAdmin")
            navigate(<UserPresenceErrorPage/>, {replace: true})
        }
    },[userToken, user, adminToken, admin])
    console.log("UserToken available?-->", userToken)
    console.log("adminToken inside PrivateAdminRoutes-->"+adminToken)


    return (adminToken && admin.isAdmin)? <Outlet/> : <Navigate to="/admin/signin"/> 
}