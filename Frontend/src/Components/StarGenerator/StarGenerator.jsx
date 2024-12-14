import React from 'react'

import {IoStarOutline,IoStarHalfSharp,IoStarSharp} from "react-icons/io5";


export default function StarGenerator ({product}){
    let avgRating = product?.reviews ? (product?.reviews.map(review=> 
                        Number.parseInt(review.rating)).reduce((total,rating)=> total+=rating,0) / product?.reviews.length).toFixed(1) : 0
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

    return(
        <span className='inline-flex items-center'> {stars} </span>
    )          
  }
