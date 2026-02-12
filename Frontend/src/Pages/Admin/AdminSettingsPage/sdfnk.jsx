import React, { useState, useEffect, useRef } from "react"
import "./AdminSettingsPage.css"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"

import { toast } from "react-toastify"
import { toast as sonnerToast } from "sonner"
import {
    User,
    Mail,
    Phone,
    MapPin,
    MapPinHouse,
    Lock,
    SquareChevronRight,
    ArrowRight,
    Camera,
    Edit2,
    Check,
    X,
} from "lucide-react"
import { RiArrowDropDownLine } from "react-icons/ri"

import ChangePasswordBox from "../../../Components/ResetPasswordBox/ResetPasswordBox"
import AdminTitleSection from "../../../Components/AdminTitleSection/AdminTitleSection"
import { SingleDateSelector } from "../../../Components/Calender/Calender"
import { updateUserDetails, resetStates as resetUserStates } from "../../../Slices/userSlice"
import { SiteButtonSquare } from "../../../Components/SiteButtons/SiteButtons"
import { camelToCapitalizedWords } from "../../../Utils/helperFunctions"
import {
    handleInputValidation,
    displaySuccess,
    displayErrorAndReturnNewFormData,
    cancelErrorState,
} from "../../../Utils/fieldValidator"
import { CustomHashLoader } from "../../../Components/Loader/Loader"


