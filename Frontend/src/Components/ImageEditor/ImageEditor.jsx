import React,{useState, useEffect, useRef} from 'react'
import './ImageEditor.css'
import {useSelector} from 'react-redux'

import {toast as sonnerToast} from 'sonner'
import Cropper from "react-easy-crop"
import {getCroppedImg} from "../ImageCropper/ImageCropperUtilities"
import {LuUndo2} from "react-icons/lu"
import {LuRedo2} from "react-icons/lu"

import Panel from './Panel'
import ColorAdjuster from './ColorAdjuster'
import Filters from './Filters'
import RotationAndFilpTool from './RotationAndFilpTool'
import ColorCorrection from './ColorCorrection'
import ImageCropper from './Cropper'
import Logo from '../Logo/Logo'
import {SiteButtonSquare} from '../SiteButtons/SiteButtons'


export default function ImageEditor(){

    const headerBg = {
        backgroundImage: "url('/Images/Background.png')",
    }

    const [showControlPanel, setShowControlPanel] = useState(true)
    const [showPanel, setShowPanel] = useState({
        colorAdjuster: true,
        colorChannels: false, 
        filters: false,
        cropper: false,
        rotator: false, 
        textEditor: false
    })
    const previewRef = useRef(null)
    const originalAspectRatio = useRef(null)

    const [loading, setLoading] = useState(null)
    const [loadStart, setLoadStart] = useState(0)
    const [apply, setApply] = useState(false)
    const loadStartInterval = useRef(null)

    const canvasRef = useRef(null)
    const imgRef = useRef(null)
    const [image, setImage] = useState({})
    
    const [brightness, setBrightness] = useState(100)
    const [contrast, setContrast] = useState(100)
    const [saturate, setSaturate] = useState(100)

    const [grayscale, setGrayscale] = useState(0)
    const [blur, setBlur] = useState(0)
    const [sepia, setSepia] = useState(0)
    const [opacity, setOpacity] = useState(100)

    const [rotate, setRotate] = useState(0)
    const [scaleX, setScaleX] = useState(1)
    const [scaleY, setScaleY] = useState(1)

    const [channelR, setChannelR] = useState(0)      
    const [channelG, setChannelG] = useState(0)
    const [channelB, setChannelB] = useState(0)

    const [temperature, setTemperature] = useState(0) // -100 (cool) / +100 (warm)
    const [tint, setTint] = useState(0)               // -100 (magenta) / +100 (green)
    const [tempR, setTempR] = useState(0)
    const [tempG, setTempG] = useState(0)
    const [tempB, setTempB] = useState(0)
    const [tintR, setTintR] = useState(0)
    const [tintG, setTintG] = useState(0)
    const [hueRotate, setHueRotate] = useState(0)     // -180/180 degrees

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [uncroppedImage, setUncroppedImage] = useState(null)
    const [resetCrop, setResetCrop] = useState(false)

    const [previewURL, setPreviewURL] = useState(null)

    const [warnedAdultery, setWarnedAdultery] = useState(false)

    const {admin} = useSelector(state=> state.admin)

useEffect(() => {
    window.opener.postMessage('child-ready', '*');
    const messageHandler = (event) => {
        if (event.data.type === 'target-img') {
            const { blob, name } = event.data
            const reader = new FileReader()
            reader.onload = ()=>{
                const base64URL = reader.result
                setImage({name, url: base64URL})  
            }
            reader.readAsDataURL(blob) 
        }
        if(event.data.type === 'loading-img'){
            clearInterval(loadStartInterval.current)
            setLoadStart(null)
            setLoading(event.data.progress)
        }
    }
    
    window.addEventListener('message', messageHandler)

    return () => {
        window.removeEventListener('message', messageHandler)
    }
}, [])

useEffect(()=>{
    if(apply){
        loadStartInterval.current = setInterval(()=>{setLoadStart(num=> num>=90? 90 : num+15)}, 250)
    }
},[apply])

useEffect(()=>{
    if(Object.values(showPanel).every(status=> status==false)){
        setShowControlPanel(false)
    }else{
        setShowControlPanel(true)
    }
    if(showPanel.colorChannels && admin && admin.isAdmin && !warnedAdultery){
        sonnerToast.warning("Product Image Accuracy Warning", 
            {
                description: `Please make only subtle color adjustments. Avoid altering the product’s appearance in a way that may mislead customers.
                    Edits should enhance clarity, not change how the product truly looks.`,
                duration:12000
            })
        setWarnedAdultery(true)
    }
},[showPanel, showPanel.colorChannels])

useEffect(()=>{
    const aspectRatio = previewRef.current.naturalWidth / previewRef.current.naturalHeight
    originalAspectRatio.current = previewRef.current.naturalWidth / previewRef.current.naturalHeight
    if(rotate === 90 || rotate === 270){
        setScaleX(scalex=> scalex * (1 / aspectRatio))
        setScaleY(scaley=> scaley * (1 / aspectRatio))
        // const tempWidth = previewRef.current.style.width
        // previewRef.current.style.width = previewRef.current.style.height
        // previewRef.current.style.height = tempWidth
    }else{
        setScaleX(scalex=> (scalex>0) ? 1 : -1)
        setScaleY(scaley=> (scaley>0) ? 1 : -1)
    }
},[rotate])

useEffect(() => {

    applyEffects({previewMode: true})

}, [channelR, channelG, channelB, brightness, contrast, saturate, grayscale, blur, sepia, opacity, rotate, scaleX, scaleY,
     tempR, tempG, tempB, tintR, tintG, hueRotate])

useEffect(() => {
    const warm = Math.max(0, temperature)
    const cool = Math.max(0, -temperature)

    setTempR(60 * (warm / 100))
    setTempB(60 * (cool / 100))
    setTempG(0)

    const magenta = Math.max(0, tint)
    const green = Math.max(0, -tint)

    setTintR(40 * (magenta / 100))
    setTintG(40 * (green / 100))
}, [temperature, tint])

useEffect(()=>{
   if(resetCrop && !croppedAreaPixels){
    applyEffects({previewMode: true})
    setResetCrop(false)
   }
},[resetCrop, croppedAreaPixels])

async function applyColorCorrections(canvas, ctx, options = {}) {

  const {channelR = 0, channelG = 0, channelB = 0, tempR = 0, tempG = 0, tempB = 0, tintR = 0, tintG = 0, hueRotate = 0} = options

  const width = canvas.width
  const height = canvas.height
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  
  const channelScale = 1.0
  const rOffset = (channelR / 100) * 25
  const gOffset = (channelG / 100) * 25
  const bOffset = (channelB / 100) * 25

  const tempScale = 0.6 // max +/-60
  const tempOffset = temperature * tempScale * 0.6

  const tintScale = 0.45
  const tintOffset = tint * tintScale

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]

    r = r + rOffset
    g = g + gOffset
    b = b + bOffset

    r += tempR   
    g += tempG
    b += tempB   

    r += tintR  
    g += tintG   

    data[i] = Math.min(255, Math.max(0, Math.round(r)))
    data[i + 1] = Math.min(255, Math.max(0, Math.round(g)))
    data[i + 2] = Math.min(255, Math.max(0, Math.round(b)))
  }

  ctx.putImageData(imageData, 0, 0);

  if (hueRotate && typeof ctx.filter !== "undefined") {
    const tmp = document.createElement("canvas")
    tmp.width = width
    tmp.height = height
    const tctx = tmp.getContext("2d")

    // copy current canvas to temp
    tctx.drawImage(canvas, 0, 0)

    // clear target canvas and set hue-rotate
    ctx.clearRect(0, 0, width, height)
    ctx.save();
    ctx.filter = `hue-rotate(${hueRotate}deg)`
    ctx.drawImage(tmp, 0, 0)
    ctx.restore();
  }
}

