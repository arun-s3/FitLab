import React, {useState, useEffect, useImperativeHandle} from 'react'
import ReactDOM from 'react-dom/client'

const PopupWindow = React.forwardRef( ({Component}, imageEditorWindowRef)=> {

    const [popupWindow, setPopupWindow] = useState(null)

    useEffect(()=>{
        if(popupWindow){

            const parentcontainer = popupWindow.document.createElement('main')
            popupWindow.document.body.appendChild(parentcontainer)
            ReactDOM.createRoot(parentcontainer).render(Component)
            return ()=> popupWindow.close()
        }
    },[popupWindow])

    const openWindow = ()=>{
        const newWindow = window.open("", "", "width=700,height=700,left=300,top=300,resizable=no")
        if(newWindow){
            setPopupWindow(newWindow)
        }
    }

    return(
        <input type='hidden' onClick={()=> openWindow()} ref={imageEditorWindowRef} />
    )
})

export default PopupWindow