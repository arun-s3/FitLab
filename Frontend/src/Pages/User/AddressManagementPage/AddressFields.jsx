import React, {useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {motion} from "framer-motion"

import {ArrowLeft, Eraser} from 'lucide-react'

import {InputLabelGenerator} from './InputLabelGenerator'
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'
import {CustomHashLoader} from '../../../Components/Loader/Loader'


export default function AddressFields({editAddresses, addressData, setAddressData, onChange, onRadioClick, onRadioChange, 
    radioCheckedAddressType, onSubmit}){

    const primaryColor = useRef('rgb(218 179 246)')

    const addressTypes = ['home', 'work', 'temporary', 'gift']

    const navigate = useNavigate()
    const {loading} = useSelector(state=> state.address)

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.40, 
          when: "beforeChildren"
        }
      }
    }

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 70, damping: 12 }
      }
    }


    return(
        
        <div id='address-content' className='relative'>
            <motion.div 
                className='address-fields flex-col xs-sm2:!flex-row'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >   
                <motion.div variants={itemVariants} className='w-full'>
                    <InputLabelGenerator name='firstName' 
                        dataObj={addressData} 
                        setDataObj={setAddressData}
                        primaryColor={primaryColor} 
                        onChange={onChange}
                    />
                </motion.div>
                <motion.div variants={itemVariants} className='w-full'>
                    <InputLabelGenerator name='lastName' 
                        onChange={onChange} 
                        dataObj={addressData ? addressData : null}
                        setDataObj={setAddressData} primaryColor={primaryColor} 
                    />
                </motion.div>
            </motion.div>
            <motion.div 
                className='address-fields'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className='basis-full md:basis-1/2'>
                    <InputLabelGenerator name='nickName' 
                        onChange={onChange} 
                        optionalField={true} 
                        optionalMsg= "(Optional- Keeping Nickname would give a personal touch, if it's a Gift Address)"
                        dataObj={addressData} 
                        setDataObj={setAddressData} 
                        primaryColor={primaryColor} 
                    />
                </motion.div>
                <div className='hidden md:inline-block basis-1/2'>
                    <InputLabelGenerator/>
                </div>
            </motion.div>
            <motion.div 
                className='address-fields flex-col xs-sm2:!flex-row'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >   
                <motion.div variants={itemVariants} className='w-full'>
                    <InputLabelGenerator name='district' 
                        onChange={onChange} 
                        dataObj={addressData} 
                        setDataObj={setAddressData} 
                        primaryColor={primaryColor} 
                    />
                </motion.div>
                <motion.div variants={itemVariants} className='w-full'>
                    <InputLabelGenerator name='state' 
                        onChange={onChange} 
                        dataObj={addressData} setDataObj={setAddressData} primaryColor={primaryColor} />
                </motion.div>
            </motion.div>
            <motion.div 
                className='address-fields'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className='w-full'>
                    <InputLabelGenerator name='street' 
                        fieldType='textarea' 
                        parentStyles="w-full" 
                        rows={3}
                        onChange={onChange} 
                        dataObj={addressData} 
                        setDataObj={setAddressData} 
                        primaryColor={primaryColor}
                    />
                </motion.div>
            </motion.div>
            <motion.div 
                className='address-fields flex-col xs-sm2:flex-row justify-start items-baseline flex-wrap lg:flex-nowrap'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className='w-full'>
                    <InputLabelGenerator name='pincode' 
                        parentStyles="w-full xs-sm2:w-auto basis-full s-sm:basis-[28%] xx-md:basis-[40%] lg:basis-[30%]" 
                        onChange={onChange} 
                        dataObj={addressData} 
                        setDataObj={setAddressData} 
                        primaryColor={primaryColor} 
                    />
                </motion.div>
                <motion.div variants={itemVariants} className='w-full'>
                    <div className='w-full xs-sm2:w-auto  max-s-sm:basis-full'>
                        <h5 className='text-[13.5px] tracking-[0.3px]'> Address Type </h5>
                        <div className='mt-[10px] flex flex-col mob:flex-row items-start mob:items-center
                          gap-[5px] mob:gap-0 s-sm:gap-[1rem] justify-between s-sm:justify-normal address-types'>
                                {
                                    addressTypes.map(type=> (
                                        <div>
                                            <input type='radio' 
                                                id={type} 
                                                onClick={(e)=> onRadioClick(e)} 
                                                onChange={(e)=> onRadioChange(e)} 
                                                checked={radioCheckedAddressType === type}
                                            />
                                            <label htmlFor={type} 
                                                className='!text-[12.5px] mob:!text-[11px] xxs-sm:!text-[12.5px] text-secondary'> 
                                                    { capitalizeFirstLetter(type) } 
                                            </label>
                                        </div>
                                    ))
                                }
                        </div>
                    </div>
                </motion.div>
                <motion.div 
                    variants={itemVariants} 
                    className='w-full'
                >
                    <div className='w-full xs-sm2:w-auto basis-full lg:basis-[50%]'>
                        <InputLabelGenerator name='landmark' 
                            optionalField={true} 
                            onChange={onChange} 
                            dataObj={addressData} 
                            setDataObj={setAddressData} 
                            primaryColor={primaryColor} 
                            optionalMsg='(Optional)'
                        />
                    </div>
                </motion.div>
            </motion.div>
            <motion.div 
                className='address-fields'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >   
                <motion.div variants={itemVariants} className='w-full'>
                    <InputLabelGenerator name='deliveryInstructions' 
                        fieldType='textarea' 
                        parentStyles="w-full" 
                        onChange={onChange} 
                        dataObj={addressData} 
                        setDataObj={setAddressData} 
                        primaryColor={primaryColor}
                        optionalField={true} optionalMsg="Example- 'Leave at the front door. @123 (Optional)'" 
                        rows={4}
                    />
                </motion.div>
            </motion.div>  
                        
            <div className='mt-[1rem] w-[40%] h-[2px] border-b-[1px] border-dashed border-mutedDashedSeperation'></div>
            <h3 className='mt-[-10px] text-[15px] text-secondary font-[550] capitalize'> Contact Information </h3>
            <motion.div 
                className='address-fields flex-col xs-sm2:!flex-row'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >   
                <motion.div variants={itemVariants} className='w-full'>
                    <InputLabelGenerator name='mobile' 
                        label='mobileNumber' 
                        onChange={onChange} 
                        dataObj={addressData} 
                        setDataObj={setAddressData} 
                        primaryColor={primaryColor} 
                    />
                </motion.div>
                <motion.div variants={itemVariants} className='w-full'>
                    <InputLabelGenerator name='email' 
                        onChange={onChange} 
                        dataObj={addressData} 
                        setDataObj={setAddressData} 
                        primaryColor={primaryColor} 
                    />
                </motion.div>
            </motion.div>
            <motion.div 
                className='address-fields'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >   
                <motion.div variants={itemVariants} className='basis-full md:basis-1/2'>
                    <InputLabelGenerator name='alternateMobile' 
                        label='alternateMobileNumber'
                        optionalField={true} 
                        optionalMsg="(Optional)" 
                        onChange={onChange} 
                        dataObj={addressData}
                        setDataObj={setAddressData} 
                        primaryColor={primaryColor} 
                    />
                </motion.div>
                <div className='hidden md:inline-block basis-1/2'>
                    <InputLabelGenerator/>
                </div>    
            </motion.div>
            <div className='w-full xs-sm2:w-auto static xs-sm2:absolute right-0 max-s-sm:top-[-3rem] 
              s-sm:bottom-16 md:bottom-[5.5rem] text-end'>
                <button className="ml-auto py-[7px] xs-sm2:py-[6px] s-sm:py-2 w-full xs-sm2:w-auto flex items-center
                   justify-center  xs-sm2:justify-normal gap-2 px-[10px] s-sm:px-[1rem] xs-sm2:text-[12px] s-sm:text-[15px]
                 bg-purple-600 text-white font-[500] rounded-[7px] hover:bg-purple-700 transition-colors"
                 onClick={()=> setAddressData({})}
                 >
                    <Eraser className="w-[14px] h-[14px] s-sm:w-4 s-sm:h-4" />
                    Clear
                </button>
            </div>
            <div className='w-full xs-sm2:w-auto max-xs-sm2:-mt-4 s-sm:mt-8 md:mt-auto flex justify-between 
              xs-sm2:justify-center items-center gap-4 flex-wrap xxs-sm:flex-nowrap'>
                <motion.div
                  className='w-full xxs-sm:w-auto text-secondary hover:text-white'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                >
                    <button 
                        className='px-[23px] xs-sm2:px-[30px] s-sm:px-[57px] py-[7px] text-[14px] xs-sm2:text-[15px] 
                         s-sm:text-[16px] tracking-[0.2px] text-black flex items-center justify-center gap-[10px] font-semibold
                         w-full xxs-sm:w-auto transition duration-300 border-2 border-secondaryLight2 rounded-[7px]
                         hover:text-white hover:bg-purple-500 hover:border-purple-500' 
                        clickHandler={()=> navigate('../')}
                    >
                    <ArrowLeft size={17} className='text-inherit'/>  
                    Back
                </button>
                </motion.div>
                <motion.div
                  className='w-full xxs-sm:w-auto'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                >
                    <SiteButtonSquare 
                        tailwindClasses='!px-[23px] xs-sm2:!px-[30px] s-sm:!px-[50px] text-[14px] xs-sm2:!text-[15px]
                         s-sm:!text-[16px] !w-full xxs-sm:!w-auto'
                        customStyle={{fontWeight:'600', paddingBlock:'9px', borderRadius:'7px'}} 
                        clickHandler={()=> onSubmit()}>
                            {
                                loading 
                                    ? <CustomHashLoader loading={loading}/> 
                                    : editAddresses 
                                    ? 'Save Address' 
                                    : 'Add Address'
                            }   
                    </SiteButtonSquare>
                </motion.div>
            </div>
        </div>

    )
}