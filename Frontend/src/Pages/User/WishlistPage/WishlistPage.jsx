import React, {useState, useEffect, useRef, useContext} from 'react'
import './WishlistPage.css'
import {useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {debounce} from 'lodash'
import {motion} from 'framer-motion'

import {TbShoppingCartHeart} from "react-icons/tb"

import ListBoard from './ListBoard'
import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'
import WishlistModal from './Modals/WishlistModal'
import ListDeletionModal from './Modals/ListDeletionModal'
import {getAllWishlistProducts, getUserWishlist, searchList} from '../../../Slices/wishlistSlice'
import {getTheCart} from '../../../Slices/cartSlice'
import CartSidebar from '../../../Components/CartSidebar/CartSidebar'
import AuthPrompt from '../../../Components/AuthPrompt/AuthPrompt'
import {UserPageLayoutContext} from '../UserPageLayout/UserPageLayout'
import {ProtectedUserContext} from '../../../Components/ProtectedUserRoutes/ProtectedUserRoutes'


export default function WishlistPage(){

    const {setBreadcrumbHeading, setPageWrapperClasses, setContentTileClasses, setSidebarTileClasses, setPageLocation} = useContext(UserPageLayoutContext)
    setBreadcrumbHeading('Wishlist')
    setPageWrapperClasses('gap-[2rem] pr-0 pl-6 xx-md:pl-[4rem] mb-[10rem]')
    setContentTileClasses('basis-full w-full x-xl:basis-[75%] mt-[2rem] mr-8 x-xl:mr-auto content-tile')
    setSidebarTileClasses('hidden x-xl:inline-block')
    
    const {setIsAuthModalOpen, checkAuthOrOpenModal} = useContext(ProtectedUserContext)
    setIsAuthModalOpen({status: false, accessFor: 'wishlist'})
              
    const location = useLocation()
    setPageLocation(location.pathname)

    const [currentList, setCurrentList] = useState('')

    const [showByGrid, setShowByGrid] = useState(true)
    
    const [limit, setLimit] = useState(12) 
    const [currentPage, setCurrentPage] = useState(1)
    const [sorts, setSorts] = useState({})
    
    const [queryOptions, setQueryOptions] = useState({})

    const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)

    const [updateListDetails, setUpdateListDetails] = useState(null)

    const [loadingListCard, setLoadingListCard] = useState({})

    const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false)
    const [listToDelete, setListToDelete] = useState(null)

    const [isCartOpen, setIsCartOpen] = useState(false)

    const {cart, productAdded, productRemoved, error, message} = useSelector(state=> state.cart) 
    const {wishlist, wishlistProducts} = useSelector(state=> state.wishlist) 
    const {user} = useSelector((state)=> state.user)

    const dispatch = useDispatch()

    const sortMenu = [
        {name: 'Priority: High to Low', value:'priority', order:'-1'}, {name: 'Priority: Low to High', value:'priority', order:'1'},
        {name: 'Price: High to Low', value:'price', order:'-1'}, {name: 'Price: Low to High', value:'price', order:'1'},
        {name: 'Names: A to Z', value:'alphabetical', order:'1'}, {name: 'Names: Z to A', value:'alphabetical', order:'-1'},
        {name: 'Newest First', value:'addedAt', order:'-1'}, {name: 'Oldest First', value:'addedAt', order:'1'}
    ]

    const gridViewStyles = `w-full grid gap-y-8 grid-cols-1 xx-md:grid-cols-2 gap-x-[4rem] xx-md:gap-x-0 justify-items-center 
                    lg:justify-items-start max-lg:!ml-0`

    useEffect(()=> {
        dispatch(getTheCart())
        dispatch(getUserWishlist())
    },[])

    useEffect(()=> {
        console.log("wishlist--------->", wishlist)
        dispatch( getAllWishlistProducts({queryOptions}))
    }, [wishlist])

    useEffect(()=>{
        console.log("SORTS-->", JSON.stringify(sorts))
        setQueryOptions(queryOptions=> (
            {...queryOptions, listName: currentList, sort: sorts, page: currentPage, limit}
        ))
    },[sorts, currentPage, limit])

    useEffect(()=>{
        console.log('WISHLIST OUERYOPTIONS--------->', JSON.stringify(queryOptions))
        if(Object.keys(queryOptions).length){
            dispatch( getAllWishlistProducts({queryOptions}))
        }
        console.log('updateListDetails--->', updateListDetails)
    },[queryOptions, updateListDetails])

    useEffect(()=> {
        if(cart?.products && cart.products.length > 0){
            setIsCartOpen(true)
        }
    },[error, productAdded, productRemoved])

    const openDeleteListModal = ({listId, listName})=> {
        setIsDeleteListModalOpen(true)
        setListToDelete({listId, listName})
    }

    const updateListHandler = (listDetails)=> {
        setUpdateListDetails(listDetails)
        setIsWishlistModalOpen(true) 
    }

    const checkAuthAndOpenListModal = ()=> {
        if(checkAuthOrOpenModal()){
          return
        }
        setIsWishlistModalOpen(true)
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

            <section id='WishlistPage' className='flex gap-[13px] flex-col md:flex-row'>

                <div className='mt-[1rem] basis-[25%] lg:basis-[20%]'>
                    <motion.div
                      className="flex md:hidden flex-col items-center text-center mb-[3rem] px-2"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className='flex gap-[10px] items-center'>
                        <TbShoppingCartHeart size={32} className='text-muted w-[28px] h-[28px] xxs-sm:w-[32px] xxs-sm:h-[32px]'/>
                        <h1 className="text-[22px] xxs-sm:text-[24px] font-[500] capitalize">
                          Wishlist
                        </h1>
                      </div>
                      <h2 className="hidden mob:inline-block text-[8px] xxs-sm:text-[10px] xs-sm:text-[12px] text-secondary mt-1">
                        Create and organize your Wishlist to save favorite gym products for later
                      </h2>
                    </motion.div>     
                
                    

                    <ListBoard 
                        currentList={currentList}
                        onNewCurrenList={setCurrentList}
                        onSearch={searchHandler}
                        onUpdateList={updateListHandler}
                        onDeleteList={openDeleteListModal}
                        setLoadingListCard={setLoadingListCard}
                        isListCardLoading={loadingListCard}
                        onOpenNewListModal={checkAuthAndOpenListModal}
                    />
                

                    <WishlistModal 
                        isOpen={isWishlistModalOpen} 
                        onClose={()=> {
                            setUpdateListDetails(null)
                            setIsWishlistModalOpen(false)
                        }} 
                        listDetails={updateListDetails}
                        setLoadingListCard={setLoadingListCard}
                    />
                            
                    <ListDeletionModal 
                        isOpen={isDeleteListModalOpen} 
                        onClose={() => setIsDeleteListModalOpen(false)}
                        listDetails={listToDelete} 
                        setListDetails={setListToDelete}
                    />


                </div>
                
                <h3 className='inline-block md:hidden text-[17px] text-secondary font-[600] tracking-[0.3px]'> Saved Products </h3>
                <div 
                    className='mt-[1rem] pt-[2rem] basis-[65%] lg:basis-[80%] bg-white border border-dropdownBorder rounded-[7px]'
                    id='wishlist-products'
                >
                      
                    <ProductListingTools 
                        showByGrid={showByGrid} 
                        setShowByGrid={setShowByGrid} 
                        sortHandlers={{sorts, setSorts}}
                        sortMenu={sortMenu} 
                        limiter={{limit, setLimit}} 
                        queryOptions={queryOptions} 
                        setQueryOptions={setQueryOptions}
                        wishlistDisplay={true}
                    />
                                                         
                    <div className='mt-[2rem]'> 
                        
                        {
                            wishlistProducts && wishlistProducts.length > 0 &&
                                <ProductsDisplay 
                                    gridView={showByGrid} 
                                    customGridViewStyles={gridViewStyles} 
                                    pageReader={{currentPage, setCurrentPage}} 
                                    limiter={{limit, setLimit}}
                                    queryOptions={queryOptions} 
                                    wishlistDisplay={true} 
                                    currentList={currentList}
                                    checkAuthOrOpenModal={checkAuthOrOpenModal}
                                />
                        }

                    </div>
                    
                        
                </div>
                {
                  !user &&
                    <div className='mt-4'>
                    
                      <AuthPrompt />

                    </div>
                }

                <CartSidebar isOpen={isCartOpen} 
                    onClose={()=> setIsCartOpen(false)} 
                    retractedView={true} 
                />

            </section>
    )
}