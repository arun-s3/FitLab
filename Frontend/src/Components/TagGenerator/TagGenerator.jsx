import React from 'react'
import {BsTags} from "react-icons/bs";
import {IoIosClose} from "react-icons/io";


export default function TagGenerator({tag, setTags, SetPlaceholderIcon}){

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
                    if( tag.find(tag=> tag.key == currentTag ) ){
                        console.log("Tag must be unique")
                        return
                    } 
                    setTags([...tag,
                        (<span className='single-tag' key={currentTag}>
                            <span> {currentTag}</span>
                            <IoIosClose onClick={(e)=> setTags(tag=> tag.filter(tag=> tag.key !== currentTag))}/>   
                        </span>)
                    ])
                    e.target.value=''
               }
            
            }
        }
    }
    const tagsKeyDownHandler = (e)=>{
        if(e.key=='Backspace' && !e.target.value){
            console.log("Inside tagsKeyDownHandler conditn success")
            tag && setTags(tag=> tag.slice(0,-1) )
        } 
    }
    
    return(
        <>
            <label for='product-tags'> Tags </label>
            <div className='relative w-full h-[5rem] border border-primary rounded-[5px] bg-white tags-wrapper'>        
                {tag? tag: ''}
               <SetPlaceholderIcon icon={<BsTags/>} fromTop={15} />
               <input type='text' placeholder='Type each tag followed by a space' maxlength='60' id='product-tags'
                     className='w-[11rem] h-[2rem] text-[11px] text-secondary' style={{width:'10rem', height:'2rem', marginLeft:'9px', border:'0'}} 
                               onChange={(e)=> tagsInputHandler(e)} onKeyDown={(e)=> tagsKeyDownHandler(e)}/>
            </div>
        </>
    )
}