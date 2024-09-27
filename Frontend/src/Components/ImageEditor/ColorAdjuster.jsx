import React from 'react'

export default function ColorAdjuster({params, setters}){

    const {brightness, contrast, saturate} = params
    const {setBrightness, setContrast, setSaturate} = setters

    return(
        <div id='panel'>
            <h3>Color Adjustments</h3>
            <div className='ranges'>
                <div>
                    <label for='brightness'> Brightness </label>
                    <input id='brightness' type='range' min='0' max='200' value={brightness} onChange={(e)=> setBrightness(e.target.value)} />
                </div>
                <div>
                    <label for='contrast'> Contrast </label>
                    <input id='contrast' type='range' min='0' max='200'  value={contrast} onChange={(e)=> setContrast(e.target.value)} />
                </div>
                <div>
                    <label for='saturation'> Saturation </label>
                    <input id='saturation' type='range' min='0' max='200' value={saturate} onChange={(e)=> setSaturate(e.target.value)} />
                </div>
            </div>
        </div>
    )
}