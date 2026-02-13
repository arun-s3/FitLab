import React from 'react'
import { Route, Navigate, Routes } from "react-router-dom"

import AdminSignInPage from '../Pages/Admin/AdminSignInPage/AdminSignInPage'

import AdminCustomersPage from '../Pages/Admin/AdminCustomersPage/AdminCustomersPage'

import AdminAddAndEditProductPage from '../Pages/Admin/AdminAddAndEditProductPage/AdminAddAndEditProductPage'
import AdminProductListPage from '../Pages/Admin/AdminProductListPage/AdminProductListPage'
import AdminAddAndEditCategoryPage from '../Pages/Admin/AdminAddAndEditCategoryPage/AdminAddAndEditCategoryPage'
import AdminCategoryListPage from '../Pages/Admin/AdminCategoryListPage/AdminCategoryListPage'
import AdminOrderHistory from "../Pages/Admin/AdminOrderHistroyPage/AdminOrderHistroyPage"

import AdminDashboardPage from '../Pages/Admin/AdminDashboardPage/AdminDashboardPage'
import AdminDashboardHeatmapPage from '../Pages/Admin/AdminCustomerHeatmapPage/AdminDashboardHeatmapPage.jsx'

import AdminCouponManagementPage from '../Pages/Admin/AdminCouponManagementPage/AdminCouponManagementPage'
import AdminOfferManagementPage from '../Pages/Admin/AdminOfferManagementPage/AdminOfferManagementPage'
import AdminCreateOfferPage from '../Pages/Admin/AdminCreateOfferPage/AdminCreateOfferPage'

import AdminTextChatSupportPage from "../Pages/Admin/AdminTextChatSupportPage/AdminTextChatSupportPage"
import AdminVideoChatSupportPage from "../Pages/Admin/AdminVideoChatSupportPage/AdminVideoChatSupportPage"

import AdminAiInsightsPage from '../Pages/Admin/AdminAiInsightsPage/AdminAiInsightsPage'

import AdminSettingsPage from "../Pages/Admin/AdminSettingsPage/AdminSettingsPage"

import AdminPageLayout from "../Layouts/AdminPageLayout/AdminPageLayout"
import AdminRoutesWrapper from "../Components/AdminRoutesWrapper/AdminRoutesWrapper"
import PrivateAdminRoutes from "../Components/PrivateAdminRoutes/PrivateAdminRoutes"

import AdminSocketProvider from '../Components/AdminSocketProvider/AdminSocketProvider'

import ErrorPage404 from '../Pages/Errors/404ErrorPage'


export default function AdminRoutes() {
    
    return (
        <Routes>
            <Route element={<AdminRoutesWrapper />}>

                <Route index element={<Navigate to='signin' replace />} />
                <Route path='signin' element={<AdminSignInPage />} />
                <Route element={<AdminSocketProvider />}>
                    <Route element={<PrivateAdminRoutes />}>
                        <Route element={<AdminPageLayout />}>
                            <Route path='dashboard'>
                                <Route index element={<Navigate to='business' replace />} />
                                <Route
                                    path='business'
                                    element={<AdminDashboardPage insightType='business' />}
                                />
                                <Route
                                    path='operations'
                                    element={<AdminDashboardPage insightType='operations' />}
                                />
                                <Route path='heatmap' element={<AdminDashboardHeatmapPage />} />
                            </Route>
                            <Route path='ai' element={<AdminAiInsightsPage />} />
                            <Route path='customers' element={<AdminCustomersPage />} />
                            <Route path='products'>
                                <Route index element={<AdminProductListPage />} />
                                <Route path='add' element={<AdminAddAndEditProductPage />} />
                                <Route
                                    path='edit'
                                    element={<AdminAddAndEditProductPage editProduct={true} />}
                                />
                            </Route>
                            <Route path='category'>
                                <Route index element={<AdminCategoryListPage />} />
                                <Route path='add' element={<AdminAddAndEditCategoryPage />} />
                                <Route
                                    path='edit'
                                    element={<AdminAddAndEditCategoryPage editCategory={true} />}
                                />
                            </Route>
                            <Route path='orders' element={<AdminOrderHistory />} />
                            <Route path='coupons' element={<AdminCouponManagementPage />} />
                            <Route path='offers'>
                                <Route index element={<AdminOfferManagementPage />} />
                                <Route path='add' element={<AdminCreateOfferPage />} />
                            </Route>
                            <Route path='support'>
                                <Route path='text' element={<AdminTextChatSupportPage />} />
                                <Route path='video' element={<AdminVideoChatSupportPage />} />
                            </Route>
                            <Route path='settings' element={<AdminSettingsPage />} />
                        </Route>
                    </Route>
                </Route>

                <Route path='*' element={<ErrorPage404 />} />

            </Route>
        </Routes>
    )
    
}