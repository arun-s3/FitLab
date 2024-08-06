import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import SignUpAndInPage from './Pages/SignUpAndInPage'

import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

export default function App(){

    return(
        <BrowserRouter>
            <ToastContainer theme='dark' autoClose={1500} style={{fontSize:'12px'}} hideProgressBar />
            <Routes path="/">
                <Route index element={<HomePage/>}/>
                <Route path='signup' element={<SignUpAndInPage type='signup' />}/>
                <Route path='signin' element={<SignUpAndInPage type='signin' />}/>
                <Route path='login' element={<LoginPage/>}/> 
            </Routes>
        </BrowserRouter>
    )
    
}