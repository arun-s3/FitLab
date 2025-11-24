import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"

import { ChevronDown, X } from "lucide-react"

import useFlexiDropdown from '../../../Hooks/FlexiDropdown'


export default function CompactFilterPanel({
  selectedMuscles = [],
  onMusclesChange,
  selectedEquipments = [],
  onEquipmentsChange,
  sortBy = "name",
  onSortByChange,
  sortOrder = "asc",
  onSortOrderChange,
  availableMuscles = [],
  availableEquipments = [],
}) {


  const [openDropdown, setOpenDropdown] = useState(null)

  const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown([
    'muscleDropdown', 'equipmentDropdown', 'sortByDropdown', 'sortOrderDropdown'
  ])


  useEffect(()=> {
    console.log("Opening CompactFilterPanel.....")
  }, [])

  const handleMuscleToggle = (muscle) => {
    const updated = selectedMuscles.includes(muscle)
      ? selectedMuscles.filter((m) => m !== muscle)
      : [...selectedMuscles, muscle]
    onMusclesChange(updated)
  }

  const handleEquipmentToggle = (equipment) => {
    const updated = selectedEquipments.includes(equipment)
      ? selectedEquipments.filter((e) => e !== equipment)
      : [...selectedEquipments, equipment]
    onEquipmentsChange(updated)
  }

  const clearFilters = () => {
    onMusclesChange([])
    onEquipmentsChange([])
    onSortByChange("name")
    onSortOrderChange("asc")
    setOpenDropdown(null)
  }

  const hasActiveFilters =
    selectedMuscles.length > 0 || selectedEquipments.length > 0 || sortBy !== "name" || sortOrder !== "asc"

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
      <div className="relative">
        <button
          onClick={() => toggleDropdown('muscleDropdown')}   
          ref={dropdownRefs.muscleDropdown}       
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            selectedMuscles.length > 0
              ? "bg-purple-500 text-white shadow-md"
              : "bg-slate-100 text-slate-900 hover:bg-slate-200"
          }`}
        >
          <span>{selectedMuscles.length > 0 ? `Muscles (${selectedMuscles.length})` : "All Muscles"}</span>
          <motion.div animate={{ rotate: openDropdowns.muscleDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>

        <AnimatePresence>
          {openDropdowns.muscleDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 min-w-max"
            >
              <div className="max-h-72 px-[3px] overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {
                    availableMuscles.map((muscle) => (
                      <motion.button
                        key={muscle}
                        whileHover={{ scale: 1.02 }}
                        onClick={()=> handleMuscleToggle(muscle)}     
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          selectedMuscles.includes(muscle)
                            ? "bg-purple-100 text-secondary"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {muscle}
                      </motion.button>
                    ))
                }
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <button
          onClick={() => toggleDropdown('equipmentDropdown')}   
          ref={dropdownRefs.equipmentDropdown}       
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            selectedEquipments.length > 0
              ? "bg-purple-500 text-white shadow-md"
              : "bg-slate-100 text-slate-900 hover:bg-slate-200"
          }`}
        >
          <span>{selectedEquipments.length > 0 ? `Equipment (${selectedEquipments.length})` : "All Equipment"}</span>
          <motion.div animate={{ rotate: openDropdowns.equipmentDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>

        <AnimatePresence>
          {openDropdowns.equipmentDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 min-w-max"
            >
              <div className="max-h-72 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {availableEquipments.map((equipment) => (
                    <motion.button
                      key={equipment}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleEquipmentToggle(equipment)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        selectedEquipments.includes(equipment)
                          ? "bg-purple-100 text-secondary"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {equipment}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <button
          onClick={() => toggleDropdown('sortByDropdown')}   
          ref={dropdownRefs.sortByDropdown} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            sortBy !== "name" ? "bg-primaryDark shadow-md" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
          }`}
        >
          <span>Sort: {sortBy === "name" ? "Name" : sortBy}</span>
          <motion.div animate={{ rotate: openDropdowns.sortByDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>

        <AnimatePresence>
          {openDropdowns.sortByDropdown  && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 min-w-max"
            >
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: "name", label: "Name" },
                  { value: "muscle", label: "Muscle" },
                  { value: "equipment", label: "Equipment" },
                  { value: "bodyPart", label: "Body Part" },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      onSortByChange(option.value)
                      setOpenDropdown(null)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      sortBy === option.value
                        ? "bg-purple-100 text-secondary"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <button
          onClick={() => toggleDropdown('sortOrderDropdown')}   
          ref={dropdownRefs.sortOrderDropdown} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            sortOrder !== "asc" ? "bg-primaryDark shadow-md" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
          }`}
        >
          <span>{sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}</span>
          <motion.div animate={{ rotate: openDropdowns.sortOrderDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>

        <AnimatePresence>
          {openDropdowns.sortOrderDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 min-w-max"
            >
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: "asc", label: "Ascending ↑" },
                  { value: "desc", label: "Descending ↓" },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      onSortOrderChange(option.value)
                      setOpenDropdown(null)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      sortOrder === option.value
                        ? "bg-purple-100 text-secondary"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearFilters}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all"
        >
          <X size={16} />
          Clear
        </motion.button>
      )}
    </div>
  )
}
