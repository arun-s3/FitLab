import React, {useCallback, useMemo, useRef, useState, useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import {AnimatePresence, motion} from "framer-motion"

import {ChevronLeft, ChevronRight} from "lucide-react"
import apiClient from '../../../Api/apiClient'


export default function LatestProductsCarousel() {

  const [slides, setSlides] = useState([])
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const isAnimatingRef = useRef(false)

  const navigate = useNavigate()

  useEffect(()=> {
    async function loadSlides(){
      try{
        const response = await apiClient.get(`/products/latest`)
        if(response?.data?.latestProducts){
            setSlides(response.data.latestProducts)
        }
      }
      catch(error){
        if (!error.response) {
          sonnerToast.error("Network error. Please check your internet.")
        }
        console.error(error)
        setSlides([])
      }  
    }
    loadSlides()
  }, [])

  const mod = (n, m) => ((n % m) + m) % m

  const computeDirection = (from, to, len) => {
    const forward = (to - from + len) % len
    if (forward === 0) return 0
    return forward <= len / 2 ? 1 : -1
  }

  const goTo = useCallback(
    (nextIndex, dir = 1) => {
      if (isAnimatingRef.current) return
      isAnimatingRef.current = true
      setDirection(dir)
      setIndex((curr) => mod(nextIndex, slides.length))
      setTimeout(() => {
        isAnimatingRef.current = false
      }, 550)
    },
    [slides.length],
  )

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index])

  const deck = useMemo(() => {
    return [0, 1, 2, 3].map((offset) => {
      const i = mod(index + offset, slides.length)
      return { ...slides[i], position: offset, sourceIndex: i }
    })
  }, [index, slides])


  return (
  
    slides && slides.length > 0 &&
      (
        <section className={`relative mx-auto w-full max-w-6xl select-none`}>
          <div className="mb-8">
              <p className="text-secondary font-semibold text-sm tracking-wide">NEW GYM ESSENTIALS</p>
              <h2 className="text-[30px] sm:text-[40px] font-bold text-gray-900">Latest Products</h2>
          </div>
          <div className="relative h-[260px] s-sm:h-[36rem] x-lg:h-[440px] overflow-hidden rounded-xl shadow-2xl bg-white">
            <div className="absolute inset-0">
              <AnimatePresence initial={false} custom={direction} mode="sync">
                <motion.img
                  key={slides[index].id}
                  layoutId={`photo-${slides[index].id}`}
                  src={slides[index].image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0.6, scale: direction === 1 ? 1.2 : 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: direction === 1 ? 1 : 1.08 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent" />
            </div>

            <div className="relative z-10 grid h-full grid-cols-1 x-lg:grid-cols-2">
              <div className="flex h-full items-center p-4 mob:p-6 sm:p-8 md:p-10">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={slides[index].id}
                    layoutId={`meta-${slides[index].id}`}
                    className="max-w-[24rem]"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h2 className="text-[22px] mob:text-[24px] xxs-sm:text-[26px] sm:text-[30px] md:text-[35px] 
                      font-semibold tracking-tight line-clamp-2 break-words overflow-hidden text-white">
                        {slides[index].title}
                    </h2>
                    <p className="mt-2 mob:mt-3 text-[13px] mob:text-[14px] leading-relaxed line-clamp-3 break-words overflow-hidden
                     text-white/85">
                        {slides[index].subtitle}
                    </p>
                    <button
                      className="mt-3 mob:mt-4 inline-flex items-center rounded-md bg-primary px-3 mob:px-4 py-1.5 mob:py-2
                        text-[13px] mob:text-[14px] font-medium text-gray-900 shadow-sm transition-colors hover:bg-yellow-300 
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryDark"
                      type="button"
                      onClick={()=> navigate(
                        {pathname: '/shop/product', search: `?id=${slides[index].id}`}, 
                        {state: {product: slides[index]}}
                      )}
                    >
                      View Product
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="relative flex items-end justify-center md:justify-end pr-2 mob:pr-4 sm:pr-6 md:pr-10 pb-6 mob:pb-8">
                <motion.div
                  className="relative flex t:hidden mob:hidden s-sm:flex"
                >
                  {deck.map((item) => {
                    const pos = item.position
                    const x =
                      pos === 0 ? 0 : pos === 1 ? -70 : pos === 2 ? -35 : -5
                    const y = -20
                    const scale = pos === 0 ? 1 : pos === 1 ? 0.95 : 0.9
                    const z = pos === 0 ? 30 : pos === 1 ? 20 : 10
                    const opacity = pos === 0 ? 1 : pos === 1 ? 0.9 : 0.82
                    const isActive = pos === 0

                    return (
                      <motion.article
                        key={item.id}
                        style={{ zIndex: z }}
                        className={`-mr-4 sm:-mr-6 border-2 border-primaryDark rounded-[16px] cursor-pointer ${
                          isActive ? "hidden pointer-events-none" : ""
                        }`}
                        initial={false}
                        animate={{ x, y, scale, opacity }}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 28,
                          mass: 0.6,
                        }}
                        whileHover={{ y: y - 5, scale: scale + 0.01 }}
                        onClick={() =>
                          goTo(
                            item.sourceIndex,
                            computeDirection(index, item.sourceIndex, slides.length)
                          )
                        }
                      >
                        <div className="relative h-44 w-32 mob:h-52 mob:w-36 sm:h-60 sm:w-40 md:h-72 md:w-48 lg:h-80 lg:w-56 
                         rounded-[16px] overflow-hidden bg-transparent shadow-xl">
                          {!isActive && (
                            <motion.img
                              layoutId={`photo-${item.id}`}
                              src={
                                item.image ||
                                "/placeholder.svg?height=320&width=240&query=random%20scenery%20photo"
                              }
                              alt=""
                              className="h-full w-full object-cover"
                              transition={{
                                duration: 0.55,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            />
                          )}
                        </div>
                      </motion.article>
                    )
                  })}
                </motion.div>

                <div className="pointer-events-auto absolute bottom-[5px] x-lg:bottom-2 left-1/2 z-20 flex -translate-x-1/2 
                 gap-2 mob:gap-3 sm:gap-4">
                  <button
                    onClick={prev}
                    className="inline-flex h-9 w-9 mob:h-10 mob:w-10 sm:h-11 sm:w-11 items-center justify-center 
                      rounded-[8px] bg-primary text-gray-900 shadow-md transition duration-300 hover:bg-yellow-300 
                      hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryDark"
                  >
                    <ChevronLeft className="h-4 w-4 mob:h-5 mob:w-5" />
                  </button>
                  <button
                    onClick={next}
                    className="inline-flex h-9 w-9 mob:h-10 mob:w-10 sm:h-11 sm:w-11 items-center justify-center 
                      rounded-[8px] bg-primary text-gray-900 shadow-md transition duration-300 hover:bg-yellow-300 
                      hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryDark"
                  >
                    <ChevronRight className="h-4 w-4 mob:h-5 mob:w-5"/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
    )

  )
}
