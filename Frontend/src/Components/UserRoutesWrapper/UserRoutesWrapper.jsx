import React, {useEffect} from 'react'
import {Outlet} from "react-router-dom"
import {useDispatch} from "react-redux"

import {resetStore} from "../../Store/resetActions"


export default function UserRoutesWrapper(){

    const dispatch = useDispatch()

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