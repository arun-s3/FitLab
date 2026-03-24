import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Navigate, Outlet, useNavigate} from 'react-router-dom'


export default function RoutesAccessWrapper(){

    const {admin} = useSelector(state=> state.admin)
    const {user} = useSelector(state=> state.user)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (user && user.isBlocked) {
            navigate("/blocked", {
                replace: true,
                state: { NoDirectAccess: true },
            })
        }
    }, [user])

    return  (

       admin  
            ? <Navigate to="/error/403" replace state={{NoDirectAccess: true}}/>
            : <Outlet/> 
    )
}