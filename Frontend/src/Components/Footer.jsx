import React from 'react'
import {Link} from 'react-router-dom'
import './Footer.css'
import { FaFacebook, FaTwitter, FaInstagram , FaPinterest, FaYoutube    } from "react-icons/fa";
import { CiYoutube } from "react-icons/ci";
import { SiteButtonSquare } from './SiteButton';

export default function Footer(){
    return(
        <footer className='flex items-center justify-between gap-[3.8rem] padding-main py-[2.3rem]'>
            <div className='basis-[380px]'>
                <figure>
                    <img src="/Logo_main.png" alt="Fitlab" className="h-[5rem] "/>   {/*mt-[10px]*/}
                </figure>
                <p className='inline-block capitalize text-small font-sairaCondensed  text-muted ml-[28px] font-medium' 
                   style={{wordSpacing:'0.5px'}}>
                    Sparking up fitness passion with the best workout gear. We're really pros at making gyms and CrossFit spaces
                    for homes and businesses all  across India. Pump up your fitness routine with our expert touch!
                </p>
                <nav className='flex gap-[1rem] items-center ml-[28px] mt-[24px] text-white' id="footer-socials">
                    <FaFacebook className='text-primary'/>
                    <FaTwitter/>
                    <FaInstagram/>
                    <FaPinterest/>
                    <FaYoutube/>
                </nav>
            </div>
            <nav className='flex gap-[4rem] items-center text-primary'>
                    <ul className='inline-block list-none text-descReg1'>
                        <li> <h6 className='text-secondary'>CATEGORY</h6> </li>
                        <li> <Link>Strength</Link> </li>
                        <li> <Link>Cardio</Link> </li>
                        <li> <Link>Supplements</Link> </li>
                        <li> <Link>Accessories</Link> </li>
                    </ul>
                    <ul className='inline-block list-none text-descReg1'>
                        <li> <h6 className='text-secondary'>SUPPORT</h6> </li>
                        <li> <Link>Help & Support</Link> </li>
                        <li> <Link>Terms & Conditions</Link> </li>
                        <li> <Link>Privacy Policy</Link> </li>
                        <li> <Link>Help</Link> </li>
                    </ul>
            </nav>
            <div className='ml-[6.7rem] w-[430px]'>
                <h4 className='text-descReg1 text-white mb-[3px] tracking-[0.2px]' style={{fontSize:'17px'}}>Newsletter</h4>
                <div>
                    <input type="email" placeholder="Your email" name="email" autocomplete 
                           className='placeholder-[13px] py-[6px] pl-[14px] mr-[25px] rounded-[7px] w-[17rem] placeholder:text-[12px]'/>
                    <SiteButtonSquare text="Subscribe"/>
                    <p className='text-descReg1 text-muted mt-[1rem]'>Get daily news on upcoming offers from many suppliers all over the world</p>
                </div>
            </div>
        </footer>
    )
}
