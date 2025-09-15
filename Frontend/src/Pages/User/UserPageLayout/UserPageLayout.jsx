import React, {createContext, useState} from 'react'
import {Outlet} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import UserSidebar from '../../../Components/UserSidebar/UserSidebar'
import Footer from '../../../Components/Footer/Footer'

export const UserPageLayoutContext = createContext()


export default function UserPageLayout(){

    const [breadcrumbHeading, setBreadcrumbHeading] = useState('')
    const [pageLocation, setPageLocation] = useState('')
    const [contentTileClasses, setContentTileClasses] = useState('')

    // const [mainElementStyles, setMainElementStyles ] = useState('')
    // const [sideBarSectionStyles, setSideBarSectionStyles] = useState('')
    // const [contentSectionStyles, setContentSectionStyles] = useState('')
    // const [outletSectionStyles, setOutletSectionStyles] = useState('')

    const {user} = useSelector((state)=> state.user)

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    return(
        <UserPageLayoutContext.Provider value={{breadcrumbHeading, setBreadcrumbHeading, setContentTileClasses, setPageLocation}} >
            <section id='UserPageLayout'>
                <header style={headerBg} className='h-[5rem]'>

                    <Header />

                </header>

                <BreadcrumbBar heading={ breadcrumbHeading && breadcrumbHeading } />

                <main className={`${user ? 'flex gap-[2rem]' : ''} gap-[2rem] px-[4rem] mb-[10rem]`}>
                
                    {
                        user &&
                        <div className={`basis-[15%]`}>
                                            
                            <UserSidebar currentPath={pageLocation}/>
                        
                        </div>
                    }

                    <div className={` ${contentTileClasses ? contentTileClasses : 'basis-[75%] mt-[2rem] content-tile'} `}>
                        
                        <Outlet/>

                    </div>

                </main>

                <Footer />

            </section>
        </UserPageLayoutContext.Provider>
    )
}