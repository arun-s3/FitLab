import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import {Toaster as SonnerToaster} from 'sonner'
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

import UserRoutes from './Routes/UserRoutes'
import AdminRoutes from './Routes/AdminRoutes'
import ErrorRoutes from './Routes/ErrorRoutes'


export default function App(){
    
    return (
        <BrowserRouter>
            <ToastContainer theme='dark' autoClose={3000} style={{ fontSize: "12px" }} hideProgressBar />

            <SonnerToaster position='bottom-right' duration={3500} richColors />

            <Routes>
                <Route path='/*' element={<UserRoutes />} />
                <Route path='/admin/*' element={<AdminRoutes />} />
                <Route path='/error/*' element={<ErrorRoutes />} />
            </Routes>
        </BrowserRouter>
    )
    
}