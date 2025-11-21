import React from 'react'
import {motion} from 'framer-motion'

import {Search} from "lucide-react"


export default function MuscleSelector({muscles, searchedMuscle, setSearchedMuscle, onSearchMuscle, selectedMuscle}){


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
                Choose Your Focus
              </h2>
              <p className="text-lg text-slate-600">
                Select a target muscle group to explore professional training videos
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search exercises or muscle groups..."
                  value={searchedMuscle}
                  onChange={(e) => setSearchedMuscle(e.target.value)}
                  className="w-full pl-12 pr-4 py-[10px] rounded-lg border-2 border-slate-200 focus:border-secondary
                    focus:outline-none text-slate-900 text-[15px] placeholder:text-[14px] placeholder-slate-500 transition-colors"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16"
            >
              {muscles && muscles.map((muscle, idx) => (
                <motion.button
                  key={muscle}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  onClick={() => onSearchMuscle(muscle)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 capitalize ${
                    selectedMuscle === muscle
                      ? 'bg-secondary text-white shadow-lg'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {muscle}
                </motion.button>
              ))}
            </motion.div>
        </>
    )
}