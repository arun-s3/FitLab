import React,{useState, useEffect, useRef} from 'react'
import './ProductList.css'
import Header from '../Components/Header'
import BreadcrumbBar from '../Components/BreadcrumbBar'

import {VscSettings} from "react-icons/vsc";
import {RiArrowDropUpLine} from "react-icons/ri";

export default function ProductList(){

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    let firstRangeStart = useRef(0); let secondRangeStart = useRef(0)
    let firstRangeEnd = useRef(0);  let secondRangeEnd = useRef(0)
    let firstRange = useRef(0); let secondRange = useRef(0)
    let currentLeft = useRef(0); let collisionCheck = useRef(false)
    const showRangeRef = useRef(null)

    let currentX = useRef(0); let leftValueNow = useRef(0)
    let checkDragging = useRef(false)

    
    const displayRange = ()=>{
        const rangeDiff = secondRange.current - firstRange.current
        Object.assign(showRangeRef.current.style, {
                height: '100%',
                marginLeft: firstRange.current.toString() + 'px',
                width: rangeDiff.toString() + 'px'
        });
    }
    const dragStartHandler = (e, rangeStart)=>{
        if(!collisionCheck.current){
        const currentLeft = parseInt(window.getComputedStyle(e.target).left) || 0;
        rangeStart.current = e.clientX - currentLeft;
        console.log("rangeStart value--> " + rangeStart.current);
        }
    }
    const dragEndHandler = (e, rangeStart, rangeEnd, range)=>{
        console.log("Dragging ended")
        const parentWidth = parseInt(window.getComputedStyle(e.target.parentElement).width);
        const draggedPoint =  e.clientX - rangeStart.current
        if(draggedPoint > parentWidth){
            rangeEnd.current = parentWidth
        }
        else if(draggedPoint < 0){
            rangeEnd.current = 0
        }
        else{
            rangeEnd.current = draggedPoint
        }
         
        console.log("range end value" + rangeEnd.current)
        range.current = rangeEnd.current - e.target.style.width
        console.log("rage calculated-->" + range.current)
        e.target.style.left = range.current.toString() + 'px'
        console.log("range.toString()+'px'-->"+ range.current.toString() + 'px')
        secondRange && displayRange()
    }
    
    const dragHandler = (e, handler)=>{
        if(handler=='firstHandler'){
            // const leftValueNow = parseInt(window.getComputedStyle(e.target).left); 
            // const moveFromLeft = leftValueNow + (e.clientX-currentX)
            // e.target.style.left = `${moveFromLeft}px`

            const currentHandlerRect = e.target.getBoundingClientRect()
            const otherHandlerRect = e.target.nextElementSibling.getBoundingClientRect()
            console.log("getBoundingClientRect() of firstHandler-->"+ JSON.stringify(currentHandlerRect))
            console.log("getBoundingClientRect() of otherHandler-->"+ JSON.stringify(otherHandlerRect))
            if(currentHandlerRect.right >= otherHandlerRect.left ){
                console.log("Collision alert!")
                collisionCheck.current = true
                e.target.style.left = `${otherHandlerRect.left - 1}px`
                e.target.draggable = false
            }
            if(currentHandlerRect.right< otherHandlerRect.left){
                e.target.draggable = true
            }
        }
    }
    const dragOverHandler = (e)=>{
        console.log("Dragged over!")
        // if(collisionCheck.current){
        //     e.preventDefault()
        // }
        e.preventDefault()
    }
    const dropHandler = (e)=>{
        console.log("Dropped!")
        // if(collisionCheck.current){
        //     e.preventDefault()
        // }
        e.preventDefault()
    }

    
    const mouseDownHandler = (e)=>{
        leftValueNow = parseInt(window.getComputedStyle(e.target).left);  
        currentX = e.clientX
        checkDragging.current = true  
        e.target.style.cursor = 'pointer' 
    }
    const mouseMoveHandler = (e)=>{
        if(checkDragging.current){
            const moveFromLeft = leftValueNow + (e.clientX-currentX)
            e.target.style.left = `${moveFromLeft}px`
        }
    }
    const mouseUpHandler = (e)=>{
        // checkDragging.current? checkDragging.current = !checkDragging.current: null
        checkDragging.current = false
    }

    return(
        <>  
            <header style={headerBg}>
                <Header/>
            </header>
            
            <BreadcrumbBar/>
            <main className='px-[60px] mt-[1rem] flex gap-[1rem] items-start justify-start' id='productlist'>
                <aside className='basis-[15rem] flex flex-col gap-[10px]'>
                    <div className='flex gap-[5px] pb-[10px] border-b border-gray-500'>
                        <VscSettings/>
                        <h3> Filter </h3>
                    </div>
                    <div className='pb-[10px] border-b border-gray-500'>
                        <div className='flex justify-between '>
                            <h4>By Category</h4>
                            <RiArrowDropUpLine/>
                        </div>
                        <ul className='list-none'>
                            <li>Strength</li>
                            <li>Cardio</li>
                            <li>Accessories</li>
                            <li>Supplements</li>
                            <span>see all</span>
                        </ul>
                    </div>
                    <div className='pb-[10px] border-b border-gray-500'>
                        <div className='flex justify-between '>
                            <h4>By Product</h4>
                            <RiArrowDropUpLine/>
                        </div>
                        <ul className='list-none'>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='weights'/>
                                    <label HTMLfor='weights'>Weights</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='benchesAndRacks'/>
                                    <label HTMLfor='benchesAndRacks'>Benches and Racks</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='gymbell'/>
                                    <label HTMLfor='gymbell'>Gymbell</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='treadmills'/>
                                    <label HTMLfor='treadmills'>Treadmills</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='plates'/>
                                    <label HTMLfor='plates'>Plates</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='bikesAndEllipticals'/>
                                    <label HTMLfor='bikesAndEllipticals'>Bikes and Ellipticals</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='proteinPowders'/>
                                    <label HTMLfor='proteinPowders'>Protein Powders</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='strengthMachines'/>
                                    <label HTMLfor='strengthMachines'>Strength Machines</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='multistationMachines'/>
                                    <label HTMLfor='multistationMachine'>MultistationMachine</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='resistanceBands'/>
                                    <label HTMLfor='resistanceBands'>Resistance Bands</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='yogaMats'/>
                                    <label HTMLfor='yogaMats'>Yoga Mats</label>
                                </div>
                            </li>
                            <span>see all</span>
                        </ul>
                    </div>
                    <div className='pb-[10px] border-b border-gray-500'>
                        <div className='flex justify-between '>
                            <h4>Price Range</h4>
                            <RiArrowDropUpLine/>
                        </div>
                        <div id='pricerange-wrapper' className='relative mt-[1rem]'>
                            {/* <input type='range' id='pricerange-one' className='absolute top-[1px] left-0'/>
                            <input type='range' id='pricerange-two' className='absolute top-[20px] left-0'/> */}
                            <div className='relative w-[11rem] h-[4px] bg-[#AFD0FF] rounded-[2px]' 
                                               onDragOver={(e)=>dragOverHandler(e)} onDrop={(e)=>dropHandler(e)}>  {/* ref={rangeRef} */}
                                               
                                <div draggable='true' className='absolute left-0 top-[-8px] w-[20px] h-[20px] rounded-[10px] 
                                            border-[2px] border-red-500' onDragStart={(e)=>dragStartHandler(e, firstRangeStart)} onDrag={(e)=>dragHandler(e, "firstHandler")}
                                                onDragEnd={(e)=>dragEndHandler(e, firstRangeStart, firstRangeEnd, firstRange)} 
                                                    onClick={(e)=>{e.target.draggable=true; collisionCheck.current=false;}} onMouseDown={(e)=>mouseDownHandler(e)}
                                                     onMouseMove={(e)=>mouseMoveHandler(e)} onMouseUp={(e)=>mouseUpHandler(e)}></div>  {/* ref={rangeHandlerRef} */}
                                <div draggable='true' className='absolute left-0 top-[-8px] w-[20px] h-[20px] rounded-[10px] 
                                            border-[2px] border-[#AFD0FF]' onDragStart={(e)=>dragStartHandler(e, secondRangeStart)} onDrag={(e)=>dragHandler(e, "secondHandler")}
                                                onDragEnd={(e)=>dragEndHandler(e, secondRangeStart, secondRangeEnd, secondRange)} 
                                                    onClick={(e)=>e.target.draggable=true}></div>
                                {/* <div className='w-[5px] h-[5px] rounded-[10px] border border-red-400'></div> */}
                                <div className='w-full bg-secondary' ref={showRangeRef}></div>

                            </div>
                        </div>
                    </div>
                </aside>
                <div className='basis-full flex-grow'>
                    
                </div>
            </main>
        </>
    )
}