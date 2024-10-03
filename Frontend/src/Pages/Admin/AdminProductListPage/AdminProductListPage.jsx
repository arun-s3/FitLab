import React,{useState} from 'react'
import './AdminProductListPage.css'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'
import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay';

import {LiaSlidersHSolid} from "react-icons/lia";
import {FiDownload} from "react-icons/fi";
import {RiArrowDropDownLine} from "react-icons/ri";
import {IoMdAdd} from "react-icons/io";
import {BsFillGrid3X3GapFill} from "react-icons/bs";
import {FaList} from "react-icons/fa";
import {CiViewTable} from "react-icons/ci";
import {VscTable} from "react-icons/vsc";

export default function AdminProductListPage(){

    const [showSortBy, setShowSortBy] = useState(false)
    const [showByGrid, setShowByGrid] = useState(true)
    const [showByTable, setShowByTable] = useState(false)
    const [toggleTab, setToggleTab] = useState({goTo: 'all'})

    return(

        <section id='AdminProductList' >

            <header className='flex justify-between items-center'>
                <h1> Products </h1>
                <div className='flex items-center gap-[1.5rem]'>
                    <div className='chip'>
                        <i>
                            <LiaSlidersHSolid/>
                        </i>
                        <span> Filter </span>
                    </div>
                    <div className='chip'>
                        <i>
                            <FiDownload/>
                        </i>
                        <span> Export </span>
                        <i>
                            <RiArrowDropDownLine/>
                        </i>
                    </div>
                    <div className='chip'>
                        <i>
                            <IoMdAdd/>
                        </i>
                        <span> Add new Product </span>
                    </div>
                </div>
            </header>
            <main className='relative mt-[4.3rem]'>
                {/* <svg width="170" height="35" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="red" stroke-width="1" fill="transparent"  d='M0 35  Q0 0, 20 0 h90 Q130 0, 145 35'/>
                </svg> */}
                <div className='h-[40px] w-[150px] bg-white border border-b-[#e5e7eb] rounded-tl-[10px] cursor-pointer
                                 flex justify-center items-center absolute top-[-39px] tab' onClick={()=>setToggleTab({goTo: 'all'})}
                        style={toggleTab.goTo == 'all'? {borderBottomColor:'transparent'}:{}}>
                    <h4 className={toggleTab.goTo == 'all' ? 'opacity-[1]' : 'opacity-[0.75]'}> All </h4>
                </div>
                <div className='h-[40px] w-[150px] bg-white border border-b-[#e5e7eb] flex justify-center items-center absolute cursor-pointer
                                    top-[-39px] left-[150px] tab' onClick={()=>setToggleTab({goTo: 'active'})}
                                style={toggleTab.goTo == 'active'? {borderBottomColor:'transparent'}:{}}>
                    <h4 className={toggleTab.goTo == 'active' ? 'opacity-[1]' : 'opacity-[0.75]'}> Active </h4>
                </div>
                <div className='h-[40px] w-[150px] bg-white border border-b-[#e5e7eb] rounded-tr-[5px] flex justify-center items-center cursor-pointer
                             absolute top-[-39px] left-[300px] tab' onClick={()=>setToggleTab({goTo: 'blocked'})}
                                style={toggleTab.goTo == 'blocked'? {borderBottomColor:'transparent'}:{}}>
                    <h4 className={toggleTab.goTo == 'blocked' ? 'opacity-[1]' : 'opacity-[0.75]'}> Blocked </h4>
                </div>
                <div className='absolute right-[5px] top-[-30px] flex items-center gap-[7px] view-type'>
                    <span data-label='Table View' onClick={()=> setShowByTable(true)}> <VscTable/> </span>
                    <span data-label='List View' onClick={()=> setShowByGrid(false)}> <FaList/> </span>
                    <span data-label='Grid View' onClick={()=> setShowByGrid(true)}>  <BsFillGrid3X3GapFill/> </span>
                </div>
                <div className='border py-[1rem] px-[2rem] bg-white'>

                    <ProductListingTools admin={true} showSortBy={showSortBy} setShowSortBy={setShowSortBy} showByTable={showByTable}/>

                    <div className='mt-[2rem] px-[2rem]'>

                        <ProductsDisplay gridView={showByGrid} showByTable={showByTable} admin={true}/>

                    </div>

                </div>
            </main>
        </section>
    )
}