import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import { updateTermsAcceptance, resetStates } from "../Slices/userSlice"
import { termsVersion } from "../Data/TermsAndConditions"


const useTermsConsent = () => {

  const dispatch = useDispatch()
  const { updatedTermsAcceptance, user } = useSelector((state) => state.user)

  const hasTriggeredRef = useRef(false)

  const acceptTermsOnFirstAction = () => {
    if (user?.hasAcceptedTerms && user?.termsVersion === termsVersion) return

    if (hasTriggeredRef.current) return

    const consent = {
      hasAcceptedTerms: true,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion,
    }

    dispatch(updateTermsAcceptance({ consent }))
    hasTriggeredRef.current = true
  }

  useEffect(() => {
    if (updatedTermsAcceptance) {
      dispatch(resetStates())
    }
  }, [updatedTermsAcceptance, dispatch])

  return {
    acceptTermsOnFirstAction,
  }
}

export default useTermsConsent
