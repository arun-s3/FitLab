import React, {useState, useEffect, useRef, useContext} from 'react'
import './WishlistPage.css'
import {useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {debounce} from 'lodash'

import {Search, MoreVertical, ChevronRight, Trash, ArrowRight, Plus} from "lucide-react"
import {CiEdit} from "react-icons/ci";
import {toast} from 'react-toastify'
import {format} from "date-fns"

import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'
import WishlistModal from './WishlistModal'
import ListDeletionModal from './ListDeletionModal'
import {getAllWishlistProducts, getUserWishlist, searchList, resetWishlistStates} from '../../../Slices/wishlistSlice'
import {getTheCart, resetCartStates} from '../../../Slices/cartSlice'
import CartSidebar from '../../../Components/CartSidebar/CartSidebar'
import {UserPageLayoutContext} from '../UserPageLayout/UserPageLayout'



export default function WishlistPage(){

    const {setBreadcrumbHeading, setContentTileClasses, setPageLocation} = useContext(UserPageLayoutContext)
    setBreadcrumbHeading('Wishlist')
              
    const location = useLocation()
    setPageLocation(location.pathname)

    setContentTileClasses('basis-[85%] mt-[2rem]')

    const [currentList, setCurrentList] = useState('')

    const [showByGrid, setShowByGrid] = useState(true)
    
    const [limit, setLimit] = useState(12) 
    const [currentPage, setCurrentPage] = useState(1)
    const [sorts, setSorts] = useState({})
    
    const [queryOptions, setQueryOptions] = useState({})

    const [isSearchListHovered, setIsSearchListHovered] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)

    const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)

    const [updateTheList, setUpdateTheList] = useState('')

    const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false)
    const [listToDelete, setListToDelete] = useState(null)

    const [isCartOpen, setIsCartOpen] = useState(false)

    const {cart, productAdded, productRemoved, error, message} = useSelector(state=> state.cart) 
    const {wishlist, listCreated, listRemoved, listUpdated, loading, wishlistError, wishlistSuccess} = useSelector(state=> state.wishlist) 

    const dispatch = useDispatch()
    

    const listNames = [
        {name:'SupplementList', createdAt: '23 January 2025', thumbnail: 'https://pixabay.com/photos/man-treadmill-run-training-gym-8545861/'},
        {name:'ChestMuscle', createdAt: '17 January 2025'}, {name:'LatestMachines', createdAt: '15 December 2024'},
    ]

    const sortMenu = [
        {name: 'Priority: High to Low', value:'priority', order:'-1'}, {name: 'Priority: Low to High', value:'priority', order:'1'},
        {name: 'Price: High to Low', value:'price', order:'-1'}, {name: 'Price: Low to High', value:'price', order:'1'},
        {name: 'Names: A to Z', value:'alphabetical', order:'1'}, {name: 'Names: Z to A', value:'alphabetical', order:'-1'},
        {name: 'Newest First', value:'addedAt', order:'-1'}, {name: 'Oldest First', value:'addedAt', order:'1'}
    ]

    const priorityDetails = [
        {name: 'high', value: 1, color: 'text-red-500', bg: 'bg-red-50'},
        {name: 'medium', value: 2, color: 'text-yellow-500', bg: 'bg-red-50'},
        {name: 'low', value: 3, color: 'text-green-500', bg: 'bg-red-50'}
    ]

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    useEffect(()=> {
        dispatch(getTheCart())
    },[])

    useEffect(()=>{
        console.log("currentListName-->", currentList)
        console.log("SORTS-->", JSON.stringify(sorts))
        setQueryOptions(queryOptions=> (
            {...queryOptions, listName: currentList, sort: sorts, page: currentPage, limit}
        ))
    },[currentList, sorts, currentPage, limit])

    useEffect(()=>{
        console.log('OUERYOPTIONS--------->', JSON.stringify(queryOptions))
        if(Object.keys(queryOptions).length){
            dispatch( getAllWishlistProducts({queryOptions}))
        }
    },[queryOptions])

    useEffect(()=> {
        if(listCreated){
            toast.success("Created wishlist successfully!")
            dispatch(resetWishlistStates())
        }
        if(listUpdated){
            toast.success("Updated wishlist successfully!")
            dispatch(resetWishlistStates())
        }
        if(listRemoved){
            toast.success("Deleted wishlist successfully!")
            dispatch(resetWishlistStates())
        }
    },[listCreated, listUpdated, listRemoved])

    useEffect(()=> {
        if(cart?.products && cart.products.length > 0){
            setIsCartOpen(true)
        }
    },[error, productAdded, productRemoved])

    const openDeleteListModal = ({listId, listName})=> {
        setIsDeleteListModalOpen(true)
        setListToDelete({listId, listName})
    }

    const debouncedSearch = useRef(
        debounce((searchData)=> {
          dispatch(searchList({find: searchData}))
        }, 600) 
    ).current;

    const searchHandler = (e)=> {
        const searchData = e.target.value
        console.log('searchData--->', searchData)
        if(searchData.trim() !== ''){
            console.log("Getting searched lists--")
            debouncedSearch(searchData)
        } 
        else{
            console.log("Getting all lists--")
            debouncedSearch.cancel()
            dispatch(getUserWishlist())
        } 
    }


    
    return(

            <section id='WishlistPage' className='flex gap-[13px]'>

                <div className='mt-[1rem] basis-[20%]'>
                <div className={`p-[12px] h-fit bg-[rgba(246,239,252)] border border-dashed border-secondary rounded-[7px]`}>
                    <h2 className={`mb-[1.3rem] mx-[3px] w-full flex items-center justify-between ${isSearchListHovered && 'relative'}`}
                        onMouseLeave={()=> !searchFocused && setIsSearchListHovered(false)}>
                        <span className={`text-[17px] text-secondary font-[550] uppercase
                             tracking-[0.2px] ${isSearchListHovered && 'hidden transition duration-300 ease-out'} `} 
                                style={{wordSpacing: '6px'}}> 
                            All Lists 
                        </span>
                        <input type='text' className={`relative mx-[5px] w-[0%] left-[170px] h-[2rem] text-[13px] text-secondary border
                         border-dropdownBorder border-r-white rounded-tr-[0px] rounded-br-[0px] rounded-[7px] opacity-0 
                            ${isSearchListHovered && 'opacity-100 transition duration-700 ease-in-out search-input'}
                                focus:ring-0 focus:border-dropdownBorder`} onFocus={()=> setSearchFocused(true)}
                                    onBlur={()=> { setSearchFocused(false); setIsSearchListHovered(false) }} 
                                        onChange={(e)=> searchHandler(e)}/>    
                        <Search className={`w-[20px] h-[20px] text-gray-400 cursor-pointer z-[5] ${isSearchListHovered && 'absolute right-[10px] scale-[85%]'}`} 
                            onMouseEnter={()=> setIsSearchListHovered(true)}/>
                        <div className={` absolute bg-white opacity-0 left-[169px] w-[32px] h-[2rem] border border-dropdownBorder border-l-white
                          rounded-tl-[0px] rounded-bl-[0px] 
                            rounded-[7px] ${isSearchListHovered && 'opacity-100'}`}></div>
                    </h2>
                    <div className={`w-full pr-[5px] flex flex-col gap-[10px]`}>
                        {
                           [...wishlist.lists].sort((a,b)=>{
                            const priorityA = a.priority.toString()
                            const priorityB = b.priority.toString()

                            if (priorityA === '1') return -1
                            if (priorityB === '1') return 1
                            if (priorityA === '2') return -1
                            if (priorityB === '2') return 1
                            return 0
                           }).map(list=> (
                            <div key={list.name} className={`w-full px-[12px] py-[10px]
                                 ${currentList === list.name ? 'bg-whitesmoke shadow-lg' : 'bg-white shadow-sm'} flex 
                                    items-center justify-between border border-dropdownBorder rounded-[5px] cursor-pointer
                                        hover:bg-whitesmoke hover:shadow-md`} id='list'>
                                <div className='flex flex-col justify-between gap-[10px]' 
                                    onClick={()=> setCurrentList(prev=> (prev === list.name ? '' : list.name))}>
                                    <div>
                                        <figure className='w-[20px] h-[20px] rounded-[10px]'>
                                            <img src={list?.thumbnail || "/placeholder.svg"} className='w-[20px] h-[20px] rounded-[10px]'/>
                                        </figure>
                                        <div className='flex gap-[10px]'>
                                            <h4 className='mt-[5px] text-[13px] font-[450] capitalize'> {list.name} </h4>
                                            <CiEdit className='self-end h-[13px] w-[13px] text-secondary cursor-pointer' 
                                                onClick={()=> { setUpdateTheList(list._id); setIsWishlistModalOpen(true) }}/>
                                        </div>
                                        <h5 className='text-[11px] text-muted font-[450] capitalize'> 
                                            { ` (${list.products.length} ${list.products.length === 1 ? 'item' : 'items'}) ` }
                                        </h5>
                                    </div>
                                    <h3 className='text-[11px]'>
                                        <span className='text-muted'>  Priority: </span>
                                        <span className={`ml-[3px] ${priorityDetails.find(status=> status.value === list.priority).color}
                                            font-[450] capitalize`}>
                                                { priorityDetails.find(status=> status.value === list.priority).name 
                                        }</span> 
                                    </h3>
                                    <h5 className='text-[11px] text-muted'> Created: {format( new Date(list.createdAt), "MMM dd, yyyy" )} </h5>
                                </div>
                                <div className='h-[7rem] flex flex-col justify-between controls'>
                                    {/* <i className='p-[3px] border border-dropdownBorder rounded-[2px]'> */}
                                        <Trash className='w-[15px] h-[15px] text-muted hover:scale-110 hover:text-red-500 transition
                                            ease-in-out duration-300' 
                                                onClick={()=> openDeleteListModal({listId: list._id, listName: list.name})}/>
                                    {/* </i> */}
                                    {/* <i className='p-[3px] border border-dropdownBorder rounded-[2px]'> */}
                                        <ArrowRight className='w-[15px] h-[15px] text-muted hover:text-green-500 hover:translate-x-2
                                            hover:scale-110 transition duration-300 ease-in-out'
                                            onClick={()=> setCurrentList(prev=> (prev === list.name ? '' : list.name))}/>
                                    {/* </i> */}
                                </div>
                            </div>
                           )) 
                        }
                    </div>
                </div>

                <div className='mb-[2rem] w-full h-[3rem] pl-[1rem] flex items-center gap-[10px] cursor-pointer'>

                    <Plus className='text-secondary w-[20px] h-[20px]'/>
                    <span className='text-[14px] text-muted font-[500] tracking-[0.5px] capitalize' 
                        onClick={()=> setIsWishlistModalOpen(true)}>
                             Add New List 
                    </span>
                    
                    <WishlistModal isOpen={isWishlistModalOpen} onClose={()=> setIsWishlistModalOpen(false)} shouldUpdateThisId={updateTheList}/>
                    
                    <ListDeletionModal isOpen={isDeleteListModalOpen} onClose={() => setIsDeleteListModalOpen(false)}
                        listDetails={listToDelete} setListDetails={setListToDelete}/>

                </div>

                </div>

                <div className='mt-[1rem] pt-[2rem] basis-[80%] bg-white border border-dropdownBorder rounded-[7px]' id='wishlist-products'>
                            
                    <ProductListingTools showByGrid={showByGrid} setShowByGrid={setShowByGrid} sortHandlers={{sorts, setSorts}}
                        sortMenu={sortMenu} limiter={{limit, setLimit}} queryOptions={queryOptions} setQueryOptions={setQueryOptions}
                         wishlistDisplay={true}/>
                                                         
                    <div className='mt-[2rem]'>

                        <ProductsDisplay gridView={showByGrid} pageReader={{currentPage, setCurrentPage}} limiter={{limit, setLimit}}
                            queryOptions={queryOptions} wishlistDisplay={true} currentList={currentList}/>

                    </div>

                    <CartSidebar isOpen={isCartOpen} onClose={()=> setIsCartOpen(false)} retractedView={true} />
                        
                </div>

            </section>

    )
}