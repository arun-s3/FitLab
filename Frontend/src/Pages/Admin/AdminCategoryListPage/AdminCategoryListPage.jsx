import React,{useState, useEffect} from 'react'
import './AdminCategoryListPage.css'
import {useNavigate, useOutletContext} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {getAllCategories, getCategoriesOfType, getSingleCategory, toggleCategoryStatus, resetSubcategories, resetStates} 
                from '../../../Slices/categorySlice'
import {SearchInput} from '../../../Components/FromComponents/FormComponents'
import AdminTitleSection from '../../../Components/AdminTitleSection/AdminTitleSection'

import {toast as sonnerToast} from 'sonner'
import {IoArrowBackSharp} from "react-icons/io5";
import {FaSortUp,FaSortDown} from "react-icons/fa6";
import {MdBlock, MdDeleteOutline} from 'react-icons/md';
import {CgUnblock} from "react-icons/cg";
import {RiFileEditLine} from "react-icons/ri";
import {MdOutlineEdit} from "react-icons/md";
import {MdOutlineArrowDropDownCircle, MdArrowDropDownCircle} from "react-icons/md";
import {RiDropdownList} from "react-icons/ri";


export default function AdminCategoryListPage(){

  const dispatch = useDispatch()
  const {categories, message, populatedSubCategories, allSubCategories, blockedCategoryList} = useSelector(state=> state.categoryStore)

  const [subCategories, setSubCategories] = useState({})
  const [openSubcategories, setOpenSubcategories] = useState({})

  const navigate = useNavigate()

  const [showTheseCategories, setShowTheseCategories] = useState([])
  const [toggleTab, setToggleTab] = useState({goTo: 'all'})

  const {setPageBgUrl} = useOutletContext() 
//   setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.95),rgba(255,255,255,0.95)), url('/admin-bg1.png')`)
     setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.94),rgba(255,255,255,0.94)), url('/admin-ProductsListBg.jpg')`)

  useEffect(() => {
    const getFitlabCategories =  async ()=>{
      console.log("Getting all categories...")
      dispatch( getAllCategories() )
    }                  
    getFitlabCategories()
    console.log("CATGEORIES----",JSON.stringify(categories))
    console.log("ALLSUBCATEGORIES---------------->", allSubCategories)
    // dispatch(resetSubcategories())
  }, []);

//   useEffect(()=>{
//     setShowTheseCategories(categories)
//     if(toggleTab.goTo = 'active'){
//         dispatch(getCategoriesOfType({status:'active'}))
//     }
//     if(toggleTab.goTo = 'blocked'){
//         dispatch(getCategoriesOfType({status:'blocked'}))
//     }
//     if(toggleTab.goTo = 'all'){
//         dispatch(getAllCategories({}))
//     }
//   },[toggleTab])
  
  useEffect(()=>{
        console.log("CATEGORIES from backend-->", JSON.stringify(categories))
    },[categories])

  useEffect(()=> {
    if(message){
      console.log("message arrived-->", message)
      sonnerToast.success(message)
    }
    dispatch(resetStates())
  },[message])

//   useEffect(()=>{
//     if(populatedSubCategories){
//         setSubCategories({...subCategories, [populatedSubCategories.parentId]: populatedSubCategories.subCategories})
//         setOpenSubcategories({...openSubcategories, [populatedSubCategories.parentId]: {...openSubcategories[populatedSubCategories.parentId], parentLevelCount: populatedSubCategories.parentLevelCount}})
//         console.log("subCategories-->", JSON.stringify(subCategories))
//     }
//   },[populatedSubCategories])

//   useEffect(()=>{
//     if(populatedSubCategories && allSubCategories){
//         console.log("allSubCategories from AdminCategoryListPage--->", JSON.stringify(allSubCategories))
//         setSubCategories({...subCategories, [populatedSubCategories.parentId]: allSubCategories.map(scat=> scat.parentCategory===populatedSubCategories.parentId)})
//         setOpenSubcategories({...openSubcategories, [populatedSubCategories.parentId]: {...openSubcategories[populatedSubCategories.parentId], parentLevelCount: populatedSubCategories.parentLevelCount}})
//     }
//   },[populatedSubCategories, allSubCategories])

  useEffect(()=>{
    if(categories.length){
        console.log("categories from AdminCategoryList--->", JSON.stringify(categories))
    }
    console.log("subCategories from AdminCategoryList--->", subCategories)
    // console.log("Subcategories now-->", JSON.stringify(subCategories))
    // console.log("Subcategory of 1st Id-->", JSON.stringify(subCategories['67165c5c19a2809d4c87ae1b']))
    if(openSubcategories){
        console.log("openSubcategories-->", JSON.stringify(openSubcategories))
    }
  },[categories, subCategories, openSubcategories])

  useEffect(() => {
    if (populatedSubCategories && allSubCategories) {
      console.log("allSubCategories from AdminCategoryListPage--->", JSON.stringify(allSubCategories));
      
      // Filter subcategories for the current parentId
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
    }
  }, [populatedSubCategories, allSubCategories]);

//   useEffect(()=>{
//     if(blockedCategoryList && blockedCategoryList.length){
//         parentCategoryList = Object.keys(subCategories)
//         parentCategoryList.forEach(parentCat=> {
//             if(blockedCategoryList.forEach(blockedCat=> {
//                 if(blockedCat.parentCategory === parentCat){
//                     setSubCategories(subcat=> ({...subcat, {subcat[parentCat]: {subcat[parentCat].map(cat=> {...cat, isBlocked: blockedCat.status}})}} }))
//             }
         
//   },[blockedCategoryList])

useEffect(() => {
    if (blockedCategoryList && blockedCategoryList.length) {
        setSubCategories((prevSubCategories) => {
            const updatedSubCategories = { ...prevSubCategories };

            Object.keys(prevSubCategories).forEach((parentCat) => {
                // Check if the parent category has blocked categories
                const blockedForParent = blockedCategoryList.filter(
                    (blockedCat) => blockedCat.parentCategory === parentCat
                );

                if (blockedForParent.length) {
                    // Map through the subcategories of the current parent
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
   const showCategories = (type)=>{
       console.log("Inside showCategories(), type--", type)
       setToggleTab({goTo: type})
       if(type == 'all'){
            dispatch(getAllCategories({}))
       }
       if(type == 'active'){
            dispatch(getCategoriesOfType({status:'active'}))
       }
       if(type == 'blocked'){
            dispatch(getCategoriesOfType({status:'blocked'}))
       }
   }

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

const tableBodyGenerator = (categories, isSubcategory, parentLevelCount)=> {
    
    return(
        <>
            {  categories &&
                categories.length > 0 ? categories.map(category =>
                 <React.Fragment key={category._id}>
                    <tr id='category-content' className='border-b border-dashed border-[#84788A85]'>
                        <td colSpan='2' className='py-[20px] pl-[1.5rem]' style={isSubcategory? {paddingLeft: `${ parentLevelCount ? (parentLevelCount * 3) : 2.5}rem`} : {}}>
                            {/* <div className='flex items-center gap-[1rem]'> */}
                                <div className='flex items-center gap-[5px] relative'>
                                    {/* ICONS WERE HERE */}
                                    {(toggleTab.goTo !== 'blocked' && toggleTab.goTo !== 'active') && category?.subCategory && category?.subCategory.length ? 
                                        <i onClick={()=> showSubcategories(category._id)} className='ml-[5px] absolute top-[8.3rem] 
                                                left-[-34px] cursor-pointer' id='open-subcategory' data-label={openSubcategories[category._id]?.['status']? 'Close Subcategories' : 'Show Subcategories'}>
                                            <MdOutlineArrowDropDownCircle/> 
                                            {/* <RiDropdownList/> */}
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
                                                        break-words px-[10px] py-[5px] rounded-[5px] mt-[15px]'>    {/*  border border-[#94a3b8]  bg-[#f5f5f5]*/}
                                                 {category.description} 
                                            </span>
                                        </div>
                                        <div className='absolute left-[10px] top-[5px] flex gap-[25px] w-full'> 
                                            <span className=' border border-[#eae0f0] px-[10px] rounded-[7px] text-[10px] tracking-[0.3px] 
                                                    text-secondary' style={!category.badge ? {display:'none'}: {}}> 
                                                {category?.badge} 
                                            </span> 
                                            <span className={`border border-[#eae0f0] px-[10px] rounded-[7px] flex items-center gap-[2px]
                                                font-[500] text-[10px] text-secondary
                                                ${(category.isBlocked || (blockedCategoryList?.length && blockedCategoryList?.find(cat=> cat.id == category._id)?.status) ) ? 'bg-red-500' : 'bg-green-500'}`}
                                                    style={!category.badge ? {marginLeft:'auto', marginRight:'20px'}: {}}>
                                                <span className='text-primary mr-[2px]'> &bull; </span> 
                                                <span className='text-[10px] text-white'> 10 Products   </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            {/* </div> */}
                        </td>
                        <td>{category.discount + '%'}</td>
                        <td className='text-green-500'>
                            {category?.relatedCategory ? category.relatedCategory.map(cat=> <span> {cat} </span>) : null}
                        </td>
                        <td className=''>
                            <span>
                                {category?.seasonalActivation && category?.seasonalActivation.startDate}
                            </span>  
                            <span>
                                {category?.seasonalActivation && category?.seasonalActivation.endDate}
                            </span>
                        </td>
                        <td>
                            {/* <div className='flex items-center gap-[10px] action-buttons'> */}
                                {/* <button type='button' onClick={() => deleteHandler(category._id)} 
                                        className='text-red-500 text-secondary text-[13px] font-[450] px-[11px]'> <MdOutlineEdit/>  <span className='text-white'> Edit </span>
                                </button>
                                <button type='button' className='basis-[103px] p-[4px] bg-white' onClick={() => toggleBlockHandler(category.id)}>
                                     {category?.isBlocked ? <CgUnblock/> : <MdBlock/>} 
                                </button> */}
                                {/* // */}
                                <div className='w-[35px] flex flex-col gap-[2rem] text-secondary'>
                                       <span data-label='Edit' className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center 
                                             relative cursor-pointer admin-control' onClick={()=> navigate('./edit', {state: {category}})}>    
                                         <i> <RiFileEditLine/> </i>
                                       </span>
                                       <span data-label='Block' className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center
                                            relative cursor-pointer admin-control'  onClick={()=> dispatch(toggleCategoryStatus(category._id))}>  
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
                ) : null
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
        <div className='h-[40px] w-[150px] bg-white border border-b-[#e5e7eb] rounded-tr-[5px] flex justify-center items-center cursor-pointer
                     absolute top-[-39px] left-[300px] tab' onClick={()=> showCategories('blocked')}
                        style={toggleTab.goTo == 'blocked'? {borderBottomColor:'transparent'}:{}}>
            <h4 className={toggleTab.goTo == 'blocked' ? 'opacity-[1]' : 'opacity-[0.75]'}> Blocked </h4>
        </div>
        <div className='border py-[1rem] px-[2rem] bg-white container'>
        <SearchInput/>

        <table cellSpacing={10} cellPadding={6} className='border-spacing-[24px] w-full mt-[2rem]'>
        <thead>
            <tr className='secondaryLight-box border border-[rgb(220, 230, 166)] font-[500] text-secondary table-header'>
                <td colSpan='2'>
                    <div className='flex items-center'>
                        <span className='table-label'>Category</span>
                        <i className='flex flex-col gap-[2px] h-[5px]'>
                            <FaSortUp  onClick = {(e)=>{ sortHandler(e,"categoryName",1)}} 
                                    style={{height: activeSorter.field === "categoryName" && activeSorter.order === 1 ?'15px':'10px',
                                                color: activeSorter.field === "categoryName" && activeSorter.order === 1 ? 
                                                            'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                            <FaSortDown onClick = {(e)=>sortHandler(e,"categoryName",-1)} 
                                style={{height: activeSorter.field === "categoryName" && activeSorter.order === -1 ?'15px':'10px',
                                            color: activeSorter.field === "categoryName" && activeSorter.order === -1 ? 
                                            'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)' }}/>
                        </i>
                    </div> 
                </td>
                <td>
                    <div className='flex items-center'>
                        <span className='table-label'>Discount</span>
                        <i className='flex flex-col h-[5px]'>
                            <FaSortUp onClick = {(e)=>sortHandler(e,"categoryBadge",1)}
                                style={{height: activeSorter.field === "categoryBadge" && activeSorter.order === 1 ?'15px':'10px',
                                            color: activeSorter.field === "categoryBadge" && activeSorter.order === 1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                            <FaSortDown onClick = {(e)=>sortHandler(e,"categoryBadge",-1)}
                                style={{height: activeSorter.field === "categoryBadge" && activeSorter.order === -1 ?'15px':'10px',
                                             color: activeSorter.field === "categoryBadge" && activeSorter.order === -1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                        </i>
                    </div>
                </td>
                <td>
                    <div className='flex items-center'>
                        <span className='table-label'>Related category</span>
                        {/* <i className='flex flex-col h-[5px]'>
                            <FaSortUp onClick = {(e)=>sortHandler(e,"categoryDiscount",1)}
                                style={{height: activeSorter.field === "categoryDiscount" && activeSorter.order === 1 ?'15px':'10px',
                                            color: activeSorter.field === "categoryDiscount" && activeSorter.order === 1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                            <FaSortDown onClick = {(e)=>sortHandler(e,"categoryDiscount",-1)}
                                style={{height: activeSorter.field === "categoryDiscount" && activeSorter.order === -1 ?'15px':'10px',
                                             color: activeSorter.field === "categoryDiscount" && activeSorter.order === -1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                        </i> */}
                    </div>
                </td>
                <td>
                    <div className='flex items-center'>
                        <span className='table-label'>Seasonal Activation</span>
                        <i className='flex flex-col h-[5px]'>
                            <FaSortUp onClick = {(e)=>sortHandler(e,"relatedCategory",1)  }
                                style={{height: activeSorter.field === "relatedCategory" && activeSorter.order === 1 ?'15px':'10px',
                                            color: activeSorter.field === "relatedCategory" && activeSorter.order === 1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                            <FaSortDown onClick = {(e)=>sortHandler(e,"relatedCategory",-1)}
                                style={{height: activeSorter.field === "relatedCategory" && activeSorter.order === -1 ?'15px':'10px',
                                             color: activeSorter.field === "relatedCategory" && activeSorter.order === -1 ? 
                                                'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                        </i>
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