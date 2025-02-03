import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import HomePage from './Pages/User/HomePage/HomePage'
import SignUpAndInPage from './Pages/User/SignUpAndInPage/SignUpAndInPage'
import OtpVerificationPage from './Pages/User/OtpVerificationPage/OtpVerificationPage'
import ForgotAndResetPasswordPage from './Pages/User/ForgotAndResetPasswordPage/ForgotAndResetPasswordPage'
import UserAccountPage from './Pages/User/UserAccountPage/UserAccountPage'
import ProductListPage from './Pages/User/ProductListPage/ProductListPage'
import PrivateUserRoutes from './Components/PrivateUserRoutes/PrivateUserRoutes'
import TestImageCropper from './Pages/User/TesterPages/TestImageCropper'
import TestAddressPage from './Pages/User/TesterPages/TestAddressPage'
import TestRandomPage from './Pages/User/TesterPages/TestRandomPage'
import AddressManagementPage from './Pages/User/AddressManagementPage/AddressManagementPage'
import AddressListingPage from './Pages/User/AddressListingPage/AddressListingPage'
import UserPageLayout from './Pages/User/UserPageLayout/UserPageLayout'
import ProductDetailPage from './Pages/User/ProductDetailPage/ProductDetailPage'
import WishlistPage from './Pages/User/WishlistPage/WishlistPage'
import CartPage from './Pages/User/CartPage/CartPage'
import CheckoutPage from './Pages/User/CheckoutPage/CheckoutPage'
import OrderConfirmationPage from './Pages/User/OrderConfirmationPage/OrderConfirmationPage'
import OrderHistoryPage from './Pages/User/OrderHistoryPage/OrderHistoryPage'

import AdminSignInPage from './Pages/Admin/AdminSignInPage/AdminSignInPage'
import AdminPageLayout from './Pages/Admin/AdminPageLayout/AdminPageLayout'
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
import AdminOrderHistory from './Pages/Admin/AdminOrderHistroyPage/AdminOrderHistroyPage'

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
                <Route path='test' element={<TestRandomPage/>}/>
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
                <Route path='forgot-password' element={<ForgotAndResetPasswordPage/>}/>
                {/* <Route path='account' element={<UserAccountPage/>}/> */}
                {/* <Route path='products'>
                    <Route index element={<ProductListPage/>}/>
                </Route>
                <Route path='shop'>
                    <Route path='product' element={<ProductDetailPage/>} />
                </Route> */}
                <Route path='shop'>
                    <Route index element={<ProductListPage/>}/>
                    <Route path='product' element={<ProductDetailPage/>} />
                </Route>

                <Route path='cart' element={<CartPage/>} />
                <Route path='checkout' element={<CheckoutPage/>} />
                <Route path='order-confirm' element={<OrderConfirmationPage/>} />
                {/* <Route path='order-completed' element={<OrderCompletedPage/>}  /> */}
                <Route element={<UserPageLayout/>} >
                    <Route path='account'>
                        <Route index element={<UserAccountPage/>}/>
                        <Route path='addresses'>
                            <Route index element={<AddressListingPage/>}/>
                            <Route path='add' element={<AddressManagementPage/>}/>
                            <Route path='edit' element={<AddressManagementPage editAddresses={true}/>}/>
                        </Route>   
                    </Route>
                    <Route path='wishlist' element={<WishlistPage/>} />
                    {/* <Route path='wishlist-test' element={<WishlistPage/>} /> */}
                </Route>
                <Route path='orders' element={<OrderHistoryPage/>} />
                <Route path='profile'> 
                </Route>
                {/* </Route> */}

                <Route path="admin/">
                    <Route path="signin" element={<AdminSignInPage/>}/>
                    <Route element={<PrivateAdminRoutes/>}>
                        <Route path='image-editor' element={<ImageEditor/>} />
                        <Route element={<AdminPageLayout/>}>
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
                            <Route path='orders' element={<AdminOrderHistory/>} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
    
}