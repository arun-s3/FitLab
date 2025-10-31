import React, {useEffect, useState, useRef} from "react"
import './Modal.css'

import useModalHelpers from '../../Hooks/ModalHelpers'
import {SitePrimaryWhiteTextButton} from "../SiteButtons/SiteButtons"

export default function Modal({openModal, setOpenModal, title, content, instruction, okButtonText, closeButtonText, contentCapitalize,
   clickTest, typeTest, typeValue, activateProcess}){

  const [modelIsOpen, setModelIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  const closeModal = () => {
    setModelIsOpen(false) 
    setOpenModal(false)
  }

  const modalRef = useRef(null)
  useModalHelpers({open: openModal, onClose: closeModal, modalRef})

  useEffect(()=>{
    if(openModal){
        setModelIsOpen(true)
    }
  },[open])

  useEffect(()=>{
    console.log("Message written---->", message)
  },[message])
//   const openModal = () => { setModelIsOpen(true) }

  const inputHandler = (e)=> {
    setMessage(e.target.value)
  }

  const buttonHandler = (e)=>{
    if(typeTest && message.trim().toLowerCase() === typeValue){
      activateProcess()
    }
    if(clickTest){
      activateProcess()
    }
    setModelIsOpen(false) 
    setOpenModal(false)
  }

  return (
    <main id="message-modal" ref={modalRef}>

      {modelIsOpen && (
        <div className="modal-main">
          <div className="modal-content">
            <h2 className="text-xl font-bold mb-4"> {title} </h2>
            <p className={`text-gray-600 mb-6 ${contentCapitalize ? 'capitalize' :''} text-[13px]`}  style={{wordSpacing:'0.5px'}}>
              {content}
            </p>
            {
              typeTest &&
              <>
                <p className="text-[12px] text-secondary tracking-[0.3px]"> 
                  {instruction}
                </p>
                <input type='text' className="border border-gray-300 rounded p-2 mb-4 w-full h-[30px] text-[11px]"
                 placeholder="Type here..." value={message} onChange={(e)=> inputHandler(e)} />
              </>
            }
            <div className="flex items-center justify-center gap-[2rem]">
                <SitePrimaryWhiteTextButton clickHandler={buttonHandler} tailwindClasses='hover:bg-red-500'> {okButtonText} </SitePrimaryWhiteTextButton>
                <SitePrimaryWhiteTextButton clickHandler={closeModal} tailwindClasses='hover:bg-green-500'> {closeButtonText} </SitePrimaryWhiteTextButton>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

