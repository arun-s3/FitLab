import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './Products.css';
import Pagination from './Pagination'
import {SiteButtonSquare} from './SiteButton';
import {MdFavoriteBorder} from "react-icons/md";
import {IoStarOutline,IoStarHalfSharp,IoStarSharp} from "react-icons/io5";

export default function Products({gridView}) {
  const [products, setProducts] = useState([]);
  const [totalCounts, setTotalCounts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        setProducts(response.data.products); 
        setTotalCounts(response.data.total)
        console.log("PRODUCTS-->", JSON.stringify(response.data.products));
        console.log("TOTAL COUNTS-->"+ response.data.total)
        console.log("TAGS-->"+ response.data.products[0].tags[0])
      } catch (error) {
        console.log("ERROR IN PRODUCTLISTING-->", error.message);
      }
    };

    getProducts();
  }, []);

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
    <div className= {gridView ? 'grid grid-cols-3 gap-y-[2rem]' : 'flex flex-col gap-[2rem]' } id="products-display">
      {
        products.map((product) => (
          <div key={product.id} className= {gridView ? 'w-[275px]' : 'flex gap-[1rem] w-full'}>
            <figure className='relative h-auto rounded-[10px] thumbnail'>
              <img src={product.thumbnail} alt={product.title} className='rounded-[10px]'/>
              <figcaption className='absolute bottom-[12px] w-full text-center'>
                <SiteButtonSquare customStyle={{width:'12rem', paddingBlock:'8px', fontSize:'13px'}}> Add to Cart </SiteButtonSquare>
              </figcaption>
              <div className='absolute top-[15px] right-[15px] p-[5px] rounded-[15px] bg-white favourite'>
                <MdFavoriteBorder />
              </div>
            </figure>
            <div className= {gridView? 'mt-[10px] flex flex-col gap-[5px] pl-[10px] py-[8px] rounded-[10px] product-infos' 
                                 : 'inline-flex flex-col gap-[10px] justify-center pl-[1rem] py-[8px] rounded-[10px] ml-[1rem] product-infos w-full'}>
              {product?.reviews ? ( <p className='text-secondary flex items-center gap-[10px]'> 
                                        { produceStarRating(product).stars } 
                                        <span className='text-[13px]'> ({ product.reviews.length }) </span> 
                                    </p>)
                                 : ( <p className='text-secondary'>No rating available!</p> )

              }
              <p className= {(gridView ? 'text-[13px]' : 'text-[16px]')  + ' capitalize font-[500]'}>{product.title}</p>
              {
                !gridView && 
                  <p className='text-[14px]'>{product.description}</p>
              }
              <p className='text-[15px]'> &#8377; {Math.ceil(product.price*84)}</p>
              {
                !gridView && 
                <div>
                  {product.tags.map(tag=> 
                    <span className='text-[13px] px-[14px] py-[1px] border-[1.5px]  border-[#eae0f0] rounded-[7px] text-secondary mr-[1rem]'> 
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
    <div>

      <Pagination totalCounts={totalCounts} currentPage={currentPage} currentPageChanger={currentPageChanger}/>

    </div>
    <div className='h-[7rem] w-full'></div>
    </>
  )
}
