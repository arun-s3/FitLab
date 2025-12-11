import React from 'react'

export default function ImageCropper({zoom, setZoom, crop, setCrop, onResetAll}){


    return(
        <div id='panel'>
            <h3>Cropper</h3>
            <div className='ranges'>
                <div>
                    <label for='zoom-range'> Zoom </label>
                    <input type="range" id="zoom-range" min="1" max="3" step="0.1" value={zoom} 
                        onChange={(e) => setZoom(Number(e.target.value))} className='w-[250px] h-[3px]'/>
                </div>
            </div>
            <div className="flex gap-2 mt-12">
              <button 
                className="px-[18px] py-1 text-white text-[15px] font-medium tracking-[0.3px] bg-secondary rounded-[4px]
                 hover:bg-purple-700 transition duration-300" 
                onClick={onResetAll}>
                    Reset
              </button>
            </div>
        </div>
    )
}