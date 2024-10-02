import React from 'react'

export default function SelectCategoryForAdmin({category, setCategory}){

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
                    <input type='checkbox' id='strength' value='strength' onChange={(e)=> categorySelectHandler(e)}/>
                </div>
                <div>
                    <label for= 'cardio'>Cardio</label>
                    <input type='checkbox' id='cardio' value='cardio' onChange={(e)=> categorySelectHandler(e)}/>
                </div>
                <div>
                    <label for= 'supplements'>Supplements</label>
                    <input type='checkbox' id='supplements' value='supplements' onChange={(e)=> categorySelectHandler(e)}/>
                </div>
                <div>
                    <label for= 'accessories'>Acessories</label>
                    <input type='checkbox' id='accessories' value='accessories' onChange={(e)=> categorySelectHandler(e)}/>
                </div>
            </div>
        </>
    )
}