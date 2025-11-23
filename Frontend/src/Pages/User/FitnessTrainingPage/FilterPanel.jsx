import React, { useState } from 'react'
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"


export default function FilterPanel({
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
  const [expandedFilters, setExpandedFilters] = useState({
    muscles: true,
    equipments: true,
    sorting: true,
  })

  const toggleFilter = (filter) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }))
  }

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
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Filters & Sorting</h3>
        {(selectedMuscles.length > 0 || selectedEquipments.length > 0 || sortBy !== "name" || sortOrder !== "asc") && (
          <button
            onClick={clearFilters}
            className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-6">
          <button
            onClick={() => toggleFilter("muscles")}
            className="w-full flex items-center justify-between mb-4 hover:text-red-600 transition-colors"
          >
            <h4 className="font-semibold text-slate-900">Target Muscles</h4>
            <motion.div animate={{ rotate: expandedFilters.muscles ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={20} className="text-slate-600" />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{ height: expandedFilters.muscles ? "auto" : 0, opacity: expandedFilters.muscles ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableMuscles.map((muscle) => (
                <motion.button
                  key={muscle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMuscleToggle(muscle)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    selectedMuscles.includes(muscle)
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {muscle}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-b border-slate-200 pb-6">
          <button
            onClick={() => toggleFilter("equipments")}
            className="w-full flex items-center justify-between mb-4 hover:text-red-600 transition-colors"
          >
            <h4 className="font-semibold text-slate-900">Equipment</h4>
            <motion.div animate={{ rotate: expandedFilters.equipments ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={20} className="text-slate-600" />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: expandedFilters.equipments ? "auto" : 0,
              opacity: expandedFilters.equipments ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableEquipments.map((equipment) => (
                <motion.button
                  key={equipment}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEquipmentToggle(equipment)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    selectedEquipments.includes(equipment)
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {equipment}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <div>
          <button
            onClick={() => toggleFilter("sorting")}
            className="w-full flex items-center justify-between mb-4 hover:text-red-600 transition-colors"
          >
            <h4 className="font-semibold text-slate-900">Sort By</h4>
            <motion.div animate={{ rotate: expandedFilters.sorting ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={20} className="text-slate-600" />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{ height: expandedFilters.sorting ? "auto" : 0, opacity: expandedFilters.sorting ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden space-y-4"
          >
            <div>
              <p className="text-sm text-slate-600 font-medium mb-3">Sort Type</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["name", "muscle", "equipment", "bodyPart"].map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSortByChange(option)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 capitalize ${
                      sortBy === option
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-600 font-medium mb-3">Sort Order</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "asc", label: "Ascending" },
                  { value: "desc", label: "Descending" },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSortOrderChange(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      sortOrder === option.value
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
