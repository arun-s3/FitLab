import React from'react'
import {useSelector} from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


export default function PrivateAdminRoutes(){

    const {admin} = useSelector(state=> state.admin)
    const {user} = useSelector(state=> state.user)
    
    console.log("Inside PrivateAdminRoutes", user && !user.isAdmin)

    return  (

       user && !user.isAdmin ? 
            <Navigate to="/401" state={{NoDirectAccess: true}}/>
            : user && user.isAdmin && user.isVerified && !user.isBlocked || admin && admin.isAdmin && admin.isVerified && !admin.isBlocked
            ? <Outlet/> 
            : <Navigate to="/admin/signin"/> 
    )
}