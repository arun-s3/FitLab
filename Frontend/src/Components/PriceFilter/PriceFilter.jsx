import React,{useState, useEffect, useRef} from 'react'
import './PriceFilter.css'
import {SiteSecondaryButtonSquare} from '../SiteButtons/SiteButtons'
import {RiArrowDropUpLine, RiArrowDropDownLine} from "react-icons/ri";

export default function PriceFilter(){

    let firstRangeStart = useRef(0); let secondRangeStart = useRef(0)
    let firstRangeEnd = useRef(0);  let secondRangeEnd = useRef(0)
    let firstRange = useRef(0); let secondRange = useRef(0)
    let currentLeft = useRef(0); let collisionCheck = useRef(false)
    const showRangeRef = useRef(null)

    let currentX = useRef(0); let leftValueNow = useRef(0) // For mouse events
    let checkDragging = useRef(false)                      // For mouse events

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(3750)
    const minPriceRef = useRef(null)
    const maxPriceRef = useRef(null)
    const priceRangeWrapperRef = useRef(null)
    const maxPriceRupee = useRef(100000)

    const [minInputPrice, setMinInputPrice] = useState(0)
    const [maxInputPrice, setMaxInputPrice] = useState(null)
    const priceErrorRef = useRef(null)

    const calculatePrice = (e, priceUnit)=>{
        const parentWidthPx = Number.parseInt(window.getComputedStyle(e.target.parentElement).width)
        console.log("window.getComputedStyle(e.target.parentElement).width)"+ parentWidthPx)
        console.log("PriceUnit-->"+priceUnit)
        console.log("(priceUnit/window.getComputedStyle(e.target.parentElement).width)"+(priceUnit/parentWidthPx))
        const pricePercentage = (priceUnit/parentWidthPx)
        console.log("maxPriceRupee-->"+maxPriceRupee.current)
        console.log("Price-->"+(maxPriceRupee.current * pricePercentage))
        return Math.ceil(maxPriceRupee.current * pricePercentage)
     }
     const setPriceUnit = (e)=>{
         let minPriceUnit,maxPriceUnit;
         if(minPriceRef.current.getBoundingClientRect().right <= maxPriceRef.current.getBoundingClientRect().left || minPriceRef.current.getBoundingClientRect().left <= maxPriceRef.current.getBoundingClientRect().right){
             console.log("Inside IF-minPriceRef.current.getBoundingClientRect.right <= maxPriceRef.current.getBoundingRectClient.left")
             minPriceUnit = firstRange.current
             maxPriceUnit = secondRange.current
         }
         else{
             console.log("Inside ELSE-minPriceRef.current.getBoundingClientRect.right <= maxPriceRef.current.getBoundingRectClient.left")
             minPriceUnit = secondRange.current
             maxPriceUnit = firstRange.current
         }
         console.log("minPriceUnit-->"+ minPriceUnit)
         console.log("maxPriceUnit-->"+ maxPriceUnit)
         setMinPrice(calculatePrice(e,minPriceUnit))
         setMaxPrice(calculatePrice(e,maxPriceUnit))
     }
     const displayRange = ()=>{
         console.log("Inside displayRange()")
         console.log("secondRange.current - firstRange.current"+(secondRange.current - firstRange.current))
         console.log("e.target.parentElement.style.width"+priceRangeWrapperRef.current.style.width.toString())
         const wrapperWidth = parseInt(window.getComputedStyle(priceRangeWrapperRef.current).width)
         let rangeDiff = secondRange.current - firstRange.current
         if(rangeDiff > wrapperWidth){
             rangeDiff = parseInt(window.getComputedStyle(priceRangeWrapperRef.current).width)
         } 
         Object.assign(showRangeRef.current.style, {
                 height: '100%',
                 marginLeft: (rangeDiff<0)? secondRange.current.toString() + 'px' : firstRange.current.toString() + 'px',
                 width: Math.abs(rangeDiff).toString() + 'px'
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
         setPriceUnit(e)
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
                 // e.target.draggable = false
             }
             if(currentHandlerRect.right< otherHandlerRect.left){
                 // e.target.draggable = true
             }
         }
     }
     const dragOverHandler = (e)=>{
         console.log("Dragged over!")
         e.preventDefault()
         // if(collisionCheck.current){
         //     e.preventDefault()
         // }
     }
     const dropHandler = (e)=>{
         console.log("Dropped!")
         e.preventDefault()
         // if(collisionCheck.current){
         //     e.preventDefault()
         // } 
     }
 
     
     const mouseDownHandler = (e)=>{
         // leftValueNow = parseInt(window.getComputedStyle(e.target).left);  
         // currentX = e.clientX
         // checkDragging.current = true  
         // e.target.style.cursor = 'pointer' 
     }
     const mouseMoveHandler = (e)=>{
         // if(checkDragging.current){
         //     const moveFromLeft = leftValueNow + (e.clientX-currentX)
         //     e.target.style.left = `${moveFromLeft}px`
         // }
     }
     const mouseUpHandler = (e)=>{
         // checkDragging.current? checkDragging.current = !checkDragging.current: null
         // checkDragging.current = false
     }
 
     const calculateRangeFromPrice = (minPriceLimit, maxPriceLimit)=>{
         console.log("Inside calculateRangeFromPrice")
         console.log("maxPriceRupee.current"+ maxPriceRupee.current)
         const parentWidthPx = Number.parseInt(window.getComputedStyle(priceRangeWrapperRef.current).width)
         console.log("window.getComputedStyle(priceRangeWrapperRef.current).width)"+ parentWidthPx)
         console.log("minPriceLimit, maxPriceLimit-->"+minPriceLimit+" "+maxPriceLimit)
         const minPricePercentage = minPriceLimit/maxPriceRupee.current
         const maxPricePercentage = maxPriceLimit/maxPriceRupee.current
         console.log("minPricePerrcentOfMaxPrice, maxPricePercentageOfMaxPrice->"+minPricePercentage+" "+maxPricePercentage)
         const minPriceUnit = minPricePercentage * parentWidthPx
         const maxPriceUnit = maxPricePercentage * parentWidthPx
         console.log("minPriceUnit, maxPriceUnit-->"+minPriceUnit+" "+maxPriceUnit)
 
         firstRange.current=maxPriceUnit
         maxPriceRef.current.style.left = `${firstRange.current}px`
         secondRange.current=minPriceUnit
         minPriceRef.current.style.left = `${secondRange.current}px`
         displayRange()
         setMinPrice(minPriceLimit)
         setMaxPrice(maxPriceLimit)
     }
 
     const validateAndCompute = ()=>{
         const numRegex = /^\d+$/;
         if( !(numRegex.test(minInputPrice)) || !(numRegex.test(maxInputPrice)) ){
             console.log("Error in price limits")
             priceErrorRef.current.style.display = 'inline-block'
             priceErrorRef.current.textContent = "Minimum and Maximum price limits must be numbers!"
             setTimeout(()=> priceErrorRef.current.style.display = 'none', 3000)
          }else if(minInputPrice < 0 || maxInputPrice < 0){
             console.log("Error in price limits")
             priceErrorRef.current.style.display = 'inline-block'
             priceErrorRef.current.textContent = "Please enter positive numbers!"
             setTimeout(()=> priceErrorRef.current.style.display = 'none', 3000)
          }else if(minInputPrice > maxInputPrice){
             console.log("Error in price limits")
             priceErrorRef.current.style.display = 'inline-block'
             priceErrorRef.current.textContent = "Minimum price limit should be greater than Maximum price limit!"
             setTimeout(()=> priceErrorRef.current.style.display = 'none', 3000)
          }else{
             console.log("No error in price limits")
             priceErrorRef.current.style.display = 'none'
 
             calculateRangeFromPrice(minInputPrice, maxInputPrice)
          }
     }

     return(
        <div id='price-filter-component'>
            <p className='text-[15px] text-secondary text-center'>{minPrice} - {maxPrice ? maxPrice+"+":"-"}</p>
            <div id='pricerange-wrapper' className='relative mt-[1rem]' onDragOver={(e)=>dragOverHandler(e)} 
                                                onDrop={(e)=>dropHandler(e)} ref={priceRangeWrapperRef}>

                <div className='relative w-[15rem] h-[4px] bg-[#AFD0FF] rounded-[2px]' 
                                  onDragOver={(e)=>dragOverHandler(e)} onDrop={(e)=>dropHandler(e)}>  {/* ref={rangeRef} bg-[#cfb6ee]*/}

                    <div draggable='true' className='absolute left-0 top-[-8px] w-[20px] h-[20px] rounded-[10px] 
                           border-[2px] border-[#AFD0FF]' onDragStart={(e)=>dragStartHandler(e, firstRangeStart)} onDrag={(e)=>dragHandler(e, "firstHandler")}
                               onDragEnd={(e)=>dragEndHandler(e, firstRangeStart, firstRangeEnd, firstRange)} 
                                   onClick={(e)=>{e.target.draggable=true; collisionCheck.current=false;}} onMouseDown={(e)=>mouseDownHandler(e)}
                                    onMouseMove={(e)=>mouseMoveHandler(e)} onMouseUp={(e)=>mouseUpHandler(e)} ref={minPriceRef}></div>  {/* ref={rangeHandlerRef} */}
                    <div draggable='true' className='absolute left-[9px] top-[-8px] w-[20px] h-[20px] rounded-[10px] 
                         border-[2px] border-[#AFD0FF]' onDragStart={(e)=>dragStartHandler(e, secondRangeStart)} onDrag={(e)=>dragHandler(e, "secondHandler")}
                             onDragEnd={(e)=>dragEndHandler(e, secondRangeStart, secondRangeEnd, secondRange)} 
                                 onClick={(e)=>e.target.draggable=true} ref={maxPriceRef}></div>
                              <div className='w-full bg-secondary' ref={showRangeRef}></div>

                </div>
            </div>
                <div className='flex justify-between w-full mb-[5px] price-buttons mt-[25px]'>
                    <div>
                        <label className='text-[12px] text-secondary'> Min </label>
                        <div>    
                            <button onClick={(e)=> {
                                setMinInputPrice(price=> Number.parseInt(price)+1)
                                // calculateRangeFromPrice(minInputPrice, "firstRange")
                             }} className='incdec-btn'> + </button>
                            <input type="number" defaultValue="0" className='w-[70px] border-[#ced1d7] border-l-0 border-r-0 
                                      p-[1px] h-[23px] placeholder:text-secondary placeholder:text-[14px]'
                                      onChange={(e)=> setMinInputPrice(e.target.value)} value={minInputPrice}/>
                        <button className='incdec-btn' onClick={(e)=> setMinInputPrice(price=> (Number.parseInt(price)-1 < 0)? 0 :Number.parseInt(price)-1 )}>-</button>
                        </div>
                    </div>
                    <div>
                        <label className='text-[12px] text-secondary'> Max </label>
                        <div>
                            <button className='incdec-btn' onClick={(e)=> setMaxInputPrice(price=> Number.parseInt(price)+1)}> + </button>
                            <input type="number" defaultValue="0" className='w-[70px] border-[#ced1d7] border-l-0 border-r-0  
                                                p-[1px] h-[23px] placeholder:text-secondary placeholder:text-[14px]'
                                                onChange={(e)=> setMaxInputPrice(e.target.value)} value={maxInputPrice}/>
                            <button className='incdec-btn' onClick={(e)=> setMaxInputPrice(price=> (Number.parseInt(price)-1 < 0)? 0 :Number.parseInt(price)-1 )}> - </button>
                        </div>
                    </div>
                </div>
                <div onClick={()=> validateAndCompute()} className='mt-[15px] text-center'>
                    <SiteSecondaryButtonSquare customStyle={{width:'60%', paddingBlock:'5px', fontSize:'13px'}}> Apply </SiteSecondaryButtonSquare>
                </div>
                <p className='hidden text-red-500 text-[10px] mt-[5px] text-center' ref={priceErrorRef}></p>
        </div>
     )
}