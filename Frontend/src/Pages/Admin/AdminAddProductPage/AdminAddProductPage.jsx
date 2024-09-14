import React,{useState, useRef, useEffect} from 'react'
import './AdminAddProductPage.css'

import {GoPackage} from "react-icons/go";
import {MdCurrencyRupee} from "react-icons/md";
import {LuPackageSearch} from "react-icons/lu";
import {RiWeightLine} from "react-icons/ri";
import {AiOutlineSafetyCertificate} from "react-icons/ai";
import {CgDetailsMore} from "react-icons/cg";
import {BsTags} from "react-icons/bs";
import {IoIosClose} from "react-icons/io";

function PlaceholderIcon({icon, fromBottom}){
    return(
        <span className='absolute bottom-[35%] left-[8px] text-[#6b7280] text-[11px]' style={fromBottom? {bottom: `${fromBottom}%`}: null}>
             {icon} 
        </span>
    )
}
export default function AdminAddProductPage(){

    const [singleTags, setSingleTags] = useState([])

    useEffect(()=>{
        console.log("singleTags-->", JSON.stringify(singleTags))
    },[singleTags])

    const inputFocusHandler = (e)=>{ e.target.nextElementSibling.style.display = 'none' }
    const inputBlurHandler = (e)=>{ e.target.value.trim()? null : e.target.nextElementSibling.style.display = 'inline-block'}

    const tagsInputHandler = (e)=>{
        if(e.target.value.trim()){
            console.log("Value inside tag")
            if(e.target.parentElement.scrollHeight > e.target.parentElement.clientHeight ){
                e.target.value = ''
                e.target.style.display = 'none'
                console.log("Overflowing..")
                return
            }
            else{
                if(e.target.scrollWidth > e.target.clientWidth){
                    console.log("Overflowing width")
                    e.target.style.width = `${e.target.scrollWidth}px`
                }
                if(e.target.value.length == e.target.maxLength){
                    console.log("Maxlength exceeded!")
                }
                if(( (/\w+\s+/).test(e.target.value) )){
                    console.log("Space found!")     
                    const currentTag = e.target.value.trim()   
                    if( singleTags.find(tag=> tag.key == currentTag ) ){
                        console.log("Tag must be unique")
                        return
                    } 
                    setSingleTags([...singleTags,
                        (<span className='single-tag' key={currentTag}>
                            <span> {currentTag}</span>
                            <IoIosClose onClick={(e)=> setSingleTags(singleTags=> singleTags.filter(tag=> tag.key !== currentTag))}/>   
                        </span>)
                    ])
                    e.target.value=''
               }
            
            }
        }
    }

    return(
        <section id='AdminAddProduct'>
            <h1> Add Product </h1>
            <main className='flex gap-[10px]'>
                <div className='flex flex-col gap-[10px] justify-center basis[55%] w-[55%]'>
                    <div className='flex flex-col gap-[1rem] justify-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            <label for='product-name'> Product Name</label>
                            <div className='relative'>
                                <input type='text' placeholder='Type name here' id='product-name' required className='pl-[21px] w-full' 
                                            onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e)}/>
                                <PlaceholderIcon icon={<GoPackage/>}/>
                            </div>
                        </div>
                        <div className='flex gap-[5px] items-center'>
                            <div className='input-wrapper'>
                                <label for='product-price'> Price </label>
                                <div className='relative'>
                                    <input type='number' id='product-price' required className='pl-[21px]' 
                                                onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e)}/>
                                    <PlaceholderIcon icon={<MdCurrencyRupee/>}/>
                                </div>
                            </div>
                            <div className='input-wrapper'>
                                <label for='product-stock'> Stock </label>
                                <div className='relative'>
                                    <input type='number' placeholder='' id='product-stock' required className='pl-[21px]' 
                                            onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e)} />
                                    <PlaceholderIcon icon={<LuPackageSearch/>}/>
                                </div>
                            </div>
                            <div className='input-wrapper'>
                                <label for='product-weight'> Weight </label>
                                <div className='relative'>
                                    <input type='number' placeholder='' id='product-weight' required  className='pl-[21px]' 
                                                onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e)} />
                                    <PlaceholderIcon icon={<RiWeightLine/>}/>
                                </div>
                            </div>
                        </div>
                        <div className='input-wrapper'>
                            <label for='product-brand'> Brand </label>
                            <div className='relative'>
                                <input type='text' placeholder='Brand name' id='product-brand' required  className='pl-[21px] w-full' 
                                                onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e)}/>
                                <PlaceholderIcon icon={<AiOutlineSafetyCertificate/>}/>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            <label for='product-description'> Description </label>
                            <div className='relative'>
                                <textarea placeholder='Type description here' rows='3' cols='70' maxlength='100' id='product-description'
                                    required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e)}/>
                                <PlaceholderIcon icon={<CgDetailsMore/>} fromBottom={70} />
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center product-input-wrapper'>
                        <div className='input-wrapper'>
                            <label for='product-tags'> Tags </label>
                            <div className='relative w-full h-[5rem] border border-primary rounded-[5px] bg-white tags-wrapper'>
                                {/* <textarea placeholder='Type each tag followed by a space' rows='3' cols='70' maxlength='100' id='product-tags' 
                                        required className='pl-[21px]' onFocus={(e)=> inputFocusHandler(e)} onBlur={(e)=> inputBlurHandler(e)}/> */}
                                        {singleTags? singleTags: ''}
                                        <PlaceholderIcon icon={<BsTags/>} fromBottom={70} />
                                        <input type='text' placeholder='Type each tag followed by a space' maxlength='60'
                                                 className='w-[11rem] h-[2rem] text-[11px] text-secondary'
                                                 style={{width:'10rem', height:'2rem', marginLeft:'9px', border:'0'}} id='product-tags'
                                                    onChange={(e)=> tagsInputHandler(e)}/>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div>

                </div>
            </main>
        </section>
    )
}