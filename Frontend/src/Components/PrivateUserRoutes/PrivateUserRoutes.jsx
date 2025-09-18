import React from 'react'
import {Outlet, Navigate} from 'react-router-dom'
import {useSelector} from 'react-redux'


export default function PrivateUserRoutes(){

    const {user} = useSelector((state)=> state.user)

    console.log("userToken inside PrivateRoutes-->"+userToken)

    
    return ( 
        user ? 
            <Outlet/>
            :<Navigate to="/signin"/>
     )
}