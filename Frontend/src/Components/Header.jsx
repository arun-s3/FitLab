import React from 'react'
import Logo from './Logo'
import './Header.css'
import {Link} from 'react-router-dom'
import {SiteButton} from './SiteButton'
import { IoIosSearch } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { MdFavoriteBorder } from "react-icons/md";

export default function Header({customStyle}){
    return(
        <header className="flex justify-between items-center text-white padding-main sticky z-10"  style={customStyle}>
            {/* <Logo/> */}
            <img src="/Logo_main.png" alt="Fitlab" className="h-[5rem] "/>   {/*mt-[10px]*/}
            <nav>
                <ul className="inline-flex items-center gap-[30px] list-none text-descReg1 tracking-[0.2px]"> {/*mt-[4px]*/}
                    <li><Link>Home</Link>
                    </li>
                    <li><Link>Shop by Categories</Link>
                    </li>
                    <li><Link>Products</Link>
                    </li>
                    <li><Link>Blogs</Link>
                    </li>
                    <li><Link>About Us</Link> 
                    </li>
                </ul>
            </nav>
            <div className="inline-flex gap-[15px] items-center">
                <IoIosSearch style={{fontSize:'23px'}}/>
                <CiUser style={{fontSize:'25px'}}/>
                <IoCartOutline style={{fontSize:'23px'}}/>
                <MdFavoriteBorder style={{fontSize:'25px'}}/>
                <SiteButton text="Sign In" customStyle={{marginLeft:'25px'}}/>
            </div>
            
        </header>
    )
}