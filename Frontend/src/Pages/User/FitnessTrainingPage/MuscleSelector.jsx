import Raect from 'react'
import {motion} from 'framer-motion'


export default function MuscleSelector({muscles, searchQuery, setSearchQuery, setSelectedMuscle}){


    return (
        <>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-slate-200 focus:border-red-600 focus:outline-none text-slate-900 placeholder-slate-500 transition-colors"
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
              {muscles.map((muscle, idx) => (
                <motion.button
                  key={muscle.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedMuscle(muscle.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    selectedMuscle === muscle.id
                      ? 'bg-red-600 text-white shadow-lg'
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