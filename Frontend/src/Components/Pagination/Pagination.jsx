import React,{useState, useEffect} from 'react'
import './Pagination.css'
import {RiArrowDropLeftLine, RiArrowDropRightLine} from "react-icons/ri";


export default function Pagination({totalCounts, currentPage, currentPageChanger}){

    const [totalPages, setTotalPages] = useState(1)
    const [currentPaginationPage, setCurrentPaginationPage] = useState(1)

    useEffect(()=>{
        setTotalPages(Math.ceil(totalCounts/12))
      },[totalCounts])

    useEffect(()=>{
        console.log("Current Page-->"+currentPage)
        console.log("Current Pagination page-->"+currentPaginationPage)
      },[currentPage, currentPaginationPage])

    return(
        <div className='mt-[3rem] flex gap-[10px] items-center' id='pagination-bar'>
          <span onClick={()=> {
            currentPageChanger(Math.max(Number.parseInt(currentPage-1), 1))
            setCurrentPaginationPage(Math.max(Number.parseInt(currentPage-1), 1))
          }}>   {/*1*/}
                        <RiArrowDropLeftLine />
          </span>

          <span onClick={()=> currentPageChanger(currentPaginationPage)}>                                  {/*2*/}
                    {currentPaginationPage}
          </span>

          <span onClick={()=> currentPageChanger(currentPaginationPage+1)}>                                   {/*3*/}
              {currentPaginationPage+1}
          </span>

          <span onClick={()=> {
            currentPageChanger(currentPaginationPage+2)
            setCurrentPaginationPage(Math.min(currentPaginationPage+2, totalPages-3))
          }}>
                        {currentPaginationPage+2}                                                          {/*4*/}
          </span>

          {currentPaginationPage == (totalPages-3)? null : (
            <span className='font-[600]'>                                                                                          {/*5*/}
            ....  
            </span>
          )}

          <span onClick={()=> currentPageChanger(totalPages)}>                                                 {/*6*/}
                        {totalPages}
          </span>

          <span onClick={()=>{
             currentPageChanger(Math.min(Number.parseInt(currentPage+1), totalPages))
             setCurrentPaginationPage(Math.min(Number.parseInt(currentPage+1), totalPages))
          }}>  
              <RiArrowDropRightLine />                                                                      {/*7*/}
          </span>
    </div>
    )
}