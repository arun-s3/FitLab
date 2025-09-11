import React from "react"

import {BsFillGrid3X3GapFill} from "react-icons/bs"
import {FaList} from "react-icons/fa"
import {CiViewTable} from "react-icons/ci"
import {VscTable} from "react-icons/vsc"


export default function ListingTabs({showProducts, toggleTab, setShowByTable, setShowByGrid}){

    return (

        <>
            <div className='h-[40px] w-[100px] md:w-[150px] text-[13px] md:text-[14px] bg-white border border-b-[#e5e7eb]
                    rounded-tl-[10px] cursor-pointer flex justify-center items-center absolute top-[-39px] tab' 
                onClick={()=> showProducts('all')} 
                    style={toggleTab.goTo == 'all'? {borderBottomColor:'transparent'}:{}}>
                <h4 className={toggleTab.goTo == 'all' ? 'opacity-[1]' : 'opacity-[0.75]'}> All </h4>
            </div>
            <div className='h-[40px] w-[100px] md:w-[150px] text-[13px] md:text-[14px] bg-white border border-b-[#e5e7eb] flex justify-center items-center absolute cursor-pointer
                                top-[-39px] left-[100px] md:left-[150px] tab' onClick={()=> showProducts('active')}
                            style={toggleTab.goTo == 'active'? {borderBottomColor:'transparent'}:{}}>
                <h4 className={toggleTab.goTo == 'active' ? 'opacity-[1]' : 'opacity-[0.75]'}> Active </h4>
            </div>
            <div className='h-[40px] w-[100px] md:w-[150px] text-[13px] md:text-[14px] bg-white border border-b-[#e5e7eb] rounded-tr-[5px] flex justify-center items-center cursor-pointer
                         absolute top-[-39px] left-[200px] md:left-[300px] tab' onClick={()=> showProducts('blocked')}
                            style={toggleTab.goTo == 'blocked'? {borderBottomColor:'transparent'}:{}}>
                <h4 className={toggleTab.goTo == 'blocked' ? 'opacity-[1]' : 'opacity-[0.75]'}> Blocked </h4>
            </div>
            <div className='hidden md:flex items-center gap-[7px] absolute right-[5px] top-[-30px] view-type'>
                <span data-label='Table View' 
                    className="hover:text-purple-800 transition duration-150"
                    onClick={()=> setShowByTable(status=> !status)}
                >
                         <VscTable className="text-inherit"/> 
                    </span>
                <span data-label='List View' 
                    className='hidden xx-lg:inline-block'
                    onClick={()=> {setShowByTable(false); setShowByGrid(false)}}
                > 
                    <FaList className="hover:text-purple-700 transition duration-150"/> 
                </span>
                <span data-label='Grid View'
                    onClick={()=> {setShowByTable(false); setShowByGrid(true)}}
                >
                          <BsFillGrid3X3GapFill className="hover:text-purple-700 transition duration-150"/> 
                    </span>
            </div>
        </>
    )
}