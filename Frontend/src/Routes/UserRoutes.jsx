import React from 'react'
import { Route, Navigate, Routes } from "react-router-dom"

import HomePage from '../Pages/User/HomePage/HomePage'
import AboutUsPage from '../Pages/User/AboutUsPage/AboutUsPage'
import ContactUsPage from '../Pages/User/ContactUsPage/ContactUsPage'
import PrivacyPolicyPage from '../Pages/User/PrivacyPolicyPage/PrivacyPolicyPage'
import TermsAndConditionsPage from '../Pages/User/TermsAndConditions/TermsAndConditionsPage'

import SignUpAndInPage from '../Pages/User/SignUpAndInPage/SignUpAndInPage'
import OtpVerificationPage from '../Pages/User/OtpVerificationPage/OtpVerificationPage'
import ForgotAndResetPasswordPage from '../Pages/User/ForgotAndResetPasswordPage/ForgotAndResetPasswordPage'
import UserAccountPage from '../Pages/User/UserAccountPage/UserAccountPage'

import AddressManagementPage from "../Pages/User/AddressManagementPage/AddressManagementPage"
import AddressListingPage from "../Pages/User/AddressListingPage/AddressListingPage"

import ProductListPage from '../Pages/User/ProductListPage/ProductListPage'
import ProductDetailPage from '../Pages/User/ProductDetailPage/ProductDetailPage'
import WishlistPage from '../Pages/User/WishlistPage/WishlistPage'
import CartPage from '../Pages/User/CartPage/CartPage'
import CouponPage from '../Pages/User/CouponPage/CouponPage'
import CheckoutPage from '../Pages/User/CheckoutPage/CheckoutPage'
import OrderConfirmationPage from '../Pages/User/OrderConfirmationPage/OrderConfirmationPage'
import OrderHistoryPage from '../Pages/User/OrderHistoryPage/OrderHistoryPage'

import WalletPage from '../Pages/User/WalletPage/WalletPage'

import CustomerSupportPage from '../Pages/User/CustomerSupportPage/CustomerSupportPage'

import FitnessTrainingPage from '../Pages/User/FitnessTrainingPage/FitnessTrainingPage'
import FitnessTrackerPage from '../Pages/User/FitnessTrackerPage/FitnessTrackerPage'

import ImageEditor from "../Components/ImageEditor/ImageEditor"

import UserBlockedPage from "../Pages/Errors/UserBlockedPage"

import SocketProvider from "../Components/SocketProvider/SocketProvider"

import UserPageLayout from '../Layouts/UserPageLayout/UserPageLayout'
import GlobalVideoCallModalLayout from '../Pages/User/GlobalModalLayouts/GlobalVideoCallModalLayout'
import UserRoutesWrapper from '../Components/UserRoutesWrapper/UserRoutesWrapper'
import RoutesAccessWrapper from '../Components/RoutesAccessWrapper/RoutesAccessWrapper'
import ProtectedUserRoutes from '../Components/ProtectedUserRoutes/ProtectedUserRoutes'
import PrivateUserRoutes from "../Components/PrivateUserRoutes/PrivateUserRoutes"
import RestrictedEntryRoutes from '../Components/RestrictedEntryRoutes/RestrictedEntryRoutes'

import ErrorPage404 from '../Pages/Errors/404ErrorPage'


export default function UserRoutes(){
    
    return (
        <Routes>
            <Route element={<UserRoutesWrapper />}>

                <Route path='image-editor' element={<ImageEditor />} />

                <Route element={<SocketProvider />}>

                    <Route element={<GlobalVideoCallModalLayout />}>
                        <Route path='signup'>
                            <Route index element={<SignUpAndInPage type='signup' />} />
                        </Route>
                        <Route path='signin' element={<SignUpAndInPage type='signin' />} />
                        <Route element={<RoutesAccessWrapper />}>
                            <Route path='forgot-password' element={<ForgotAndResetPasswordPage />} />
                            <Route index element={<HomePage />} />
                            <Route path='about' element={<AboutUsPage />} />
                            <Route path='contact' element={<ContactUsPage />} />
                            <Route path='privacy' element={<PrivacyPolicyPage />} />
                            <Route path='terms' element={<TermsAndConditionsPage />} />
                            <Route path='cart' element={<CartPage />} />
                            <Route element={<ProtectedUserRoutes />}>
                                <Route path='shop'>
                                    <Route index element={<ProductListPage />} />
                                    <Route path='product' element={<ProductDetailPage />} />
                                </Route>
                                <Route element={<UserPageLayout />}>
                                    <Route path='wishlist' element={<WishlistPage />} />
                                    <Route path='wallet' element={<WalletPage />} />
                                    <Route path='account'>
                                        <Route index element={<UserAccountPage />} />
                                        <Route path='addresses'>
                                            <Route index element={<AddressListingPage />} />
                                            <Route path='add' element={<AddressManagementPage />} />
                                            <Route
                                                path='edit'
                                                element={<AddressManagementPage editAddresses={true} />}
                                            />
                                        </Route>
                                    </Route>
                                    <Route path='coupons' element={<CouponPage />} />
                                </Route>
                            </Route>
                            <Route element={<PrivateUserRoutes />}>
                                <Route path='orders' element={<OrderHistoryPage />} />
                                <Route path='checkout' element={<CheckoutPage />} />
                            </Route>
                            <Route element={<RestrictedEntryRoutes />}>
                                <Route path='blocked' element={<UserBlockedPage />} />
                                <Route path='otp-verify' element={<OtpVerificationPage />} />
                                <Route path='order-confirm' element={<OrderConfirmationPage />} />
                            </Route>
                            <Route path='support' element={<CustomerSupportPage />} />
                            <Route path='fitness'>
                                <Route index element={<Navigate to='training' replace />} />
                                <Route path='training' element={<FitnessTrainingPage />} />
                                <Route path='tracker' element={<FitnessTrackerPage />} />
                            </Route>
                        </Route>
                    </Route>

                </Route>

                <Route path='*' element={<ErrorPage404 />} />

            </Route>
        </Routes>
    )
    
}