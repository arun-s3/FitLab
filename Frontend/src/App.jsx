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
import ProductDetailPage from './Pages/User/ProductDetailPage/ProductDetailPage'
import WishlistPage from './Pages/User/WishlistPage/WishlistPage'
import CartPage from './Pages/User/CartPage/CartPage'
import CouponPage from './Pages/User/CouponPage/CouponPage'
import CheckoutPage from './Pages/User/CheckoutPage/CheckoutPage'
import OrderConfirmationPage from './Pages/User/OrderConfirmationPage/OrderConfirmationPage'
import OrderHistoryPage from './Pages/User/OrderHistoryPage/OrderHistoryPage'
import WalletPage from './Pages/User/WalletPage/WalletPage'
import CustomerSupportPage from './Pages/User/CustomerSupportPage/CustomerSupportPage'

import UserPageLayout from './Pages/User/UserPageLayout/UserPageLayout'
import GlobalVideoCallModalLayout from './Pages/User/GlobalModalLayouts/GlobalVideoCallModalLayout'
import UserRoutesWrapper from './Components/UserRoutesWrapper/UserRoutesWrapper'
import ProtectedUserRoutes from './Components/ProtectedUserRoutes/ProtectedUserRoutes'
import RestrictedEntryRoutes from './Components/RestrictedEntryRoutes/RestrictedEntryRoutes'

import AdminSignInPage from './Pages/Admin/AdminSignInPage/AdminSignInPage'
import AdminPageLayout from './Components/AdminPageLayout/AdminPageLayout'
import PrivateAdminRoutes from './Components/PrivateAdminRoutes/PrivateAdminRoutes'
import AdminCustomersPage from './Pages/Admin/AdminCustomersPage/AdminCustomersPage'
// import AdminCustomersPageV2 from './Pages/Admin/TesterPages/TesterV2AdminCustomersPage' //For Testing Purpose
// import AdminCustomersPageV3 from './Pages/Admin/TesterPages/TesterV3AdminCustomersPage'  //For Testing Purpose
import AdminAddAndEditProductPage from './Pages/Admin/AdminAddAndEditProductPage/AdminAddAndEditProductPage'
import ImageEditor from './Components/ImageEditor/ImageEditor'
import AdminProductListPage from './Pages/Admin/AdminProductListPage/AdminProductListPage'
import AdminAddAndEditCategoryPage from './Pages/Admin/AdminAddAndEditCategoryPage/AdminAddAndEditCategoryPage'
import AdminCategoryListPage from './Pages/Admin/AdminCategoryListPage/AdminCategoryListPage'
import AdminDashboardPage from './Pages/Admin/AdminDashboardPage/AdminDashboardPage'
import AdminDashboardHeatmapPage from './Pages/Admin/AdminCustomerHeatmapPage/AdminDashboardHeatmapPage.jsx'
import AdminOrderHistory from './Pages/Admin/AdminOrderHistroyPage/AdminOrderHistroyPage'
import AdminCouponManagementPage from './Pages/Admin/AdminCouponManagementPage/AdminCouponManagementPage'
import AdminOfferManagementPage from './Pages/Admin/AdminOfferManagementPage/AdminOfferManagementPage'
import AdminCreateOfferPage from './Pages/Admin/AdminCreateOfferPage/AdminCreateOfferPage'
import AdminTextChatSupportPage from './Pages/Admin/AdminTextChatSupportPage/AdminTextChatSupportPage'
import AdminVideoChatSupportPage from './Pages/Admin/AdminVideoChatSupportPage/AdminVideoChatSupportPage'
import AdminRoutesWrapper from './Components/AdminRoutesWrapper/AdminRoutesWrapper'

import ErrorPage403 from './Pages/Errors/403ErrorPage'
import ErrorPage401 from './Pages/Errors/401ErrorPage'
import ErrorPage404 from './Pages/Errors/404ErrorPage'
import UserBlockedPage from './Pages/Errors/UserBlockedPage'

import {Toaster as SonnerToaster} from 'sonner'
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import Header from './Components/Header/Header'
import SocketProvider from './Components/SocketProvider/SocketProvider'
import AdminSocketProvider from './Components/AdminSocketProvider/AdminSocketProvider'
// import SocketListener from './Components/GlobalModals/SocketListener'


