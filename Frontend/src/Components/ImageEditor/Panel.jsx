import React from 'react'

import {TbColorFilter} from "react-icons/tb";
import {LuSettings2} from "react-icons/lu";
import {MdFilterHdr} from "react-icons/md";
import {MdCrop} from "react-icons/md";
import {RxRotateCounterClockwise} from "react-icons/rx";
import {PiTextTBold} from "react-icons/pi";

export default function Panel({panelHandler, subPanelStatus}){

    return(
        <div className='flex flex-col gap-[2rem] justify-center items-center mt-[3rem] w-full'>
            <div className={`icon-wrapper ${subPanelStatus['colorAdjuster'] ? 'bg-primary' : 'bg-[#f3efef]'} `} 
                onClick={(e)=> { panelHandler(e, 'colorAdjuster')}}>
                <i className=''>
                    <TbColorFilter/>
                </i>
            </div>
            <div className={`icon-wrapper ${subPanelStatus['colorChannels'] ? 'bg-primary' : 'bg-[#f3efef]'}`} 
                onClick={(e)=> { panelHandler(e, 'colorChannels')}}>
                <i className='color-setting-icon'>
                    {/* <GiSettingsKnobs/> */}
                    <LuSettings2/>  
                </i>
            </div>
            <div className={`icon-wrapper ${subPanelStatus['filters'] ? 'bg-primary' : 'bg-[#f3efef]'}`} 
                onClick={(e)=> { panelHandler(e, 'filters')}}>
                <i className=''>
                    <MdFilterHdr/>
                </i>
            </div>
            <div className={`icon-wrapper ${subPanelStatus['cropper'] ? 'bg-primary' : 'bg-[#f3efef]'}`} 
                onClick={(e)=> { panelHandler(e, 'cropper')}}>
                <i className=''>
                    <MdCrop/>
                </i>
            </div>
            <div className={`icon-wrapper ${subPanelStatus['rotator'] ? 'bg-primary' : 'bg-[#f3efef]'}`} 
                onClick={(e)=> { panelHandler(e, 'rotator')}}>
                <i className=''>
                    <RxRotateCounterClockwise/>
                </i>
            </div>
            <div className={`icon-wrapper ${subPanelStatus['textEditor'] ? 'bg-primary' : 'bg-[#f3efef]'}`} >
                <i className=''>
                    <PiTextTBold/>
                </i>
            </div>
        </div>
    )
}