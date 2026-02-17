
import React, {useState, useEffect} from 'react'
import {motion} from 'framer-motion'

import {Play, Video, TriangleAlert, RotateCcw} from 'lucide-react'
import {toast as sonnerToast} from 'sonner'

import apiClient from '../../../Api/apiClient'


export default function ExerciseVideos({exercise}) {

  const [videos, setVideos] = useState([])
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)
  const [playVideo, setPlayVideo] = useState(false)

  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(false)

    async function fetchVideos() {
      try {
        const response = await apiClient.get( `/fitness/videos/${exercise.name}`)
        if(response.status === 200){ 
          setVideos(response.data.videos)
        }
      }catch (error) {
        setFetchError(true)
      }finally {
        setLoading(false)
      }
    }

  useEffect(()=> {
    if (!exercise?.name) return
    setLoading(true)
    fetchVideos()
  }, [exercise])

  const refetchVideos = ()=> {
    setFetchError(false)
    setLoading(true)
    fetchVideos()
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
    <>
        <h2 className='px-8 flex items-center gap-4 w-full mt-20 mb-6'>
            <Video className='w-[30px] h-[30px] text-secondary'/>
            <span className='text-[25px] text-black font-bold'> Videos related to this exercise or its variations </span>
        </h2>
        {
          videos && videos.length > 0 && !fetchError &&
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative px-4 md:px-8 flex flex-col x-lg:flex-row gap-6"
            >
              <div className="relative w-full aspect-video rounded-[12px] overflow-hidden"> 
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
              </div>
              <p className="absolute -bottom-4 text-[18px] text-muted font-medium">{videos[selectedVideoIndex].title}</p>

              <motion.div variants={itemVariants} className="basis-[40%] h-[36rem] max-x-lg:self-start">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 backdrop-blur-sm border border-dropdownBorder
                  rounded-[12px] p-6 h-[40rem] lg:h-[37rem] sticky top-32">
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
                            <div className="relative h-[14rem] x-lg:h-44 rounded-lg mb-2 group-hover:shadow-lg transition-all">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="text-white fill-white" size={24} />
                              </div>
                              <img 
                                src={video.thumbnail} 
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
        {loading && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='flex justify-center py-12'>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className='w-12 h-12 border-4 border-slate-200 border-t-secondary rounded-full'
                />
            </motion.div>
        )}
        
        {fetchError && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mt-16 mx-auto flex justify-center items-center gap-[5px] w-[35%] min-w-[15rem] bg-red-50 border border-red-200
                  text-red-700 px-4 py-8 rounded-lg mb-8'>
                <TriangleAlert className='mb-[18px] text-primary w-[32px] h-[32px]' />
                <p className='flex flex-col'>
                    <span className='flex items-center gap-[7px] text-[17px] text-[#686262] font-medium'>
                        Unable to load
                        <RotateCcw
                            className='w-[20px] h-[20px] text-muted p-1 rounded-full border border-dropdownBorder cursor-pointer 
                                        hover:text-black transition-all duration-150 ease-in'
                            onClick={() => refetchVideos()}
                        />
                    </span>
                    <span className='text-[13px] text-muted'>Check connection</span>
                </p>
            </motion.div>
        )}
    </>
  )
}
