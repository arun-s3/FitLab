import React,{useState, useEffect, useRef} from 'react'
import './AdminCategoryListPage.css'
import {useNavigate, useOutletContext} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {debounce} from 'lodash'

import {toast as sonnerToast} from 'sonner'
import {format} from "date-fns"
import {MdBlock, MdDeleteOutline} from 'react-icons/md'
import {CgUnblock} from "react-icons/cg"
import {RiFileEditLine} from "react-icons/ri"
import {MdOutlineEdit} from "react-icons/md"
import {MdOutlineArrowDropDownCircle, MdArrowDropDownCircle} from "react-icons/md"
import {RiDropdownList} from "react-icons/ri"

import {getAllCategories, getCategoriesOfType, getSingleCategory, toggleCategoryStatus, resetSubcategories, searchCategoryByName, resetStates} 
                from '../../../Slices/categorySlice'
import {SearchInput} from '../../../Components/FromComponents/FormComponents'
import AdminTitleSection from '../../../Components/AdminTitleSection/AdminTitleSection'


export default function AdminCategoryListPage(){

  const dispatch = useDispatch()
  const {categories, message, error, populatedSubCategories, allSubCategories, blockedCategoryList, 
    categoryStatusToggled} = useSelector(state=> state.categoryStore)

  const [subCategories, setSubCategories] = useState({})
  const [openSubcategories, setOpenSubcategories] = useState({})

  const navigate = useNavigate()

  const [showTheseCategories, setShowTheseCategories] = useState([])
  const [toggleTab, setToggleTab] = useState({goTo: 'all'})
  const [previousTab, setPreviousTab] = useState(null)

  const {setPageBgUrl} = useOutletContext() 
     setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.94),rgba(255,255,255,0.94)), url('/Images/admin-ProductsListBg.jpg')`)

  useEffect(() => {
    const getFitlabCategories =  async ()=>{
      dispatch( getAllCategories() )
    }                  
    getFitlabCategories()
  }, []);

  useEffect(()=> {
    if(message){
      sonnerToast.success(message)
    }
    dispatch(resetStates())
  },[message])

  useEffect(()=> {
     if(error){ 
         sonnerToast.error(error)
         dispatch(resetStates())
     }
  }, [error])

  useEffect(() => {
      const filteredSubCategories = allSubCategories.filter(
        (scat) => scat.parentCategory === populatedSubCategories.parentId
      );
      
      setSubCategories((prevSubCategories) => ({
        ...prevSubCategories,
        [populatedSubCategories.parentId]: filteredSubCategories,
      }));
  
      setOpenSubcategories((prevOpenSubcategories) => ({
        ...prevOpenSubcategories,
        [populatedSubCategories.parentId]: {
          ...prevOpenSubcategories[populatedSubCategories.parentId],
          parentLevelCount: populatedSubCategories.parentLevelCount,
        },
      }));
  }, [populatedSubCategories, allSubCategories]);

useEffect(() => {
    if (blockedCategoryList && blockedCategoryList.length) {
        setSubCategories((prevSubCategories) => {
            const updatedSubCategories = { ...prevSubCategories };

            Object.keys(prevSubCategories).forEach((parentCat) => {
                const blockedForParent = blockedCategoryList.filter(
                    (blockedCat) => blockedCat.parentCategory === parentCat
                );

                if (blockedForParent.length) {
                    updatedSubCategories[parentCat] = updatedSubCategories[parentCat].map((cat) => {
                        const matchedBlockedCat = blockedForParent.find(
                            (blockedCat) => blockedCat.id === cat._id
                        );

                        return matchedBlockedCat
                            ? { ...cat, isBlocked: matchedBlockedCat.status }
                            : cat;
                    });
                }
            });

            return updatedSubCategories;
        });
    }
}, [blockedCategoryList]);

   const showCategories = (type)=>{
       setToggleTab({goTo: type})
       if(type == 'all'){
            dispatch(getAllCategories({}))
       }
       if(type == 'active'){
            dispatch(getCategoriesOfType({status:'active', isActive: true}))
       }
        if(type == 'inactive'){
            dispatch(getCategoriesOfType({status:'active', isActive: false}))
       }
       if(type == 'blocked'){
            dispatch(getCategoriesOfType({status:'blocked'}))
       }
   }

   useEffect(()=> {
     if(categoryStatusToggled){ 
        setPreviousTab(toggleTab.goTo)
        const gotoTab = toggleTab.goTo === 'blocked' ? previousTab ? previousTab : 'all' : 'blocked'
        setTimeout(()=> {
            showCategories(gotoTab)
            dispatch(resetStates())
        }, 1500)
     }
  }, [categoryStatusToggled])

const closeNestedSubcategories = (id) => {
    if (subCategories[id]) {
        subCategories[id].forEach(subCategory => {
            setOpenSubcategories(openSubcategories => ({
                ...openSubcategories,
                [subCategory._id]: {
                    ...openSubcategories[subCategory._id],
                    status: false
                }
            }))
            closeNestedSubcategories(subCategory._id)
        })
    }
}

const showSubcategories = (id) => {
    if(!openSubcategories[id]){
        dispatch(getSingleCategory({id}))
    }
    const isOpening = !openSubcategories[id]?.status
    if (!isOpening) {
        closeNestedSubcategories(id)
    }
    setOpenSubcategories(openSubcategories => ({
        ...openSubcategories,
        [id]: {
            ...openSubcategories[id],
            status: isOpening,
            parentLevelCount: openSubcategories[id]?.parentLevelCount || 1
        }
    }))
}

const parseDate = (value) => {
    if (!value) return null
    
    if (typeof value === "number") {
      return new Date(value < 1000000000000 ? value * 1000 : value)
    }
  
    return new Date(value)
}

const debouncedSearch = useRef(
    debounce((query)=> {
        dispatch(searchCategoryByName({query}))
    }, 600) 
).current;

const searchHandler = (e)=> {
    const query = e.target.value
    if(query.trim()) {
        setPreviousTab(toggleTab.goTo)
        debouncedSearch(query)
    } else {
        debouncedSearch.cancel() 
        showCategories(previousTab)
    }
}


const tableBodyGenerator = (categories, isSubcategory, parentLevelCount)=> {
    
    return(
        <>
            {  categories &&
                categories.length > 0 ? categories.map(category =>
                 <React.Fragment key={category._id}>
                    <tr id='category-content' className='border-b border-dashed border-[#84788A85]'>
                        <td colSpan='2' className='py-[20px] pl-[1.5rem]' style={isSubcategory? {paddingLeft: `${ parentLevelCount ? (parentLevelCount * 3) : 2.5}rem`} : {}}>
                                <div className='flex items-center gap-[5px] relative'>
                                    {(toggleTab.goTo !== 'blocked' && toggleTab.goTo !== 'active') && category?.subCategory && category?.subCategory.length ? 
                                        <i onClick={()=> showSubcategories(category._id)} className='ml-[5px] absolute top-[8.3rem] 
                                                left-[-34px] cursor-pointer' id='open-subcategory' data-label={openSubcategories[category._id]?.['status']? 'Close Subcategories' : 'Show Subcategories'}>
                                            <MdOutlineArrowDropDownCircle/> 
                                        </i> : null
                                       }
                                    <figure className='w-[150px] h-[150px] rounded-[8px] border-primary bg-[#f3f5f7] relative'>
                                        <img src={category?.image?.url} alt='category-image' className='w-[150px] h-[150px] object-cover rounded-[5px]'/>
                                        <figcaption className='absolute bottom-[10px] left-[10px] mt-[5px] text-[12px] font-[550] capitalize
                                                 text-secondary rounded-[5px] tracking-[0.3px] px-[10px]'> 
                                            {category.name} 
                                        </figcaption> 
                                    </figure>
                                    <div className='relative'>
                                        <div className='flex flex-col gap-[2px] justify-center h-[122px] border-l-[3.5px] border-[#8f8989] '>
                                            <span className='w-[200px] capitalize text-[10px] text-[#8f8989] tracking-[0.2px] text-right         
                                                        break-words px-[10px] py-[5px] rounded-[5px] mt-[15px] whitespace-pre-wrap line-clamp-6'>    {/*  border border-[#94a3b8]  bg-[#f5f5f5]*/}
                                                 {category.description} 
                                            </span>
                                        </div>
                                        <div className='absolute left-[10px] top-[5px] flex gap-[25px] w-full'> 
                                            <div className='flex items-center gap-[5px]'>
                                                {
                                                    category?.badge 
                                                        && <span className=' border border-[#eae0f0] px-[10px] rounded-[7px] text-[10px] tracking-[0.3px] 
                                                            text-secondary' style={!category.badge ? {display:'none'}: {}}> 
                                                            {category?.badge} 
                                                           </span>
                                                } 
                                                <span className={`w-[4px] h-[4px] rounded-full 
                                                    ${category.isBlocked ? 'bg-red-500' : 'bg-green-600'}`}></span>
                                            </div>
                                            { (category?.productCount || category?.productCount === 0 ) &&
                                                <span className={`border border-[#eae0f0] px-[10px] rounded-[7px] flex items-center gap-[2px]
                                                    font-[500] text-[10px] text-secondary
                                                    ${(category.isBlocked || 
                                                        (blockedCategoryList?.length 
                                                            && blockedCategoryList?.find(cat=> cat.id == category._id)?.status) ) 
                                                            ? 'bg-red-500' 
                                                            : 'bg-green-500'}`
                                                    }
                                                        style={!category.badge ? {marginLeft:'auto', marginRight:'20px'}: {}}>
                                                    <span className='text-primary mr-[2px]'> &bull; </span> 
                                                    <span className='text-[10px] text-white'>
                                                     {category.productCount + ' Products'}   
                                                    </span>
                                                </span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            {/* </div> */}
                        </td>
                        <td>{category.discount + '%'}</td>
                        <td className='text-green-500'>
                            {category?.relatedCategory ? category.relatedCategory.map(cat=> <span> {cat.name} </span>) : null}
                        </td>
                        <td className='text-muted text-[13px]'> 
                            <p>
                                {
                                    category?.seasonalActivation?.startDate 
                                        ? format(parseDate(category?.seasonalActivation?.startDate), "MMM dd, yy" ) + " (Starts)"
                                        : null
                                }
                            </p>  
                            <p className='mt-[5px]'>
                                {
                                    category?.seasonalActivation?.endDate 
                                        ? format(parseDate(category?.seasonalActivation?.endDate), "MMM dd, yy" ) + " (Ends)"
                                        : null
                                }
                            </p>
                        </td>
                        <td>
                                <div className='w-[35px] flex flex-col gap-[2rem] text-secondary'>
                                       <span data-label='Edit' className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center 
                                             relative cursor-pointer admin-control' onClick={()=> navigate('./edit', {state: {
                                                category, 
                                                from: location.pathname
                                             }})}>    
                                         <i> <RiFileEditLine/> </i>
                                       </span>
                                       <span data-label={category.isBlocked ? 'Unblock' : 'Block'} 
                                            className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center
                                                relative cursor-pointer admin-control'  
                                            onClick={()=> dispatch(toggleCategoryStatus(category._id))}
                                        >  
                                         <i> <MdBlock/> </i>
                                       </span>
                                </div>
                        </td>
                    </tr>
                        { openSubcategories[category._id]?.['status']? subCategories && Object.keys(subCategories).length > 1 &&
                                    tableBodyGenerator(subCategories[category._id], true, openSubcategories[category._id]?.['parentLevelCount'] +1)
                                    : null
                        }
                </React.Fragment>
                ) : <tr> 
                        <td colSpan='5'>
                            <p className='mt-20 text-[17px] text-muted tracking-[0.4px] text-center w-full h-[7rem]'>
                                 No categories found! 
                            </p> 
                        </td>
                    </tr>
            }  
        </>
    )
   }

  return(
   <section id='AdminCategoryListPage'>
    <header>
        <AdminTitleSection heading='Category List' subHeading='View, Edit and Organize all Categories seamlessly'/>
    </header>
    <main>
        <div className='relative mt-[4.3rem]'>
        <div className='h-[40px] w-[150px] bg-white border border-b-[#e5e7eb] rounded-tl-[10px] cursor-pointer
                                 flex justify-center items-center absolute top-[-39px] tab' onClick={()=> showCategories('all')} 
                        style={toggleTab.goTo == 'all'? {borderBottomColor:'transparent'}:{}}>
                    <h4 className={toggleTab.goTo == 'all' ? 'opacity-[1]' : 'opacity-[0.75]'}> All </h4>
        </div>
        <div className='h-[40px] w-[150px] bg-white border border-b-[#e5e7eb] flex justify-center items-center absolute cursor-pointer
                            top-[-39px] left-[150px] tab' onClick={()=> showCategories('active')}
                        style={toggleTab.goTo == 'active'? {borderBottomColor:'transparent'}:{}}>
            <h4 className={toggleTab.goTo == 'active' ? 'opacity-[1]' : 'opacity-[0.75]'}> Active </h4>
        </div>
        <div className='h-[40px] w-[150px] bg-white border border-b-[#e5e7eb] flex justify-center items-center absolute cursor-pointer
                            top-[-39px] left-[300px] tab' onClick={()=> showCategories('inactive')}
                        style={toggleTab.goTo == 'inactive'? {borderBottomColor:'transparent'}:{}}>
            <h4 className={toggleTab.goTo == 'inactive' ? 'opacity-[1]' : 'opacity-[0.75]'}> Inactive </h4>
        </div>
        <div className='h-[40px] w-[150px] bg-white border border-b-[#e5e7eb] rounded-tr-[5px] flex justify-center items-center cursor-pointer
                     absolute top-[-39px] left-[450px] tab' onClick={()=> showCategories('blocked')}
                        style={toggleTab.goTo == 'blocked'? {borderBottomColor:'transparent'}:{}}>
            <h4 className={toggleTab.goTo == 'blocked' ? 'opacity-[1]' : 'opacity-[0.75]'}> Blocked </h4>
        </div>
        <div className='border py-[1rem] px-[2rem] bg-white container'>

        <input type='search'
            placeholder='Search Category...'
            className={`h-[34px] lg:w-[47%] x-lg:w-[25rem] xl:w-[34rem] text-secondary border border-inputBorderLow rounded-[7px]
                placeholder:text-[11px] text-[13px] search-fitlab focus:shadow-lg focus:ring-secondary focus:border-secondary`}
            onChange={(e)=> searchHandler(e)} 
        />

        <table cellSpacing={10} cellPadding={6} className='border-spacing-[24px] w-full mt-[2rem]'>
        <thead>
            <tr className='secondaryLight-box border border-[rgb(220, 230, 166)] font-[500] text-secondary table-header'>
                <td colSpan='2'>
                    <div className='flex items-center'>
                        <span className='table-label'>Category</span>
                    </div> 
                </td>
                <td>
                    <div className='flex items-center'>
                        <span className='table-label'>Discount</span>
                    </div>
                </td>
                <td>
                    <div className='flex items-center'>
                        <span className='table-label'>Related category</span>
                    </div>
                </td>
                <td>
                    <div className='flex items-center'>
                        <span className='table-label'>Seasonal Activation</span>
                    </div>
                </td>
                <td></td>
            </tr>  
        </thead>
        <tr><td colSpan='5'></td></tr>
        <tbody className='text-[14px]'>
            {/* <tableBodyGenerator categories={categories} /> */}
            {
                tableBodyGenerator(categories)
            }                        
        </tbody>
    </table>
  </div>
  <div className='h-[5rem]'></div>
 </div>
</main>
</section>
  )
}