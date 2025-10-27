import React,{useEffect, useState, useRef} from 'react'
import './SelectCategoryForAdmin.css'
import {useSelector, useDispatch} from 'react-redux'
import {getAllCategories, getSingleCategory, getCategoriesOfType, getFirstLevelCategories, resetSubcategories} from '../../Slices/categorySlice'
import {convertToCamelCase, camelToCapitalizedWords} from '../../Utils/helperFunctions'

export default function SelectCategoryForAdmin({category, setCategory, editCategory}){

    const [categoryStatus, setCategoryStatus] = useState({strength:false, cardio:false, supplements:false, accessories:false})

    const {categories} = useSelector(state=> state.categoryStore)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getAllCategories())
        dispatch(resetSubcategories())
    },[])

    useEffect(()=>{
        console.log("Categories-->", JSON.stringify(categories))
    },[categories])

    useEffect(() => {
        if (editCategory) {
            const updatedStatus = { ...categoryStatus };
            editCategory.forEach(category => {
                if (Object.keys(categoryStatus).includes(category)) {
                    updatedStatus[category] = true;
                }
            });
            setCategoryStatus(updatedStatus);
        }
        console.log("editCategory-->",JSON.stringify(editCategory))
    }, [editCategory])

    // useEffect(() => {
    //     editCategory.forEach(category => {
    //         if (Object.keys(categoryStatus.current).includes(category)) {
    //             categoryStatus.current[category] = true;
    //         }
    //     });
    //     Object.keys(categoryStatus.current).forEach(categoryKey => {
    //         if (categoryStatus.current[categoryKey]) {
    //             categoryStatus.current[categoryKey].checked = true;
    //         }
    //     });
    // }, [editCategory]);
    

    const categorySelectHandler = (e) => {
        if (e.target.checked) {
            console.log("Checkbox checked!");     
            if (e.target.value === 'supplements') {
                if (category.length > 0) {
                    console.log("Cannot select supplements along with other categories")
                    e.target.checked = false
                    return;
                } 
                setCategory([e.target.value])
            } 
            else {
                if (category.includes('supplements')) {
                    console.log("Cannot select other categories when supplements is selected")
                    e.target.checked = false
                    return
                }
                if (category.length >= 2) {
                    console.log("Cannot select more than 2 categories")
                    e.target.checked = false
                    return
                }
                setCategory([...category, e.target.value])
            }
        } 
        else {
            console.log("Checkbox unchecked!");
            setCategory(category.filter(item => item !== e.target.value));
        }
    }

    return(

        <>
            <h4 className='text-[11.6px] text-secondary'> Select category / categories </h4> 
            <h5 className='text-[10px] text-muted'> Choose up to two categories. The 'supplements' category must be selected alone </h5>
            <div className='flex justify-between items-center mt-[10px] text-black' onBlur={()=> categoryBlurHandler()}>
                {
                 categories && categories.length > 0 &&
                 categories.map((category) => (
                    <div key={category.name}>
                        <label htmlFor={category.name}> {category.name[0].toUpperCase() + category.name.slice(1)} </label>
                        <input type='checkbox' id={category.name} value={category.name} checked={editCategory && categoryStatus[category.name]}
                            onChange={(e) => categorySelectHandler(e)} />
                    </div>
                 ))
                }
            </div>
        </>
    )
}

