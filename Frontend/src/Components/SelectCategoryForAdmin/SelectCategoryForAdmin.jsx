import React,{useEffect, useState, useRef} from 'react'
import './SelectCategoryForAdmin.css'

export default function SelectCategoryForAdmin({category, setCategory, editCategory}){

    const [categoryStatus, setCategoryStatus] = useState({strength:false, cardio:false, supplements:false, accessories:false})

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
    }, [editCategory]);

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

    const categoryBlurHandler = ()=>{
        
    }

    return(

        <>
            <h4 className='text-[11.6px] text-secondary'> Select category / categories </h4> 
            <div className='flex justify-between items-center mt-[10px] text-black' onBlur={()=> categoryBlurHandler()}>
                <div>
                    <label for= 'strength'>Strength</label>
                    <input type='checkbox' id='strength' value='strength' checked={editCategory && categoryStatus.strength}
                         onChange={(e)=> categorySelectHandler(e)}/>
                </div>
                <div>
                    <label for= 'cardio'>Cardio</label>
                    <input type='checkbox' id='cardio' value='cardio' checked={editCategory && categoryStatus.cardio}
                         onChange={(e)=> categorySelectHandler(e)}/>
                </div>
                <div>
                    <label for= 'supplements'>Supplements</label>
                    <input type='checkbox' id='supplements' value='supplements' checked={editCategory && categoryStatus.supplements}
                         onChange={(e)=> categorySelectHandler(e)}/>
                </div>
                <div>
                    <label for= 'accessories'>Accessories</label>
                    <input type='checkbox' id='accessories' value='accessories' checked={editCategory && categoryStatus.accessories} 
                        onChange={(e)=> categorySelectHandler(e)}/>
                </div>
            </div>
        </>
    )
}

