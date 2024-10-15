import React,{useState} from 'react'

import {FaSortUp,FaSortDown} from "react-icons/fa6";
import {MdBlock, MdDeleteOutline} from 'react-icons/md';
import {RiFileEditLine} from "react-icons/ri";

export default function ProductsTableView({products}){

    const [activeSorter, setActiveSorter] = useState({field:'',order:''})

    const sortHandler = (e,type,order)=>{
        if(e.target.style.height=='15px'){
          e.target.style.height='10px'
          e.target.style.color='rgba(159, 42, 240, 0.5)'
          console.log("Going to default icon settings and localUsers--")
      }else {
          setActiveSorter({field:type, order})
      }
     }


  return(
    <div id='ProductsTableView'>
        <table cellSpacing={10} cellPadding={10} className='border-spacing-[24px] w-full'>
        <thead>
            <tr className='secondaryLight-box border border-[rgb(220, 230, 166)] font-[500] text-secondary table-header'>
                <td>
                    <div className='flex items-center'>
                        <span>Product Name</span>
                        <i className='flex flex-col gap-[2px] h-[5px]'>
                            <FaSortUp  onClick = {(e)=>{ sortHandler(e,"productName",1)}} 
                                    style={{height: activeSorter.field === "productName" && activeSorter.order === 1 ?'15px':'10px',
                                                color: activeSorter.field === "productName" && activeSorter.order === 1 ? 
                                                            'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                            <FaSortDown onClick = {(e)=>sortHandler(e,"productName",-1)} 
                                style={{height: activeSorter.field === "productName" && activeSorter.order === -1 ?'15px':'10px',
                                            color: activeSorter.field === "productName" && activeSorter.order === -1 ? 
                                            'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)' }}/>
                        </i>
                    </div> 
                </td>
                <td>
                    <div className='flex items-center'>
                        <span>Price</span>
                        <i className='flex flex-col h-[5px]'>
                            <FaSortUp onClick = {(e)=>sortHandler(e,"price",1)} 
                                style={{height: activeSorter.field === "price" && activeSorter.order === 1 ?'15px':'10px',
                                            color: activeSorter.field === "price" && activeSorter.order === 1 ?
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                            <FaSortDown onClick = {(e)=>sortHandler(e,"price",-1)} 
                                style={{height: activeSorter.field === "price" && activeSorter.order === -1 ?'15px':'10px',
                                            color: activeSorter.field === "price" && activeSorter.order === -1 ? 
                                             'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                        </i>
                    </div>
                </td>
                <td>
                    <div className='flex items-center'>
                        <span>Brand</span>
                        <i className='flex flex-col h-[5px]'>
                            <FaSortUp onClick = {(e)=>sortHandler(e,"brand",1)} 
                                style={{height: activeSorter.field === "brand" && activeSorter.order === 1 ?'15px':'10px',
                                        color: activeSorter.field === "brand" && activeSorter.order === 1 ? 
                                           'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                            <FaSortDown onClick = {(e)=>sortHandler(e,"brand",-1)} 
                                style={{height: activeSorter.field === "brand" && activeSorter.order === -1 ?'15px':'10px',
                                            color: activeSorter.field === "brand" && activeSorter.order === -1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}} />
                        </i>
                    </div>
                </td>
                <td>
                    <div className='flex items-center'>
                        <span>Stock</span>
                        <i className='flex flex-col h-[5px]'>
                            <FaSortUp onClick = {(e)=>sortHandler(e,"stock",1)}
                                style={{height: activeSorter.field === "stock" && activeSorter.order === 1 ?'15px':'10px',
                                            color: activeSorter.field === "stock" && activeSorter.order === 1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                            <FaSortDown onClick = {(e)=>sortHandler(e,"stock",-1)}
                                style={{height: activeSorter.field === "stock" && activeSorter.order === -1 ?'15px':'10px',
                                             color: activeSorter.field === "stock" && activeSorter.order === -1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                        </i>
                    </div>
                </td>
                <td>
                    <div className='flex items-center'>
                        <span>Category</span>
                        <i className='flex flex-col h-[5px]'>
                            <FaSortUp onClick = {(e)=>sortHandler(e,"category",1)}
                                style={{height: activeSorter.field === "category" && activeSorter.order === 1 ?'15px':'10px',
                                            color: activeSorter.field === "category" && activeSorter.order === 1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                            <FaSortDown onClick = {(e)=>sortHandler(e,"category",-1)}
                                style={{height: activeSorter.field === "category" && activeSorter.order === -1 ?'15px':'10px',
                                             color: activeSorter.field === "category" && activeSorter.order === -1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                        </i>
                    </div>
                </td>
                <td>
                    <div className='flex items-center'>
                        <span>Weights</span>
                        <i className='flex flex-col h-[5px]'>
                            <FaSortUp onClick = {(e)=>sortHandler(e,"weights",1)}
                                style={{height: activeSorter.field === "weights" && activeSorter.order === 1 ?'15px':'10px',
                                            color: activeSorter.field === "weights" && activeSorter.order === 1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                            <FaSortDown onClick = {(e)=>sortHandler(e,"weights",-1)}
                                style={{height: activeSorter.field === "weights" && activeSorter.order === -1 ?'15px':'10px',
                                             color: activeSorter.field === "weights" && activeSorter.order === -1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                        </i>
                    </div>
                </td>
                <td></td>
            </tr> 
        </thead>
        <tr><td colSpan='5'></td></tr>
        
        <tbody className='text-[14px]'>
            {   
                products.length > 0 ? products.map(product =>
                    <tr key={product.id}>
                        <td>
                            <div className='flex items-center gap-[1rem]'>
                                <figure className='w-[50px] h-[50px] rounded-[8px] border-primary bg-[#f3f5f7]'>
                                    <img src={product.thumbnail.url} alt='product-thumbnail' className='w-[50px] h-[50px] object-cover rounded-[5px]'/>
                                </figure>
                                <span> {product.title} </span>
                            </div>
                        </td>
                        <td>{product.price}</td>
                        <td>{product.brand}</td>
                        <td>{product.stock}</td>
                        <td>{product.category}</td>
                        <td>{product.weights ? 'Available' : 'Not available'}</td>
                        <td>
                            <div className='flex items-center gap-[10px] action-buttons'>
                                <button type='button' onClick={() => deleteHandler(product._id)} 
                                        className='text-red-500'> Edit 
                                </button>
                                <button type='button' className='basis-[103px]' onClick={() => toggleBlockHandler(product.id)}>
                                     {product?.isBlocked ? "Unblock" : "Block"} <MdBlock/>
                                </button>
                            </div>
                        </td>
                    </tr>
                ) :<tr><td>No Records!</td></tr>
            }
        </tbody>
    </table>
  </div>
  )
}