import React, {useState, useEffect, useRef, useContext} from 'react'
import './WishlistPage.css'
import {useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {Search, MoreVertical, ChevronRight, Trash, ArrowRight, Plus} from "lucide-react"
import {toast} from 'react-toastify'

import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'
import WishlistModal from './WishlistModal'
import {createList, addProductToList} from '../../../Slices/wishlistSlice'
import {addToCart, removeFromCart, resetCartStates} from '../../../Slices/cartSlice'
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
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(12) 
    const [sorts, setSorts] = useState({})
    
    const [queryOptions, setQueryOptions] = useState({})

    const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)

    const [isCartOpen, setIsCartOpen] = useState(false)
    const [packedupCart, setPackedupCart] = useState({})

    const {cart, productAdded, productRemoved, error, message} = useSelector(state=> state.cart) 
    const {wishlist, listCreated, listRemoved, listUpdated, loading, wishlistError, wishlistSuccess} = useSelector(state=> state.wishlist) 

    const dispatch = useDispatch()
    

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

    useEffect(()=> {
        if(listCreated){
            toast.success("Created wishlist successfully!")
        }
    },[listCreated])

    useEffect(()=> {
        if(cart?.products && cart.products.length > 0){
            setPackedupCart(cart)
            setIsCartOpen(true)
        }
        if(error && error.toLowerCase().includes('product')){
          console.log("Error from ProductDetailPage-->", error)
          toast.error(error)
          dispatch(resetCartStates())
        }
        if(productAdded){
          console.log("Product added to cart successfully!")
          setPackedupCart(cart)
          setIsCartOpen(true)
          dispatch(resetCartStates())
        }
        if(productRemoved){
          setPackedupCart(cart)
          dispatch(resetCartStates())
        }
    },[error, productAdded, productRemoved])

    const updateQuantity = (id, newQuantity)=> {
        dispatch( addToCart({productId: id, quantity: newQuantity}) )
    }
         
    const removeFromTheCart = (id)=> {
        dispatch(removeFromCart({productId: id}))
    }

    const handleSubmit = (wishlistDetails)=> {
        console.log("New Wishlist Data:", wishlistDetails)
        console.log("Dispatching....")
        dispatch( createList({wishlistDetails}) )
    }

    
    return(

            <section id='WishlistPage' className='flex gap-[13px]'>

                <div className='mt-[1rem] basis-[20%]'>
                <div className={`p-[12px] h-fit bg-[rgba(246,239,252)] border border-dashed border-secondary rounded-[7px]`}>
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

                <div className='mb-[2rem] w-full h-[3rem] pl-[1rem] flex items-center gap-[10px] cursor-pointer'>

                    <Plus className='text-secondary w-[20px] h-[20px]'/>
                    <span className='text-[14px] text-muted font-[500] tracking-[0.5px] capitalize' 
                        onClick={()=> setIsWishlistModalOpen(true)}>
                             Add New List 
                    </span>
                    
                    <WishlistModal isOpen={isWishlistModalOpen} onClose={()=> setIsWishlistModalOpen(false)} onSubmit={handleSubmit} />

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

                    <CartSidebar isOpen={isCartOpen} onClose={()=> setIsCartOpen(false)} packedupCart={packedupCart} 
                        updateQuantity={updateQuantity} removeFromTheCart={removeFromTheCart} retractedView={true} />
                        
                </div>

            </section>

    )
}