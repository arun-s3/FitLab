import React, {useState, useEffect, useRef} from 'react'


export default function useStickyDropdown(dropdownKeys) {

  const [openStickyDropdowns, setOpenStickyDropdowns] = useState( dropdownKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) )

  const stickyDropdownRefs = dropdownKeys.reduce( (acc, key) => ({ ...acc, [key]: useRef(null) }), {} )

  useEffect(() => {
    const handleClickOutsideStickyDropdowns = (e) => {
      const isOutside = !Object.values(stickyDropdownRefs).some((ref)=> ref.current?.contains(e.target))

      console.log('Sticky dropdowns--isOutside--', isOutside);
      if (isOutside) {
        setOpenStickyDropdowns(
          Object.keys(openStickyDropdowns).reduce((newState, key) => {
            newState[key] = false
            return newState;
          }, {})
        )
      }
    }
    document.addEventListener('mousedown', handleClickOutsideStickyDropdowns)

    return ()=> {
      document.removeEventListener('mousedown', handleClickOutsideStickyDropdowns)
    }
  }, [stickyDropdownRefs, openStickyDropdowns])

  const toggleStickyDropdown = (e, dropdownKey)=> {
    e.stopPropagation()

    console.log(`Toggling dropdown: ${dropdownKey}`)
    setOpenStickyDropdowns((prevState) =>
      Object.keys(prevState).reduce((newState, key) => {
        newState[key] = key === dropdownKey ? !prevState[key] : false
        return newState;
      }, {})
    )
  }

  return {openStickyDropdowns, stickyDropdownRefs, toggleStickyDropdown}
}
