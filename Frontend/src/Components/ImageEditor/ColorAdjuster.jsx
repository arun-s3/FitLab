import React from 'react'

export default function ColorAdjuster({params, setters}){

    const {brightness, contrast, saturate} = params
    const {setBrightness, setContrast, setSaturate} = setters

    const resetAll = () => {
      setBrightness(100)
      setContrast(100)
      setSaturate(100)
    }

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
            <div className="flex gap-2 mt-12">
              <button 
                className="px-[18px] py-1 text-white text-[15px] font-medium tracking-[0.3px] bg-secondary rounded-[4px]
                 hover:bg-purple-700 transition duration-300" 
                onClick={resetAll}>
                    Reset
              </button>
            </div>
        </div>
    )
}