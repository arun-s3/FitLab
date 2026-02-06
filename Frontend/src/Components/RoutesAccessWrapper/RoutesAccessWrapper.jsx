import React from'react'
import {useSelector} from 'react-redux'
import {Navigate, Outlet} from 'react-router-dom'


export default function RoutesAccessWrapper(){

    const {admin} = useSelector(state=> state.admin)
    const {user} = useSelector(state=> state.user)
    
    console.log("user inside RoutesAccessWrapper---->", user)
    console.log("admin inside RoutesAccessWrapper---->", admin)

    return  (

       admin  
            ? <Navigate to="/403" replace state={{NoDirectAccess: true}}/>
            : <Outlet/> 
    )
}