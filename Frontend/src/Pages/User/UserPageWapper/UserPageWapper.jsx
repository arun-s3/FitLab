import React from 'react'
import {Outlet, useLocation} from 'react-router-dom'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'

export default function UserPageWapper(){

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    const location = useLocation()
    const breadcrumbHeading = location.pathname.split('/')

    return(
        <section id='AddressManagementPage'>
            <header style={headerBg}>

                <Header />

            </header>

            <BreadcrumbBar heading='add addresses' />

            <Outlet/>

        </section>
    )
}