export function SelectSubCategoryForAdmin({category, setCategory}){

    const cardioRef = useRef(null)
    const strengthRef = useRef(null)
    const supplementsRef = useRef(null)
    const accessoriesRef = useRef(null)

    const [error, setError] = useState('')
    const [checkedCategories, setCheckedCategories] = useState({});

    useEffect(() => {
        const categoryListRefs = [cardioRef, strengthRef, supplementsRef, accessoriesRef]
        if (category && category.length) {

            categoryListRefs.forEach(catListRef => {
                if (catListRef.current) {
                    const isActive = category.some(cat => catListRef.current.id.includes(cat))
    
                    if (!isActive) {
                        catListRef.current.style.color = '#919191'
                        catListRef.current.previousElementSibling.style.color = '#919191'
                        catListRef.current.inactivate = true                        
                        console.log("Inactivated and unchecked: ", catListRef.current.id)
                        setCheckedCategories(prev => ({
                            ...prev,
                            [catListRef.current.id]: false,
                        }))
                    } else {
                        catListRef.current.style.color = 'initial'
                        catListRef.current.previousElementSibling.style.color = '#757575'
                        catListRef.current.inactivate = false
                        console.log("Activated: ", catListRef.current.id)
                    }
                }
            });
        }
        if (category && !category.length){
            categoryListRefs.forEach(catListRef=>{
                catListRef.current.style.color = '#757575'
                catListRef.current.previousElementSibling.style.color = '#757575'
                catListRef.current.inactivate = true
                console.log("Every subcategories activated")
            })
        }
    }, [category]);

    useEffect(()=>{
        console.log("CheckedCategories-->",JSON.stringify(checkedCategories))
    },[checkedCategories])

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
            return
        }else{
            const changeEvent = new Event('change', {bubbles:true})
            e.target.dispatchEvent(changeEvent)
        }
    }

    const radioChangeHandler = (e)=>{
        console.log("Object.values(checkedCategories)-->",Object.values(checkedCategories))
        if(!Object.values(checkedCategories).every(status=> status == false)){
            e.target.checked = false
            setError('Cannot select more than 1 subcategory!')
            console.log("Cannot select more than 1 subcategory!")
            return
        }
        setCheckedCategories({ ...checkedCategories, [e.target.parentElement.parentElement.id]: {...checkedCategories[e.target.parentElement.parentElement.id], [e.target.id]: e.target.checked} })
    }

    const subCategoryBlockClickHandler = ()=>{
        if(!category.length){
            setError('Please choose a category first!')
        }
    }

    return(
        <main id='SelectSubCategoryForAdmin' onClick={()=> subCategoryBlockClickHandler()}>
            <h4 className='text-[11.6px] text-secondary'> Select a subcategory</h4> 
            <div className='flex justify-between items-center mt-[8px] subcategory-body'>
                <div>
                    <h5> Strength </h5>
                    <ul className='list-none' id='strengthList' ref={strengthRef}>
                        <li>
                            <label for='freeWeight'> Free Weight </label>
                            <input type='radio' value='freeWeight' id='freeWeight' disabled={strengthRef?.current?.inactivate} checked={checkedCategories['strengthList']?.freeWeight || false} style={strengthRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='weightMachine'> Weight Machine </label>
                            <input type='radio' value='weightMachine' id='weightMachine' disabled={strengthRef?.current?.inactivate} checked={checkedCategories['strengthList']?.weightMachine || false} style={strengthRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='weightBench'> Weight Bench </label> 
                            <input type='radio' value='weightBench' id='weightBench' disabled={strengthRef?.current?.inactivate} checked={checkedCategories['strengthList']?.weightBench || false}  style={strengthRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='pullUpbar'> Pull Up Bar </label>
                            <input type='radio' value='pullUpbar' id='pullUpbar' disabled={strengthRef?.current?.inactivate} checked={checkedCategories['strengthList']?.pullUpbar || false}  style={strengthRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='powerRack'> Power Rack </label>
                            <input type='radio' value='powerRack' id='powerRack' disabled={strengthRef?.current?.inactivate} checked={checkedCategories['strengthList']?.powerRack || false}  style={strengthRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>                                                                                                                                                                                        
                        </li>
                        <li>
                            <label for='platesAndBars'> Plates & Bars </label>
                            <input type='radio' value='platesAndBars' id='platesAndBars' disabled={strengthRef?.current?.inactivate} checked={checkedCategories['strengthList']?.platesAndBars || false}  style={strengthRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                    </ul>
                </div>
                <div>
                    <h5> Cardio </h5> 
                    <ul className='list-none' id='cardioList' ref={cardioRef}>
                        <li>
                            <label for='treadmill'> Treadmill </label>
                            <input type='radio' value='treadmill' id='treadmill' disabled={cardioRef?.current?.inactivate} checked={checkedCategories['cardioList']?.treadmill || false} style={cardioRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='elliptical'> Elliptical </label>
                            <input type='radio' value='elliptical' id='elliptical' disabled={cardioRef?.current?.inactivate} checked={checkedCategories['cardioList']?.elliptical || false} style={cardioRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='exerciseBike'> Exercise Bike </label> 
                            <input type='radio' value='exerciseBike' id='exerciseBike' disabled={cardioRef?.current?.inactivate} checked={checkedCategories['cardioList']?.exerciseBike || false} style={cardioRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='rowingMachine'> Rowing Machine </label>
                            <input type='radio' value='rowingMachine' id='rowingMachine' disabled={cardioRef?.current?.inactivate} checked={checkedCategories['cardioList']?.rowingMachine || false} style={cardioRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='jumpRope'> Jump Rope </label>
                            <input type='radio' value='jumpRope' id='jumpRope' disabled={cardioRef?.current?.inactivate} checked={checkedCategories['cardioList']?.jumpRope || false} style={cardioRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>                                                                                                                                                                                        
                        </li>
                        <li>
                            <label for='stepper'> Stepper </label>
                            <input type='radio' value='stepper' id='stepper' disabled={cardioRef?.current?.inactivate} checked={checkedCategories['cardioList']?.stepper || false} style={cardioRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                    </ul>
                </div>
                <div>
                    <h5> Supplements </h5>
                    <ul className='list-none' id='supplementsList' ref={supplementsRef}>
                        <li>
                            <label for='protein'> Protein </label>
                            <input type='radio' value='protein' id='protein' disabled={supplementsRef?.current?.inactivate} checked={checkedCategories['supplementsList']?.protein || false}  style={supplementsRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='preWorkout'> Pre-Workout </label>
                            <input type='radio' value='preWorkout' id='preWorkout' disabled={supplementsRef?.current?.inactivate} checked={checkedCategories['supplementsList']?.preWorkout || false} style={supplementsRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='postWorkout'> Post-Workout </label> 
                            <input type='radio' value='postWorkout' id='postWorkout' disabled={supplementsRef?.current?.inactivate} checked={checkedCategories['supplementsList']?.postWorkout || false} style={supplementsRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='vitamins'> Vitamins </label>
                            <input type='radio' value='vitamins' id='vitamins' disabled={supplementsRef?.current?.inactivate} checked={checkedCategories['supplementsList']?.vitamins || false} style={supplementsRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='fatBurner'> Fat Burner </label>
                            <input type='radio' value='fatBurner' id='fatBurner' disabled={supplementsRef?.current?.inactivate} checked={checkedCategories['supplementsList']?.fatBurner || false} style={supplementsRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>                                                                                                                                                                                        
                        </li>
                        <li>
                            <label for='creatine'> Creatine </label>
                            <input type='radio' value='creatine' id='creatine' disabled={supplementsRef?.current?.inactivate} checked={checkedCategories['supplementsList']?.creatine || false} style={supplementsRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                    </ul>
                </div>
                <div>
                    <h5> Accessories </h5>
                    <ul className='list-none' id='accessoriesList' ref={accessoriesRef}>
                        <li>
                            <label for='yogaMat'> Yoga Mat </label>
                            <input type='radio' value='yogaMat' id='yogaMat' disabled={accessoriesRef?.current?.inactivate} checked={checkedCategories['accessoriesList']?.yogaMat || false} style={accessoriesRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='foamRoller'> Foam Roller </label>
                            <input type='radio' value='foamRoller' id='foamRoller' disabled={accessoriesRef?.current?.inactivate} checked={checkedCategories['accessoriesList']?.foamRoller || false} style={accessoriesRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='glovesAndStraps'> Gloves And Straps </label> 
                            <input type='radio' value='glovesAndStraps' id='glovesAndStraps' disabled={accessoriesRef?.current?.inactivate} checked={checkedCategories['accessoriesList']?.glovesAndStraps || false} style={accessoriesRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='gymBag'> Gym Bag </label>
                            <input type='radio' value='gymBag' id='gymBag' disabled={accessoriesRef?.current?.inactivate} checked={checkedCategories['accessoriesList']?.gymBag || false} style={accessoriesRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                        <li>
                            <label for='shakersAndBottles'> Shakers And Bottles </label>
                            <input type='radio' value='shakersAndBottles' id='shakersAndBottles' disabled={accessoriesRef?.current?.inactivate} checked={checkedCategories['accessoriesList']?.shakersAndBottle || false} style={accessoriesRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>                                                                                                                                                                                        
                        </li>
                        <li>
                            <label for='beltAndSupport'> Belt And Support </label>
                            <input type='radio' value='beltAndSupport' id='beltAndSupport' disabled={accessoriesRef?.current?.inactivate} checked={checkedCategories['accessoriesList']?.beltAndSupport || false} style={accessoriesRef?.current?.inactivate ? {color:'#919191'} : {color:'rgba(215, 241, 72, 1)'}} onChange={(e)=> radioChangeHandler(e)} onClick={(e)=> radioClickHandler(e)}/>
                        </li>
                    </ul>
                </div>
            </div>
            <p className='h-[15px] w-full text-[11px] text-red-500 tracking-[0.1px] mt-[5px]'> {error} </p>
        </main>
    )
}