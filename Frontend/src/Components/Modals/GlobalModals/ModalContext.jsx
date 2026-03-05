import React, { createContext, useState, useContext } from "react";


const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export default function ModalProvider({ children }){
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setModalContent(null)
  }

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen && modalContent}
    </ModalContext.Provider>
  )
}
