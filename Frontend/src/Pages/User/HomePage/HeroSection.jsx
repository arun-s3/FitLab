import React from 'react'
import './HeroSection.css'

import {FaFacebook, FaInstagramSquare, FaLinkedin} from "react-icons/fa"
import {CiFacebook, CiInstagram, CiLinkedin} from "react-icons/ci"

import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'


export default function HeroSection(){

    return(
        <div>
 
            <div className="absolute top-[30%] left-[10%] text-white w-full l-md:w-3/4 x-lg:w-1/2 overflow-visible ml-0 
              xx-md:ml-14 x-lg:ml-0">
                <h5 className="hero-subtitle text-primary text-subtitleSmall1 mb-[8px]">
                     #1 Innovative Home Gym makers on the market 
                </h5>
                <h1 
                    className="hero-heading w-3/4 md:w-[101%] x-lg:text-[32px] xx-md:text-[30px] sm:text-[26px] xs-sm:text-[23px]" 
                    style={{fontFamily:'funCity'}}
                >
                    Transform your space into a world class
                    <br className="hidden sm:block"/> 
                    <span className="text-secondary typewriter" style={{fontFamily:'inherit'}}> Fitness Zone </span>
                </h1>
                <p className="hero-paragraph text-[13px] xs-sm2:text-[14px] s-sm:text-descReg1 mt-[30px] leading-[27px]
                  mb-[45px] s-sm:mb-[60px] w-[70%] mob:w-[80%] xs-sm:w-[85%] sm:w-[80%] x-md:w-[70%]"
                >
                   At  Fitlab, we deliver only the highest quality equipments with the next level precision, stability and endurance.
                   We also provide you with  revolutionary supplements and accessories for men and women
                </p>
                <button 
                    className='hero-button text-black font-[500] text-[12px] mob:text-[13px] sm:text-descReg1 tracking-[0.5px] 
                      bg-primary rounded-[7px] shadow-[0_0_20px_var(--PRIMARY)] py-[9px] px-[22px] sm:py-[12px] sm:px-[30px]'> 
                    Start Looking 
                </button>
            </div>

            <aside 
                id="socials" 
                className='text-white text-[28px] hidden mob:flex flex-row l-md:flex-col gap-[1rem] items-center justify-center
                    absolute l-md:top-[16rem] l-md:right-[2rem] max-l-md:left-[41%] max-xs-sm:bottom-[11rem] max-l-md:-bottom-4'
            >
                <hr className='hidden l-md:inline-block w-[3px] h-[10rem] bg-primary opacity-[0.41] mb-[1rem] mr-[5px]'/>
                <CiFacebook className='cursor-pointer'/>
                <CiInstagram className='cursor-pointer'/>
                <CiLinkedin className='cursor-pointer'/>  
            </aside> 

        </div>
          
    )
}