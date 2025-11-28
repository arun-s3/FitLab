
import React, {useState, useEffect} from 'react'
import {motion} from 'framer-motion'

import {Play} from 'lucide-react'
import axios from 'axios'


export default function ExerciseVideos({exercise}) {

  const [videos, setVideos] = useState([])
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)
  const [playVideo, setPlayVideo] = useState(false)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

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

        {
          videos && videos.length > 0 &&
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
                <p className="text-sm mt-1 font-medium">{videos[selectedVideoIndex].title}</p>
              </div>

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
    </>
  )
}
