import React, { useCallback, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const mod = (n, m) => ((n % m) + m) % m

const defaultSlides = [
  { id: "s1", image: "./45-Degree-leg-press.jpg", title: 'Cardio Equipment', description: 'Get your heart racing with top-tier cardio machines.', cta: "See more"},
  { id: "s2", image: "./chestBicepsCurl.jpg", title: 'Strength Machines', description: 'Build muscle and power with premium strength gear.', cta: "See more" },
  { id: "s3", image: "./creatine.jpg", title: 'Supplements', description: 'Fuel your workouts with science-backed nutrition.', cta: "See more" },
  { id: "s4", image:  "./lateral-raise.jpg", title: 'Gym Accessories', description: 'Enhance your fitness experience with quality accessories.', cta: "See more" },
  { id: "s5", image: "./PowerkettlePro.jpg", title: 'Home Gym Kits', description: 'Everything you need to train from home effectively.', cta: "See more" },
  { id: "s6", image: "./vjgsa.jpg", title: 'Pro Equipment', description: 'Train like an athlete with elite-grade gear.', cta: "See more" },
];

const computeDirection = (from, to, len) => {
  const forward = (to - from + len) % len
  if (forward === 0) return 0
  return forward <= len / 2 ? 1 : -1
}

export default function ProductCarousel({ slides = defaultSlides, className = "" }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const isAnimatingRef = useRef(false)

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
    <section className={`relative mx-auto w-full max-w-6xl select-none ${className}`} aria-label="Product carousel">
      <div className="relative h-[380px] sm:h-[440px] overflow-hidden rounded-xl shadow-2xl bg-white">
        <div className="absolute inset-0">
<AnimatePresence initial={false} custom={direction} mode="sync">
  <motion.img
    key={slides[index].id}
    layoutId={`photo-${slides[index].id}`}
    src={slides[index].image}
    alt=""
    aria-hidden="true"
    className="absolute inset-0 h-full w-full object-cover"
    initial={{ opacity: 0.6, scale: direction === 1 ? 1.2 : 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: direction === 1 ? 1 : 1.08 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  />
</AnimatePresence> 

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 grid h-full grid-cols-1 md:grid-cols-2">
          <div className="flex h-full items-center p-6 sm:p-8 md:p-10">
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
                <h2 className="text-balance text-[28px] traking-[0.4px] font-semibold tracking-tight text-white sm:text-[30px] md:text-[35px]">
                  {slides[index].title}
                </h2>
                <p className="mt-3 text-pretty text-[14px] leading-relaxed text-white/85">
                  {slides[index].description}
                </p>
                <button
                  className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  type="button"
                >
                  {slides[index].cta}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative flex items-end justify-center md:justify-end pr-4 sm:pr-6 md:pr-10 pb-8">
            <motion.div
              className="relative flex"
            >
              {deck.map((item) => {
                const pos = item.position
                const x = pos === 0 ? 0 : pos === 1 ? -80 : pos === 2 ? -40 : -5
                const y = -25
                const scale = pos === 0 ? 1 : pos === 1 ? 0.96 : 0.92
                const z = pos === 0 ? 30 : pos === 1 ? 20 : 10
                const opacity = pos === 0 ? 1 : pos === 1 ? 0.9 : 0.82
                const isActive = pos === 0

                return (
                  <motion.article
                    key={item.id}
                    style={{ zIndex: z }}
                    className={`-mr-6 sm:-mr-8 border-2 border-primaryDark rounded-[20px] cursor-pointer ${isActive ? "hidden pointer-events-none" : ""}`}
                    initial={false}
                    animate={{ x, y, scale, opacity }}
                    transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.6 }}
                    whileHover={{ y: y - 6, scale: scale + 0.01 }}
                    onClick={() => goTo(item.sourceIndex, computeDirection(index, item.sourceIndex, slides.length))}
                  >
                    <div className="relative h-52 w-36 rounded-[20px] overflow-hidden bg-transparent shadow-xl sm:h-64 sm:w-44 md:h-72 md:w-48 lg:h-80 lg:w-56">
                      {!isActive && (
                        <motion.img
                          layoutId={`photo-${item.id}`}
                          src={item.image || "/placeholder.svg?height=320&width=240&query=random%20scenery%20photo"}
                          alt=""
                          className="h-full w-full object-cover"
                          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>

            <div className="pointer-events-auto absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-3 md:bottom-4">
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-primary text-gray-900 shadow-md ring-0  transition duration-300 hover:bg-yellow-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryDark"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-primary text-gray-900 shadow-md ring-0 transition duration-300 hover:bg-yellow-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryDark"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
