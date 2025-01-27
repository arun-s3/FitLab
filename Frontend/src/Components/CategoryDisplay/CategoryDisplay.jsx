import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {unwrapResult} from '@reduxjs/toolkit';
import {getAllCategories, getSingleCategory, resetSubcategories} from '../../Slices/categorySlice';
import './CategoryDisplay.css';
import {MdOutlineArrowDropDownCircle} from 'react-icons/md';
import {GoPlus} from "react-icons/go";

export default function CategoryDisplay({type, filter, setFilter, radioCheckedCategory, setRadioCheckedCategory, manualCheckCategory, 
                      setManualCheckCategory, setRelatedCategoryError, styler}) {
  const [subCategories, setSubCategories] = useState({});
  const [openSubcategories, setOpenSubcategories] = useState({});

  const [checkedCategories, setCheckedCategories] = useState([])

  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  const dispatch = useDispatch();
  const {categories, populatedSubCategories} = useSelector((state) => state.categoryStore);

  useEffect(() => {
    const fetchCategories = async () => {
      await dispatch(getAllCategories())
      dispatch(resetSubcategories())
    }
    fetchCategories();
  }, [dispatch]);


  useEffect(() => {
    if (populatedSubCategories && !loadingSubCategories) {
      setSubCategories((prevSubCategories) => ({
        ...prevSubCategories,
        [populatedSubCategories.parentId]: populatedSubCategories.subCategories,
      }));
      setOpenSubcategories((prevOpenSubcategories) => ({
        ...prevOpenSubcategories,
        [populatedSubCategories.parentId]: {
          ...prevOpenSubcategories[populatedSubCategories.parentId],
          parentLevelCount: populatedSubCategories.parentLevelCount,
        },
      }));
      checkNestedSubcategories(populatedSubCategories.parentId, true); 
    }
  }, [populatedSubCategories, loadingSubCategories]);
  

  useEffect(()=>{
    const categoryArray = checkedCategories.map(category=> category.name)
    filter && setFilter({...filter, categories: [...categoryArray]})
    console.log("checkedCategories", JSON.stringify(checkedCategories))
  },[checkedCategories])
  // useEffect(()=>{
  //   filter && setFilter({...filter, categories: [...checkedCategories]})
  //   console.log("checkedCategories", JSON.stringify(checkedCategories))
  // },[checkedCategories])

  useEffect(()=>{
    console.log("openSubcategories--->", JSON.stringify(openSubcategories))
  },[filter,openSubcategories])
 
  useEffect(()=>{
    console.log("SUBCATEGORIES--->", JSON.stringify(subCategories))
  },[subCategories])

  const closeNestedSubcategories = (id) => {
    if (subCategories[id]) {
      subCategories[id].forEach((subCategory) => {
        setOpenSubcategories((prevOpenSubcategories) => ( {...prevOpenSubcategories, [subCategory._id]: { ...openSubcategories[subCategory._id], status: false } }));
        closeNestedSubcategories(subCategory._id);
      });
    }
  };

  const showSubcategories = (id, name) => {
    dispatch(getSingleCategory({ id }));
    const isOpening = !openSubcategories[id]?.status;
    if (!isOpening) closeNestedSubcategories(id);

    setOpenSubcategories((prevOpenSubcategories) => ({...prevOpenSubcategories, [id]: {
        status: isOpening,
        checked: openSubcategories?.[id]?.checked ? openSubcategories?.[id]?.checked : false,
        parentLevelCount: prevOpenSubcategories[id]?.parentLevelCount || 1,
      },
    }));
  };

const checkNestedSubcategories = async (id, isChecked) => {
  if (subCategories[id]) {
    for (const subCategory of subCategories[id]) {
      console.log("Setting openSubCAtegories for-->",subCategory.name)
      setOpenSubcategories((prevOpenSubcategories) => ({
        ...prevOpenSubcategories,
        [subCategory._id]: {
          ...prevOpenSubcategories[subCategory._id],
          checked: isChecked,
          status: prevOpenSubcategories[subCategory._id]?.status || false,
        },
      }));

      try {
        console.log("Dispatching category inside checkNestedSubcategories-->",subCategory.name)
        const result = await dispatch(getSingleCategory({ id: subCategory._id }));
        unwrapResult(result);  
        console.log("Dispatched category inside checkNestedSubcategories-->",subCategory.name)
        console.log("Going to checkNestedSubcategories from checkNestedSubcategories--")
        await checkNestedSubcategories(subCategory._id, isChecked);  
      } catch (error) {
        console.error("Error fetching subcategory inside checkNestedSubcategories--", error);
      }
    }
  }else{
    console.log(`NO such subCategories[id] of ${id} available`)
  }
};

  const checkboxHandler = async (e, catId, subCategory) => {
    const categoryId = e.target.id;
    const isChecked = e.target.checked;
  
    setOpenSubcategories((prevOpenSubcategories) => ({
      ...prevOpenSubcategories,
      [catId]: {
        ...prevOpenSubcategories[catId],
        checked: isChecked,
      },
    })); 
  
    if (subCategory.length > 0) {
      if (subCategories[catId]) {
        console.log("Inside if subCategories[catId]",)
        await checkNestedSubcategories(catId, isChecked);
      } else {
        console.log("Inside else subCategories[catId]")
        setLoadingSubCategories(true)
        try{
          console.log("Dispatching category inside checkboxHandler-->",categoryId)
          const result = await dispatch(getSingleCategory({ id: catId }))
          console.log(`Dispatched category inside checkboxHandler-->name-${categoryId}, id-${catId}`)
          unwrapResult(result)
          console.log("Going to checkNestedSubcategories from checkboxHandler--")
          setLoadingSubCategories(false)
        }
        catch (error) {
          console.error("Error fetching subcategory inside checkboxHandler--", error);
          setLoadingSubCategories(false)
        }
      }
    }
  
    setCheckedCategories((prevCategories) => {
      const updatedCategories = prevCategories.filter((cat) => cat.name !== categoryId);
      return isChecked ? [...updatedCategories, { name: categoryId, status: true }] : updatedCategories;
    });
  };

  const radioClickHandler = (name)=>{
    const checkStatus = radioCheckedCategory === name
    console.log("checkStatus-->", checkStatus)
    if(checkStatus){
        setRadioCheckedCategory('')
        return
    }else{
        setRadioCheckedCategory(name)
        const changeEvent = new Event('change', {bubbles:true})
        e.target.dispatchEvent(changeEvent)
    }
}

  const radioChangeHandler = (e, name)=>{
    e.target.checked = (radioCheckedCategory === name)
}
  
  // const manualCheckboxHandler = (e, name)=> {
  //   console.log('e.target.checked---->',e.target.checked)
  //   const status = e.target.checked
  //    setManualCheckCategory(manualCheckCategory=> {
  //     const key = manualCheckCategory?.find(catObj=> Object.keys(catObj)[0] === name)
  //     return [...manualCheckCategory, {...key, [name]: status}]
  //    })
  // }
//   const manualCheckboxHandler = (e, name) => {
//     console.log('e.target.checked ---->', e.target.checked);
//     const status = e.target.checked;

//     setManualCheckCategory((prevState) => {
//         // Check if the category already exists in the array
//         const existingIndex = prevState.findIndex((item) => item.name === name);

//         if (existingIndex !== -1) {
//             // Update the existing category's status
//             const updatedCategory = { ...prevState[existingIndex], checked: status };
//             return [
//                 ...prevState.slice(0, existingIndex),
//                 updatedCategory,
//                 ...prevState.slice(existingIndex + 1),
//             ];
//         } else {
//             // Add a new category to the array
//             return [...prevState, { name, checked: status }];
//         }
//     });
// };

  const manualCheckboxHandler = (e, name)=> {
    console.log('e.target.checked ---->', e.target.checked);
    const status = e.target.checked;
    const manualCheckCategoryCurrentLength = Object.keys(manualCheckCategory).filter(cat=> manualCheckCategory[cat] === true).length
    console.log("manualCheckCategoryCurrentLength--->", manualCheckCategoryCurrentLength)
    if (manualCheckCategoryCurrentLength > 2) setRelatedCategoryError("Can set only 3 categories as related category at the maximum!")
    if(status && manualCheckCategoryCurrentLength < 3){
      setManualCheckCategory(prevObj=> {
        return {...prevObj, [name]:true}
      })
    }else{
      console.log("manualCheckCategory---->", JSON.stringify(manualCheckCategory))
      setManualCheckCategory(prevObj=> {
        return {...prevObj, [name]:false}
      })
    }
  }

  
  const CategoryListGenerator = (categories, isSubcategory, parentLevelCount) => (
    <>
      {categories && categories.length > 0 && categories.map((category, index) => {
        const isSubcategoryOpen = openSubcategories[category._id]?.status;
        const subCategoryPadding = isSubcategory ? { paddingLeft: `${parentLevelCount * 10}px` } : {};

        return (
          <div key={category._id}>
            <ul id='category-content' className={` ${!category.parentCategory && (index!==categories.length-1) && !styler?.['borderBottomNone'] && 'border-b border-dotted border-[#C9CBCE] border-primary'}`}>
              <li className='py-[5px]' style={subCategoryPadding}>
                <div className={`flex items-center justify-between ${category.parentCategory && 'pr-[7px]'}
                           ${(type == 'radioType' || type == 'manualCheckboxType') && 'justify-start gap-[3rem]'}`}>
                  <div className={`flex items-center category-name ${(type == 'radioType' || type == 'manualCheckboxType')  && 'gap-[5px]'}`}> 
                    {
                      type == 'checkboxType'?
                        <input type='checkbox' id={category.name} key={`${category._id}-${openSubcategories[category._id]?.checked}`}
                          onChange={(e)=>checkboxHandler(e, category._id, category.subCategory)} 
                          checked={ openSubcategories?.[category._id]?.['checked'] || checkedCategories.some(cat=> cat.name===category.name)?.['checked'] || openSubcategories?.[category.parentCategory]?.['checked'] }
                          className={`${!category.parentCategory ? 'hidden' : 'inline-block'} h-[13px] w-[13px] rounded-[3px] border-primary`}/>
                        : type == 'manualCheckboxType'?
                            <input type='checkbox' id={category.name} onChange={(e)=> manualCheckboxHandler(e, category.name)} key={`${category._id}-${manualCheckCategory?.[category.name]}`}
                                checked={manualCheckCategory?.[category.name]} />                     
                        :
                          <input type='radio' id='radioType-input' onClick={()=> radioClickHandler(category.name)} 
                              onChange={()=> radioChangeHandler(category.name)} checked={radioCheckedCategory === category.name}/>
                    }
                    <span className={`capitalize text-[#505050] cursor-pointer ${!category.parentCategory ? 'text-[14px]':'text-[12.5px]'}`}> 
                      {category.name}
                    </span>
                  </div>
                  <div className='flex'>
                    { type == 'checkboxType' && category?.badge && (
                      <span className='border border-[#eae0f0] px-[10px] rounded-[7px] text-[10px] tracking-[0.3px] text-[#07bc0c]'>
                        {category.badge}
                      </span>
                    )}
                    {category?.subCategory && category?.subCategory.length ? 
                      ( <i className='ml-[5px] cursor-pointer text-secondary' onClick={() => showSubcategories(category._id, category.name)}
                             data-label={isSubcategoryOpen ? 'Close Subcategories' : 'Show Subcategories'} >
                        { (type == 'checkboxType')? <MdOutlineArrowDropDownCircle /> : <GoPlus/>}
                      </i>
                    ) : null}
                  </div>
                </div>
              </li>
            </ul>
            {isSubcategoryOpen && subCategories && Object.keys(subCategories).length > 1 &&
              CategoryListGenerator( subCategories[category._id], true, openSubcategories[category._id]?.parentLevelCount )}
          </div>
        );
      })}
    </>
  );

  return (
          <main id='categoryDisplay' className='w-full'>
            {
              CategoryListGenerator(categories)
            }
          </main>
  )
}

