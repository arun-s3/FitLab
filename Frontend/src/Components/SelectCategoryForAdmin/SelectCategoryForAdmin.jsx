import React,{useEffect, useState, useRef} from 'react'

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

    return(

        <>
            <h4 className='text-[11.6px] text-secondary'> Select category / categories </h4> 
            <div className='flex justify-between items-center mt-[10px] text-black'>
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