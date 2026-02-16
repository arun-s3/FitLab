import React, {useState, useEffect} from 'react'
import './CategoryDisplay.css'
import {useSelector, useDispatch} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {motion, AnimatePresence} from "framer-motion"

import {toast as sonnerToast} from 'sonner'

import {MdOutlineArrowDropDownCircle} from 'react-icons/md'
import {GoPlus} from "react-icons/go"

import {getAllCategories, getSingleCategory, resetSubcategories} from '../../Slices/categorySlice'


export default function CategoryDisplay({type, filter, setFilter, categoryType, radioCheckedCategory, setRadioCheckedCategory, manualCheckCategory, 
                      setManualCheckCategory, setRelatedCategoryError, storeCheckedCategories, styler}) {
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
    if(!storeCheckedCategories){
      const topLevelCategories = categories.map(cat=> cat.name)
      const mainCategories = categoryArray.filter(cat => topLevelCategories.includes(cat));
      const subCategories = categoryArray.filter(cat => !topLevelCategories.includes(cat));
      filter && setFilter({...filter, categories: [...mainCategories], subCategories: subCategories.toString()})
    }
  },[checkedCategories])

  const closeNestedSubcategories = (id) => {
    if (subCategories[id]) {
      subCategories[id].forEach((subCategory) => {
        setOpenSubcategories((prevOpenSubcategories) => ( {...prevOpenSubcategories, [subCategory._id]: { ...openSubcategories[subCategory._id], status: false } }));
        closeNestedSubcategories(subCategory._id);
      })
    }
  }

  const showSubcategories = (id, name) => {
    dispatch(getSingleCategory({ id }));
    const isOpening = !openSubcategories[id]?.status;
    if (!isOpening) closeNestedSubcategories(id);

    setOpenSubcategories((prevOpenSubcategories) => ({...prevOpenSubcategories, [id]: {
        status: isOpening,
        checked: openSubcategories?.[id]?.checked ? openSubcategories?.[id]?.checked : false,
        parentLevelCount: prevOpenSubcategories[id]?.parentLevelCount || 1,
      },
    }))
  }

