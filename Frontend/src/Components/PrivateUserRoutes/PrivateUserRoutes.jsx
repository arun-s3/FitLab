import React from 'react'
import {Outlet, Navigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function PrivateUserRoutes({children}){

    const {userToken} = useSelector((state)=>state.user)
    console.log("userToken inside PrivateRoutes-->"+userToken)
    return userToken? <Outlet/>:<Navigate to="/signin"/> 
}