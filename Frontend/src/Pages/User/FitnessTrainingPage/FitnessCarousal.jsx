import React, {useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {motion, AnimatePresence} from 'framer-motion'

import {ChevronLeft, ChevronRight, Play, Search} from 'lucide-react'



export default function FitnessCarousal(){

  const [carouselIdx, setCarouselIdx] = useState(0)

  const {user} = useSelector(state=> state.user)

  const dispatch = useDispatch()

  const CAROUSEL_SLIDES = [
    {
      id: 1,
      title: 'Why Target Specific Muscles?',
      description: 'Targeting specific muscle groups helps you build strength efficiently, improve posture, and achieve your fitness goals with precision. Professional training videos show you the correct form to maximize results.',
      image: '/FitnessCarousal/img1.jpg',
      tagline: 'Precision Training'
    },
    {
      id: 2,
      title: 'Benefits of Professional Videos',
      description: 'Learn from certified trainers who break down every movement. Understand muscle activation, proper breathing, and common mistakes to avoid. Get results faster with expert guidance.',
      image: '/FitnessCarousal/img2.jpg',
      tagline: 'Expert Guidance'
    },
    {
      id: 3,
      title: 'Why Professional Over Personal Trainer?',
      description: 'Access unlimited videos anytime, anywhere. Learn multiple variations and techniques. Practice at your own pace without time constraints. Build a personalized workout routine with proven methods.',
      image: '/FitnessCarousal/img3.jpg',
      tagline: 'Learn At Your Pace'
    },
    {
      id: 4,
      title: 'Structured Learning Path',
      description: 'Follow a progressive training system. Start with basics, advance to complex movements. Track your progress and adapt your routine. Every muscle group has dedicated training content.',
      image: '/FitnessCarousal/img4.jpg',
      tagline: 'Progress Tracking'
    },
    {
    id: 5,
    title: "Train Smarter With Muscle Isolation",
    tagline: "Focused Efficiency",
    description:
      "Every muscle plays a unique role in strength, posture, and performance. Muscle isolation helps you remove unnecessary momentum and activate the exact muscle you intend to train. This creates faster strength gains, better symmetry, and reduces the risk of injury by teaching your body to lift with control and intention.",
    image: "/FitnessCarousal/img5.jpg"
    },
    {
      id: 6,
      title: "Why Equipment Choice Matters",
      tagline: "Optimized Performance",
      description:
        "Dumbbells, barbells, cables, and machines each stimulate your muscles differently. Understanding when to use each type of equipment helps you maximize range of motion, increase tension, and avoid plateaus. Learn how to match the right equipment to the right exercise so you can grow stronger with every session.",
      image: "/FitnessCarousal/img6.jpg"
    },
    {
      id: 7,
      title: "Master Proper Form for Maximum Gains",
      tagline: "Form First",
      description:
        "Most people fail to see progress not because they don’t train hard, but because they train with improper form. Professional form guidance ensures you activate the correct muscles, protect your joints, and train safely at higher intensities. Build confidence and consistency with clear, step-by-step technique breakdowns.",
      image: "/FitnessCarousal/img7.jpg"
    },
    {
      id: 8,
      title: "Build a Complete Balanced Physique",
      tagline: "Total Development",
      description:
        "A well-structured routine strengthens all major and minor muscle groups equally. Balanced training boosts metabolism, improves movement quality, and eliminates weak points that limit your progress. With guided programs, you’ll learn how to combine compound and isolation movements to build a strong, functional, and aesthetic body.",
      image: "/FitnessCarousal/img8.jpg"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % CAROUSEL_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCarouselIdx((prev) => (prev + 1) % CAROUSEL_SLIDES.length)
  }

  const prevSlide = () => {
    setCarouselIdx((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)
  }


  return (
    
    <section id='ShoppingCartPage'>

      <div className="relative w-full bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              // transition={{ duration: 0.7 }}
              // exit={{ opacity: 0, x: -100 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                // exit={{ opacity: 0, y: 10 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block"
                >
                  <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
                    {CAROUSEL_SLIDES[carouselIdx].tagline}
                  </span>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[25px] md:text-[33px] font-bold text-slate-900 leading-tight"
                >
                  {CAROUSEL_SLIDES[carouselIdx].title}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[16px] text-slate-600 leading-relaxed"
                >
                  {CAROUSEL_SLIDES[carouselIdx].description}
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block bg-purple-600 text-white text-[15px] px-8 py-3 rounded-lg font-semibold
                   hover:bg-purple-700 transition-colors"
                >
                  Start Learning
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 1.3 }}
                exit={{ opacity: 0, x: -40 }}
                className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-slate-200"
              >
                <img
                  src={CAROUSEL_SLIDES[carouselIdx].image || "/placeholder.svg"}
                  alt={CAROUSEL_SLIDES[carouselIdx].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-12">
            <div className="flex gap-2">
              {CAROUSEL_SLIDES.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setCarouselIdx(idx)}
                  className={`h-1 rounded-full transition-all ${
                    idx === carouselIdx ? 'bg-purple-600 w-8' : 'bg-slate-300 w-2'
                  }`}
                  whileHover={{ scale: 1.1 }}
                />
              ))}
            </div>
            <div className="flex gap-4">
              <motion.button
                onClick={prevSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors"
              >
                <ChevronLeft size={20} className="text-slate-900" />
              </motion.button>
              <motion.button
                onClick={nextSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                <ChevronRight size={20} className="text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>



    </section>
    
  )
}





