import React, {useState, useCallback, useMemo, createContext} from 'react'
import {Outlet} from 'react-router-dom'
import {useSelector} from 'react-redux'

import AuthModal from '../AuthModal/AuthModal'

export const ProtectedUserContext = createContext()


export default function ProtectedUserRoutes(){


    const {user} = useSelector((state)=> state.user)

    const [isAuthModalOpen, setIsAuthModalOpen] = useState({status: false, accessFor: 'this feature'})

    console.log("✅ ProtectedUserRoutes mounted");

    const checkAuthOrOpenModal = useCallback((accessFor = 'this feature')=> {
        if(user){
          return false
        }else{
          setIsAuthModalOpen(prev => ({ ...prev, status: true, accessFor }))
          return true
        }
    }, [user, setIsAuthModalOpen])

    const providerValue = useMemo(() => ({
      setIsAuthModalOpen,
      checkAuthOrOpenModal,
    }), [setIsAuthModalOpen, checkAuthOrOpenModal])


    return (
        <ProtectedUserContext.Provider value={providerValue}>
            
            <Outlet />

            {
                isAuthModalOpen.status &&
                    <AuthModal
                        isOpen={isAuthModalOpen.status}
                        accessFor={isAuthModalOpen.accessFor}
                        onClose={()=> setIsAuthModalOpen({status: false, accessFor: 'whishlist'})}
                    />
            }


        </ProtectedUserContext.Provider>
    )
}