import React from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import {SiteButtonDark} from '../Components/SiteButton'
import {FaFacebook, FaInstagramSquare, FaLinkedin} from "react-icons/fa";
import {CiFacebook, CiInstagram, CiLinkedin} from "react-icons/ci";

export default function HomePage(){
    const bgImg = {
        backgroundImage:"url('/Hero-section-bg2.png')",
        backgroundSize:"cover"
    }

    return(
      <>
        <div className="bg-home h-[70rem]" style={bgImg}>
            <Header/>
            <section className="absolute top-[30%] left-[10%] text-white w-1/2 overflow-visible u">
                <h5 className="text-primary text-subtitleSmall1 mb-[8px]">#1 Innovative Home Gym makers on the market</h5>
                <h1 className="w-[101%]" style={{fontFamily:'funCity', fontSize:'35px'}}>Transform your space into a world class<br/> 
                    <span className="text-secondary" style={{fontFamily:'inherit'}}>Fitness Zone</span></h1>
                <p className="text-descReg1 mt-[30px] w-[70%] leading-[27px] mb-[60px]">
                   At  Fitlab, we deliver only the highest quality equipments with the next level precision, stability and endurance.
                   We also provide you with  revolutionary supplements and accessories for men and women
                </p>
                <SiteButtonDark> Start Looking </SiteButtonDark>
            </section>
            <aside id="socials" className='text-secondary text-[28px] flex flex-col gap-[1rem] items-center justify-center
                                         absolute top-[16rem] right-[2rem]'>
                <hr className='w-[1px] h-[10rem] bg-primary opacity-[0.41] mb-[1rem]'/>
                <CiFacebook className='cursor-pointer'/>
                <CiInstagram className='cursor-pointer'/>
                <CiLinkedin className='cursor-pointer'/>  
            </aside> 
        </div>
        <Footer/>
      </>
    )
}