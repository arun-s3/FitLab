import React, {useEffect} from 'react'
import {Outlet, useNavigate, useLocation} from 'react-router-dom'


export default function RestrictedEntryRoutes({redirectTo = null}){

    const navigate = useNavigate()

    const location = useLocation()

    const redirectToPage = redirectTo ? `/${redirectTo}` : '/403'

    useEffect(()=> {
        if(!location.state?.NoDirectAccesss){
            navigate(redirectToPage, {replace: true})
        }
    }, [location])

    
    return  <Outlet/>
}