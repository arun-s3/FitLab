import { useEffect, useState } from 'react'

export const useTogglerEnabled = (stateObj, excludeKey)=> {

  const [togglerEnabled, setTogglerEnabled] = useState(true)

  useEffect(()=> {
    const enabled = Object.entries(stateObj).filter(([key]) => key !== excludeKey)
      .some(([, value]) => value)

    setTogglerEnabled(enabled)
  }, [stateObj, excludeKey])

  return togglerEnabled
}
