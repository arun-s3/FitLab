import React, {useEffect} from 'react'
import {Outlet, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"

import {resetStore} from "../../Store/resetActions"


export default function AdminRoutesWrapper(){

    const dispatch = useDispatch()
    const {user} = useSelector(state=> state.user)

    const navigate = useNavigate()

    useEffect(()=> {
        const syncLogout = (e)=> {
            if (e.key === "completeLogout"){
                console.log("Clearing every redux states and local, session storages across all tabs...")
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