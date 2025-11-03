import React from 'react'

import {IoStarOutline,IoStarHalfSharp,IoStarSharp} from "react-icons/io5";


export default function StarGenerator ({product}){

    let avgRating = product?.averageRating || 0
    let stars = []

    if(avgRating > 0){
        for(let i=0; i<5; i++){
            if(avgRating>0){
                avgRating<1 ? stars.push(<IoStarHalfSharp key={i} className='text-primaryDark'/>): stars.push(<IoStarSharp key={i} className='text-primaryDark'/>)
            }else{
                stars.push(<span className='emptystar'> <IoStarOutline key={i} /> </span>)
            }
            avgRating--;
        }
    }
    else{
        for(let i=0; i<5; i++){
            stars.push(<span className='emptystar'> <IoStarOutline /> </span>)
        }
    }

    return(
        <span className='inline-flex items-center'> {stars} </span>
    )          
  }
