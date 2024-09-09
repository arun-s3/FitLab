import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './Products.css';
import Pagination from './Pagination'
import {SiteButtonSquare} from './SiteButton';
import {MdFavoriteBorder} from "react-icons/md";
import {IoStarOutline,IoStarHalfSharp,IoStarSharp} from "react-icons/io5";

export default function Products() {
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
    <div className='grid grid-cols-3 gap-y-[2rem]' id="products-display">
      {
        products.map((product) => (
          <div key={product.id} className='w-[275px]'>
            <figure className='relative h-auto rounded-[10px] thumbnail'>
              <img src={product.thumbnail} alt={product.title} />
              <figcaption className='absolute bottom-[12px] w-full text-center'>
                <SiteButtonSquare customStyle={{width:'12rem', paddingBlock:'8px', fontSize:'13px'}}> Add to Cart </SiteButtonSquare>
              </figcaption>
              <div className='absolute top-[15px] right-[15px] p-[5px] rounded-[15px] bg-white favourite'>
                <MdFavoriteBorder />
              </div>
            </figure>
            <div className='mt-[10px] flex flex-col gap-[5px] pl-[10px] py-[8px] rounded-[10px] product-infos'>
              {product?.reviews ? ( <p className='text-secondary flex items-center gap-[10px]'> 
                                        { produceStarRating(product).stars } 
                                        <span className='text-[13px]'> ({ produceStarRating(product).avgRating }) </span> 
                                    </p>)
                                 : ( <p className='text-secondary'>No rating available!</p> )

              }
              <p className='text-[13px] capitalize font-[500]'>{product.title}</p>
              <p className='text-[15px]'>&#8377; {product.price}</p>
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
