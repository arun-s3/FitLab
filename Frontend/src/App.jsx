import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import HomePage from './Pages/User/HomePage/HomePage'
import SignUpAndInPage from './Pages/User/SignUpAndInPage/SignUpAndInPage'
import OtpVerificationPage from './Pages/User/OtpVerificationPage/OtpVerificationPage'
import ProductListPage from './Pages/User/ProductListPage/ProductListPage'
import PrivateUserRoutes from './Components/PrivateUserRoutes/PrivateUserRoutes'
import TestImageCropper from './Pages/User/TesterPages/TestImageCropper'
import TestAddressPage from './Pages/User/TesterPages/TestAddressPage'
import AddressManagementPage from './Pages/User/AddressManagementPage/AddressManagementPage'
import AddressListingPage from './Pages/User/AddressListingPage/AddressListingPage'
import UserPageWapper from './Pages/User/UserPageWapper/UserPageWapper'
import ProductDetailPage from './Pages/User/ProductDetailPage/ProductDetailPage'


import AdminSignInPage from './Pages/Admin/AdminSignInPage/AdminSignInPage'
import AdminPageWrapper from './Pages/Admin/AdminPageWrapper/AdminPageWrapper'
import PrivateAdminRoutes from './Components/PrivateAdminRoutes/PrivateAdminRoutes'
import UserPresenceErrorPage from './Pages/Admin/AdminErrorPages/UserPresenceErrorPage'
import AdminCustomersPage from './Pages/Admin/AdminCustomersPage/AdminCustomersPage'
// import AdminCustomersPageV2 from './Pages/Admin/TesterPages/TesterV2AdminCustomersPage' //For Testing Purpose
// import AdminCustomersPageV3 from './Pages/Admin/TesterPages/TesterV3AdminCustomersPage'  //For Testing Purpose
import AdminAddAndEditProductPage from './Pages/Admin/AdminAddAndEditProductPage/AdminAddAndEditProductPage'
import ImageEditor from './Components/ImageEditor/ImageEditor'
import AdminProductListPage from './Pages/Admin/AdminProductListPage/AdminProductListPage'
import AdminAddAndEditCategoryPage from './Pages/Admin/AdminAddAndEditCategoryPage/AdminAddAndEditCategoryPage'
import AdminCategoryListPage from './Pages/Admin/AdminCategoryListPage/AdminCategoryListPage'
import AdminDashboardPage from './Pages/Admin/AdminDashboardPage/AdminDashboardPage'

import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Header from './Components/Header/Header'

export default function App(){
    
    return(
        <BrowserRouter>
            <ToastContainer theme='dark' autoClose={1500} style={{fontSize:'12px'}} hideProgressBar />
            <Routes path="/">
                {/* <Route path='test' element={AdminCategoryListPage} /> */}
                <Route path='test-cropper' element={<TestImageCropper/>}/>
                <Route path='test-address' element={<TestAddressPage/>}/>
                <Route element={<PrivateUserRoutes/>}>
                </Route>
                <Route index element={<HomePage/>}/>
                <Route path='error'>
                    <Route path='userPresent' element={<UserPresenceErrorPage/>}/>
                 </Route>
                <Route path='signup'>
                    <Route index element={<SignUpAndInPage type='signup' />} />
                    <Route path='otp-verify' element={<OtpVerificationPage/>}/>
                </Route>
                <Route path='signin' element={<SignUpAndInPage type='signin' />}/>
                <Route path='products'>
                    <Route index element={<ProductListPage/>}/>
                </Route>
                <Route path='shop'>
                    <Route path='product' element={<ProductDetailPage/>} />
                </Route>
                {/* <Route element={<UserPageWapper/>} > */}
                <Route path='profile'>
                    <Route path='addresses'>
                        <Route index element={<AddressListingPage/>}/>
                        <Route path='add' element={<AddressManagementPage/>}/>
                        <Route path='edit' element={<AddressManagementPage editAddresses={true}/>}/>
                    </Route>    
                </Route>
                {/* </Route> */}

                <Route path="admin/">
                    <Route path="signin" element={<AdminSignInPage/>}/>
                    <Route element={<PrivateAdminRoutes/>}>
                        <Route path='image-editor' element={<ImageEditor/>} />
                        <Route element={<AdminPageWrapper/>}>
                            <Route path="dashboard" element={<AdminDashboardPage/>} />
                            <Route path="customers" element={<AdminCustomersPage/>} />
                            <Route path='products'>
                                <Route path='list' element={<AdminProductListPage/>} />
                                <Route path='add' element={<AdminAddAndEditProductPage/>} />
                                <Route path='edit' element={<AdminAddAndEditProductPage editProduct={true}/>} />
                                <Route path='category'> 
                                    <Route index element={<AdminCategoryListPage/>} />
                                    <Route path='add' element={<AdminAddAndEditCategoryPage/>} />
                                    <Route path='edit' element={<AdminAddAndEditCategoryPage editCategory={true}/>} />
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
    
}