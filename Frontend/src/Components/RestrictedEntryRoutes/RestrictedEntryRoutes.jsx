import React, {useEffect} from 'react'
import {Outlet, useNavigate, useLocation} from 'react-router-dom'


export default function RestrictedEntryRoutes({redirectTo = null}){

    const navigate = useNavigate()

    const location = useLocation()

    const redirectToPage = redirectTo ? `/${redirectTo}` : '/error/403'

    useEffect(()=> {
        if(!location.state?.NoDirectAccess){
            navigate(redirectToPage, {
                replace: true, 
                state: {NoDirectAccess: true}
            })
        }
    }, [location])

    
    return  <Outlet/>
}