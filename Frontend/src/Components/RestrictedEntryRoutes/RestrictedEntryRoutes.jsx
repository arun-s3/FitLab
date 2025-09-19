import React, {useEffect} from 'react'
import {Outlet, useNavigate, useLocation} from 'react-router-dom'


export default function RestrictedEntryRoutes({redirectTo = null}){

    const navigate = useNavigate()

    const location = useLocation()

    const redirectToPage = redirectTo ? `/${redirectTo}` : '/403'

    useEffect(()=> {
        console.log('location.state?.NoDirectAccess----->', location.state.NoDirectAccess)
        if(!location.state?.NoDirectAccess){
            navigate(redirectToPage, {
                replace: true, 
                state: {NoDirectAccess: true}
            })
        }
    }, [location])

    
    return  <Outlet/>
}