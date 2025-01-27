import React, {useState, useEffect} from 'react';
import './ProductsDisplay.css';
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import axios from 'axios';
import {toast} from 'react-toastify'
import {MdFavoriteBorder} from "react-icons/md";
import {RiFileEditLine} from "react-icons/ri";
import {MdBlock} from "react-icons/md";

import {getAllProducts, toggleProductStatus} from '../../Slices/productSlice'
import Pagination from '../Pagination/Pagination'
import StarGenerator from '../StarGenerator/StarGenerator';
import {SiteButtonSquare} from '../SiteButtons/SiteButtons';
import {capitalizeFirstLetter} from '../../Utils/helperFunctions'
import ProductsTableView from './ProductsTableView';

export default function ProductsDisplay({gridView, showByTable, pageReader, limiter, queryOptions, showTheseProducts, admin}) {

  const {currentPage, setCurrentPage} = pageReader

  // const [products, setProducts] = useState([]);             //Use this for dummy data
  // const [productCounts, setProductCounts] = useState(null)  //Use this for dummy data
  const dispatch = useDispatch()
  const {products:items, productCounts} = useSelector(state=> state.productStore)
  const [products, setProducts] = useState([])

  const navigate = useNavigate()

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

  useEffect(()=>{
    !admin && setProducts(items)
  },[items])

  useEffect(()=>{
    admin && setProducts(showTheseProducts)
  },[showTheseProducts])

  const currentPageChanger = (page)=>{
    setCurrentPage(page)
  }

  return (
    <>
     <div className={`${gridView ? 'grid grid-cols-3 gap-y-[2rem]' : showByTable ? '' : 'flex flex-col gap-[2rem]'}`} id="products-display"
            style={admin ? { justifyItems: 'center' } : {}}>

      { !showByTable && 
        products.map((product) => (
          <div key={product._id} className= {gridView ? 'w-[275px]' : 'flex gap-[1rem] w-full'} 
                    onClick={()=> !admin && navigate('/shop/product', {state: {product}})}>
            <figure className='relative h-auto rounded-[10px] thumbnail cursor-pointer'>
              <img src={product.thumbnail.url || product.thumbnail} alt={product.title} className='rounded-[10px] h-[275px] object-cover'/> {/*w-[275px]  */}
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
            <div className={` ${gridView? 'mt-[10px] flex flex-col gap-[5px] pl-[10px] py-[15px] rounded-[10px] product-infos' 
                                 : 'inline-flex flex-col gap-[10px] justify-between px-[1rem] py-[2rem] rounded-[10px] ml-[1rem] product-infos w-full'} cursor-pointer`}>
              <div>
              {product?.reviews ? 
                ( <p className='text-secondary flex items-center gap-[10px]'> 

                    <StarGenerator product={product} />

                    <span className='text-[13px]'> ({ product.reviews.length }) </span> 
                  </p>)
                : ( <p className='text-secondary'>No rating available!</p> )

                }
                <p className= {(gridView ? 'text-[15px]' : (admin && !gridView)? 'text-[15px]' :'text-[18px]')  
                      + ' mt-[10px] capitalize font-[450] line-clamp-2'} style={{wordBreak: 'break-word'}}>
                {product.title}
                </p>
              </div>
              {
                !gridView && 
                  <p className={`${(admin && !gridView)? 'text-[12px]' : 'text-[14px]'} text-wrap break-words line-clamp-3`} 
                    style={{wordBreak: 'break-word'}}>
                       { capitalizeFirstLetter(product.subtitle) } 
                  </p>
              }
              <div>

                <p className={`${(admin && !gridView)? 'text-[16px]' : (gridView) 
                    ? 'text-[16px]' : 'text-[18px]'} font-[500] tracking-[0.5px]`}> &#8377; {product.price}</p>
                {
                  !gridView && 
                  <div className='mt-[10px]'>
                    {product.tags.map(tag=> 
                      <span className={`${admin? 'text-[12px]' :'text-[13px]'} px-[14px] py-[1px] border-[1.5px]  border-[#eae0f0]
                         rounded-[7px] text-secondary mr-[1rem]`}> 
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
    <div>

      <Pagination productCounts={productCounts} currentPage={currentPage} currentPageChanger={currentPageChanger} limiter={limiter} />

    </div>
    <div className='h-[7rem] w-full'></div>
    </>
  )
}
