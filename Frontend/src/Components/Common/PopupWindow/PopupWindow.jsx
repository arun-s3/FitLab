import React, {useState, useEffect, useImperativeHandle} from 'react'
import ReactDOM from 'react-dom/client'


const PopupWindow = React.forwardRef( ({path}, windowRef)=> {

    const [popupWindow, setPopupWindow] = useState(null)

    useEffect(()=>{
        if(popupWindow){
            return ()=> popupWindow.close()
        }
    },[popupWindow])

    const openWindow = ()=>{
        const newWindow = window.open(path, "", "width=700,height=700,left=300,top=300,resizable=no")
        if(newWindow){
            setPopupWindow(newWindow)
        }
    }

    return(
        <input type='hidden' onClick={()=> openWindow()} ref={windowRef} />
    )
})

export default PopupWindow