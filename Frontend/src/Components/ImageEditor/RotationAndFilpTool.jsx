import React from 'react'

import {LuFlipHorizontal, LuFlipVertical} from "react-icons/lu";
import {AiOutlineRotateLeft, AiOutlineRotateRight} from "react-icons/ai";

export default function RotationAndFilpTool({setters}){

    const {setRotate, setScaleX, setScaleY} = setters

    return(
        <div id='rotation-tool'>
            <div className=' mt-[1rem] pb-[10px]'>
                <h3> Rotate </h3>
                <div className='flex gap-[1rem] items-center  mt-[10px] rotate text-[#3c3939]'>
                    <i onClick={()=> setRotate(rotate=> { return rotate = (rotate+90) > 360 ? 0 : rotate+90 })}>
                        <AiOutlineRotateRight />
                    </i>
                    <i onClick={()=> setRotate(rotate=> { return rotate = (rotate-90) < 0 ? 360 : rotate-90 })}>
                        <AiOutlineRotateLeft />
                    </i>
                </div>
            </div>
            <div className='mt-[2rem] pt-[10px] '>
                <h3> Flip </h3>
                <div className='flex gap-[24px] items-center mt-[10px] flip'>
                    <i onClick={()=> setScaleX(x=> x==1? -1 : 1)}>
                        <LuFlipHorizontal />
                    </i>
                    <i onClick={()=> setScaleY(y=> y==1? -1 : 1)}>
                        <LuFlipVertical />
                    </i>
                </div>
            </div>
        </div>
    )
}