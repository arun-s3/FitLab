
import React, {useState, useEffect} from 'react'
import {motion} from 'framer-motion'

import {ArrowLeft} from 'lucide-react'
import axios from 'axios'

import ExerciseVideos from './ExerciseVideos'
import ExerciseDifficultyStars from './ExerciseDifficultyStars'
import Carousal from '../../../Components/Carousal/Carousal'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'


export default function ExerciseDetails({exercise, onGoBack}) {

  const [hideGif, setHideGif] = useState(false)

  const [exerciseBasedProducts, setExerciseBasedProducts] = useState([])

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(()=> {
    if(!exercise.name) return 
    async function loadExerciseBasedProducts(){
      try{
        console.log("Inside loadExerciseBasedProducts()....")
        const response = await axios.get(
          `${baseApiUrl}/products/exercise?exercise=${encodeURIComponent(exercise.name)}&muscle=${encodeURIComponent(exercise.targetMuscles[0])}`,
           {withCredentials: true}
        )
        console.log("RESPONSE from loadExerciseBasedProducts---->", response)
        setExerciseBasedProducts(response.data.exerciseBasedProducts)
      }
      catch(error){
        console.log("error from  loadExerciseBasedProducts--->", error.message)
      }  
    }

    loadExerciseBasedProducts()
  }, [exercise])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <div className="min-h-screen text-white overflow-hidden">

      <motion.div
        className={`transition-all duration-300`}
      >
        <div className="px-4 md:px-8 pt-0 pb-4 flex items-center gap-4">
          <span
            className="p-2 bg-dropdownBorder hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
            onClick={()=> onGoBack()}
          >
            <ArrowLeft size={24} className='text-secondary'/>
          </span>
          <div className="flex-1 truncate">
            <p className="text-sm text-muted truncate"> Fitlab </p>
            <h1 className="font-bold truncate text-[16px] text-secondary line-clamp-1"> Exercise List </h1>
          </div>
        </div>
      </motion.div>

      <div className='max-x-lg:mt-8'>
        <div className='mx-auto w-[80%] sm:w-[35rem] h-[20rem] rounded-[6px] outline outline-2 outline-primary outline-offset-4'>
          <img
            src={exercise.thumbnail}
            className="h-full w-full object-cover rounded-[7px]"
          />
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-6 px-4 md:px-8 py-0 max-w-6xl mx-auto"
      >

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="bg-whitesmoke backdrop-blur-sm border border-mutedDashedSeperation rounded-[7px] p-6 md:p-8">
              <h2 className="text-2xl text-secondary font-bold mb-4">Instructions:</h2>
              <article className="text-[14px] text-[#757584] leading-relaxed mb-6">
                <ul className='flex flex-col gap-[10px]'>
                {
                  exercise.instructions.map(step=> (
                    <li className="before:content-['▶'] before:text-primaryDark before:mr-2">
                      {step}
                    </li>
                  ))
                }
                </ul>
              </article>
            </div>
            <div className='mt-[10px] flex flex-col gap-8 lg:flex-row justify-between'>
              {
                !hideGif &&
                  <div className='w-[18rem] max-lg:self-center xxs-sm:w-[20rem] xs-sm2:w-[25rem] h-[20rem] rounded-[6px]'>
                    <img
                      src={exercise.gifUrl} 
                      className="h-full w-full object-cover rounded-[7px]"
                      onError={(e)=> {
                        e.target.onerror = null
                        setHideGif(true)
                      }}
                    />
                  </div>
              }
              <div 
                className={`${hideGif && 'flex items-center gap-4 justify-between'} flex flex-col s-sm:flex-row 
                  items-center justify-between lg:inline-block`}
              >
                <div className={`w-[15rem] h-[10rem] border border-dashed border-secondaryLight2 rounded-[8px]`}>
                  <img
                    src={`/Images/Muscles/${exercise.targetMuscles[0]}.jpg`}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = `/Muscles/${exercise.targetMuscles[0]}.png`
                    }}
                    className="h-full w-full object-cover rounded-[7px]"
                    // onLoad={()=> setIsLoading(false)}
                  />
                </div>
                <div className='mt-[10px] w-[15rem] h-[10rem] border border-dashed border-secondaryLight2 rounded-[8px]'>
                  <img
                    src={`/Images/Muscles/${exercise.targetMuscles?.[1] || exercise.secondaryMuscles?.[0]}.jpg`}
                    onError={(e) => {
                      e.target.onerror = null
                      const fallbackImg = exercise.targetMuscles?.[1] || exercise.secondaryMuscles?.[0]
                      e.target.src = `/Muscles/${fallbackImg}.jpg`
                    }}
                    className="h-full w-full object-cover rounded-[7px]"
                    // onLoad={()=> setIsLoading(false)}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className=''>
            <div className="bg-white backdrop-blur-sm border border-secondaryLight2 rounded-xl p-6 md:p-8 sticky top-32">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className='text-[#4b4a55] whitespace-nowrap'> Target Muscles </span>
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-muted text-sm uppercase font-semibold mb-2">
                    Primary
                  </p>
                  <div className="bg-inputBgSecondary text-secondary border border-dropdownBorder rounded-[5px] px-4 py-[7px]
                   font-bold text-[14px]">
                    { capitalizeFirstLetter(exercise.targetMuscles.join(',')) }
                  </div>
                </div> 

                <div>
                  <p className="text-muted text-sm uppercase font-semibold mb-2">
                    Secondary
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exercise.secondaryMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="bg-whitesmoke text-[#272424] border border-dropdownBorder rounded-[5px] px-3 py-2 text-sm font-medium"
                      >
                        {capitalizeFirstLetter(muscle)}
                      </span>
                    ))} 
                  </div>
                </div>

                <div>
                  <p className="text-muted text-sm uppercase font-semibold mb-2">
                    Difficulty
                  </p>
                  <div className="bg-white border border-dropdownBorder rounded-lg px-4 py-3 font-bold">

                    <ExerciseDifficultyStars exercise={exercise}/>

                  </div>
                </div>

                <div>
                  <p className="text-muted text-sm uppercase font-semibold mb-2">
                    Equipment
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exercise.equipments.map((item) => (
                      <span
                        key={item}
                        className="bg-inputBgSecondary text-[14px] text-secondary border border-dropdownBorder
                          rounded-[5px] px-4 py-[7px] font-bold"
                      >
                        {capitalizeFirstLetter(item)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        </motion.div>

        <ExerciseVideos exercise={exercise}/>
        
        <div className='mt-24 mb-12'>
          {
            exerciseBasedProducts &&
              <Carousal 
                products={exerciseBasedProducts} 
                title='Recommended products for this muscle' 
                titleStyle='text-secondary'
                imageStyle='!rounded-[12px]'
                buttonLabel='BUY'
                size='small'
              />
          }
        </div>
        
        <motion.div
          variants={itemVariants}
          className="mt-16 pb-8 flex justify-center"
        >
          <span
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg
              font-bold hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            onClick={()=> onGoBack()}
          >
            <ArrowLeft size={20} />
            Back to Exercise List
          </span>
        </motion.div>
    </div>
  )
}