const applyEffects = ({ previewMode = false })=> {

  const canvas = canvasRef.current
  const ctx = canvas.getContext("2d")
  const img = new Image()

  if (!previewMode) setApply(true)

  img.crossOrigin = "Anonymous"

  if(croppedAreaPixels){
    img.src = previewURL
    setCroppedAreaPixels(null)
  }else{
    img.src = image.url
  }

  img.onload = async () => {
    let drawWidth = img.width
    let drawHeight = img.height

    let rotation = ((rotate % 360) + 360) % 360 // normalizing angle
    const radians = rotation * Math.PI / 180

    if (rotation === 90 || rotation === 270) {   // For final canvas size
      canvas.width = img.height * Math.abs(scaleY)
      canvas.height = img.width * Math.abs(scaleX)
    } else {
      canvas.width = img.width * Math.abs(scaleX)
      canvas.height = img.height * Math.abs(scaleY)
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturate}%)
      grayscale(${grayscale}%)
      blur(${blur / 5}px)
      sepia(${sepia}%)
      opacity(${opacity / 100})
    `;

    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2)

    if (rotation !== 0) {
      ctx.rotate(radians) 
    }

    ctx.scale(scaleX, scaleY)

    ctx.drawImage(
      img,
      -img.width / 2,
      -img.height / 2,
      img.width,
      img.height
    );

    ctx.restore();

    await applyColorCorrections(canvas, ctx, {channelR, channelG, channelB, tempR, tempG, tempB, tintR, tintG, hueRotate});

    canvas.toBlob((blob) => {
      if (!previewMode) {
        const imageData = {name: image.name, size: blob.size, blob}
        window.opener.postMessage({ type: "edited-image", payload: imageData }, "*")
      } else {
        const url = URL.createObjectURL(blob);
        setPreviewURL(url)
      }
    }, "image/png")
  }
}

const panelHandler = (e, panel)=>{
    setShowPanel(showPanel=> {
        const newShowPanel = Object.keys(showPanel).reduce((accObj, panel) => {
            accObj[panel] = false 
            return accObj
        }, {})
        return {...newShowPanel, [panel]: !showPanel[panel]}
    })
}

const onCropCompleteHandler = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
}

const handleCrop = async () => {

  if (!croppedAreaPixels) return

  const croppedImageURL  = await getCroppedImg(previewURL || image.url, croppedAreaPixels)

  setPreviewURL(croppedImageURL )

  const response = await fetch(croppedImageURL )
  const blob = await response.blob()

  if(!uncroppedImage){
    setUncroppedImage(image) 
  }
  const reader = new FileReader();

  reader.onload = () => {
    const base64URL = reader.result
    setImage({name: image.name, url: base64URL});
  };

reader.readAsDataURL(blob)
}


 return(
        <section id='image-editor' className='h-screen w-full'>
            <header className='relative flex justify-between items-center h-[4rem] w-full pl-[3rem] rounded-bl-[60px]' style={headerBg}>
                <h2 className='captilize text-white text-[18px] font-[500] ml-[17px]'>Edit Image</h2>
                <div className='h-[12rem] w-[12rem] mt-[2.5rem]'>
                    <Logo/>
                </div>
            </header>
            <div className='fixed h-screen flex'>
            <nav className='h-screen w-[4rem] border-r-2 border-r-borderLight rounded-tr-[20px] bg-[#f3efef]'>

                <Panel panelHandler={panelHandler} subPanelStatus={showPanel}/>

            </nav>
            <main className='flex h-screen absolute left-[4rem] w-[90%]'>
                {  showControlPanel &&
                    <div className='basis-[20%] w-[20%] border-r-2 border-l-borderLight pt-[1rem] px-[2rem] control-panel'>
                      { showPanel.colorAdjuster && 
                            <ColorAdjuster params={{brightness, contrast, saturate}} setters={{setBrightness, setContrast, setSaturate}}/>
                      }    
                      { showPanel.filters && 
                            <Filters params={{grayscale, blur, sepia, opacity}} setters={{setGrayscale, setBlur, setSepia, setOpacity}}/>
                      }
                      { showPanel.rotator && 
                            <RotationAndFilpTool setters={{setRotate, setScaleX, setScaleY}} />
                      }   
                      { showPanel.colorChannels && 
                          <ColorCorrection
                            params={{channelR, channelG, channelB, temperature, tint, hueRotate}}
                            setters={{setChannelR, setChannelG, setChannelB, setTemperature, setTint, setHueRotate}}
                          />
                      }
                      { showPanel.cropper && 
                            <ImageCropper zoom={zoom} setZoom={setZoom} crop={crop} setCrop={setCrop}
                                onResetAll={()=> {
                                    setImage(uncroppedImage)
                                    setCroppedAreaPixels(null)
                                    setPreviewURL(null)
                                    setZoom(1)
                                    setCrop({ x: 0, y: 0 })
                                    setResetCrop(true)
                                }}
                            />
                      }
  
                    </div>
                }
                <div className='h-[85%] w-full content-panel'>
                    
                    <figure className='h-[97%] w-full p-[2rem] flex justify-center items-center bg-grayLightMuted'>
                        {
                            !showPanel.cropper ?
                            <>
                                <img src={previewURL || image.url} alt='current image' className='max-w-[700px] h-full' ref={previewRef}/>
                                <img ref={imgRef}/>
                            </>
                            :
                            <>
                                <div className='relative w-full max-w-[1000px] h-[95%]'>
                                    <Cropper image={previewURL || image.url} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop}
                                                      onZoomChange={setZoom} onCropComplete={onCropCompleteHandler} />
                                </div>
                                <button className='absolute bottom-[8.1rem] left-[17.4rem] px-[18px] py-1 text-white text-[15px] 
                                    font-medium tracking-[0.3px] bg-secondary rounded-[4px] hover:bg-purple-700 transition duration-300' 
                                    onClick={handleCrop}
                                >
                                        Crop 
                                </button>
                            </>
                            
                        }
                        <canvas ref={canvasRef} className='hidden'/>
                    </figure>

                    <div className='h-auto w-full border-t-2 border-l-borderLight px-[1.5rem] pt-[15px] py-[10px] flex justify-between items-center'>
                        {/* <div className='flex items-center gap-[1rem] undoredo'>
                            <i>
                                <LuUndo2/>
                            </i>
                            <i>
                                <LuRedo2/>
                            </i>
                        </div> */}
                        <div className='flex items-center gap-[1.3rem]'>
                            <SiteButtonSquare customStyle={{width:'6rem', paddingBlock:'6px'}}>
                                 Cancel 
                            </SiteButtonSquare>
                            <SiteButtonSquare customStyle={{width:'6rem', paddingBlock:'6px'}} clickHandler={()=> applyEffects({previewMode: false})}>
                                 <span className={ (loadStart || loading) ? 'text-secondary' : '' }> 
                                    { loadStart? loadStart+'%': loading? loading+'%' : 'Apply'}
                                 </span>
                            </SiteButtonSquare>
                        </div>
                    </div>
                </div>
            </main>
            </div>
        </section>
    )
}