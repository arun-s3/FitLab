import React, {useState} from 'react'
import {motion} from 'framer-motion'

import {Search} from "lucide-react"

import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {CustomHashLoader} from '../../../Components/Loader/Loader'


export default function MuscleSelector({bodyParts, searchedBodyPart, setSearchedBodyPart, onSearchBodyPart, selectedBodyParts, listExercises}){

    const [searchedKeyword, setSearchedKeyword] = useState(null)
    const [loading, setLoading] = useState(false)
  
    const searchKeyword = ()=> {
      console.log('searchData--->', searchedKeyword)
      setSearchedBodyPart(searchedKeyword)
    }

    
    return (
        <>  
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-[5px] text-slate-900">
                Choose Your Focus Body Part
              </h2>
              <p className="text-lg text-slate-600">
                Select a target body part to explore professional demonstartions, details and instructions
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="relative max-w-2xl mx-auto flex items-center gap-[10px]">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search exercises, body parts, muscle groups, equipments..."
                  value={searchedKeyword}
                  onChange={(e)=> {
                    if(e.target.value){
                      setSearchedKeyword(e.target.value)
                    }else{
                      setSearchedKeyword('')
                      setSearchedBodyPart('')
                      listExercises({searchQueryRemoved: true})
                    }
                  }}
                  className="w-full pl-12 pr-4 py-[10px] rounded-lg border-2 border-slate-200 focus:border-secondary
                    focus:outline-none text-slate-900 text-[15px] placeholder:text-[14px] placeholder-slate-500 transition-colors"
                />
                  <motion.div whileTap={{ scale: 0.98 }} onClick={searchKeyword}>
                      <SiteButtonSquare 
                          tailwindClasses={`hover:!bg-primaryDark transition duration-300`} 
                          customStyle={{paddingInline:'50px', paddingBlock:'12px', borderRadius:'7px'}}
                                          clickHandler={()=>{ searchKeyword()}}>
                           {loading? <CustomHashLoader loading={loading}/> : 'Search'}  
                      </SiteButtonSquare>
                  </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16"
            >
              {bodyParts && bodyParts.map((bodyPart, idx) => (
                <motion.button
                  key={bodyPart}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  onClick={()=> {
                    const bodyPartAdded = selectedBodyParts.some(part=> part === bodyPart)
                    if(bodyPartAdded){
                      onSearchBodyPart(bodyPartsAdded=> bodyPartsAdded.filter(part=> part !== bodyPart))
                    }else{
                      onSearchBodyPart(parts=> [...parts, bodyPart])
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 capitalize ${
                    selectedBodyParts.some(part=> part === bodyPart)
                      ? 'bg-secondary text-white shadow-lg'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {bodyPart}
                </motion.button>
              ))}
            </motion.div>
        </>
    )
}