const checkNestedSubcategories = async (id, isChecked) => {
  if (subCategories[id]) {
    for (const subCategory of subCategories[id]) {
      setOpenSubcategories((prevOpenSubcategories) => ({
        ...prevOpenSubcategories,
        [subCategory._id]: {
          ...prevOpenSubcategories[subCategory._id],
          checked: isChecked,
          status: prevOpenSubcategories[subCategory._id]?.status || false,
        },
      }))

      try {
        const result = await dispatch(getSingleCategory({ id: subCategory._id }));
        unwrapResult(result);  
        await checkNestedSubcategories(subCategory._id, isChecked);  
      }
      catch (error) {
        sonnerToast.error("Internal server error")
      }
    }
  }
}

  const checkboxHandler = async (e, catId, subCategory) => {
    const categoryId = e ? e.target.id : catId;
    const isChecked = e ? e.target.checked: true;
  
    setOpenSubcategories((prevOpenSubcategories) => ({
      ...prevOpenSubcategories,
      [catId]: {
        ...prevOpenSubcategories[catId],
        checked: isChecked,
      },
    })); 
  
    if (subCategory.length > 0) {
      if (subCategories[catId]) {
        await checkNestedSubcategories(catId, isChecked);
      } else {
        setLoadingSubCategories(true)
        try{
          const result = await dispatch(getSingleCategory({ id: catId }))
          unwrapResult(result)
          setLoadingSubCategories(false)
        }
        catch (error) {
          setLoadingSubCategories(false)
        }
      }
    }
  
    setCheckedCategories((prevCategories) => {
      const updatedCategories = prevCategories.filter((cat) => cat.name !== categoryId);
      return isChecked ? [...updatedCategories, { name: categoryId, status: true }] : updatedCategories;
    });
  }

  useEffect(()=> {
    async function checkRequestedCategory(){
      if(categoryType){
        await checkboxHandler(null, categoryType.id, categoryType.subCategory)
      }
    }
    checkRequestedCategory()
  }, [categoryType])

  const radioClickHandler = (name)=>{
    const checkStatus = radioCheckedCategory === name
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

  const manualCheckboxHandler = (e, name)=> {
    const status = e.target.checked;
    const manualCheckCategoryCurrentLength = Object.keys(manualCheckCategory).filter(cat=> manualCheckCategory[cat] === true).length
    if (manualCheckCategoryCurrentLength > 2) setRelatedCategoryError("Can set only 3 categories as related category at the maximum!")
    if(status && manualCheckCategoryCurrentLength < 3){
      setManualCheckCategory(prevObj=> {
        return {...prevObj, [name]:true}
      })
    }else{
      setManualCheckCategory(prevObj=> {
        return {...prevObj, [name]:false}
      })
    }
  }

  const CategoryListGenerator = (categories, isSubcategory, parentLevelCount) => (
    <>
      {categories && categories.length > 0 && categories.map((category, index) => {
        if(!category.isBlocked && category.isActive){ 
          const isSubcategoryOpen = openSubcategories[category._id]?.status;
          const subCategoryPadding = isSubcategory ? { paddingLeft: `${parentLevelCount * 10}px` } : {};

          return (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
            >
              <ul
                id="category-content"
                className={`${
                  !category.parentCategory &&
                  index !== categories.length - 1 &&
                  !styler?.["borderBottomNone"] &&
                  "border-b border-dotted border-[#C9CBCE] border-primary"
                }`}
              >
                <li className="py-[5px]" style={subCategoryPadding}>
                  <div
                    className={`flex items-center justify-between ${
                      category.parentCategory && "pr-[7px]"
                    } ${(type == "radioType" || type == "manualCheckboxType") && "justify-start gap-[3rem]"}`}
                  >
                    <div
                      className={`flex items-center category-name ${
                        (type == "radioType" || type == "manualCheckboxType") && "gap-[5px]"
                      }`}
                    >
                      {type == "checkboxType" ? (
                        <input
                          type="checkbox"
                          id={category.name}
                          key={`${category._id}-${openSubcategories[category._id]?.checked}`}
                          onChange={(e) => checkboxHandler(e, category._id, category.subCategory)}
                          checked={
                            openSubcategories?.[category._id]?.["checked"] ||
                            checkedCategories.some((cat) => cat.name === category.name)?.["checked"] ||
                            openSubcategories?.[category.parentCategory]?.["checked"]
                          }
                          className={`h-[13px] w-[13px] rounded-[3px] border-primary`}
                        />
                      ) : type == "manualCheckboxType" ? (
                        <input
                          type="checkbox"
                          id={category.name}
                          onChange={(e) => manualCheckboxHandler(e, category.name)}
                          key={`${category._id}-${manualCheckCategory?.[category.name]}`}
                          checked={manualCheckCategory?.[category.name]}
                        />
                      ) : (
                        <input
                          type="radio"
                          id="radioType-input"
                          onClick={() => radioClickHandler(category.name)}
                          onChange={() => radioChangeHandler(category.name)}
                          checked={radioCheckedCategory === category.name}
                        />
                      )}

                      <span
                        className={`capitalize text-[#505050] cursor-pointer ${
                          !category.parentCategory ? "text-[14px]" : "text-[12.5px]"
                        }`}
                      >
                        {category.name}
                      </span>
                    </div>

                    <div className="flex">
                      {type == "checkboxType" && category?.badge && (
                        <span className="border border-[#eae0f0] px-[10px] rounded-[7px] text-[10px] tracking-[0.3px] text-[#07bc0c]">
                          {category.badge}
                        </span>
                      )}
                      {category?.subCategory && category?.subCategory.length ? (
                        <i
                          className="ml-[5px] cursor-pointer text-secondary"
                          onClick={() => showSubcategories(category._id, category.name)}
                          data-label={isSubcategoryOpen ? "Close Subcategories" : "Show Subcategories"}
                        >
                          {type == "checkboxType" ? <MdOutlineArrowDropDownCircle /> : <GoPlus />}
                        </i>
                      ) : null}
                    </div>
                  </div>
                </li>
              </ul>

              <AnimatePresence>
                {isSubcategoryOpen && subCategories && Object.keys(subCategories).length > 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {CategoryListGenerator(
                      subCategories[category._id],
                      true,
                      openSubcategories[category._id]?.parentLevelCount
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        }
      })}
    </>
  )

  return (
    <main id="categoryDisplay" className="w-full">

      {CategoryListGenerator(categories)}

    </main>
  )

}
