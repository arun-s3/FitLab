import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import HomePage from './Pages/User/HomePage/HomePage'
import SignUpAndInPage from './Pages/User/SignUpAndInPage/SignUpAndInPage'
import PrivateUserRoutes from './Components/PrivateUserRoutes/PrivateUserRoutes'
import PrivateAdminRoutes from './Components/PrivateAdminRoutes/PrivateAdminRoutes'

import AdminSignInPage from './Pages/Admin/AdminSignInPage/AdminSignInPage'
import AdminPageWrapper from './Pages/Admin/AdminPageWrapper/AdminPageWrapper'
import AdminCustomersPage from './Pages/Admin/AdminCustomersPage/AdminCustomersPage'
// import AdminCustomersPageV2 from './Pages/Admin/TesterPages/TesterV2AdminCustomersPage' //For Testing Purpose
// import AdminCustomersPageV3 from './Pages/Admin/TesterPages/TesterV3AdminCustomersPage'  //For Testing Purpose

import ProductListPage from './Pages/User/ProductListPage/ProductListPage'


import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Header from './Components/Header/Header'

export default function App(){
    
    return(
        <BrowserRouter>
            <ToastContainer theme='dark' autoClose={1500} style={{fontSize:'12px'}} hideProgressBar />
            <Routes path="/">
                <Route element={<PrivateUserRoutes/>}>
                </Route>
                <Route index element={<HomePage/>}/>
                <Route path='signup' element={<SignUpAndInPage type='signup' />}/>
                <Route path='signin' element={<SignUpAndInPage type='signin' />}/>
                <Route path="admin/">
                    <Route path="signin" element={<AdminSignInPage/>}/>
                    <Route element={<PrivateAdminRoutes/>}>
                        <Route element={<AdminPageWrapper/>}>
                            <Route path="customers" element={<AdminCustomersPage/>} />
                        </Route>
                    </Route>
                </Route>
                <Route path='products'>
                    <Route index element={<ProductListPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
    
}