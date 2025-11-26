
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import { ArrowLeft, Play} from 'lucide-react'
import { IoIosFitness } from "react-icons/io"
import axios from 'axios'

import ExerciseDifficultyStars from './ExerciseDifficultyStars'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'


export default function ExerciseDetails({exercise, onGoBack}) {

  const [hideGif, setHideGif] = useState(false)

  const [videos, setVideos] = useState([])
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)
  const [playVideo, setPlayVideo] = useState(false)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrolled(window.scrollY > 50)
  //   }
  //   window.addEventListener('scroll', handleScroll)
  //   return () => window.removeEventListener('scroll', handleScroll)
  // }, [])

  useEffect(()=> {
    if (!exercise?.name) return
    async function fetchVideos() {
      try {
        console.log("Inside fetchVideos()...")
        const response = await axios.get( `${baseApiUrl}/fitness/videos/${exercise.name}`, { withCredentials: true })
        console.log("fetchVideos response----->", response.data)
        if(response.status === 200){ 
          setVideos(response.data.videos)
          console.log("Videos--->", response.data.videos)
        }
      }catch (error) {
      	console.error("Error while fetching exercise videos", error.message)
      }
    }

    fetchVideos()
  }, [exercise])

  useEffect(()=> {
    console.log("playVideo----->", playVideo)
  }, [playVideo])

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
            <h1 className="font-bold truncate text-secondary line-clamp-1"> Exercise List </h1>
          </div>
        </div>
      </motion.div>

      <div>
        <div className='mx-auto w-[35rem] h-[20rem] rounded-[6px] outline outline-2 outline-primary outline-offset-4'>
          <img
            src={exercise.thumbnail}
            className="h-full w-full object-cover rounded-[7px]"
            // onLoad={()=> setIsLoading(false)}
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
              <article className="flex flex-col gap-[10px] text-slate-300 leading-relaxed mb-6">
                {
                  exercise.instructions.map(step=> (
                    <div className='flex items-center gap-[7px]'>
                      <IoIosFitness className='text-primaryDark w-[12px] h-[12px]'/>
                      <p className='text-[14px] text-[#757584]'> {step} </p>
                    </div>
                  ))
                }
              </article>
            </div>
            <div className='mt-[10px] flex justify-between'>
              {
                !hideGif &&
                  <div className='w-[25rem] h-[20rem] rounded-[6px]'>
                    <img
                      src={exercise.gifUrl} 
                      className="h-full w-full object-cover rounded-[7px]"
                      onError={(e)=> {
                        e.target.onerror = null
                        setHideGif(true)
                      }}
                      // onLoad={()=> setIsLoading(false)}
                    />
                  </div>
              }
              <div className={`${hideGif && 'flex items-center gap-4 justify-between'}`}>
                <div className={`w-[15rem] h-[10rem] border border-dashed border-secondaryLight2 rounded-[8px]`}>
                  <img
                    src={`/Muscles/${exercise.targetMuscles[0]}.jpg`}
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
                    src={`/Muscles/${exercise.targetMuscles?.[1] || exercise.secondaryMuscles?.[0]}.jpg`}
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

          <motion.div variants={itemVariants}>
            <div className="bg-white backdrop-blur-sm border border-secondaryLight2 rounded-xl p-6 md:p-8 sticky top-32">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                {/* <span className="text-dropdownBorder">⚡</span>  */}
                <span className='text-[#4b4a55]'> Target Muscles </span>
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

        {
          videos && videos.length > 0 &&
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative px-4 md:px-8 flex gap-6"
            >
              <div className="relative w-full aspect-video rounded-[12px] overflow-hidden shadow-2xl"> {/*bg-gradient-to-br from-slate-700 to-slate-800 */}
                {/* {
                  !playVideo &&
                    <div className="absolute inset-0 bg-black/40" />
                } */}
                {
                  !playVideo &&
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full w-32 h-32 mx-auto my-auto" />
                        <Play 
                          className="relative text-white fill-white" 
                          size={80} 
                          onClick={()=> setPlayVideo(true)}
                        />
                      </motion.div> 
                    </div>
                }
                {
                  playVideo 
                    ? <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videos[selectedVideoIndex].videoId}?autoplay=${playVideo ? 1 : 0}&controls=1&rel=0&showinfo=0&modestbranding=1`}
                        frameBorder="0"
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                      />
                    : <img 
                        src={videos[selectedVideoIndex].thumbnail} 
                        className="rounded-lg w-full object-cover" 
                      />
                }
                <p className="text-sm mt-1 font-medium">{videos[selectedVideoIndex].title}</p>
              </div>

              <motion.div variants={itemVariants} className="basis-[40%] h-[36rem]">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 backdrop-blur-sm border border-dropdownBorder
                  rounded-[12px] p-6 h-full sticky top-32">
                  <h3 className="text-[21px] text-secondary font-bold mb-4 flex items-center gap-2">
                    Similar Videos
                  </h3>

                  <div className="space-y-8 max-h-96">
                    {videos.length > 0 && (
                      videos.filter((video, index)=> index !== selectedVideoIndex).map((video, idx) => (
                        <motion.div
                          key={video.videoId}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className='cursor-pointer'
                          onClick={()=> setSelectedVideoIndex(idx)}
                        >
                          <div className="group block">
                            <div className="relative h-44 rounded-lg mb-2 group-hover:shadow-lg transition-all">
                              {/* <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" /> */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="text-white fill-white" size={24} />
                              </div>
                              <img 
                                src={videos[selectedVideoIndex].thumbnail} 
                                className="rounded-lg w-full h-full object-cover" 
                              />
                            </div>
                            <h4 className="text-sm text-muted font-semibold group-hover:text-secondary transition-colors line-clamp-2">
                              {video.title}
                            </h4>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
              
            </motion.div>
        }

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
