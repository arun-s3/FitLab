import React, {useState, useEffect, useRef} from "react"
import { motion, AnimatePresence } from "framer-motion"
import {debounce} from 'lodash'

import apiClient from '../../../Api/apiClient'
import axios from 'axios'

import {Search, ChevronDown, Plus, Zap, Trash} from "lucide-react"
import {IoIosFitness} from "react-icons/io"
import {IoBody} from "react-icons/io5"
import {toast as sonnerToast} from 'sonner'

import useFlexiDropdown from '../../../Hooks/FlexiDropdown'
import {CustomHashLoader} from '../../../Components/Loader/Loader'


export default function ExerciseForm({ onAddOrUpdateExercise, editExerciseData = null, onExerciseUpdation}) {
    const [formData, setFormData] = useState({
        name: "",
        bodyPart: "",
        equipment: "",
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

    const [loading, setLoading] = useState(false)

    const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['exerciseNamesDropdown', 'bodyPartsDropdown', 'equipmentsDropdown'])

    const exerciseAPiUrl = import.meta.env.VITE_EXERCISEDB_URL

    useEffect(()=> {
      async function loadBodyPartsAndEquipments(){
        try {
          const [bodyPartsResponse, equipmentsResponse] = await Promise.allSettled([
            await apiClient.get(`/fitness/exercises/bodyparts`),
            await apiClient.get(`/fitness/exercises/equipments`),
          ])

          if (bodyPartsResponse.status === 'fulfilled'){
            const bodyParts = bodyPartsResponse.value.data.data.map(data=> data.name)
            setBodyParts(bodyParts)
          }
          if (equipmentsResponse.status === 'fulfilled'){
            const equipments = equipmentsResponse.value.data.data.map(data=> data.name)
            setEquipments(equipments)
          }
        }catch (error) {
        	console.error(error)
            if (!error.response) {
              sonnerToast.error("Network error. Please check your internet.")
            }
        }
      }
      loadBodyPartsAndEquipments()
    }, [])

    useEffect(()=> {
      if(editExerciseData && Object.keys(editExerciseData).length > 0){
        setFormData({
          name: editExerciseData.name,
          equipment: editExerciseData.equipment,
          bodyPart: editExerciseData.bodyPart,
          notes: editExerciseData.notes
        })
        setSets(editExerciseData.sets)
      }
    }, [editExerciseData])

    const fetchExercises = async(name)=> { 
      try {
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
        
          if(response.data.success){
            const exercises = response.data.data.map(exercise=> exercise.name)
            setSearchResults((prev) => ({ ...prev, exercises }))
          }
        }catch (error) {
            console.error(error)
        }
    }
  
    const debouncedSearch = useRef(
        debounce((name)=> {
          fetchExercises(name)
        }, 600) 
    ).current;

    const exerciseSearchHandler = (name)=> {
        if(name.trim() !== ''){
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

    const getAllResults = (resultsOf)=> {
      const allBodyParts = ["cardio", "full-body", ...bodyParts]
      const allEquipments = ["none", "bodyweight", ...equipments]
      setSearchResults((prev) => ({ ...prev, [resultsOf]: resultsOf === 'bodyParts' ? allBodyParts : allEquipments}))
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

    const addNewExercise = async(exercise)=> { 
      try { 
        const response = await apiClient.post(`/fitness/tracker/exercise-library/add`, {exercise})
        if(response.status === 201){
          sonnerToast.success("New exercise succesfully added!")
          onAddOrUpdateExercise()
        }
      }catch (error) {
        if (!error.response) {
          sonnerToast.error("Network error. Please check your internet.")
        } else if (error.response?.status === 400) {
          sonnerToast.error(error.response.data.message || "Error while adding your exercise. Please try later!")
        } else {
          sonnerToast.error("Something went wrong! Please retry later.")
        }
      }finally {
        setLoading(false)
      }
    }

    const updateExercise = async(exercise, id)=> { 
      try { 
        const response = await apiClient.put(`/fitness/tracker/exercise-library/update`, {exercise, id})
        if(response.status === 200){
          sonnerToast.success("Exercise succesfully updated!")
          onAddOrUpdateExercise()
          onExerciseUpdation()
        }
      }catch (error) {
        if (!error.response) {
          sonnerToast.error("Network error. Please check your internet.")
        } else if (error.response?.status === 400 || error.response?.status === 404) {
          sonnerToast.error(error.response.data.message || "Error while updating your exercise. Please try later!")
        } else {
          sonnerToast.error("Something went wrong! Please retry later.")
        }
      }finally {
        setLoading(false)
      }
    }

    const handleSubmit = async(e) => {
      e.preventDefault()
      setLoading(true)
      if (!formData.name || sets.length === 0 || sets.some(set=> !set.reps)) {
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
          weight: Number(s.weight) || 0,
          reps: Number(s.reps),
          rpe: Number(s.rpe) || 0
        })),
        notes: formData.notes || "",
      }
      
      if(!editExerciseData){
        await addNewExercise(exercise)
      }else{
        await updateExercise(exercise, editExerciseData._id)
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


  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4 sticky top-4"
    >
      <h3 className="text-gray-900 font-semibold text-lg">Add Exercise</h3>

      <div className="space-y-3">

        <div className="relative" ref={dropdownRefs.exerciseNamesDropdown}>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-[15px] h-[15px]" />
            </div>
            <input
              type="text"
              name="name" 
              placeholder="Exercise name"
              value={formData.name}
              onChange={(e)=> {
                handleChange(e)
                toggleDropdown('exerciseNamesDropdown')
              }}
              onBlur={()=> setSearchResults({bodyParts: [], equipments: [], exercises:[]})}
              className="w-full text-[14px] bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900
               placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />

            <AnimatePresence>
              {openDropdowns.exerciseNamesDropdown && searchResults.exercises.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50
                   max-h-48 overflow-y-auto"
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
                      <p className="text-gray-900 font-medium text-sm capitalize">{item}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
      </div>
      <div className="relative" ref={dropdownRefs.bodyPartsDropdown}>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <IoBody className="w-[15px] h-[15px]" />
            </div>
            <input
              type="text"
              name="bodyPart"
              placeholder={"Body part (Recommended)"}
              value={formData.bodyPart}
              onChange={(e)=> {
                handleChange(e)
                toggleDropdown('bodyPartsDropdown')
              }}
              onBlur={()=> setSearchResults({bodyParts: [], equipments: [], exercises:[]})}
              className="w-full text-[14px] bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900
               placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
            <ChevronDown 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-[15px] h-[15px] text-secondary cursor-pointer" 
              onClick={()=> {
                getAllResults('bodyParts')
                toggleDropdown('bodyPartsDropdown')
              }}
            />
    
            <AnimatePresence>
              {openDropdowns.bodyPartsDropdown && searchResults.bodyParts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50
                   max-h-48 overflow-y-auto"
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
                      <p className="text-gray-900 font-medium text-sm capitalize">{item}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
      </div>
      <div className="relative" ref={dropdownRefs.equipmentsDropdown}>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <IoIosFitness className="w-[15px] h-[15px]" />
            </div>
            <input
              type="text"
              name="equipment"
              placeholder={"Equipment (Recommended)"}
              value={formData.equipment}
              onChange={(e)=> {
                handleChange(e)
                toggleDropdown('equipmentsDropdown')
              }}
              onBlur={()=> setSearchResults({bodyParts: [], equipments: [], exercises:[]})}
              className="w-full text-[14px] bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900
               placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
            <ChevronDown  
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-[15px] h-[15px] text-secondary cursor-pointer" 
              onClick={()=> {
                getAllResults('equipments')
                toggleDropdown('equipmentsDropdown')
              }} 
            />

            <AnimatePresence>
              {openDropdowns.equipmentsDropdown && searchResults.equipments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg 
                    z-50 max-h-48 overflow-y-auto"
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
                      <p className="text-gray-900 font-medium text-sm capitalize">{item}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
      </div>

      </div>

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
                  placeholder="RPE (Optional)"
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
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg flex 
          items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
 
        {
          loading 
            ? <CustomHashLoader loading={loading} color="#efff00" customStyle={{borderColor: '#efff00'}}/> 
            : (
              <> 
                <Plus className="w-5 h-5" />
                <span>
                  { !editExerciseData ? 'Add Exercise' : 'Update Exercise' }
                </span>
              </>
            )
        }  
        
      </motion.button>
    </motion.form>
  )
}