export default function AdminSettingsPage() {

    const { setHeaderZIndex, setPageBgUrl } = useOutletContext()
    setPageBgUrl(
        `linear-gradient(to right,rgba(255,255,255,0.94),rgba(255,255,255,0.94)), url('/Images/admin-ProductsListBg.jpg')`,
    )

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    const [editing, setEditing] = useState(false)
    const [userDetails, setUserDetails] = useState({})
    const [dob, setDob] = useState(null)
    const [gender, setGender] = useState("")

    const [openSecurityMenu, setOpenSecurityMenu] = useState(false)
    const securityMenuRef = useRef(null)

    const [openDropdowns, setOpenDropdowns] = useState({ genderDropdown: false })
    const dropdownRefs = {
        genderDropdown: useRef(null),
    }

    const primaryColor = useRef("rgb(209 213 219)")
    const errorRef = useRef(null)

    const dispatch = useDispatch()
    const { user, userUpdated, loading: userLoading } = useSelector((state) => state.user)

    useEffect(() => {
        const handleClickOutside = (e) => {
            const isOutside = !Object.values(dropdownRefs).some((ref) => ref.current?.contains(e.target))
            console.log("isOutside--->", isOutside)
            if (isOutside) {
                setOpenDropdowns((prevState) =>
                    Object.keys(prevState).reduce((newState, key) => {
                        newState[key] = false
                        return newState
                    }, {}),
                )
            }
        }
        document.addEventListener("click", handleClickOutside)
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        dispatch(resetUserStates())
    }, [])

    useEffect(() => {
        if (gender) {
            setUserDetails((userDetails) => ({ ...userDetails, gender }))
        }
        if (dob) {
            console.log("DOB-->", dob)
            console.log("new Date(dob)-->", new Date(dob))
            setUserDetails((userDetails) => ({ ...userDetails, dob: new Date(dob) }))
        }
    }, [gender, dob])

    useEffect(() => {
        if (userUpdated) {
            sonnerToast.success("The details have been succesfully Updated!")
            dispatch(resetUserStates())
        }
    }, [userUpdated])

    const personalnfoTypes = [
        { type: "firstName", Icon: User, optionalField: true },
        { type: "lastName", optionalField: true },
        { type: "username" },
        { type: "email", Icon: Mail },
        { type: "mobile", Icon: Phone },
    ]

    const toggleDropdown = (dropdownKey) => {
        setOpenDropdowns((prevState) =>
            Object.keys(prevState).reduce((newState, key) => {
                newState[key] = key === dropdownKey ? !prevState[key] : false
                return newState
            }, {}),
        )
    }

    const inputBlurHandler = (e, fieldName, options, detailType) => {
        console.log("inside inputBlurHandler, fieldname", fieldName)
        if (fieldName) {
            const value = e.target.value
            const statusObj = options?.optionalField
                ? handleInputValidation(fieldName, value, { optionalField: true })
                : handleInputValidation(fieldName, value)
            console.log("statusObj from inputBlurHandler--> ", JSON.stringify(statusObj))
            if (!statusObj.error && statusObj.message.startsWith("Optional")) {
                console.log("Inside here----")
                e.target.nextElementSibling.textContent = ""
                e.target.style.borderColor = primaryColor.current
                return
            }
            if (statusObj.error) {
                const message = statusObj.message
                const newDetails =
                    detailType === "personal"
                        ? displayErrorAndReturnNewFormData(e, message, userDetails, fieldName) : null
                detailType === "personal" ? setUserDetails(newDetails) : null
            } else {
                displaySuccess(e)
            }
        }
    }

    const handleSubmit = () => {
        console.log("Inside submitAddress()--")
        setEditing(false)

        const requiredUserFieldNames = personalnfoTypes
            .filter((infoType) => !infoType.hasOwnProperty("optionalField"))
            .map((infoType) => infoType.type)

        const checkErrors = (detailsArray, requiredfieldNamesArray) => {
            const requiredFields = Object.keys(detailsArray).filter((field) => requiredfieldNamesArray.includes(field))
            const missingRequiredFields = requiredfieldNamesArray.filter(
                (field) => !detailsArray[field] || detailsArray[field] === "" || detailsArray[field] === undefined,
            )

            console.log(`Required Fields Length----> ${requiredFields.length} Required Fields--->, ${requiredFields}`)
            if (requiredFields.length < requiredfieldNamesArray.length) {
                console.log("Missing required fields!")
                toast.error("Please enter all required fields!")
                return "error"
            }
            if (missingRequiredFields.length > 0) {
                console.log("Undefined values found in required fields!")
                sonnerToast.error("Please check the fields and submit again!")
                return "error"
            }
        }

        if (user) {
            console.log("Checking errors in userDetails......")
            console.log(`requiredUserFieldNames--->${requiredUserFieldNames}`)
            const status = checkErrors(userDetails, requiredUserFieldNames)
            console.log("status-->", status)
            if (status === "error") return

            dispatch(updateUserDetails({ userDetails }))
            console.log("userDetails now -->", userDetails)
            console.log("Dispatched userDetails successfully!")
        }
        console.log("Dispatched all successfully!")
    }

    const openSecurity = () => {
        window.scrollTo({ top: securityMenuRef.current.getBoundingClientRect().bottom, scrollBehavior: "smooth" })
        setOpenSecurityMenu((status) => !status)
    }

    const InputFieldsGenerator = (infoTypes, detailType) => {
        return infoTypes.map((infoType) => (
            <div key={infoType.type}>
                <label className='text-sm font-medium text-gray-700 mb-1 flex justify-between items-center'>
                    {camelToCapitalizedWords(infoType.type)}
                    {!infoType?.optionalField && editing && (
                        <span className='text-red-500 text-[11px]'> *Required Field </span>
                    )}
                </label>
                <div className={`${infoType?.Icon ? "relative" : ""}`}>
                    <input
                        type='text'
                        value={detailType === "personal" && userDetails[infoType.type] }
                        disabled={!editing}
                        className={`w-full px-4 py-2 capitalize ${editing ? "text-secondary" : "text-muted"}
                    ${infoType?.Icon ? "pl-10" : ""} text-[13px] rounded-lg border border-gray-300 focus:ring-2
                       focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50`}
                        id={infoType.type}
                        onChange={(e) =>
                            detailType === "personal"
                                ? setUserDetails({ ...userDetails, [infoType.type]: e.target.value })
                                : setAddressDetails({ ...addressDetails, [infoType.type]: e.target.value })
                        }
                        onBlur={(e) =>
                            infoType?.optionalField
                                ? inputBlurHandler(e, infoType.type, { optionalField: true }, detailType)
                                : inputBlurHandler(e, infoType.type, detailType)
                        }
                    />
                    {infoType?.Icon && <infoType.Icon className='absolute left-3 top-[14px] w-4 h-4 text-gray-400' />}
                    <p
                        className='mt-[3px] h-[7px] text-[10px] text-red-500 visible tracking-[0.2px] error'
                        ref={errorRef}
                        onClick={(e) => {
                            console.log("Clicked error...")
                            infoType?.optionalField
                                ? cancelErrorState(e, primaryColor.current, { optionalField: true })
                                : cancelErrorState(e, primaryColor.current)
                        }}></p>
                </div>
            </div>
        ))
    }

    return (
        <section id='UserAccountPage'>
            <header>
                <AdminTitleSection
                    heading='Settings'
                    subHeading='View, edit, filter, export and manage products across grid, list, and table views.'
                />
            </header>
            {false ? (
                <div className='mt-4 flex items-center justify-center'>
                    {/* <AuthPrompt /> */}
                </div>
            ) : (
                <div className={`pt-[2rem] px-[2rem] pb-[2rem]`}>
                    <div className='flex justify-between items-center mb-[2rem]'>
                        <h1 className='text-[30px] text-secondary font-bold tracking-[0.5px]'>Account Details</h1>
                        {!editing ? (
                            <button
                                className='flex items-center gap-2 px-[1rem] py-2 bg-purple-600 text-[15px] text-white font-[500] rounded-lg
                           hover:bg-purple-700 transition-colors'
                                onClick={() => setEditing(true)}>
                                <Edit2 className='w-4 h-4' />
                                Edit Profile
                            </button>
                        ) : (
                            <div className='flex gap-2'>
                                <button
                                    className='flex items-center gap-2 px-4 py-2 bg-green-600 text-[15px] text-white rounded-lg
                              hover:bg-green-700 transition-colors'
                                    onClick={handleSubmit}>
                                    <Check className='w-[15px] h-[15px]' />
                                    {userLoading ? <CustomHashLoader loading={loading} /> : "Save"}
                                </button>
                                <button
                                    className='flex items-center gap-2 px-4 py-2 bg-gray-600 text-[15px] text-white rounded-lg
                               hover:bg-gray-700 transition-colors'
                                    onClick={() => setEditing(false)}>
                                    <X className='w-[15px] h-[15px]' />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8' id='personal-details'>
                        <div className='space-y-6'>
                            <h2 className='text-[20px] font-semibold text-gray-900'>Personal Information</h2>
                            <div className='space-y-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                    {InputFieldsGenerator(personalnfoTypes.slice(0, 2), "personal")}
                                </div>
                                {InputFieldsGenerator(personalnfoTypes.slice(2), "personal")}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='w-full dob'>
                                        <label className='block text-sm font-medium text-gray-700 mb-[4px]'>
                                            Date Of Birth
                                        </label>
                                        <div className={`relative ${!editing ? "bg-gray-50" : ""}`}>
                                            <SingleDateSelector
                                                date={dob}
                                                setDate={setDob}
                                                placeholderText={`${editing ? "Select your DOB" : ""}`}
                                                isDisabled={!editing}
                                                value={userDetails.dob || dob}
                                            />
                                            {!editing && (
                                                <div className='absolute top-0 left-0 w-full h-full bg-transparent'></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='h-[63%]'>
                                        <span className='block text-sm font-medium text-gray-700 mb-1'> Gender </span>
                                        <div
                                            className={`relative w-full h-full px-4 py-2 flex justify-between items-center rounded-lg border 
                                  border-gray-300 ${!editing ? "bg-gray-50" : ""} cursor-pointer`}
                                            onClick={() => editing && toggleDropdown("genderDropdown")}
                                            ref={dropdownRefs.genderDropdown}>
                                            <span
                                                className={`text-[13px]  ${editing ? "text-secondary" : "text-muted"}`}>
                                                {(gender && camelToCapitalizedWords(gender)) ||
                                                    (userDetails?.gender &&
                                                        camelToCapitalizedWords(userDetails.gender))}
                                            </span>
                                            <i className=''>
                                                {" "}
                                                <RiArrowDropDownLine />{" "}
                                            </i>
                                            {openDropdowns.genderDropdown && (
                                                <ul
                                                    className='absolute top-[43px] left-0 list-none w-full h-fit bg-white border border-dropdownBorder
                                       rounded-[6px] py-[8px] pl-[10px] pr-[2px] text-[14px] cursor-pointer'>
                                                    <li
                                                        className='hover:text-secondary'
                                                        onClick={() => setGender("male")}>
                                                        Male
                                                    </li>
                                                    <li
                                                        className='hover:text-secondary'
                                                        onClick={() => setGender("female")}>
                                                        Female
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-8 pt-8 border-t border-gray-200'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <h2 className='text-[20px] font-semibold text-gray-900'>Security</h2>
                                <p className='text-sm text-gray-500 mt-1'>Change your password </p>
                            </div>
                            <button
                                className={`flex items-center gap-2 px-[1rem] py-[8px] text-[15px] border border-secondaryLight2 rounded-lg
                             hover:bg-secondary hover:text-white transition-colors ${openSecurityMenu && "bg-secondary text-white"}`}
                                onClick={openSecurity}>
                                <Lock className='w-4 h-4' />
                                Change Password
                                <ArrowRight className='ml-[5px] w-4 h-4' />
                            </button>
                        </div>

                        <div ref={securityMenuRef}>
                            {openSecurityMenu && <ChangePasswordBox setOpenSecurityMenu={setOpenSecurityMenu} />}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
