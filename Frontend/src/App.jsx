import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import SignUpAndInPage from './Pages/SignUpAndInPage'

export default function App(){

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<HomePage/>}/>
                    <Route path='signup' element={<SignUpAndInPage/>}/>
                    <Route path='login' element={<LoginPage/>}/> 
                </Route>
            </Routes>
        </BrowserRouter>
    )
    
}