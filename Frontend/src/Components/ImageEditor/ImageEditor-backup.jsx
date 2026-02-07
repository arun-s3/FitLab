import React,{useState, useEffect, useRef} from 'react'
import {useLocation,useSearchParams} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import Panel from './Panel'
import ColorAdjuster from './ColorAdjuster'
import Filters from './Filters'
import RotationAndFilpTool from './RotationAndFilpTool'
import ColorCorrection from './ColorCorrection'

import './ImageEditor.css'
import Logo from '../Logo/Logo'

import {FaUndoAlt} from "react-icons/fa"
import {FaRedoAlt} from "react-icons/fa"
import {LuUndo2} from "react-icons/lu"
import {LuRedo2} from "react-icons/lu"
import {SiteButtonSquare} from '../SiteButtons/SiteButtons'

export default function ImageEditor(){

    const headerBg = {
        backgroundImage: "url('/Images/Background.png')",
        // backgroundSize: 'cover'
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
    const [adjustedScaleX, setAdjustedScaleX] = useState(1)
    const [adjustedScaleY, setAdjustedScaleY] = useState(1)

    const [channelR, setChannelR] = useState(0)      
    const [channelG, setChannelG] = useState(0)
    const [channelB, setChannelB] = useState(0)
    const [overlayColor, setOverlayColor] = useState({ r: 0, g: 0, b: 0 })
    const [overlayIntensity, setOverlayIntensity] = useState(0)

    const [temperature, setTemperature] = useState(0) // -100 (cool) / +100 (warm)
    const [tint, setTint] = useState(0)               // -100 (magenta) / +100 (green)
    const [tempR, setTempR] = useState(0)
    const [tempG, setTempG] = useState(0)
    const [tempB, setTempB] = useState(0)
    const [tintR, setTintR] = useState(0)
    const [tintG, setTintG] = useState(0)
    const [hueRotate, setHueRotate] = useState(0)     // -180/180 degrees
    


    const dispatch = useDispatch()

    const location = useLocation()

    // useEffect(()=>{
    //     console.log("(useLocation)location.search-->"+location.search)
    //     const params = new URLSearchParams(location.search)
    //     const encodedImageURL = params.get('image')
    //     if (encodedImageURL) {
    //       const imageURL = decodeURIComponent(encodedImageURL)
    //       const name = params.get('name')
    //       setImage({name, url: imageURL})  
    //     }
    // },[])
    
    useEffect(()=>{
        // console.log("Color Tones-->"+ JSON.stringify(colorTones))
        // console.log("")
        // console.log(" `brightness( ${colorTones.brightness}% )`-->"+  `brightness( ${colorTones.brightness}% )`)
        // console.log("brightness(${colorTones.brightness}%) contrast(${colorTones.contrast}%) saturate(${colorTones.saturation}%)`" + `brightness(${colorTones.brightness}%) contrast(${colorTones.contrast}%) saturate(${colorTones.saturation}%)` )
    })
    // const changeHandler = (e)=>{
    //     setColorTones({...colorTones, [e.target.id.toString()] : e.target.value})
    // }
    // useEffect(()=>{
    //     console.log("Inside useEffect")
    //     window.addEventListener('message', (event) => {
    //         if (event.data.type === 'target-img') {
    //             const targetImage = event.data.blob
    //             console.log("RECEIVED TARGET IMAGE FROM PARENT WINDOW-->", JSON.stringify(targetImage))
    //             const reader = new FileReader()
    //             reader.onload = ()=>{
    //                 console.log("Inside fileReader")
    //                 const base64URL = reader.result
    //                 setImage({name, url: base64URL})  
    //             }
    //             reader.readAsDataURL(targetImage) 
    //         }
    //     })        
    // },[])
useEffect(() => {
    window.opener.postMessage('child-ready', '*');
    const messageHandler = (event) => {
        if (event.data.type === 'target-img') {
            const { blob, name } = event.data;
            console.log("RECIEVED IMAGE FROM FILE-UPLOAD ON CHILD READY-->", JSON.stringify({ blob, name }));
            const reader = new FileReader()
            reader.onload = ()=>{
                console.log("Inside fileReader")
                const base64URL = reader.result
                setImage({name, url: base64URL});  
                console.log("MADE A BASE64URL from BLOB FOR EDITING-->", JSON.stringify({name, url: base64URL}))
            }
            reader.readAsDataURL(blob) 
        }
        if(event.data.type === 'loading-img'){
            console.log("Inside event.data.type == 'loading-img'")
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
    console.log("inside useEffect for loadStartInterval ")
    loadStartInterval.current = setInterval(()=>{setLoadStart(num=> num>=90? 90 : num+15)}, 250)
    }
},[apply])

useEffect(()=>{
    if(Object.values(showPanel).every(status=> status==false)){
        setShowControlPanel(false)
    }else{
        setShowControlPanel(true)
    }
},[showPanel])

useEffect(()=>{
    console.log("ROtation in radians", rotate * Math.PI/180)
    const aspectRatio = previewRef.current.naturalWidth / previewRef.current.naturalHeight
    originalAspectRatio.current = previewRef.current.naturalWidth / previewRef.current.naturalHeight
    if(rotate === 90 || rotate === 270){
        setScaleX(scalex=> scalex * (1 / aspectRatio))
        setScaleY(scaley=> scaley * (1 / aspectRatio))
        // const tempWidth = previewRef.current.style.width
        // previewRef.current.style.width = previewRef.current.style.height
        // previewRef.current.style.height = tempWidth
    }else{
        console.log("Inside else for check rotate 90 times")
        setScaleX(scalex=> (scalex>0) ? 1 : -1)
        setScaleY(scaley=> (scaley>0) ? 1 : -1)
    }
},[rotate])

useEffect(() => {
    const overlayR = (channelR / 100) * 128
    const overlayG = (channelG / 100) * 128
    const overlayB = (channelB / 100) * 128

    setOverlayColor({r: overlayR, g: overlayG, b: overlayB})

    setOverlayIntensity(Math.abs(channelR + channelG + channelB) / 300)
}, [channelR, channelG, channelB])

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



async function applyColorCorrections(canvas, ctx, options = {}) {

  const {channelR = 0, channelG = 0, channelB = 0, tempR = 0, tempG = 0, tempB = 0, tintR = 0, tintG = 0, hueRotate = 0} = options

  const width = canvas.width;
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


const applyEffects = ()=>{
    setApply(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = image.url
    img.onload = async()=>{
        canvas.width = img.width
        canvas.height = img.height
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%) 
                        blur(${blur/5}px) sepia(${sepia}%) opacity(${opacity/100})`
        ctx.save()
        if(scaleX < 0){
            console.log("scalex applying-->",scaleX)
            ctx.translate(canvas.width, 0)
            ctx.scale(-1,1)
        }
        if(scaleY < 0){
            console.log("scalex applying-->",scaleY)
            ctx.translate(0, canvas.height)
            ctx.scale(1,-1)
        }
        ctx.drawImage(img, 0, 0, img.width, img.height)

        if(rotate){
            ctx.translate(canvas.width, canvas.height)
            const radians = rotate * Math.PI/180
            console.log("RADIANS-->"+ radians)
            if (rotate === 90 || rotate === 270) {
                canvas.width = img.naturalHeight * scaleX
                canvas.height = img.naturalWidth * scaleY
              } else {
                canvas.width = img.naturalWidth * scaleX
                canvas.height = img.naturalHeight * scaleY
              }

              ctx.translate(canvas.width / 2, canvas.height / 2)
              ctx.rotate(radians)

              ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%) 
                blur(${blur/5}px) sepia(${sepia}%) opacity(${opacity/100})`;

              ctx.drawImage(
                img,
                -img.naturalWidth / 2,
                -img.naturalHeight / 2,
                img.naturalWidth * scaleX,
                img.naturalHeight * scaleY
              );
        }
        // await applyColorCorrections(canvas, ctx, {channelR, channelG, channelB, temperature, tint, hueRotate});
        await applyColorCorrections(canvas, ctx, { channelR, channelG, channelB, tempR, tempG, tempB, tintR, tintG, hueRotate});

        // const blobUrl = canvas.toDataURL('image/png')
        // console.log("blobUrl-->" + blobUrl)
        // imgRef.current.src = blobUrl
        // let blobUrl = ''
        canvas.toBlob((blob)=>{
            // const blobUrl = URL.createObjectURL(blob)
            // console.log("blobURL ceated from canvas-->",blobUrl)
            const imageData = {name: image.name, size: blob.size, blob}   //, url: blobUrl
            window.opener.postMessage({ type: 'edited-image', payload: imageData }, '*');
            console.log("EDITED IMAGE SET BACK TO FILE-UPLOAD-->", JSON.stringify(imageData))
        },'image/png')
    }
}
const panelHandler = (e, panel)=>{
    setShowPanel(showPanel=> {
        console.log("panel==>"+panel)
        console.log("showPanel-->"+JSON.stringify(showPanel))
        const newShowPanel = Object.keys(showPanel).reduce((accObj, panel) => {
            accObj[panel] = false 
            return accObj
        }, {})
        console.log("New showPanel-->"+JSON.stringify(newShowPanel))
        console.log("showPanel NOW-->"+JSON.stringify({...newShowPanel, [panel]: !showPanel[panel]}))
        return {...newShowPanel, [panel]: !showPanel[panel]}
    })
    showPanel[panel] ? e.currentTarget.style.backgroundColor = 'rgba(215, 241, 72, 1)' :  e.currentTarget.style.backgroundColor = '#f3efef'
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

                <Panel panelHandler={panelHandler} />

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
  
                    </div>
                }
                <div className='h-[85%] w-full content-panel'>
                    <figure className='h-[97%] w-full p-[2rem] flex justify-center items-center bg-grayLightMuted'>
                        <img src={image.url} alt='current image' className='max-w-[700px] h-full' ref={previewRef}
                            style={{filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) 
                                        grayscale(${grayscale}%) blur(${blur/5}px) sepia(${sepia}%) opacity(${opacity/100})`,
                                    transform: `rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY})`}}/>

                        <div className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundColor: `rgba(${overlayColor.r}, ${overlayColor.g}, ${overlayColor.b}, ${overlayIntensity})`,
                                mixBlendMode: "color"
                            }}
                        />

                        <canvas ref={canvasRef} className='hidden'/>
                        <img ref={imgRef}/>
                    </figure>
                    <div className='h-auto w-full border-t-2 border-l-borderLight px-[1.5rem] pt-[15px] py-[10px] flex justify-between items-center'>
                        <div className='flex items-center gap-[1rem] undoredo'>
                            <i>
                                <LuUndo2/>
                            </i>
                            <i>
                                <LuRedo2/>
                            </i>
                        </div>
                        <div className='flex items-center gap-[1.3rem]'>
                            <SiteButtonSquare customStyle={{width:'6rem', paddingBlock:'6px'}}>
                                 Cancel 
                            </SiteButtonSquare>
                            <SiteButtonSquare customStyle={{width:'6rem', paddingBlock:'6px'}} clickHandler={()=> applyEffects()}>
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