import React,{useState, useEffect, useRef} from 'react'
import './PriceSliderAndFilter.css'
import {useSelector, useDispatch} from 'react-redux'
import {motion, AnimatePresence} from "framer-motion"

import {SiteSecondaryButtonSquare} from '../SiteButtons/SiteButtons'
import {RiArrowDropUpLine, RiArrowDropDownLine} from "react-icons/ri";

export default function PriceSliderAndFilter({priceGetter, priceSetter, firstSlide, mountingComponent}){

    const {minPrice, maxPrice} = priceGetter
    const {setMinPrice, setMaxPrice} = priceSetter

    let firstRangeStart = useRef(0); let secondRangeStart = useRef(0)
    let firstRangeEnd = useRef(0);  let secondRangeEnd = useRef(0)
    let firstRange = useRef(0); let secondRange = useRef(0)
    let currentLeft = useRef(0); let collisionCheck = useRef(false)
    const showRangeRef = useRef(null)

    let currentX = useRef(0); let leftValueNow = useRef(0) // For mouse events
    let checkDragging = useRef(false); let checkMouseDown = useRef(false)                   // For mouse events
    let dragCursor = useRef(false)

    const minPriceRef = useRef(null)
    const maxPriceRef = useRef(null)
    const priceRangeWrapperRef = useRef(null)
    const maxPriceRupee = useRef(500000)

    const priceErrorRef = useRef(null)

    const [minInputPrice, setMinInputPrice] = useState(0)
    const [maxInputPrice, setMaxInputPrice] = useState(null)

    // const {maxPriceAvailable} = useSelector(state=> state.productStore)

    // useEffect(()=> {
    //     if(maxPriceAvailable){
    //         maxPriceRupee.current = maxPriceAvailable
    //     }
    // },[maxPriceAvailable])

    useEffect(()=>{
        setMinInputPrice(minPrice)
        setMaxInputPrice(maxPrice)
    },[minPrice, maxPrice])

    const calculatePrice = (e, priceUnit)=>{
        const parentWidthPx = Number.parseInt(window.getComputedStyle(e.target.parentElement).width)
        const pricePercentage = (priceUnit/parentWidthPx)
        return Math.ceil(maxPriceRupee.current * pricePercentage)
     }
     const setPriceUnit = (e)=>{
         let minPriceUnit,maxPriceUnit;
         if(minPriceRef.current.getBoundingClientRect().right <= maxPriceRef.current.getBoundingClientRect().left
                 || minPriceRef.current.getBoundingClientRect().right <= maxPriceRef.current.getBoundingClientRect().right){
             minPriceUnit = firstRange.current
             maxPriceUnit = secondRange.current
         }
         else{
             minPriceUnit = secondRange.current
             maxPriceUnit = firstRange.current
         }
         setMinPrice(calculatePrice(e,minPriceUnit))
         setMaxPrice(calculatePrice(e,maxPriceUnit))
     }
     const displayRange = ()=>{
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
         firstSlide.current = true
         if(true || !collisionCheck.current){
        //  checkDragging.current = true
         const currentLeft = parseInt(window.getComputedStyle(e.target).left) || 0;
         rangeStart.current = e.clientX - currentLeft;
         const img = new Image();
         img.src = ''; 
         e.dataTransfer.setDragImage(img, 0, 0);
         e.target.style.cursor = 'grab'
         dragCursor.current  =true
         }
     }
     const dragEndHandler = (e, rangeStart, rangeEnd, range)=>{
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
         range.current = rangeEnd.current - e.target.style.width
         e.target.style.left = range.current.toString() + 'px'
         secondRange && displayRange()
         setPriceUnit(e)
     }
     
     const dragHandler = (e, handler)=>{
         if(handler=='firstHandler'){
             e.target.style.cursor = 'grabbing'
             const currentHandlerRect = e.target.getBoundingClientRect()
             const otherHandlerRect = e.target.nextElementSibling.getBoundingClientRect()
         }
     }
     const dragOverHandler = (e)=>{
         e.preventDefault()
     }
     const dropHandler = (e)=>{
         checkDragging.current = false
         checkMouseDown.current = false
         dragCursor.current = false
         e.preventDefault()
     }
 
     
     const mouseDownHandler = (e)=>{
         leftValueNow.current = parseInt(window.getComputedStyle(e.target).left);  
         currentX.current = e.clientX
         checkDragging.current = true  
         e.target.style.cursor = 'pointer' 
     }
 
     const calculateRangeFromPrice = (minPriceLimit, maxPriceLimit)=>{
         const parentWidthPx = Number.parseInt(window.getComputedStyle(priceRangeWrapperRef.current).width)
         const minPricePercentage = minPriceLimit/maxPriceRupee.current
         const maxPricePercentage = maxPriceLimit/maxPriceRupee.current
         const minPriceUnit = minPricePercentage * parentWidthPx
         const maxPriceUnit = maxPricePercentage * parentWidthPx
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
             priceErrorRef.current.style.visibility = 'visible'
             priceErrorRef.current.textContent = "Minimum and Maximum price limits must be numbers!"
             setTimeout(()=> priceErrorRef.current.style.visibility = 'hidden', 3000)
          }else if(minInputPrice < 0 || maxInputPrice < 0){
             priceErrorRef.current.style.visibility = 'visible'
             priceErrorRef.current.textContent = "Please enter positive numbers!"
             setTimeout(()=> priceErrorRef.current.style.visibility = 'hidden', 3000)
          }else if(minInputPrice > maxInputPrice){
             priceErrorRef.current.style.visibility = 'visible'
             priceErrorRef.current.textContent = "Minimum price limit should be leseer than Maximum price limit!"
             setTimeout(()=> priceErrorRef.current.style.visibility = 'hidden', 3000)
          }else{
             priceErrorRef.current.style.visibility = 'hidden'
 
             calculateRangeFromPrice(minInputPrice, maxInputPrice)
          }
     }

     return(
        <div id='price-filter-component' className='h-auto' 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onDrop={(e)=> { 
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                if(dragCursor.current){
                    e.target.style.cursor = 'grabbing' 
                }
            }} 
            onDragEnter={(e)=>{
                e.dataTransfer.dropEffect = 'move'
                if(dragCursor.current){
                    e.target.style.cursor = 'grabbing' 
                } 
            }} 
            onDragOver={(e)=>{
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                if(dragCursor.current){
                    e.target.style.cursor = 'grabbing' 
                }
            }}
        >
            <p className={`${(mountingComponent=='AdminProductListPage'? 'text-[13px] ':'text-[15px] ') + 'text-secondary text-center'}`}>
                {minPrice} - { maxPrice 
    ? (maxPrice !== maxPriceRupee.current 
        ? maxPrice 
        : maxPrice + "+") 
    : "-"
}
            </p>
            <div id='pricerange-wrapper' className='relative mt-[1rem]' onDragOver={(e)=>dragOverHandler(e)} 
                                                onDrop={(e)=>dropHandler(e)} ref={priceRangeWrapperRef}>

                <div className='relative w-[15rem] h-[4px] bg-[#AFD0FF] rounded-[2px]' 
                                  onDragOver={(e)=>dragOverHandler(e)} onDrop={(e)=>dropHandler(e)} >  {/* ref={rangeRef} bg-[#cfb6ee]*/}

                    <div draggable='true' className='absolute left-0 top-[-8px] w-[20px] h-[20px] rounded-[10px] 
                           border-[2px] border-[#AFD0FF]' onDragStart={(e)=>dragStartHandler(e, firstRangeStart)} onDrag={(e)=>dragHandler(e, "firstHandler")}
                               onDragEnd={(e)=>dragEndHandler(e, firstRangeStart, firstRangeEnd, firstRange)} 
                                   onClick={(e)=>{e.target.draggable=true; collisionCheck.current=false;}} onMouseDown={(e)=>mouseDownHandler(e)}
                                    ref={minPriceRef}></div>  {/* ref={rangeHandlerRef} */}
                    <div draggable='true' className='absolute left-[9px] top-[-8px] w-[20px] h-[20px] rounded-[10px] 
                         border-[2px] border-[#AFD0FF]' onDragStart={(e)=>dragStartHandler(e, secondRangeStart)} onDrag={(e)=>dragHandler(e, "secondHandler")}
                             onDragEnd={(e)=>dragEndHandler(e, secondRangeStart, secondRangeEnd, secondRange)} 
                                 onClick={(e)=>e.target.draggable=true} ref={maxPriceRef}></div>
                              <div className='w-full bg-secondary' ref={showRangeRef}></div>

                </div>
            </div>
            <div>
                <div className='flex justify-between w-full mb-[5px] price-buttons mt-[25px]' style={mountingComponent=='AdminProductListPage'? {marginTop:'8px'} :{} }>
                    <div>
                        <label className='text-[12px] text-secondary'> Min </label>
                        <div className='flex items-center'>    
                            <button onClick={(e)=> {
                                setMinInputPrice(price=> Number.parseInt(price)+1)
                             }} className='incdec-btn' style={mountingComponent=='AdminProductListPage'? {height:'1.4rem'} :{} }> + </button>
                            <input type="number" defaultValue="0" className='w-[70px] border-[#ced1d7] border-l-0 border-r-0
                                      p-[1px] h-[23px] placeholder:text-secondary placeholder:text-[14px]' style={mountingComponent=='AdminProductListPage'? {height:'18px', fontSize:'12px'} :{} }
                                      onChange={(e)=> setMinInputPrice(e.target.value)} value={minInputPrice} />
                        <button className='incdec-btn' onClick={(e)=> {setMinInputPrice(price=> (Number.parseInt(price)-1 < 0)? 0 :Number.parseInt(price)-1 )}}
                                    style={mountingComponent=='AdminProductListPage'? {height:'1.4rem'} :{} }>-</button>
                        </div>
                    </div>
                    <div>
                        <label className='text-[12px] text-secondary'> Max </label>
                        <div className='flex items-center'>
                            <button className='incdec-btn' onClick={(e)=> {setMaxInputPrice(price=> Number.parseInt(price)+1)}}
                                        style={mountingComponent=='AdminProductListPage'? {height:'1.4rem'} :{} }> + </button>
                            <input type="number" defaultValue="0" className='w-[70px] border-[#ced1d7] border-l-0 border-r-0  
                                                p-[1px] h-[23px] placeholder:text-secondary placeholder:text-[14px]' style={mountingComponent=='AdminProductListPage'? {height:'18px', fontSize:'12px'} :{} }
                                                onChange={(e)=> setMaxInputPrice(e.target.value)} value={maxInputPrice}
                                                    onBlur={()=> validateAndCompute()}/>
                            <button className='incdec-btn' onClick={(e)=> {setMaxInputPrice(price=> (Number.parseInt(price)-1 < 0)? 0 :Number.parseInt(price)-1 )}}
                                        style={mountingComponent=='AdminProductListPage'? {height:'1.4rem'} :{} }> - </button>
                        </div>
                    </div>
                </div>
                { (mountingComponent == 'AdminProductListPage') ? null :
                <div onClick={()=> validateAndCompute()} className='mt-[15px] text-center'>
                    <SiteSecondaryButtonSquare customStyle={{width:'60%', paddingBlock:'5px', fontSize:'13px'}}> Apply </SiteSecondaryButtonSquare>
                </div>
                }
                <p className='invisible w-full h-[10px] text-red-500 text-[10px] mt-[5px] text-center' ref={priceErrorRef}></p>
            </div>
        </div>
     )
}