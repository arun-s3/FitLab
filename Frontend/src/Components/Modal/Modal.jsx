import React, { useEffect, useState } from "react";
import './Modal.css'

export default function Modal({openModel, setOpenModel, title, content, instruction, buttonText1, buttonText2, deleteHandler}) {

  const [modelIsOpen, setModelIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(()=>{
    if(openModel){
        setModelIsOpen(true)
    }
  },[open])

  useEffect(()=>{
    console.log("Message written---->", message)
  },[message])
//   const openModal = () => { setModelIsOpen(true) }

  const closeModal = () => {
    setModelIsOpen(false) 
    setOpenModel(false)
  }

  const inputHandler = (e)=> {
    setMessage(e.target.value)
  }

  const buttonHandler = (e)=>{
    if(message.trim().toLowerCase() === 'sure'){
        deleteHandler()
    }
    setModelIsOpen(false) 
    setOpenModel(false)
  }

  return (
    <main id="message-modal">

      {modelIsOpen && (
        <div className="modal-main">
          <div className="modal-content">
            <h2 className="text-xl font-bold mb-4"> {title} </h2>
            <p className="text-gray-600 mb-6 capitalize text-[13px]"  style={{wordSpacing:'0.5px'}}>
              {content}
            </p>
            <p className="text-[12px] text-secondary tracking-[0.3px]"> 
                {instruction}
            </p>
            <input type='text' className="border border-gray-300 rounded p-2 mb-4 w-full h-[30px] text-[11px]"
                 placeholder="Type here..." value={message} onChange={(e)=> inputHandler(e)} />
            <div className="flex items-center justify-center gap-[2rem]">
                <button type='button' className="bg-primary text-white font-500 px-[2rem] py-[3px] tracking-[0.3px] rounded hover:bg-red-500" 
                            onClick={buttonHandler} > {buttonText1} </button>
                <button onClick={closeModal} className="bg-primary text-white font-500 px-[2rem] py-[3px] tracking-[0.3px] rounded hover:bg-green-500">
                  {buttonText2}
                </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
