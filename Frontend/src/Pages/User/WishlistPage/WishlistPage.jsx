import React, {useState, useEffect, useRef, useContext} from 'react'
import './WishlistPage.css'
import {useLocation} from 'react-router-dom'


import {Search, MoreVertical, ChevronRight, Trash, ArrowRight} from "lucide-react"

import {UserPageLayoutContext} from '../UserPageLayout/UserPageLayout'
import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'



export default function WishlistPage(){

    const {setBreadcrumbHeading, setPageLocation} = useContext(UserPageLayoutContext)
    setBreadcrumbHeading('Wishlist')
              
    const location = useLocation()
    setPageLocation(location.pathname)

    const [currentList, setCurrentList] = useState('')

    const [showByGrid, setShowByGrid] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(12) 
    const [sorts, setSorts] = useState({})
    
    const [queryOptions, setQueryOptions] = useState({})
    

    const listNames = [
        {name:'SupplementList', createdAt: '23 January 2025', thumbnail: 'https://pixabay.com/photos/man-treadmill-run-training-gym-8545861/'},
        {name:'ChestMuscle', createdAt: '17 January 2025'}, {name:'LatestMachines', createdAt: '15 December 2024'},
    ]

    const sortMenu = [
        {name: 'Priority: High to Low', value:'price', order:'-1'}, {name: 'Priority: Low to High', value:'price', order:'1'},
        {name: 'Price: High to Low', value:'price', order:'-1'}, {name: 'Price: Low to High', value:'price', order:'1'}
    ]

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }


    return(

            <section id='WishlistPage' className='basis-[85%] mt-[2rem] flex gap-[13px]'>

                <div className={`mt-[1rem] p-[12px] h-fit basis-[20%] bg-[rgba(246,239,252)] border border-dashed border-secondary 
                    rounded-[7px]`}>
                    <h2 className='mb-[1.3rem] mx-[3px] flex items-center justify-between'>
                        <span className='text-[17px] text-secondary font-[550] uppercase tracking-[0.2px]' style={{wordSpacing: '6px'}}> 
                            All Lists 
                        </span>
                        <Search className='w-[20px] h-[20px] text-gray-400'/>
                    </h2>
                    <div className={`w-full pr-[5px] flex flex-col gap-[10px]`}>
                        {
                           listNames.map(list=> (
                            <div key={list.name} className={`w-full px-[12px] py-[10px]
                                 ${currentList === list.name ? 'bg-inputBgSecondary border-[2px] shadow-lg' : 'bg-white'} flex 
                                    items-center justify-between border border-dropdownBorder rounded-[5px] cursor-pointer
                                        hover:bg-inputBgSecondary hover:shadow-sm`}
                                         onClick={()=> setCurrentList(list.name)}>
                                <div className='flex flex-col justify-between gap-[10px]'>
                                    <div>
                                        <figure className='w-[20px] h-[20px] rounded-[10px]'>
                                            <img src={list.thumbnail} className='w-[20px] h-[20px] rounded-[10px]'/>
                                        </figure>
                                        <h4 className='mt-[5px] text-[13px] font-[450] capitalize'> {list.name} </h4>
                                    </div>
                                    <h5 className='text-[11px] text-muted'> Created On: {list.createdAt} </h5>
                                </div>
                                <div className='h-[4rem] flex flex-col justify-between '>
                                    {/* <i className='p-[3px] border border-dropdownBorder rounded-[2px]'> */}
                                        <Trash className='w-[15px] h-[15px] text-muted'/>
                                    {/* </i> */}
                                    {/* <i className='p-[3px] border border-dropdownBorder rounded-[2px]'> */}
                                        <ArrowRight className='w-[15px] h-[15px] text-muted'/>
                                    {/* </i> */}
                                </div>
                            </div>
                           )) 
                        }
                    </div>
                </div>

                <div className='mt-[1rem] pt-[2rem] basis-[80%] bg-white border border-dropdownBorder rounded-[7px]' id='wishlist-products'>
                            
                    <ProductListingTools showByGrid={showByGrid} setShowByGrid={setShowByGrid} sortHandlers={{sorts, setSorts}}
                        sortMenu={sortMenu} limiter={{limit, setLimit}} queryOptions={queryOptions} setQueryOptions={setQueryOptions}
                         wishlistDisplay={true}/>
                                                         
                    <div className='mt-[2rem]'>

                        <ProductsDisplay gridView={showByGrid} pageReader={{currentPage, setCurrentPage}} limiter={{limit, setLimit}}
                            queryOptions={queryOptions} wishlistDisplay={true}/>

                    </div>
                        
                </div>

            </section>

    )
}