import React from 'react'
import './BreadcrumbBar.css'
import {useLocation, Link} from 'react-router-dom'
import {RiArrowDropRightLine} from "react-icons/ri";

export default function BreadcrumbBar(){

    const barBg = {
        backgroundImage: "url('/breadcrumb-bg.png')",
        backgroundSize: 'cover',
        backgroundPositionY: '-20px'
    }

    const location = useLocation()

    let breadCrumb = ''
    console.log("Pathname->"+ location.pathname)
    const pathArray = location.pathname.split('/')
    pathArray[0] = 'Home'
    console.log("PathArray-->"+ pathArray)
    const breadcrumbPath = pathArray.map(currentCrumb=>{
        currentCrumb=='Home'? breadCrumb+='/' : breadCrumb+=currentCrumb
        return(
            <Link to={breadCrumb} key={currentCrumb}> 
                <h4 className="text-white inline-block capitalize">{currentCrumb}</h4>
                { pathArray.indexOf(currentCrumb) == pathArray.length-1? null : <RiArrowDropRightLine className='text-white inline-block h-[26px] w-[26px]'/> }
            </Link>
        )
    })

    return(
        <div style={barBg} className='mt-[5px] h-[5rem] pl-[60px] flex flex-col items-start justify-center relative' id='breadcrumb-bar'>
            <nav className='text-[13px] z-[5]'>
                {breadcrumbPath}
            </nav>
            <h1 className='text-breadcrumbTitle text-white z-[5]'>Products</h1>
        </div>
    )
}