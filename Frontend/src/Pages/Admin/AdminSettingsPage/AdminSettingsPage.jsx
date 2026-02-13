import React, { useState, useEffect } from "react"
import "./AdminSettingsPage.css"
import { useOutletContext } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import { User, Mail, Phone, Edit2, Check, X, Lock, ArrowRight, Camera } from "lucide-react"
import { toast as sonnerToast } from "sonner"

import ResetPasswordBox from "../../../Components/ResetPasswordBox/ResetPasswordBox"
import SelfieModal from "../../../Components/SelfieModal/SelfieModal"
import AdminTitleSection from "../../../Components/AdminTitleSection/AdminTitleSection"
import { SingleDateSelector } from "../../../Components/Calender/Calender"
import { updateAdminDetails, updateAdminProfilePic, resetStates } from "../../../Slices/adminSlice"


export default function AdminSettingsPage() {

    const [editing, setEditing] = useState(false)
    const [openSecurityMenu, setOpenSecurityMenu] = useState(false)
    const [formData, setFormData] = useState({})
    const [dob, setDob] = useState(null)

    const [profileImage, setProfileImage] = useState(null)
    const [profileImageModal, setProfileImageModal] = useState(false)
    const [userSystemPic, setUserSystemPic] = useState([])
    const [photoDispatched, setPhotoDispatched] = useState(false)

    const [errors, setErrors] = useState({})

    const dispatch = useDispatch()

    const { admin, adminUpdated, adminDpUpdated, loading, error } = useSelector((state) => state.admin)

    const {setPageBgUrl, setHeaderZIndex} = useOutletContext()  
    setHeaderZIndex(0)
    setPageBgUrl(
        `linear-gradient(to right,rgba(255,255,255,0.97),rgba(255,255,255,0.97)), url('/Images/admin-settings.png')`,
    )

    useEffect(() => {
        if (admin) {
            setFormData({ ...admin })
            const defaultDp = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            setProfileImage(!admin?.profilePic || admin?.profilePic === defaultDp ? "/Images/adminDp.jpg" : admin.profilePic)
            if (admin.dob) setDob(new Date(admin.dob))
        }
        dispatch(resetStates())
    }, [admin])

    useEffect(() => {
        if (adminUpdated) {
            sonnerToast.success("Profile updated successfully")
            setEditing(false)
            dispatch(resetStates())
        }
    }, [adminUpdated]) 
    
    useEffect(()=> {
        if(photoDispatched && adminDpUpdated){
            sonnerToast.success("Your profile pic has been updated!")
            dispatch(resetStates())
            setPhotoDispatched(false)
        }
        if(error){
            sonnerToast.error(error)
            dispatch(resetStates())
            setPhotoDispatched(false)
        }
    }, [adminDpUpdated, error])

    const regexMap = {
        firstName: /^[A-Za-z]{2,}$/,
        lastName: /^[A-Za-z]{1,}$/,
        username: /^[a-zA-Z0-9_]{3,20}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        mobile: /^[0-9]{10}$/,
    }

    const errorMessages = {
        firstName: "First name must contain only letters (min 2).",
        lastName: "Last name must contain only letters (min 2).",
        username: "Username must be 3–20 characters (letters, numbers, underscore).",
        email: "Enter a valid email address.",
        mobile: "Mobile number must be exactly 10 digits.",
    }

    const handleBlur = (e) => {
        const { name, value } = e.target

        if (!regexMap[name]) return

        if (!regexMap[name].test(value.trim())) {
            setErrors((prev) => ({
                ...prev,
                [name]: errorMessages[name],
            }))
        } else {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = () => {
        const hasErrors = Object.values(errors).some((err) => err)

        if (hasErrors) {
            sonnerToast.error("Please fix the errors before submitting.")
            return
        }

        const userDetails = { ...formData, dob }
        console.log("userDetails now -->", userDetails)

        dispatch( updateAdminDetails({userDetails}) )
    }

    const uploadPhoto = async (dataUrl) => {
        console.log("Inside uploadPhoto function")
        const blob = await (await fetch(dataUrl)).blob()

        const formData = new FormData()
        formData.append("image", blob, "photo.jpg")

        dispatch(updateAdminProfilePic({formData}))
        setPhotoDispatched(true)
    }


    return (
        <section id='AdminSettingsPage'>
            <header>
                <AdminTitleSection
                    heading='Settings'
                    subHeading='Control your administrative profile, identity, and security.'
                />
            </header>
            <div className='flex justify-between items-center mt-14 mb-8'>
                <div className='flex justify-between items-center mb-10'>
                    <div className='flex items-center gap-6'>
                        <div className='relative w-24 h-24 group'>
                            <img
                                src={profileImage || "/Images/adminDp.jpg"}
                                alt='Admin Profile'
                                className={`w-full h-full object-cover rounded-full border-4 border-purple-100 shadow-md
                                    ${!profileImage || profileImage === "/Images/adminDp.jpg" ? 'contrast-[78%]' : ''}`}
                            />

                            <label
                                className='absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full
                                    cursor-pointer shadow-md hover:bg-purple-700 transition'
                                onClick={() => {
                                    setHeaderZIndex(0)
                                    setProfileImageModal(true)
                                }}>
                                <Camera className='w-4 h-4 text-white' />
                            </label>
                        </div>

                        <div>
                            <h2 className='text-2xl font-semibold text-gray-800'>{admin?.username || "Admin"}</h2>
                            <p className='text-sm text-gray-500'>Administrator Profile</p>
                        </div>
                    </div>
                </div>

                {!editing ? (
                    <button
                        className='flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg'
                        onClick={() => setEditing(true)}>
                        <Edit2 size={16} />
                        Edit Profile
                    </button>
                ) : (
                    <div className='flex gap-2'>
                        <button
                            className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg'
                            onClick={handleSubmit}>
                            <Check size={16} />
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                            className='flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg'
                            onClick={() => setEditing(false)}>
                            <X size={16} />
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className='grid md:grid-cols-2 gap-6' id='admin-info'>
                <InputField
                    label='First Name'
                    name='firstName'
                    value={formData.firstName || ""}
                    requiredMsg={false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!editing}
                    Icon={User}
                    error={errors.firstName}
                />

                <InputField
                    label='Last Name'
                    name='lastName'
                    value={formData.lastName || ""}
                    requiredMsg={false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!editing}
                    Icon={null}
                    error={errors.lastName}
                />

                <InputField
                    label='Username'
                    name='username'
                    requiredMsg={editing}
                    value={formData.username || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!editing}
                    Icon={null}
                    error={errors.username}
                />

                <InputField
                    label='Email'
                    name='email'
                    requiredMsg={editing}
                    value={formData.email || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!editing}
                    Icon={Mail}
                    error={errors.email}
                />

                <InputField
                    label='Mobile'
                    name='mobile'
                    requiredMsg={editing}
                    value={formData.mobile || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!editing}
                    Icon={Phone}
                    error={errors.mobile}
                />

                <div className='dob'>
                    <label className='text-sm font-medium text-gray-700'>Date of Birth</label>
                    <SingleDateSelector date={dob} setDate={setDob} isDisabled={!editing} />
                </div>

                <div>
                    <label className='text-sm font-medium text-gray-700'>Gender</label>
                    <select
                        name='gender'
                        value={formData.gender || ""}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`w-full py-2 pr-4 text-[13px] text-secondary rounded-lg border
                            ${"border-gray-300 focus:ring-purple-600"} focus:ring-2 focus:border-transparent disabled:bg-gray-50`}>
                        <option value='' className='text-muted'>
                            Select
                        </option>
                        <option value='male' className=''>
                            Male
                        </option>
                        <option value='female' className='hover:text-secondary'>
                            Female
                        </option>
                    </select>
                </div>
            </div>

            <div className='mt-10 pt-8 border-t'>
                <div className='flex justify-between items-center'>
                    <div>
                        <h2 className='text-lg font-semibold'>Security</h2>
                        <p className='text-sm text-gray-500'>Change your password</p>
                    </div>

                    <button
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg
              ${openSecurityMenu ? "bg-secondary text-white" : ""}`}
                        onClick={() => setOpenSecurityMenu((prev) => !prev)}>
                        <Lock size={16} />
                        Change Password
                        <ArrowRight size={16} />
                    </button>
                </div>

                {openSecurityMenu && (
                    <div className='mt-6'>
                        <ResetPasswordBox setOpenSecurityMenu={setOpenSecurityMenu} admin={true} />
                    </div>
                )}
            </div>

            <SelfieModal
                isOpen={profileImageModal}
                onClose={() => {
                    setHeaderZIndex(300)
                    setProfileImageModal(false)
                }}
                onCapture={(photo) => {
                    uploadPhoto(photo)
                    setProfileImageModal(false)
                }}
                userSystemPic={userSystemPic}
                setUserSystemPic={setUserSystemPic}
            />
        </section>
    )
}

function InputField({ label, Icon, name, value, requiredMsg, onChange, onBlur, disabled, error }) {
    return (
        <div className='relative pb-6'>
            <label className='text-sm font-medium text-gray-700 flex justify-between items-center'>
                {label}
                {requiredMsg && <span className='text-red-500 text-[11px]'> *Required Field </span>}
            </label>

            <div className='relative mt-1'>
                {Icon && <Icon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />}

                <input
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={`w-full py-2 pr-4 rounded-lg border
                        ${Icon ? "pl-10" : "pl-4"}
                        ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"}
                        focus:ring-2 focus:border-transparent
                        disabled:bg-gray-50`}
                />
            </div>

            <p
                className={`absolute left-0 bottom-0 text-xs text-red-500 transition-opacity duration-200
        ${error ? "opacity-100" : "opacity-0"}`}>
                {error || " "}
            </p>
        </div>
    )
}


