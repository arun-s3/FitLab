import React, {useState, useEffect} from 'react';
import './ProductsDisplay.css';
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import axios from 'axios';
import {toast} from 'react-toastify'
import {MdFavoriteBorder} from "react-icons/md";
import {IoStarOutline,IoStarHalfSharp,IoStarSharp} from "react-icons/io5";
import {RiFileEditLine} from "react-icons/ri";
import {MdBlock} from "react-icons/md";

import {getAllProducts, toggleProductStatus} from '../../Slices/productSlice'
import Pagination from '../Pagination/Pagination'
import {SiteButtonSquare} from '../SiteButtons/SiteButtons';
import ProductsTableView from './ProductsTableView';

export default function ProductsDisplay({gridView, showByTable, pageReader, limiter, queryOptions, showTheseProducts, admin}) {

  const {currentPage, setCurrentPage} = pageReader

  // const [products, setProducts] = useState([]);             //Use this for dummy data
  // const [productCounts, setProductCounts] = useState(null)  //Use this for dummy data
  const dispatch = useDispatch()
  const {products:items, productCounts} = useSelector(state=> state.productStore)
  const [products, setProducts] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    // const getDummyProducts = async () => {
    //   try {
    //     const response = await axios.get('https://dummyjson.com/products');
    //     setProducts(response.data.products); 
    //     setProductCounts(response.data.total)
    //     console.log("PRODUCTS-->", JSON.stringify(response.data.products));
    //     console.log("TOTAL COUNTS-->"+ response.data.total)
    //     console.log("TAGS-->"+ response.data.products[0].tags[0])
    //   } catch (error) {
    //     console.log("ERROR IN PRODUCTLISTING-->", error.message);
    //   }
    // };
    const getFitlabProducts =  async ()=>{
      dispatch( getAllProducts({}) )
    }
    getFitlabProducts()
    console.log("PRODUCTS----",JSON.stringify(products))
    // getDummyProducts();
  }, []);

  useEffect(()=>{
    !admin && setProducts(items)
  },[items])

  useEffect(()=>{
    admin && setProducts(showTheseProducts)
  },[showTheseProducts])

  const produceStarRating = (product)=>{
    let avgRating = (product.reviews.map(review=> Number.parseInt(review.rating)).reduce((total,rating)=> total+=rating,0) / product.reviews.length).toFixed(1)
    let stars = [];
    const averageRating = avgRating
    for(let i=0; i<5; i++){
        if(avgRating>0){
            avgRating<1 ? stars.push(<IoStarHalfSharp key={i}/>): stars.push(<IoStarSharp key={i}/>)
        }else{
            stars.push(<span className='emptystar'> <IoStarOutline key={i} /> </span>)
        }
        avgRating--;
    }
    return{
        stars: <span className='inline-flex items-center'> {stars} </span>,
        avgRating: averageRating
    }
        
    
  }

  const currentPageChanger = (page)=>{
    setCurrentPage(page)
  }

  return (
    <>
     <div className={`${gridView ? 'grid grid-cols-3 gap-y-[2rem]' : showByTable ? '' : 'flex flex-col gap-[2rem]'}`} id="products-display"
            style={admin ? { justifyItems: 'center' } : {}}>

      { !showByTable && 
        products.map((product) => (
          <div key={product._id} className= {gridView ? 'w-[275px]' : 'flex gap-[1rem] w-full'}>
            <figure className='relative h-auto rounded-[10px] thumbnail'>
              <img src={product.thumbnail.url || product.thumbnail} alt={product.title} className='rounded-[10px] h-[275px] w-[275px] object-cover'/>
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
                  <SiteButtonSquare customStyle={{width:'12rem', paddingBlock:'8px', fontSize:'13px'}}> Add to Cart </SiteButtonSquare>
                }
              </figcaption>
              { !admin &&
              <div className='absolute top-[15px] right-[15px] p-[5px] rounded-[15px] bg-white favourite'>
                <i className='cursor-pointer'> <MdFavoriteBorder /> </i>
              </div>
              }
            </figure>
            <div className= {gridView? 'mt-[10px] flex flex-col gap-[5px] pl-[10px] py-[8px] rounded-[10px] product-infos' 
                                 : 'inline-flex flex-col gap-[10px] justify-center pl-[1rem] py-[8px] rounded-[10px] ml-[1rem] product-infos w-full'}>
              {product?.reviews ? ( <p className='text-secondary flex items-center gap-[10px]'> 
                                        { produceStarRating(product).stars } 
                                        <span className='text-[13px]'> ({ product.reviews.length }) </span> 
                                    </p>)
                                 : ( <p className='text-secondary'>No rating available!</p> )

              }
              <p className= {(gridView ? 'text-[13px]' : (admin && !gridView)? 'text-[14px]' :'text-[16px]')  + ' capitalize font-[500]'}>{product.title}</p>
              {
                !gridView && 
                  <p className={(admin && !gridView)? 'text-[12px]' : 'text-[14px]'}> {product.description} </p>
              }
              <p className={(admin && !gridView)? 'text-[13px]' : 'text-[15px]'}> &#8377; {Math.ceil(product.price*84)}</p>
              {
                !gridView && 
                <div>
                  {product.tags.map(tag=> 
                    <span className={`${admin? 'text-[12px]' :'text-[13px]'} px-[14px] py-[1px] border-[1.5px]  border-[#eae0f0] rounded-[7px] text-secondary mr-[1rem]`}> 
                      {tag} 
                    </span>
                )}
                </div>
              }
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
    <div>

      <Pagination productCounts={productCounts} currentPage={currentPage} currentPageChanger={currentPageChanger} limiter={limiter} />

    </div>
    <div className='h-[7rem] w-full'></div>
    </>
  )
}
