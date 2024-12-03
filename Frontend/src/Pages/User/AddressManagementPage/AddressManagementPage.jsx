import React,{useState, useEffect} from 'react'
import './AddressManagementPage.css'

import Header from '../../../Components/Header/Header'
import Footer from '../../../Components/Footer/Footer'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import UserSidebar from '../../../Components/UserSidebar/UserSidebar'
import {convertToCamelCase, camelToCapitalizedWords} from '../../../Utils/helperFunctions'
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'

export default function AddressManagementPage(){

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    const inputChangeHandler = (e)=> {

    }

    const inputFocusHandler = (e)=> {

    }

    const inputBlurHandler = (e)=> {

    }

    const submitAddress = ()=> {

    }
    
    const InputAndLabelGenerator = ({name, fieldType, inputType, inputStyles, labelStyles, parentStyles})=>{
        return(
                <div className={`${parentStyles ? parentStyles : 'basis-1/2 '}`}>
                    { name &&
                        <>
                        <label htmlFor={convertToCamelCase(name)} className={`block text-[13.5px] tracking-[0.3px]
                            ${labelStyles? labelStyles: ''} `}  style={{wordSpacing:'0.5px'}}> 
                           {camelToCapitalizedWords(name)} 
                       </label>
                       {!(fieldType === 'textarea') ?
                            <input type={inputType? inputType:'text'} id={convertToCamelCase(name)} className={`mt-[5px] w-full h-[2rem] 
                                px-[10px] text-[13px] text-secondary border-[1.5px] border-inputBorderSecondary rounded-[4px]
                                 bg-inputBgSecondary ${inputStyles? inputStyles : ''} caret-primaryDark`}
                                        onChange={(e)=> inputChangeHandler(e)} onBlur={(e)=> inputBlurHandler(e)}
                                           onFocus={(e)=> inputFocusHandler(e)} />
                            :<textarea id={convertToCamelCase(name)} className={`mt-[5px] w-full min-h-[2rem] 
                                px-[10px] text-[13px] text-secondary resize-none border-[1.5px] border-inputBorderSecondary rounded-[4px]
                                 bg-inputBgSecondary ${inputStyles? inputStyles : ''}  caret-primaryDark `} rows='4'
                                        onChange={(e)=> inputChangeHandler(e)} onBlur={(e)=> inputBlurHandler(e)}
                                           onFocus={(e)=> inputFocusHandler(e)} />
                       }
                        </>
                    }
                </div>
        )
    }

    return(

        <section id='AddressManagementPage'>
            <header style={headerBg}>

                <Header />

            </header>

            <BreadcrumbBar heading='add addresses' />

            <main className='flex gap-[2rem] px-[4rem] mb-[10rem]'>
                <div className='basis-[25%]'>
                    
                    <UserSidebar />

                </div>
                <div className='basis-[75%] mt-[2rem]'>
                    <div className='text-center'>
                        <h1 className='text-[20px] font-[500] capitalize'> Your Details </h1>
                        <h2 className='text-[14px] text-secondary'> Personal Information </h2>
                    </div>
                    <div id='address-content'>
                        <div className='address-fields'>
                            <InputAndLabelGenerator name='firstName'/>
                            <InputAndLabelGenerator name='lastName'/>
                        </div>
                        <div className='address-fields'>
                            <InputAndLabelGenerator name='dateOfBirth'/>
                            <InputAndLabelGenerator/>
                        </div>
                        <div className='address-fields'>
                            <InputAndLabelGenerator name='district'/>
                            <InputAndLabelGenerator name='state'/>
                        </div>
                        <div className='address-fields'>
                            <InputAndLabelGenerator name='street' fieldType='textarea' parentStyles="w-full"/>
                        </div>
                        <div className='address-fields justify-start items-baseline'>
                            <InputAndLabelGenerator name='pincode' parentStyles="basis-[30%]"/>
                            <div>
                                <h5 className='text-[13.5px] tracking-[0.3px]'> Address Type </h5>
                                <div className='mt-[10px] flex items-center gap-[1rem] address-types'>
                                    <div>
                                        <input type='radio' id='homeAddress'/>
                                        <label htmlFor='homeAddress'> Home </label>
                                    </div>
                                    <div>
                                        <input type='radio' id='workAddress'/>
                                        <label htmlFor='workAddress'> Work </label>
                                    </div>
                                    <div>
                                        <input type='radio' id='temporaryAddress'/>
                                        <label htmlFor='temporaryAddress'> Temporary </label>
                                    </div>
                                    <div>
                                        <input type='radio' id='giftAddress'/>
                                        <label htmlFor='giftAddress'> Gift </label>
                                    </div>
                                </div>
                            </div>
                            <div className='basis-[50%]'>
                                <InputAndLabelGenerator name='landmark'/>
                                <p className='mt-[2px] text-[12px] text-muted tracking-[0.2px]'> (Optional) </p>
                            </div>
                        </div>
                        
                        <div className='mt-[1rem] w-[40%] h-[2px] border-b-[1px] border-dashed border-mutedDashedSeperation'></div>
                        <h3 className='mt-[-10px] text-[15px] text-secondary font-[550] capitalize'> Contact Information </h3>

                        <div className='address-fields'>
                            <InputAndLabelGenerator name='mobileNumber'/>
                            <InputAndLabelGenerator name='email'/>
                        </div>
                        <div className='address-fields'>
                            <div className='basis-1/2'>   
                                <InputAndLabelGenerator name='alternateMobileNumber'/>
                                <p className='mt-[2px] text-[12px] text-muted tracking-[0.2px]'> (Optional) </p>
                            </div>
                            <InputAndLabelGenerator/>
                        </div>
                        <div className='text-center'>
                            <SiteButtonSquare customStyle={{fontWeight:'600', paddingInline:'50px', paddingBlock:'9px', borderRadius:'7px'}} 
                                    clickHandler={()=> submitAddress()}>
                                Add Address
                            </SiteButtonSquare>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

        </section>
    )
}