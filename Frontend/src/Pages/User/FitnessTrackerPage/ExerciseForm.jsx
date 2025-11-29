import React, {useState, useEffect, useRef} from "react"
import { motion, AnimatePresence } from "framer-motion"
import {debounce} from 'lodash'

import axios from 'axios'
import {Search, Plus, Zap, Trash} from "lucide-react"
import {IoIosFitness} from "react-icons/io"
import {IoBody} from "react-icons/io5"
import {toast as sonnerToast} from 'sonner'


export default function ExerciseForm({ onAddExercise }) {
    const [formData, setFormData] = useState({
        name: "",
        bodyPart: "",
        equipment: "",
        weight: "",
        sets: "",
        reps: "",
        rpe: "5",
        notes: "",
    })

    const [searchResults, setSearchResults] = useState({
      bodyParts: [],
      equipments: [],
      exercises: []
    })

    const [bodyParts, setBodyParts] = useState([])
    const [equipments, setEquipments] = useState([])

    const [sets, setSets] = useState( [{ weight: "", reps: "", rpe: "5" }])

    const exerciseAPiUrl = import.meta.env.VITE_EXERCISEDB_URL

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(()=> {
      console.log("searchResults----->", searchResults)
    }, [searchResults])

    useEffect(()=> {
      async function loadBodyPartsAndEquipments(){
        try {
          console.log("Inside loadBodyPartsAndEquipments()...")
          const [bodyPartsResponse, equipmentsResponse] = await Promise.allSettled([
            await axios.get(`${exerciseAPiUrl}/bodyparts`),
            await axios.get(`${exerciseAPiUrl}/equipments`),
          ])

          console.log("bodyPartsResponse------->", bodyPartsResponse)
          if (bodyPartsResponse.status === 'fulfilled'){
            const bodyParts = bodyPartsResponse.value.data.data.map(data=> data.name)
            console.log("bodyParts--->", bodyParts)
            setBodyParts(bodyParts)
          }
          console.log("equipmentsResponse------->", equipmentsResponse)
          if (equipmentsResponse.status === 'fulfilled'){
            const equipments = equipmentsResponse.value.data.data.map(data=> data.name)
            console.log("equipments--->", equipments)
            setEquipments(equipments)
          }
        }catch (error) {
        	console.error("Error while loading body parts and equipments", error.message)
        }
      }
      loadBodyPartsAndEquipments()
    }, [])

    const fetchExercises = async(name)=> { 
      try {
          console.log("Inside fetchExercises()...")    
        
        //   const response = await axios.get(
        //     `${exerciseAPiUrl}/exercises/search`,
        //     {
        //       params: {
        //         offset: 0,          
        //         limit: 20,   
        //         q: name          
        //       }
        //     }
        //   );
        //   const response = await axios.get(
        //     `${exerciseAPiUrl}/exercises/search`,
        //     {
        //       params: {
        //         q: name  // search query
        //       }
        //     }
        //   );
          const response = await axios.get(
            `${exerciseAPiUrl}/exercises/filter`,
            {
              params: {
                offset: 0,          
                limit: 20,             
                search: name,
              
                sortBy: 'name',
                sortOrder: 'asc',
              }
            }
          );
        
          console.log("fetchExercises response----->", response.data)
          if(response.data.success){
            console.log("Exercises--->", response.data)
            const exercises = response.data.data.map(exercise=> exercise.name)
            setSearchResults((prev) => ({ ...prev, exercises }))
          }
        }catch (error) {
            console.error("Error while loading exercises", error.message)
        }
    }
  
    const debouncedSearch = useRef(
        debounce((name)=> {
          fetchExercises(name)
        }, 600) 
    ).current;

    const exerciseSearchHandler = (name)=> {
        console.log('name--->', name)
        if(name.trim() !== ''){
            console.log("Getting searched lists--")
            debouncedSearch(name)
        } 
    }

    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      const makeItemsEmpty = ()=> {
          setSearchResults({bodyParts: [], equipments: [], exercises: []})
      }

      if (name === "name") {
        if (value.trim()) {
          exerciseSearchHandler(value)
        }else {
          makeItemsEmpty()
        }
      }

      if (name === "bodyPart") {
        if (value.trim()) {
          const filtered = bodyParts.filter((part) => part.toLowerCase().includes(value.toLowerCase()))
          setSearchResults((prev) => ({ ...prev, bodyParts: filtered }))
        } else {
          makeItemsEmpty()
        }
      }

      if (name === "equipment") {
        if (value.trim()) {
          const filtered = equipments.filter((eq) => eq.toLowerCase().includes(value.toLowerCase()))
          setSearchResults((prev) => ({ ...prev, equipments: filtered }))
        } else {
          makeItemsEmpty()
        }
      }
    }


    const handleSelectResult = (type, value) => {
      setFormData((prev) => ({ ...prev, [type]: value }))
      if(type === 'name'){
        setSearchResults((prev) => ({ ...prev, exercises: [] }))
      }else{
        setSearchResults((prev) => ({ ...prev, [type]: [] }))
      }
    }

    const handleSetChange = (index, field, value) => {
      if (value === "" || /^[0-9]+$/.test(value)) {
        const updated = [...sets]
        updated[index][field] = value
        setSets(updated)
      }
    }

    const addSet = () => {
      setSets(prev => [...prev, { weight: "", reps: "", rpe: "5" }])
    }

    const removeSet = (index) => {
      if (sets.length === 1) return
      const updated = sets.filter((_, i) => i !== index)
      setSets(updated)
    }

    const handleSubmit = async(e) => {
      e.preventDefault()
      if (!formData.name || sets.length === 0 || sets.every(set=> !set.weight || !set.rpe || !set.reps)) {
        sonnerToast.error("Please fill in all required fields")
        return
      }
      if(sets.some(set=> set.weight <= 0 || set.reps <= 0)){
        sonnerToast.error("Please enter a valid weight/reps")
        return
      }
      const exercise = {
        name: formData.name,
        bodyPart: formData.bodyPart,
        equipment: formData.equipment,
        sets: sets.map(s => ({
          weight: Number(s.weight),
          reps: Number(s.reps),
          rpe: Number(s.rpe)
        })),
        notes: formData.notes || "",
      }
      try { 
        const response = await axios.post(`${baseApiUrl}/fitness/tracker/add`, {exercise}, { withCredentials: true })
        if(response.status === 201){
          sonnerToast.success("New exercise succesfully added!")
          onAddExercise()
        }
      }catch (error) {
        console.error("Error during ading exercise", error.message)
      }
      setFormData({
        name: "",
        bodyPart: "",
        equipment: "",
        notes: "",
      })
      setSets([{ weight: "", reps: "", rpe: "5" }])
      setSearchResults({bodyParts: [], equipments: [], exercises: []})
    }

    const SearchableInput = ({ name, placeholder, icon: Icon, searchKey }) => (
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon className="w-[15px] h-[15px]" />
        </div>
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          onBlur={()=> setSearchResults({bodyParts: [], equipments: []})}
          // onFocus={() => formData[name] && setShowResults((prev) => ({ ...prev, [searchKey]: true }))}
          className="w-full text-[14px] bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900
           placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
        />

        <AnimatePresence>
          {searchResults[searchKey].length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
            >
              {searchResults[searchKey].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  onClick={() => handleSelectResult(name, item)}
                >
                  <p className="text-gray-900 font-medium text-sm">{item}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4 sticky top-4"
    >
      <h3 className="text-gray-900 font-semibold text-lg">Add Exercise</h3>

      <div className="space-y-3">
        
        {/* <SearchableInput name="name" placeholder="Exercise name" icon={Search} searchKey="exercises" /> */}

        {/* <SearchableInput name="bodyPart" placeholder="Body part" icon={IoBody} searchKey="bodyParts" /> */}

        <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-[15px] h-[15px]" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Exercise name"
              value={formData.name}
              onChange={handleChange}
              onBlur={()=> setSearchResults({bodyParts: [], equipments: [], exercises:[]})}
              // onFocus={() => formData[name] && setShowResults((prev) => ({ ...prev, [searchKey]: true }))}
              className="w-full text-[14px] bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900
               placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />

            <AnimatePresence>
              {searchResults.exercises.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                >
                  {searchResults.exercises.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={()=> handleSelectResult('name', item)}
                    >
                      <p className="text-gray-900 font-medium text-sm">{item}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
      </div>
      <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <IoBody className="w-[15px] h-[15px]" />
            </div>
            <input
              type="text"
              name="bodyPart"
              placeholder={"Body part"}
              value={formData.bodyPart}
              onChange={handleChange}
              onBlur={()=> setSearchResults({bodyParts: [], equipments: [], exercises:[]})}
              // onFocus={() => formData[name] && setShowResults((prev) => ({ ...prev, [searchKey]: true }))}
              className="w-full text-[14px] bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900
               placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
    
            <AnimatePresence>
              {searchResults.bodyParts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                >
                  {searchResults.bodyParts.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handleSelectResult('bodyPart', item)}
                    >
                      <p className="text-gray-900 font-medium text-sm">{item}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
      </div>
      <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <IoIosFitness className="w-[15px] h-[15px]" />
            </div>
            <input
              type="text"
              name="equipment"
              placeholder={"Equipment"}
              value={formData.equipment}
              onChange={handleChange}
              onBlur={()=> setSearchResults({bodyParts: [], equipments: [], exercises:[]})}
              // onFocus={() => formData[name] && setShowResults((prev) => ({ ...prev, [searchKey]: true }))}
              className="w-full text-[14px] bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900
               placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
    
            <AnimatePresence>
              {searchResults.equipments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                >
                  {searchResults.equipments.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handleSelectResult('equipment', item)}
                    >
                      <p className="text-gray-900 font-medium text-sm">{item}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
      </div>

        {/* <SearchableInput name="equipment" placeholder="Equipment" icon={IoIosFitness} searchKey="equipment" /> */}

      </div>

      {/* <div className="grid grid-cols-3 gap-2">
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={handleChange}
          className="w-full text-[14px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900
           placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
        />

        <input
          type="number"
          name="reps"
          placeholder="Reps"
          value={formData.reps}
          onChange={handleChange}
          className="bg-gray-50 text-[14px] border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500
             focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
        />

        <div>
          <input
            type="range"
            name="rpe"
            min="1"
            max="10"
            value={formData.rpe}
            onChange={handleChange}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <p className="text-gray-600 text-xs text-center mt-1 font-semibold">RPE: {formData.rpe}/10</p>
        </div>
      </div>     */}

      <div className="space-y-3">
        <AnimatePresence>
          {sets.map((set, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ease: 'easeOut', duration: 0.3}}
              key={index} 
              className="relative grid grid-cols-3 gap-2"
            >
            
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={sets[index].weight}
                onChange={(e) =>
                  handleSetChange(index, "weight", e.target.value)
                }
                className="w-full text-[14px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900
                placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              <input
                type="number"
                name="reps"
                placeholder="Reps"
                value={sets[index].reps}
                onChange={(e) =>
                  handleSetChange(index, "reps", e.target.value)
                }
                className="bg-gray-50 text-[14px] border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500
                  focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              <div>
                <input
                  type="range"
                  name="rpe"
                  min="1"
                  max="10"
                  placeholder="RPE"
                  value={sets[index].rpe}
                  onChange={(e) =>
                    handleSetChange(index, "rpe", e.target.value)
                  }
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <p className="text-gray-600 text-xs text-center mt-1 font-semibold">RPE: {sets[index].rpe}/10</p>
              </div>
              {
                index >= 1 &&
                  <button
                    type="button"
                    onClick={() => removeSet(index)}
                    className="absolute right-0 top-[26px]"
                  >
                    <Trash className="text-red-500 w-[15px] h-[15px]"/>
                  </button>
              }

            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={addSet}
          className="-mt-[5px] text-purple-600 font-medium text-sm hover:underline"
        >
          + Add Set
        </button>
      </div>

      <textarea
        type="text"
        name="notes"
        rows={3}
        cols={2}
        maxLength={500}
        placeholder="Notes (optional)"
        value={formData.notes}
        onChange={handleChange}
        className="w-full text-[14px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 
            focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
      />

      <motion.button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        <span>Add Exercise</span>
      </motion.button>
    </motion.form>
  )
}
