import React from "react"


export default function ColorCorrection({ params, setters }) {

  const {channelR = 0, channelG = 0, channelB = 0, temperature = 0, tint = 0, hueRotate = 0} = params

  const {setChannelR, setChannelG, setChannelB, setTemperature, setTint, setHueRotate} = setters

  const resetAll = () => {
    setChannelR(0)
    setChannelG(0)
    setChannelB(0)
    setTemperature(0)
    setTint(0)
    setHueRotate(0)
  }

  return (
    <div id="panel">
      <h3>Color Correction</h3>

      <div className="ranges space-y-1 !mt-8">
        <div>
          <label htmlFor="r"> Red </label>
          <input id="r" type="range" min="-100" max="100" value={channelR} onChange={(e) => setChannelR(Number(e.target.value))}/>
        </div>

        <div>
          <label htmlFor="g">Green</label>
          <input id="g" type="range" min="-100" max="100" value={channelG} onChange={(e) => setChannelG(Number(e.target.value))}/>
        </div>

        <div>
          <label htmlFor="b">Blue</label>
          <input id="b" type="range" min="-100" max="100" value={channelB} onChange={(e) => setChannelB(Number(e.target.value))}/>
        </div>

        <hr />

        <div>
          <label htmlFor="temp">Temperature</label>
          <input id="temp" type="range" min="-100" max="100" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))}/>
        </div>

        <div>
          <label htmlFor="tint">Tint</label>
          <input id="tint" type="range" min="-100" max="100" value={tint} onChange={(e) => setTint(Number(e.target.value))}/>
        </div>

        <hr />

        <div>
          <label htmlFor="hue">Hue Rotate</label>
          <input id="hue" type="range" min="-180" max="180" value={hueRotate} onChange={(e) => setHueRotate(Number(e.target.value))}/>
        </div>

        <div className="flex gap-2 mt-3">
          <button 
            className="mb-8 px-[18px] py-1 text-white text-[15px] font-medium tracking-[0.3px] bg-secondary rounded-[4px]
             hover:bg-purple-700 transition duration-300" 
            onClick={resetAll}>
                Reset
          </button>
        </div>
      </div>
    </div>
  )
}
