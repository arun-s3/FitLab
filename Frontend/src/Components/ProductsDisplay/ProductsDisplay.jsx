import React, {useState, useEffect} from 'react';
import './ProductsDisplay.css';
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import axios from 'axios';
import {toast} from 'react-toastify'
import {MdFavorite, MdFavoriteBorder} from "react-icons/md";
import {RiFileEditLine} from "react-icons/ri";
import {MdBlock} from "react-icons/md";

import {getAllProducts, toggleProductStatus} from '../../Slices/productSlice'
import {createList, addProductToList, removeProductFromList, getUserWishlist, resetWishlistStates} from '../../Slices/wishlistSlice'
import WishlistModal from '../../Pages/User/WishlistPage/WishlistModal'
import WishlistOptionsModal from '../WishlistModals/WishlistOptionsModal'
import RemoveWishlistItemModal from '../WishlistModals/RemoveWishlistItemModal';
import Pagination from '../Pagination/Pagination'
import StarGenerator from '../StarGenerator/StarGenerator';
import {SiteButtonSquare} from '../SiteButtons/SiteButtons';
import {capitalizeFirstLetter} from '../../Utils/helperFunctions'
import {addToCart} from '../../Slices/cartSlice'
import ProductsTableView from './ProductsTableView';

export default function ProductsDisplay({gridView, showByTable, pageReader, limiter, queryOptions, showTheseProducts, admin, wishlistDisplay}) {

  const {currentPage, setCurrentPage} = pageReader

  // const [products, setProducts] = useState([]);             //Use this for dummy data
  // const [productCounts, setProductCounts] = useState(null)  //Use this for dummy data
  const dispatch = useDispatch()
  const {products:items, productCounts} = useSelector(state=> state.productStore)
  const [products, setProducts] = useState([])

  const [productIsHovered, setProductIsHovered] = useState()

  const navigate = useNavigate()

  const {wishlist, listCreated, listRemoved, listUpdated, loading, wishlistError, wishlistSuccess} = useSelector(state=> state.wishlist)

  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)
  const [isWishlistOptionsModalOpen, setIsWishlistOptionsModalOpen] = useState(false)
  const [selectedProductForWishlist, setSelectedProductForWishlist] = useState(null)

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [selectedList, setSelectedList] = useState(null)


  // useEffect(() => {
  //   // const getDummyProducts = async () => {
  //   //   try {
  //   //     const response = await axios.get('https://dummyjson.com/products');
  //   //     setProducts(response.data.products); 
  //   //     setProductCounts(response.data.total)
  //   //     console.log("PRODUCTS-->", JSON.stringify(response.data.products));
  //   //     console.log("TOTAL COUNTS-->"+ response.data.total)
  //   //     console.log("TAGS-->"+ response.data.products[0].tags[0])
  //   //   } catch (error) {
  //   //     console.log("ERROR IN PRODUCTLISTING-->", error.message);
  //   //   }
  //   // };
  //   const getFitlabProducts =  async ()=>{
  //     dispatch( getAllProducts({}) )
  //   }
  //   getFitlabProducts()
  //   console.log("PRODUCTS----",JSON.stringify(products))
  //   // getDummyProducts();
  // }, []);

  // useEffect(()=> {
  //   if(Object.keys(queryOptions).length){
  //     dispatch( getAllProducts({queryOptions}) )
  //   }
  // },[queryOptions])

  useEffect(()=> {
    dispatch(getUserWishlist())
  },[])

  useEffect(()=>{
    !admin && setProducts(items)
  },[items])

  useEffect(()=>{
    admin && setProducts(showTheseProducts)
  },[showTheseProducts])

  useEffect(()=> {
    if(listUpdated){
      toast.success("The product have been added to the Wishlist!")
      dispatch(resetWishlistStates())
    }
    if(listRemoved){
      toast.success("The product have been removed from the Wishlist!")
      dispatch(resetWishlistStates())
    }
    if(wishlistError){
      toast.error(wishlistError)
      dispatch(resetWishlistStates())
    }
    if(wishlist){
      console.log("Wishlist---->", wishlist)
    }
  },[listUpdated, listRemoved, wishlist, wishlistError])

  const currentPageChanger = (page)=>{
    setCurrentPage(page)
  }

  const handleAddToCart = (id)=> {
     console.log("Inside handleAddToCart()--")
     dispatch( addToCart({productId: id, quantity: 1}) )
     console.log("Dispatched successfully")
  }

  const openWishlistOptionsModal = (product)=> {
    setSelectedProductForWishlist(product)
    setIsWishlistOptionsModalOpen(true)
  }

  const openWishlistItemRemoveModal = (product) => {
    setSelectedProductForWishlist(product)
    const targetList = wishlist.lists.find((list)=> list.products.find(item=> item.product === product._id))
    setSelectedList(targetList.name)
    setIsRemoveModalOpen(true)
  }

  const addToWishlist = (product)=> {
    const userCreatedListsExists = Object.keys(wishlist).length && wishlist?.lists.some(list=> list.name === 'Default Shopping List') 
                                    && wishlist?.lists.length > 1
    if(userCreatedListsExists){
      console.log("Has lists other than default list")
      openWishlistOptionsModal(product)
    }else{
      dispatch(addProductToList({productId: product._id}))
    }
  }

  const deleteFromWishlist = (product)=> {
    const productOfDefaultList = Object.keys(wishlist).length && wishlist?.lists.some(list=> {
       list.name === 'Default Shopping List' && list.products.some(item=> item.product === product._id)
    }) 
                                    
    if(productOfDefaultList){
      console.log("Inside productOfDefaultList ")
      dispatch(removeProductFromList({productId: product._id}))
    }else{
      console.log("Has lists other than default list")
      openWishlistItemRemoveModal(product)
    }
  }

  const createNewWishlist = (wishlistDetails)=> {
    console.log("New Wishlist Data:", wishlistDetails)
    console.log("Dispatching....")
    dispatch( createList({wishlistDetails}) )
  }


  return (
    <>
     <div className={`${gridView ? 'grid grid-cols-3 gap-y-[2rem]' : showByTable ? '' : 'flex flex-col gap-[2rem]'}
       ${wishlistDisplay && 'ml-[1.5rem]'}`} id="products-display" style={admin ? { justifyItems: 'center' } : {}}>

      { !showByTable && 
        products.map((product) => (
          <div key={product._id} className={` ${gridView ? 'w-[275px]' : 'flex gap-[1rem] w-full'}`}
                    onMouseEnter={()=> setProductIsHovered(product._id)} 
                      onMouseLeave={()=> setProductIsHovered('')}>
            <figure className={`relative h-auto rounded-[10px] thumbnail cursor-pointer ${productIsHovered === product._id && 'shadow-lg'}`}>
              <img src={product.thumbnail.url || product.thumbnail} alt={product.title} 
                className={`rounded-[10px] ${wishlistDisplay ? 'h-[250px]' : 'h-[275px]'} object-cover`}
                  onClick={()=> !admin && navigate('/shop/product', {state: {product}})}/> 
              <figcaption className={`${admin ? 'top-[2px] left-[-40px]' : 'bottom-[12px]'} absolute w-full text-center`}>
                {
                 admin ?
                  <div className='w-[35px] flex flex-col gap-[1rem] text-secondary'>
                    <span data-label='Edit' className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center 
                          relative cursor-pointer admin-control' onClick={()=> navigate('../edit', {state: {product}})}>
                      <i> <RiFileEditLine/> </i>
                    </span>
                    <span data-label='Block' className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center
                         relative cursor-pointer admin-control' onClick={()=> dispatch(toggleProductStatus(product._id))}>
                      <i> <MdBlock/> </i>
                    </span>
                  </div>
                  // <div className='flex justify-around'>
                  //   <SiteButtonSquare customStyle={{paddingBlock:'6px', paddingInline:'22px', fontWeight:'430', borderRadius:'6px'}}> Edit </SiteButtonSquare>
                  //   <SiteButtonSquare customStyle={{paddingBlock:'6px', paddingInline:'22px', fontWeight:'430', borderRadius:'6px'}}> Block </SiteButtonSquare>
                  // </div> 
                  :
                  <SiteButtonSquare clickHandler={()=> handleAddToCart(product._id)} 
                    customStyle={{width:'12rem', paddingBlock:'8px', fontSize:'13px'}}>
                       Add to Cart 
                  </SiteButtonSquare>
                }
              </figcaption>
              { !admin &&
              <div className='absolute top-[15px] right-[15px] p-[5px] rounded-[15px] bg-white favourite'>
                <i className='cursor-pointer'> 
                  { 
                    Object.keys(wishlist).length > 0 ?
                      wishlist.lists.some(list=> list.products.some(item=> item.product === product._id)) ? 
                        <MdFavorite onClick={()=> deleteFromWishlist(product)}/> 
                        :<MdFavoriteBorder onClick={()=> addToWishlist(product)} /> 
                        :<MdFavoriteBorder onClick={()=> addToWishlist(product)} /> 
                  } 
                </i>
              </div>
              }
            </figure>
            <div className={` ${gridView? 'mt-[10px] flex flex-col gap-[5px] pl-[10px] py-[15px] rounded-[10px] product-infos' 
                                 : 'inline-flex flex-col gap-[10px] justify-between px-[1rem] py-[2rem] rounded-[10px] ml-[1rem] product-infos w-full'} 
                                      ${ wishlistDisplay && 'mr-[1rem]' } ${productIsHovered === product._id && 'shadow-lg'} cursor-pointer`}
                onClick={()=> !admin && navigate('/shop/product', {state: {product}})}>
              <div>
              {product?.reviews ? 
                ( <p className='text-secondary flex items-center gap-[10px]'> 

                    <StarGenerator product={product} />

                    <span className='text-[13px]'> ({ product.reviews.length }) </span> 
                  </p>)
                : ( <p className='text-secondary'>No rating available!</p> )

                }
                <p className= {(gridView ? 'text-[15px]' : (admin && !gridView)? 'text-[15px]' 
                    : wishlistDisplay ? 'text-[16px] font-[500]' : 'text-[18px]')  
                      + ' mt-[10px] capitalize font-[450] line-clamp-2 hover:text-secondary hover:underline'} style={{wordBreak: 'break-word'}}>
                {product.title}
                </p>
              </div>
              {
                !gridView && 
                  <p className={`${( (admin && !gridView) || wishlistDisplay)? 'text-[12px]' : 'text-[14px]'} text-wrap 
                    break-words line-clamp-3`} style={{wordBreak: 'break-word'}}>
                       { capitalizeFirstLetter(product.subtitle) } 
                  </p>
              }
              <div>

                {
                  product.stock <= 5 &&
                  <p className='text-[13px] text-red-500 mb-[5px]'>
                     { product.stock <= 0 ? 'Out of Stock' :  `Only ${product.stock} items in Stock!`}
                  </p>
                }

                <p className={`${(admin && !gridView)? 'text-[16px]' : (gridView) 
                    ? 'text-[16px]' : wishlistDisplay ? 'text-[17px]' : 'text-[18px]'} font-[500] tracking-[0.5px]`}> 
                      &#8377; {product.price}
                </p>
                {
                  !gridView && 
                  <div className='mt-[10px]'>
                    {product.tags.map(tag=> 
                      <span className={`px-[14px] py-[1px] ${admin? 'text-[12px]' : wishlistDisplay? 'text-[11px]' : 'text-[13px]'} 
                        border-[1.5px]  border-[#eae0f0] rounded-[7px] text-secondary mr-[1rem]`}> 
                        {tag} 
                      </span>
                  )}
                </div>
              }

              </div>
            </div>
           
          </div>
        ))
      }
    </div>
    { showByTable &&
      <div>

          <ProductsTableView products={products} />
          
      </div>
    }

    {
      selectedProductForWishlist &&
      <>

        <WishlistOptionsModal isOpen={isWishlistOptionsModalOpen} onClose={()=> setIsWishlistOptionsModalOpen(false)} 
          product={selectedProductForWishlist} setIsWishlistModalOpen={setIsWishlistModalOpen} wishlist={wishlist}/>
      
        <RemoveWishlistItemModal isOpen={isRemoveModalOpen} onClose={()=> setIsRemoveModalOpen(false)} product={selectedProductForWishlist}
          listName={selectedList} />

      </>
    }

    <WishlistModal isOpen={isWishlistModalOpen} onClose={()=> setIsWishlistModalOpen(false)} onSubmit={createNewWishlist} />

    <div className={` ${wishlistDisplay && 'ml-[1.5rem]'} `}>

      <Pagination productCounts={productCounts} currentPage={currentPage} currentPageChanger={currentPageChanger} limiter={limiter} />

    </div>
    <div className='h-[7rem] w-full'></div>
    </>
  )
}
