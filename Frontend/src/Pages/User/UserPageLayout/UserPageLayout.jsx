import React, {createContext, useState} from 'react'
import {Outlet,} from 'react-router-dom'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import UserSidebar from '../../../Components/UserSidebar/UserSidebar'
import Footer from '../../../Components/Footer/Footer'

export const UserPageLayoutContext = createContext()

export default function UserPageLayout(){

    const [breadcrumbHeading, setBreadcrumbHeading] = useState('')
    const [pageLocation, setPageLocation] = useState('')
    // const [mainElementStyles, setMainElementStyles ] = useState('')
    // const [sideBarSectionStyles, setSideBarSectionStyles] = useState('')
    // const [contentSectionStyles, setContentSectionStyles] = useState('')
    // const [outletSectionStyles, setOutletSectionStyles] = useState('')

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    // const location = useLocation()
    // const breadcrumbHeading = location.pathname.split('/')

    return(
        <UserPageLayoutContext.Provider value={{breadcrumbHeading, setBreadcrumbHeading, setPageLocation}} >
            <section id='UserPageLayout'>
                <header style={headerBg}>

                    <Header />

                </header>

                <BreadcrumbBar heading={ breadcrumbHeading && breadcrumbHeading } />

                <main className='flex gap-[2rem] px-[4rem] mb-[10rem]'>
                
                    <div className={`basis-[15%]`}>
                                            
                        <UserSidebar currentPath={pageLocation}/>
                        
                    </div>

                    <div className='basis-[75%] mt-[2rem] content-tile'>
                        
                        <Outlet/>

                    </div>

                </main>

                <Footer />

            </section>
        </UserPageLayoutContext.Provider>
    )
}