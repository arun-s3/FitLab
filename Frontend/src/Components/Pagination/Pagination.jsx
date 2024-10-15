import React,{useState, useEffect} from 'react'
import './Pagination.css'
import {RiArrowDropLeftLine, RiArrowDropRightLine} from "react-icons/ri";


export default function Pagination({productCounts, currentPage, currentPageChanger, limiter}){

    const [totalPages, setTotalPages] = useState(1)
    const [currentPaginationPage, setCurrentPaginationPage] = useState(1)

    const {limit, setLimit} = limiter

    useEffect(()=>{
      if(productCounts < limit){
        setTotalPages(1)
      }else{
        setTotalPages(Math.ceil(productCounts/limit))
      }
    },[productCounts])

    useEffect(()=>{
        console.log("Current Page-->"+currentPage)
        console.log("Current Pagination page-->"+currentPaginationPage)
        console.log("Total Page-->", totalPages)
      },[currentPage, currentPaginationPage])

    return(
        <div className='mt-[3rem] flex gap-[10px] items-center' id='pagination-bar'>

          { (totalPages > 1) &&
          <span onClick={()=> {
            currentPageChanger(Math.max(Number.parseInt(currentPage-1), 1))
            setCurrentPaginationPage(Math.max(Number.parseInt(currentPage-1), 1))
          }}>   {/*Prev*/}
                        <RiArrowDropLeftLine />
          </span>
          }

          <span onClick={()=> currentPageChanger(currentPaginationPage)} style={totalPages==1 && {background: 'white', borderColor:'#D5D2D2'}}>                                  {/*1*/}
                    {currentPaginationPage}
          </span>
          
          { (totalPages > 1) &&
          <span onClick={()=> currentPageChanger(currentPaginationPage+1)}>                                   {/*2*/}
              {currentPaginationPage+1}
          </span>
          }

          { (totalPages > 2) &&
          <span onClick={()=> {
            currentPageChanger(currentPaginationPage+2)
            setCurrentPaginationPage(Math.min(currentPaginationPage+2, totalPages-3))
          }}>
                        {currentPaginationPage+2}                                                          {/*3*/}
          </span>
          }

          { (totalPages > 3) ?
            (currentPaginationPage == (totalPages-3))? null : (
            <span className='font-[600]'>                                                                                          {/*...*/}
            ....  
            </span>
          ): null}

          { (totalPages > 4) &&
          <span onClick={()=> currentPageChanger(totalPages)}>                                                 {/*LastPage*/}
                        {totalPages}
          </span>
          }

          { (totalPages > 1) &&
          <span onClick={()=>{
             currentPageChanger(Math.min(Number.parseInt(currentPage+1), totalPages))
             setCurrentPaginationPage(Math.min(Number.parseInt(currentPage+1), totalPages))
          }}>  
              <RiArrowDropRightLine />                                                                      {/*7*/}
          </span>
          }
          
    </div>
    )
}