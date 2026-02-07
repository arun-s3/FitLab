import React from 'react'
import './BreadcrumbBar.css'
import {useLocation, Link} from 'react-router-dom'

import {RiArrowDropRightLine} from "react-icons/ri"
import {House} from 'lucide-react'


export default function BreadcrumbBar({heading}){

    const barBg = {
        backgroundImage: "url('/Images/breadcrumb-bg.png')",
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
            <Link to={breadCrumb} key={currentCrumb} className='flex items-center'> 
                <h4 className="hidden xs-sm:inline-block text-white capitalize max-xs-sm2:text-[14px] hover:text-primary
                 hover:font-[500] hover:underline">
                    {currentCrumb}
                </h4>
                <h4 className="inline-block xs-sm:hidden text-white capitalize max-xs-sm:text-[14px] hover:text-primary 
                 hover:font-[500] hover:underline">
                    {
                        currentCrumb == 'Home' ?
                            <House className='max-xs-sm2:w-[17px] max-xs-sm:h-[17px] w-[20px] h-[20px]'/>
                            : currentCrumb
                    }
                </h4>
                {
                    pathArray.indexOf(currentCrumb) == pathArray.length-1 ? 
                        null 
                        : <RiArrowDropRightLine className='text-white inline-block h-[26px] w-[26px]'/>
                }
            </Link>
        )
    })

    return(
        <div style={barBg}
            className='mt-[5px] h-[5rem] max-xs-sm:h-[4rem] max-xs-sm:pl-[1.8rem] pl-[60px] flex flex-col items-start justify-center relative'
            id='breadcrumb-bar'
        >
            <nav className='max-xs-sm:text-[14px] text-[15px] sm:text-[13px] flex justify-center items-center z-[5]'>
                {breadcrumbPath}
            </nav>

            <h1 className='hidden sm:inline-block text-[18px] font-[600] l-md:text-breadcrumbTitle capitalize trackig-[0.5px] text-white z-[5]' 
                style={{wordSpacing: '1px'}}
                > 
                {heading? heading : null}
            </h1>
        </div>
    ) 
}

