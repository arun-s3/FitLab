import React, {useState, useEffect} from 'react'

import {useNavigate, useLocation} from 'react-router-dom'
import {useDispatch} from 'react-redux'

import {FaSortUp,FaSortDown} from "react-icons/fa6"
import {MdBlock} from 'react-icons/md'
import {CgUnblock} from "react-icons/cg"
import {PackagePlus} from 'lucide-react'

import {toggleProductStatus} from "../../Slices/productSlice"


export default function ProductsTableView({products, setProducts, restockProduct}){

    const [activeSorter, setActiveSorter] = useState({field:'',order:''})

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const location = useLocation()

    useEffect(() => {
        let tempProducts = [...products]

        if (activeSorter.field && activeSorter.order) {
            tempProducts = sortProducts(activeSorter.field, activeSorter.order, true)
        }
        setProducts(tempProducts)

    }, [activeSorter.field, activeSorter.order]);

    const sortHandler = (e,type,order)=>{
        if(e.target.style.height=='15px'){
          e.target.style.height='10px'
          e.target.style.color='rgba(159, 42, 240, 0.5)'
      }else {
          setActiveSorter({field:type, order})
      }
     }

     const sortProducts = (type, order, returnData) => {

         const sortedProducts = [...products].sort((a, b) => {
             const valA = a[type]
             const valB = b[type]

             if (typeof valA === "string") {
                 return order === 1 ? valA.localeCompare(valB) : valB.localeCompare(valA)
             }

             return order === 1 ? valA - valB : valB - valA
         })

         if (returnData) {
             return sortedProducts
         } else {
             setProducts(sortedProducts)
         }
     }

     const editProductHandler = (product)=> {
        navigate(
            {
                pathname: "./edit",
                search: `?id=${product._id}`,
            },
            { state: {
                 product,
                 from: location.pathname 
            }},
        )
     }


  return(
    <div id='ProductsTableView' className='overflow-x-auto'>
        <table cellSpacing={10} cellPadding={10} className='border-spacing-[24px] w-min-full border-collapse'>
        <thead>
            <tr className='secondaryLight-box border border-[rgb(220, 230, 166)] font-[500] text-secondary table-header'>
                <td>
                    <div className='flex items-center'>
                        <span>Product Name</span>
                        <i className='flex flex-col gap-[2px] h-[5px]'>
                            <FaSortUp  onClick = {(e)=>{ sortHandler(e,"title",1)}} 
                                    style={{height: activeSorter.field === "title" && activeSorter.order === 1 ?'15px':'10px',
                                                color: activeSorter.field === "title" && activeSorter.order === 1 ? 
                                                            'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                            <FaSortDown onClick = {(e)=>sortHandler(e,"title",-1)} 
                                style={{height: activeSorter.field === "title" && activeSorter.order === -1 ?'15px':'10px',
                                            color: activeSorter.field === "title" && activeSorter.order === -1 ? 
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
                    </div>
                </td>
                <td>
                    <div className='flex items-center'>
                        <span>Weights</span>
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
                                <span className='text-[15px] font-[480] capitalize'> 
                                    { product.title.length > 25 ? product.title.slice(0,25) + '...' : product.title } 
                                </span> {/*20 */}
                            </div>
                        </td>
                        <td className='capitalize'> &#8377; { product.price }</td>
                        <td className='capitalize'>{ product.brand.length > 20 ? product.brand.slice(0,20) + '...' : product.brand } </td>  {/*15 */}
                        <td className='capitalize'>{ product.stock }</td>
                        <td className='capitalize'>
                            {
                                (()=> {
                                        if (!product.category || product.category.length === 0) return "";
                                        const totalLength = product.category.reduce((sum, item) => sum + item.length, 0)

                                        if (totalLength > 20) {
                                          if (product.category.length === 2) {
                                            return product.category[0].slice(0, 15) + " .., " + product.category[1].slice(0, 10) + ".."
                                          }
                                          return product.category[0].slice(0, 20) + "..."
                                        }
                                        return product.category.join(", ").toString()
                                    }
                                )()
                            }
                        </td>
                        <td className={`${product.weights ? 'text-green-500' : 'text-red-500'}`}>
                            {product.weights ? 'Available' : 'Not available'}
                        </td>
                        <td>
                            <div className='flex items-center gap-[10px] action-buttons'>
                                <button type='button' onClick={() => editProductHandler(product)} 
                                        className='text-red-500'> Edit 
                                </button>
                                <button type='button' className='basis-[103px]' onClick={() => dispatch(toggleProductStatus(product._id))}>
                                     {product.isBlocked ? "Unblock" : "Block"} 
                                     {
                                        product?.isBlocked 
                                            ? <CgUnblock className='text-green-600'/>
                                            : <MdBlock className='text-red-500'/>
                                     }
                                </button>
                                <button type='button' className='!px-[10px] !py-[5px]' onClick={() => restockProduct(product)}> 
                                    <PackagePlus className='w-[15px] h-[15px] !text-green-600 '/>
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