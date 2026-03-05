import React from'react'
import {useSelector} from 'react-redux'
import {Navigate, Outlet} from 'react-router-dom'


export default function RoutesAccessWrapper(){

    const {admin} = useSelector(state=> state.admin)

    return  (

       admin  
            ? <Navigate to="/error/403" replace state={{NoDirectAccess: true}}/>
            : <Outlet/> 
    )
}