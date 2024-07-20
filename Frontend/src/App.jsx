import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import SignupPage from './Pages/SignupPage'
import LoginPage from './Pages/LoginPage'

export default function App(){

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<HomePage/>}/>
                    <Route path='signup' element={<SignupPage/>}/>
                    <Route path='login' element={<LoginPage/>}/> 
                </Route>
            </Routes>
        </BrowserRouter>
    )
    
}