export default function App(){
    
    return(
        <BrowserRouter>

            <ToastContainer theme='dark' autoClose={3000} style={{fontSize:'12px'}} hideProgressBar />

            <SonnerToaster position="bottom-right" duration={3500} richColors />
            
            <Routes path='/'>

                <Route element={<UserRoutesWrapper />} >

                    {/* <Route path='test' element={AdminCategoryListPage} /> */}
                    <Route path='test-cropper' element={<TestImageCropper/>}/>
                    <Route path='test-address' element={<TestAddressPage/>}/>
                    <Route path='test' element={<TestRandomPage/>}/>
                    <Route path='signup'>
                        <Route index element={<SignUpAndInPage type='signup' />} />
                    </Route>
                    <Route path='signin' element={<SignUpAndInPage type='signin' />}/>
                    <Route path='forgot-password' element={<ForgotAndResetPasswordPage/>}/>

                    <Route path='image-editor' element={<ImageEditor/>} />

                    <Route element={<SocketProvider/>}>
                        <Route element={<GlobalVideoCallModalLayout/>}>
                            <Route index element={<HomePage/>}/>
                            <Route path='cart' element={<CartPage/>} />
                            <Route element={<ProtectedUserRoutes/>}>
                                <Route path='shop'>
                                    <Route index element={<ProductListPage/>}/>
                                    <Route path='product' element={<ProductDetailPage/>} />
                                </Route>
                                <Route element={<UserPageLayout/>} >
                                    <Route path='wishlist' element={<WishlistPage/>} />
                                    <Route path='wallet' element={<WalletPage/>} />
                                    <Route path='account'>
                                        <Route index element={<UserAccountPage/>}/>
                                        <Route path='addresses'>
                                            <Route index element={<AddressListingPage/>}/>
                                            <Route path='add' element={<AddressManagementPage/>}/>
                                            <Route path='edit' element={<AddressManagementPage editAddresses={true}/>}/>
                                        </Route>   
                                    </Route>
                                    <Route path='coupons' element={<CouponPage/>} />
                                </Route>
                            </Route>
                            <Route element={<PrivateUserRoutes/>}>
                                <Route path='orders' element={<OrderHistoryPage/>} />
                                <Route path='checkout' element={<CheckoutPage/>} />
                            </Route>
                            <Route element={<RestrictedEntryRoutes/>}>
                                <Route path='blocked' element={<UserBlockedPage/>} />
                                <Route path='otp-verify' element={<OtpVerificationPage/>}/>
                                <Route path='order-confirm' element={<OrderConfirmationPage/>} />
                            </Route>
                            <Route path='support' element={<CustomerSupportPage/>} />
                        </Route>
                    </Route>

                    <Route path="*" element={<ErrorPage404 />} />

                </Route>


                <Route element={<AdminRoutesWrapper/>}>

                    <Route path="admin/">
                    <Route path="signin" element={<AdminSignInPage/>}/>
                        <Route element={<AdminSocketProvider/>}>
                            <Route element={<PrivateAdminRoutes/>}>
                                <Route element={<AdminPageLayout/>}>
                                    <Route path='dashboard' element={<AdminDashboardPage insightType='business'/>} >
                                        <Route path="business" element={<AdminDashboardPage insightType='business'/>} />
                                        <Route path="operations" element={<AdminDashboardPage insightType='operations'/>} />
                                        <Route path="heatmap" element={<AdminDashboardHeatmapPage/>} />
                                    </Route>
                                    <Route path="customers" element={<AdminCustomersPage/>} />
                                    <Route path='products'>
                                        <Route index element={<AdminProductListPage/>} />
                                        <Route path='add' element={<AdminAddAndEditProductPage/>} />
                                        <Route path='edit' element={<AdminAddAndEditProductPage editProduct={true}/>} />
                                    </Route>
                                    <Route path='category'> 
                                        <Route index element={<AdminCategoryListPage/>} />
                                        <Route path='add' element={<AdminAddAndEditCategoryPage/>} />
                                        <Route path='edit' element={<AdminAddAndEditCategoryPage editCategory={true}/>} />
                                    </Route>
                                    <Route path='orders' element={<AdminOrderHistory/>} />
                                    <Route path='coupons' element={<AdminCouponManagementPage/>} />
                                    <Route path='offers'>
                                        <Route index element={<AdminOfferManagementPage/>} />
                                        <Route path='add' element={<AdminCreateOfferPage/>} />
                                    </Route>
                                    <Route path='support' element={<AdminTextChatSupportPage/>} >
                                        <Route path='text' element={<AdminTextChatSupportPage/>} />
                                        <Route path='video' element={<AdminVideoChatSupportPage/>} />
                                    </Route>
                                </Route>
                            </Route>
                    </Route>

                    <Route path="*" element={<ErrorPage404 />} />

                </Route>

                </Route>

                <Route>
                    <Route element={<RestrictedEntryRoutes redirectTo={404}/>}>
                        <Route path='401' element={<ErrorPage401/>} />
                        <Route path='403' element={<ErrorPage403/>} />
                    </Route>
                    <Route path='404' element={<ErrorPage404/>} />
                </Route>  

                <Route path="*" element={<ErrorPage404 />} />  

            </Routes>
        </BrowserRouter>
    )
    
}