export function SelectSubCategoryForAdmin({category, setCategory, setSubCategory, categoryImgPreview, setCategoryImgPreview}){

    const [error, setError] = useState('')
    const [levelOneCategories, setLevelOneCategories] = useState([])

    const [nestedSubcategories, setNestedSubcategories] = useState([])
    const [checkNestedSubcategories, setCheckNestedSubcategories] = useState({})

    const [checkedCategories, setCheckedCategories] = useState({});

    const [subcategoryLabel, setsubcategoryLabel] = useState('')

    const [defaultDisabled, setDefaultDisabled] = useState(true)

    const {categories, populatedSubCategories, firstLevelCategories} = useSelector(state=> state.categoryStore)
    const dispatch = useDispatch()

    const categoryRefs = useRef({})

    useEffect(()=>{
        dispatch(getFirstLevelCategories())
        dispatch(resetSubcategories())
        if(nestedSubcategories) setNestedSubcategories([])
    },[])

    useEffect(()=>{
        console.log("category.length------>", category.length)
        if(category.length == 0){
            setDefaultDisabled(true)
            setCheckedCategories({})
            setNestedSubcategories([])
            setCheckNestedSubcategories({})
        }else{
            setDefaultDisabled(false)
        }
    },[category])

    useEffect(()=>{
        console.log("defaultDisabled---->", defaultDisabled)
    },[defaultDisabled])

    useEffect(() => {
        console.log("firstLevelCategories from SelectSubCategoryForAdmin --->", JSON.stringify(firstLevelCategories))
        if (firstLevelCategories && firstLevelCategories.length) {
            firstLevelCategories.forEach(category => {
                if (!categoryRefs.current[category.name]) {
                    categoryRefs.current[category.name] = React.createRef();
                }
            })
            Object.values(categoryRefs.current).forEach(refs => {
                if (refs?.current) {
                    console.log("category-->",category)
                    const isActive = category.some(cat => refs.current.id.includes(cat));
                    console.log(`isActive is ${isActive} for ${refs.current.id}`)
                    if (!isActive) {
                        refs.current.style.color = '#919191';
                        refs.current.previousElementSibling.style.color = '#919191';
                        refs.current.inactivate = true;
                        setCheckedCategories(prev => ({
                            ...prev,
                            [refs.current.id]: false,
                        }));
                    } else {
                        refs.current.style.color = 'initial';
                        refs.current.previousElementSibling.style.color = '#757575';
                        refs.current.inactivate = false;
                    }
                }
            });
        } else if (!firstLevelCategories.length) {
            Object.values(categoryRefs.current).forEach(ref => {
                if (ref?.current) {
                    ref.current.style.color = '#757575';
                    ref.current.previousElementSibling.style.color = '#757575';
                    ref.current.inactivate = true;
                    console.log("Activated: ", ref.current.id)
                }
            });
        }
    }, [category]);

    useEffect(() => {
        console.log("checkedCategories-->", JSON.stringify(checkedCategories))
        const subcategory = Object.values(checkedCategories)
            .map(categoryValue => {
                if (typeof categoryValue === 'object') {
                    const subcategoryKey = Object.keys(categoryValue)[0];
                    return subcategoryKey;
                }
                return null;
            })
            .filter(Boolean);

        setSubCategory(subcategory.find(value => value));
        makeSubCategoryLabel(checkedCategories)
    }, [checkedCategories]);

    useEffect(()=> {
        if(populatedSubCategories && populatedSubCategories.parentName && category.length > 0 && Object.keys(checkedCategories).length > 0){
            console.log("populatedSubCategories from useEffect of SelectCategoryForAdmin-->", JSON.stringify(populatedSubCategories))
            console.log("populatedSubCategories from useEffect of SelectCategoryForAdmin-->", JSON.stringify(populatedSubCategories.subcategories))
            setNestedSubcategories([{parentName: [populatedSubCategories['parentName']], subcategories: populatedSubCategories.subCategories}])
        }
    },[populatedSubCategories])

    useEffect(()=>{
        if(checkNestedSubcategories){
            console.log("---checkNestedSubcategories------>", JSON.stringify(checkNestedSubcategories))
            const nestedSubCat = Object.values(checkNestedSubcategories).find(cat=> typeof cat == 'object')
            if(nestedSubCat){
                console.log("Object.values(nestedSubCat)[0]-->",Object.values(nestedSubCat)[0])
                if( !Object.keys(nestedSubCat).find(key=> key==='subCategory') && Object.values(nestedSubCat)[0] === true ){
                    makeSubCategoryLabel(checkNestedSubcategories)
                }
            }
        }
    },[checkNestedSubcategories])

    useEffect(()=>{
        if(error){
            setTimeout(()=>{
                setError('')
            },2500)
        }
    },[error])

    const radioClickHandler = (e)=>{
        const checkStatus = checkedCategories?.[e.target.parentElement.parentElement.id]?.[e.target.id]
        console.log("checkStatus-->", checkStatus)
        if(checkStatus){
            console.log("Inisde if checkStatus")
            setCheckedCategories({ ...checkedCategories, [e.target.parentElement.parentElement.id]: false})
            setNestedSubcategories([])
            setCheckNestedSubcategories({})
            setCategoryImgPreview('')
            return
        }else{
            const changeEvent = new Event('change', {bubbles:true})
            e.target.dispatchEvent(changeEvent)
        }
    }

    const radioChangeHandler = (e, subcat)=>{
        console.log("Object.values(checkedCategories)-->",Object.values(checkedCategories))
        if(!Object.values(checkedCategories).every(status=> status === false)){
            e.target.checked = false
            setError('Cannot select more than 1 subcategory!')
            console.log("Cannot select more than 1 subcategory!")
            return
        }else{
            if(subcat.subCategory){
                dispatch(getSingleCategory({id: subcat._id}))
            }
            setCheckedCategories({ ...checkedCategories, [e.target.parentElement.parentElement.id]: {...checkedCategories[e.target.parentElement.parentElement.id], [e.target.id]: e.target.checked} })
            setCategoryImgPreview(subcat.image.url)
        }
    }

    const nestedRadioClickHandler = (e, cat, subcat)=>{
        console.log("cat---->", subcat.parentCategory)
        const checkStatus = checkNestedSubcategories?.[subcat.parentCategory]?.[subcat.name]
        console.log("checkStatus-->", checkStatus)
        if(checkStatus){
            console.log("Inisde if checkStatus")
            setCheckNestedSubcategories({...checkNestedSubcategories, [subcat.parentCategory]: {[subcat.name]: false, } })
            return
        }else{
            const changeEvent = new Event('change', {bubbles:true})
            e.target.dispatchEvent(changeEvent)
        }
    }

    const nestedRadioChangeHandler = (e, cat, subcat)=> {
        if( Object.keys(checkNestedSubcategories).find(nestedParentCat=> nestedParentCat === cat.name) ){
            e.target.checked = false
            setError('Cannot select more than 1 subcategory!')
            console.log("Cannot select more than 1 subcategory!")
            return
        }else{
            if(subcat?.subCategory.length > 0){
                console.log("subcat has subCategory")
                dispatch(getSingleCategory({id: subcat._id}))
                setCheckNestedSubcategories({...checkNestedSubcategories, [subcat.parentCategory]: {[subcat.name]: true} })
            }else{
                setCheckNestedSubcategories({...checkNestedSubcategories, [subcat.parentCategory]: {[subcat.name]: true, subCategory: false} })
            }            
            setCategoryImgPreview(subcat.image.url)
            console.log("subcat.subCategory.length--->", subcat.subCategory.length)
        }
        if(subcat.subCategory.length == 0){
            console.log("Setting subcategory...")
            setSubCategory(subcat.name)
        }
    }

    const subCategoryBlockClickHandler = ()=>{
        if(!category.length){
            setError('Please choose a category first!')
        }
        console.log("defaultDisabled-->", defaultDisabled)
    }

    const makeSubCategoryLabel = (subcategoryObj)=> {
        let label;
        const labeObj = Object.values(subcategoryObj).find(cat=> typeof cat == 'object')
        if(labeObj){
            label = camelToCapitalizedWords( Object.keys(labeObj)[0] )
        }
        console.log("SubCategoryLabel---->", label)
        setsubcategoryLabel(label)
    }

    return(
        <main id='SelectSubCategoryForAdmin' className={` ${categoryImgPreview && 'before:content-[""]' } relative z-[10] `} 
                    onClick={()=> subCategoryBlockClickHandler()}>
            <h4 className={`text-[11.6px] text-secondary ${categoryImgPreview && 'mt-[5px]'}`}> Select a subcategory</h4> 
            <div className='flex justify-between items-start mt-[8px] subcategory-body'>
                {firstLevelCategories &&
                    firstLevelCategories.map(category => (
                        <div key={category._id}>
                            <h5 className='capitalize'>{category.name}</h5>
                            <ul className="list-none" id={`${category.name}List`} ref={categoryRefs.current[category.name]}>
                                {category.subCategory &&
                                    category.subCategory.map(subcat => (
                                        <li key={subcat._id} onClick={()=> subCategoryBlockClickHandler()}>
                                            <label htmlFor={subcat.name} className={`capitalize ${defaultDisabled ? 'disabled-label' : ''}`}>
                                                {subcat.name}
                                            </label>
                                            <input type="radio" value={subcat.name} id={subcat.name} 
                                                    disabled={categoryRefs.current[category.name]?.current?.inactivate || defaultDisabled}
                                                    checked={checkedCategories[`${category.name}List`]?.[`${subcat.name}`] || false}
                                                    style={categoryRefs.current[category.name]?.current?.inactivate ? {color: '#919191'}: {color: 'rgba(215, 241, 72, 1)'}}
                                                        onChange={(e)=> radioChangeHandler(e, subcat)} onClick={(e)=> radioClickHandler(e)} 
                                                            onMouseOver={()=> subCategoryBlockClickHandler()}/>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
            </div>
            <div className='mt-[15px]'>
                {
                    nestedSubcategories && ( Array.isArray(nestedSubcategories) && nestedSubcategories.some(cat=> cat?.subcategories?.length > 0) )&&
                    nestedSubcategories.map(cat=> (
                        <div key={cat.parentName}>
                            <h4 className='text-[10px] text-secondary pl-[1px] pb-[7px] tracking-[0.3px] border-b border-dashed border-[#f1c40f]'> 
                                Choose a subcategory {subcategoryLabel && 'for'}
                                <span className='capitalize font-[550] tracking-[0.6px] text-[#f1c40f] ml-[3px]'> 
                                    {subcategoryLabel && `${subcategoryLabel}`}
                                </span>
                            </h4>
                            <ul className='mt-[10px] flex items-center gap-[1rem] list-none' id={cat.parentName}>                              
                                {
                                    cat.subcategories && cat.subcategories.length > 0 &&
                                    cat.subcategories.map(subcat=> (
                                        <li  key={subcat._id} className='list-none flex items-center gap-[5px]'>
                                            <input type='radio' id={subcat.name} style={{height:'15px', width:'15px', borderColor:'#f1c40f'}}
                                                onChange={(e)=> nestedRadioChangeHandler(e, cat, subcat)} onClick={(e)=> nestedRadioClickHandler(e, cat, subcat)}
                                                    checked={ checkNestedSubcategories[subcat.parentCategory]?.[subcat.name] || false} />
                                            <label htmlFor={subcat.name} className='capitalize tracking-[0.5px]' style={{wordSpacing:'1px'}}> 
                                                {subcat.name} 
                                            </label>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </div>
            <p className={`h-[15px] w-full text-[11px] text-red-500 tracking-[0.1px] mt-[5px] ${categoryImgPreview && 'mb-[1rem] ml-[5px]'} `}> 
                {error} 
            </p>
        </main>
    )
}