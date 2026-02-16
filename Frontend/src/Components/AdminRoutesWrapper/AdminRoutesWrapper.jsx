import React, {useEffect} from 'react'
import {Outlet, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"

import {resetStore} from "../../Store/resetActions"


export default function AdminRoutesWrapper(){

    const dispatch = useDispatch()

    useEffect(()=> {
        const syncLogout = (e)=> {
            if (e.key === "completeLogout"){
                dispatch(resetStore())
                localStorage.clear()
                sessionStorage.clear()
            }
        }
        window.addEventListener("storage", syncLogout)  
        return () => {
          window.removeEventListener("storage", syncLogout)
        }
    }, [dispatch])
    

    return (
        <Outlet />
    )

}