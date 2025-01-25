import {useState, useEffect, useRef} from 'react'


export default function useFlexiDropdown(dropdownKeys){

  const [openDropdowns, setOpenDropdowns] = useState( dropdownKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) )

  const dropdownRefs = dropdownKeys.reduce( (acc, key) => ({ ...acc, [key]: useRef(null) }), {} )

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutside = !Object.values(dropdownRefs).some((ref)=>
        ref.current?.contains(e.target)
      )
      if (isOutside) {
        setOpenDropdowns(
          Object.keys(openDropdowns).reduce((newState, key) => {
            newState[key] = false
            return newState;
          }, {})
        )
      }
    }

    document.addEventListener('click', handleClickOutside)
    return ()=> {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownRefs, openDropdowns])

  const toggleDropdown = (dropdownKey)=> {
    setOpenDropdowns((prevState) =>
      Object.keys(prevState).reduce((newState, key) => {
        newState[key] = key === dropdownKey ? !prevState[key] : false
        return newState
      }, {})
    )
  }


  return {openDropdowns, dropdownRefs, toggleDropdown}
}
