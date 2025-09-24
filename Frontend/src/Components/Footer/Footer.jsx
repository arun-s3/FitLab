import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa'

import { SiteButtonSquare } from '../SiteButtons/SiteButtons'


export default function Footer() {
    
  return (
    <footer className="padding-main py-[2.3rem] text-white max-xs-sm2:overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 items-start">
        <div className="space-y-4 w-[380px]">
          <figure>
            <img src="/Logo_main.png"
               alt="Fitlab"
               className="h-[5rem]" />
          </figure>
          <p className="ml-[28px] mt-[-2px] capitalize text-small font-sairaCondensed text-muted font-medium 
           max-xxs-sm:w-[75%] max-xs-sm2:w-[85%]"
            style={{ wordSpacing: '0.5px' }}
          >
            Sparking up fitness passion with the best workout gear. We're really pros at making gyms and CrossFit spaces
            for homes and businesses all across India. Pump up your fitness routine with our expert touch!
          </p>
          <nav className="ml-[28px] flex flex-wrap gap-4 items-center text-white"
           id="footer-socials"
           aria-label="Social media">
            <FaFacebook className="text-primary" />
            <FaTwitter />
            <FaInstagram />
            <FaPinterest />
            <FaYoutube />
          </nav>
        </div>

        <nav className="mt-[24px] sm:ml-[28px] md:ml-[40px] x-md:ml-0 flex lg:ml-[4.5rem] xl:ml-0 gap-[4rem] lg:gap-[2rem]
         xl:gap-[4rem] items-center text-primary">
          <ul className="list-none text-descReg1 lg:text-[13px] xl:text-descReg1">
            <li> <h6 className="text-secondary text-descReg1 lg:text-[13px] xl:text-descReg1 whitespace-nowrap"> CATEGORY </h6></li>
            <li> <Link> Strength </Link> </li>
            <li> <Link> Cardio </Link> </li>
            <li> <Link> Supplements </Link> </li>
            <li> <Link> Accessories </Link> </li>
          </ul>
          <ul className="list-none text-descReg1 lg:text-[13px] xl:text-descReg1 whitespace-nowrap">
            <li><h6 className="text-secondary text-descReg1 lg:text-[13px] xl:text-descReg1"> SUPPORT </h6></li>
            <li className='block lg:hidden xl:block'>
                <Link> Help &amp; Support </Link>
            </li>
            <li className='hidden lg:block xl:hidden'>
                <Link> Help Desk </Link>
            </li>
            <li className='block lg:hidden xl:block white'>
                <Link> Terms &amp; Conditions </Link>
            </li>
            <li className='hidden lg:inline-block xl:hidden'>
                <Link> T &amp; C </Link>
            </li>
            <li> <Link> Privacy Policy </Link> </li>
            <li> <Link> Help </Link> </li>
          </ul>
        </nav>

        <div className='sm:ml-[28px] md:ml-0'>
          <h4 className="text-white mt-[2rem] mb-[3px] tracking-[0.2px] lg:text-[15px] xl:text-[17px]"> Newsletter </h4>
          <form className="flex flex-col sm:flex-row sm:justify-between items-stretch gap-3"
             onSubmit={(e)=> e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              name="email"
              autoComplete="email"
              className="placeholder:text-[12px] py-[6px] pl-[14px] rounded-[7px] w-full md:w-auto lg:min-w-[12rem] xl:min-w-[17rem]
               bg-white/90 text-black"
            />
            <SiteButtonSquare tailwindClasses='lg:text-[14px] xl:text-[15px] lg:px-[14px] xl:px-[25px]'> Subscribe </SiteButtonSquare>
          </form>
          <p className="sm:text-[13px] lg:text-[12px] xl:text-[14px] text-muted mt-4">
            Get daily news on upcoming offers from many suppliers all over the world
          </p>
        </div>
      </div>

      {/* <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Fitlab. All rights reserved.
      </div> */}
    </footer>
  )
}
