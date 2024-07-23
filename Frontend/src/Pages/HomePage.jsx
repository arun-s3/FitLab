import React from 'react'
import Header from '../Components/Header'

export default function HomePage(){

    const bgImg = {
        backgroundImage:"url('/Hero-section-bg2.png')",
        backgroundSize:"cover"
    }

    return(
        <div className="bg-home h-[70rem]" style={bgImg}>
            <Header/>
            <section className="absolute top-[30%] left-[10%] text-white w-1/2 overflow-visible">
                <h5 className="text-primary text-subtitleSmall1 mb-[8px]">#1 Innovative Home Gym makers on the market</h5>
                <h1 className="w-[101%]" style={{fontFamily:'funCity', fontSize:'35px'}}>Transform your space into a world class<br/> 
                    <span className="text-secondary" style={{fontFamily:'inherit'}}>Fitness Zone</span></h1>
                <p className="text-descReg1 mt-[30px] w-[70%] leading-[27px]">At  Fitlab, we deliver only the highest quality equipments with the next level precision, stability and endurance.
                   We also provide you with  revolutionary supplements and accessories for men and women</p>
            </section>
            <button type="button">Start Looking</button>
        </div>
    )
}