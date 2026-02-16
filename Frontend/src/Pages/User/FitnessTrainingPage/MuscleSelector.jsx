import React, {useState, useEffect, useRef} from 'react'
import {useLocation} from 'react-router-dom'
import {motion} from 'framer-motion'

import {Search} from "lucide-react"

import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {CustomHashLoader} from '../../../Components/Loader/Loader'


export default function MuscleSelector({bodyParts, setSearchedBodyPart, onSearchBodyPart, selectedBodyParts, listExercises, isLoading,
    bodyPartsLoading}) {

    const [searchedKeyword, setSearchedKeyword] = useState(null)

    const searchRef = useRef(null)
    const applyRef = useRef(null)

    const location = useLocation()
  
    const searchKeyword = ()=> {
      setSearchedBodyPart(searchedKeyword)
    }

    useEffect(()=> {
      if(location && location.search){
        const queryParams = new URLSearchParams(location.search)
        const name = queryParams.get("name")
        const parsedName = name ? JSON.parse(decodeURIComponent(name)) : null
      
        if(parsedName.exerciseName){
          setSearchedKeyword(parsedName.exerciseName)
          setTimeout(()=> applyRef.current?.click(), 500)
          setTimeout(() => {
            searchRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 200)
        }
      }
    }, [location])

    
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                ref={searchRef}
                className='text-center mb-8'>
                <h2 className='text-4xl md:text-5xl font-bold mb-[5px] text-slate-900'>Choose Your Focus Body Part</h2>
                <p className='text-lg text-slate-600'>
                    Select a target body part to explore professional demonstartions, details and instructions
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className='mb-12'>
                <div className='relative max-w-2xl mx-auto flex items-center gap-[10px]'>
                    <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400' size={20} />
                    <input
                        type='text'
                        placeholder='Search exercises, body parts, muscle groups, equipments...'
                        value={searchedKeyword}
                        onChange={(e) => {
                            if (e.target.value) {
                                setSearchedKeyword(e.target.value)
                            } else {
                                setSearchedKeyword("")
                                setSearchedBodyPart("")
                                listExercises({ searchQueryRemoved: true })
                            }
                        }}
                        className='w-full pl-12 pr-4 py-[10px] rounded-lg border-2 border-slate-200 focus:border-secondary
                    focus:outline-none text-slate-900 text-[15px] placeholder:text-[14px] placeholder-slate-500 transition-colors'
                    />
                    <motion.div whileTap={{ scale: 0.98 }} ref={applyRef} onClick={searchKeyword}>
                        <SiteButtonSquare
                            tailwindClasses={`hover:!bg-primaryDark transition duration-300`}
                            customStyle={{ paddingInline: "50px", paddingBlock: "12px", borderRadius: "7px" }}
                            clickHandler={() => {
                                searchKeyword()
                            }}>
                            {isLoading && searchedKeyword && searchedKeyword.trim() ? <CustomHashLoader loading={isLoading} /> : "Search"}
                        </SiteButtonSquare>
                    </motion.div>
                </div>
            </motion.div>

            {bodyPartsLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex justify-center py-12'>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className='w-12 h-12 border-4 border-slate-200 border-t-secondary rounded-full'
                    />
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16'>
                {!bodyPartsLoading &&
                    bodyParts &&
                    bodyParts.map((bodyPart, idx) => (
                        <motion.button
                            key={bodyPart}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            viewport={{ once: true }}
                            onClick={() => {
                                const bodyPartAdded = selectedBodyParts.some((part) => part === bodyPart)
                                if (bodyPartAdded) {
                                    onSearchBodyPart((bodyPartsAdded) =>
                                        bodyPartsAdded.filter((part) => part !== bodyPart),
                                    )
                                } else {
                                    onSearchBodyPart((parts) => [...parts, bodyPart])
                                }
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 capitalize ${
                                selectedBodyParts.some((part) => part === bodyPart)
                                    ? "bg-secondary text-white shadow-lg"
                                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                            }`}>
                            {bodyPart}
                        </motion.button>
                    ))}
            </motion.div>
        </>
    )
}