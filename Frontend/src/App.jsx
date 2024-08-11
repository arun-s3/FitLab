import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import SignUpAndInPage from './Pages/SignUpAndInPage'
import PrivateRoutes from './Components/PrivateRoutes'

import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Header from './Components/Header'

export default function App(){
    
    return(
        <BrowserRouter>
            <ToastContainer theme='dark' autoClose={1500} style={{fontSize:'12px'}} hideProgressBar />
            <Routes path="/">
                <Route element={<PrivateRoutes/>}>
                </Route>
                <Route index element={<HomePage/>}/>
                <Route path='signup' element={<SignUpAndInPage type='signup' />}/>
                <Route path='signin' element={<SignUpAndInPage type='signin' />}/>
            </Routes>
        </BrowserRouter>
    )
    
}