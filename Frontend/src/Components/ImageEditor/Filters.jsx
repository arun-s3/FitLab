import React from 'react'

export default function Filters({params, setters}){

    const {grayscale, blur, sepia, opacity} = params
    const {setGrayscale, setBlur, setSepia, setOpacity} = setters

    const resetAll = () => {
      setGrayscale(0)
      setBlur(0)
      setSepia(0)
      setOpacity(100)
    }

    return(
        <div id='panel'>
            <h3> Filters </h3>
            <div className='ranges'>
                <div>
                    <label for='grayscale'> Grayscale </label>
                    <input id='grayscale' type='range' min='0' max='200' value={grayscale} onChange={(e)=> setGrayscale(e.target.value)} />
                </div>
                <div>
                    <label for='blur'> Blur </label>
                    <input id='blur' type='range' min='0' max='200'  value={blur} onChange={(e)=> setBlur(e.target.value)} />
                </div>
                <div>
                    <label for='sepia'> Sepia </label>
                    <input id='sepia' type='range' min='0' max='200' value={sepia} onChange={(e)=> setSepia(e.target.value)} />
                </div>
                <div>
                    <label for='opacity'> Opacity </label>
                    <input id='opacity' type='range' min='0' max='200' value={opacity} onChange={(e)=> setOpacity(e.target.value)} />
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