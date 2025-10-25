import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"

const CATEGORIES = [
  {
    id: 1,
    name: "Free Weights",
    subcategories: [
      {
        id: 11,
        name: "Dumbbells",
        subcategories: [
          {
            id: 111,
            name: "Adjustable Dumbbells",
            subcategories: [
              {
                id: 1111,
                name: "5-25 lbs Set",
                subcategories: [
                  { id: 11111, name: "Rubber Coated" },
                  { id: 11112, name: "Chrome Plated" },
                  { id: 11113, name: "Neoprene Grip" },
                ],
              },
              {
                id: 1112,
                name: "25-50 lbs Set",
                subcategories: [
                  { id: 11121, name: "Rubber Coated" },
                  { id: 11122, name: "Chrome Plated" },
                ],
              },
              {
                id: 1113,
                name: "50-100 lbs Set",
                subcategories: [
                  { id: 11131, name: "Rubber Coated" },
                  { id: 11132, name: "Chrome Plated" },
                ],
              },
            ],
          },
          {
            id: 112,
            name: "Fixed Dumbbells",
            subcategories: [
              {
                id: 1121,
                name: "Rubber Coated",
                subcategories: [
                  { id: 11211, name: "1-10 lbs" },
                  { id: 11212, name: "10-50 lbs" },
                  { id: 11213, name: "50+ lbs" },
                ],
              },
              {
                id: 1122,
                name: "Hex Dumbbells",
                subcategories: [
                  { id: 11221, name: "Cast Iron" },
                  { id: 11222, name: "Rubber Coated" },
                ],
              },
              {
                id: 1123,
                name: "Neoprene Dumbbells",
                subcategories: [
                  { id: 11231, name: "Bright Colors" },
                  { id: 11232, name: "Pastel Colors" },
                ],
              },
            ],
          },
          {
            id: 113,
            name: "Specialty Dumbbells",
            subcategories: [
              {
                id: 1131,
                name: "Kettlebell Dumbbells",
                subcategories: [
                  { id: 11311, name: "8 kg" },
                  { id: 11312, name: "16 kg" },
                  { id: 11313, name: "24 kg" },
                ],
              },
              {
                id: 1132,
                name: "Spin-Lock Dumbbells",
                subcategories: [
                  { id: 11321, name: "Standard Collar" },
                  { id: 11322, name: "Quick Lock" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 12,
        name: "Barbells",
        subcategories: [
          {
            id: 121,
            name: "Olympic Barbells",
            subcategories: [
              {
                id: 1211,
                name: "20kg Standard",
                subcategories: [
                  { id: 12111, name: "Stainless Steel" },
                  { id: 12112, name: "Black Oxide" },
                  { id: 12113, name: "Chrome Plated" },
                ],
              },
              {
                id: 1212,
                name: "15kg Women's",
                subcategories: [
                  { id: 12121, name: "Stainless Steel" },
                  { id: 12122, name: "Black Oxide" },
                ],
              },
              {
                id: 1213,
                name: "Stainless Steel",
                subcategories: [
                  { id: 12131, name: "Competition Grade" },
                  { id: 12132, name: "Training Grade" },
                ],
              },
            ],
          },
          {
            id: 122,
            name: "EZ Curl Bars",
            subcategories: [
              {
                id: 1221,
                name: "Standard EZ Bar",
                subcategories: [
                  { id: 12211, name: "30mm Diameter" },
                  { id: 12212, name: "28mm Diameter" },
                ],
              },
              {
                id: 1222,
                name: "Olympic EZ Bar",
                subcategories: [
                  { id: 12221, name: "Black Oxide" },
                  { id: 12222, name: "Chrome Plated" },
                ],
              },
            ],
          },
          {
            id: 123,
            name: "Specialty Bars",
            subcategories: [
              {
                id: 1231,
                name: "Trap Bars",
                subcategories: [
                  { id: 12311, name: "Hexagon Shape" },
                  { id: 12312, name: "Diamond Shape" },
                ],
              },
              {
                id: 1232,
                name: "Safety Squat Bars",
                subcategories: [
                  { id: 12321, name: "Adjustable Handles" },
                  { id: 12322, name: "Fixed Handles" },
                ],
              },
              {
                id: 1233,
                name: "Football Bars",
                subcategories: [
                  { id: 12331, name: "Standard" },
                  { id: 12332, name: "Cambered" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 13,
        name: "Kettlebells",
        subcategories: [
          {
            id: 131,
            name: "Cast Iron Kettlebells",
            subcategories: [
              {
                id: 1311,
                name: "8-16 kg",
                subcategories: [
                  { id: 13111, name: "8 kg" },
                  { id: 13112, name: "12 kg" },
                  { id: 13113, name: "16 kg" },
                ],
              },
              {
                id: 1312,
                name: "20-32 kg",
                subcategories: [
                  { id: 13121, name: "20 kg" },
                  { id: 13122, name: "24 kg" },
                  { id: 13123, name: "32 kg" },
                ],
              },
              {
                id: 1313,
                name: "40+ kg",
                subcategories: [
                  { id: 13131, name: "40 kg" },
                  { id: 13132, name: "48 kg" },
                  { id: 13133, name: "56 kg" },
                ],
              },
            ],
          },
          {
            id: 132,
            name: "Competition Kettlebells",
            subcategories: [
              {
                id: 1321,
                name: "IBJJF Approved",
                subcategories: [
                  { id: 13211, name: "Red - 16 kg" },
                  { id: 13212, name: "Blue - 20 kg" },
                  { id: 13213, name: "Yellow - 24 kg" },
                ],
              },
              {
                id: 1322,
                name: "Color Coded Sets",
                subcategories: [
                  { id: 13221, name: "4 Piece Set" },
                  { id: 13222, name: "6 Piece Set" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Machines",
    subcategories: [
      {
        id: 21,
        name: "Cardio Machines",
        subcategories: [
          {
            id: 211,
            name: "Treadmills",
            subcategories: [
              {
                id: 2111,
                name: "Manual Treadmills",
                subcategories: [
                  { id: 21111, name: "Compact Models" },
                  { id: 21112, name: "Full Size" },
                ],
              },
              {
                id: 2112,
                name: "Electric Treadmills",
                subcategories: [
                  { id: 21121, name: "Basic Models" },
                  { id: 21122, name: "Advanced Models" },
                  { id: 21123, name: "Commercial Grade" },
                ],
              },
              {
                id: 2113,
                name: "Folding Treadmills",
                subcategories: [
                  { id: 21131, name: "Space Saving" },
                  { id: 21132, name: "Premium Folding" },
                ],
              },
            ],
          },
          {
            id: 212,
            name: "Stationary Bikes",
            subcategories: [
              {
                id: 2121,
                name: "Upright Bikes",
                subcategories: [
                  { id: 21211, name: "Basic" },
                  { id: 21212, name: "Advanced" },
                ],
              },
              {
                id: 2122,
                name: "Recumbent Bikes",
                subcategories: [
                  { id: 21221, name: "Standard" },
                  { id: 21222, name: "Premium" },
                ],
              },
              {
                id: 2123,
                name: "Spin Bikes",
                subcategories: [
                  { id: 21231, name: "Home Use" },
                  { id: 21232, name: "Commercial Use" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 22,
        name: "Strength Machines",
        subcategories: [
          {
            id: 221,
            name: "Leg Press Machines",
            subcategories: [
              {
                id: 2211,
                name: "45° Angle",
                subcategories: [
                  { id: 22111, name: "Plate Loaded" },
                  { id: 22112, name: "Pin Loaded" },
                ],
              },
              {
                id: 2212,
                name: "Vertical",
                subcategories: [
                  { id: 22121, name: "Compact" },
                  { id: 22122, name: "Full Size" },
                ],
              },
            ],
          },
          {
            id: 222,
            name: "Chest Press Machines",
            subcategories: [
              {
                id: 2221,
                name: "Plate Loaded",
                subcategories: [
                  { id: 22211, name: "Single Arm" },
                  { id: 22212, name: "Dual Arm" },
                ],
              },
              {
                id: 2222,
                name: "Pin Loaded",
                subcategories: [
                  { id: 22221, name: "Standard" },
                  { id: 22222, name: "Premium" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Accessories",
    subcategories: [
      {
        id: 31,
        name: "Weight Plates",
        subcategories: [
          {
            id: 311,
            name: "Olympic Plates",
            subcategories: [
              {
                id: 3111,
                name: "Bumper Plates",
                subcategories: [
                  { id: 31111, name: "Competition" },
                  { id: 31112, name: "Training" },
                  { id: 31113, name: "Colored Sets" },
                ],
              },
              {
                id: 3112,
                name: "Iron Plates",
                subcategories: [
                  { id: 31121, name: "Cast Iron" },
                  { id: 31122, name: "Machined" },
                ],
              },
              {
                id: 3113,
                name: "Calibrated Plates",
                subcategories: [
                  { id: 31131, name: "IPF Approved" },
                  { id: 31132, name: "Standard" },
                ],
              },
            ],
          },
          {
            id: 312,
            name: "Standard Plates",
            subcategories: [
              {
                id: 3121,
                name: "1 inch Center",
                subcategories: [
                  { id: 31211, name: "Vinyl Coated" },
                  { id: 31212, name: "Rubber Coated" },
                ],
              },
              {
                id: 3122,
                name: "Magnetic Plates",
                subcategories: [
                  { id: 31221, name: "Standard Strength" },
                  { id: 31222, name: "Heavy Duty" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 32,
        name: "Benches",
        subcategories: [
          {
            id: 321,
            name: "Weight Benches",
            subcategories: [
              {
                id: 3211,
                name: "Flat Benches",
                subcategories: [
                  { id: 32111, name: "Compact" },
                  { id: 32112, name: "Full Size" },
                  { id: 32113, name: "Commercial" },
                ],
              },
              {
                id: 3212,
                name: "Adjustable Benches",
                subcategories: [
                  { id: 32121, name: "2-Position" },
                  { id: 32122, name: "5-Position" },
                  { id: 32123, name: "Multi-Position" },
                ],
              },
              {
                id: 3213,
                name: "Decline Benches",
                subcategories: [
                  { id: 32131, name: "Fixed Decline" },
                  { id: 32132, name: "Adjustable Decline" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

const SubmenuLevel = ({ items, level = 0 }) => {
  const [hoveredId, setHoveredId] = useState(null)

  if (!items || items.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute left-full top-0 ml-2 min-w-max z-50"
    >
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <motion.button
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-between transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              <span>{item.name}</span>
              {item.subcategories && item.subcategories.length > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </motion.button>

            <AnimatePresence>
              {hoveredId === item.id && item.subcategories && item.subcategories.length > 0 && (
                <SubmenuLevel items={item.subcategories} level={level + 1} />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function CategorySubmenus() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false)
        setHoveredId(null)
      }}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200"
      >
        <span>Shop by Categories</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 min-w-max z-50"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              {CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setHoveredId(category.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                    className="w-full px-5 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-between transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-slate-800 whitespace-nowrap"
                  >
                    <span>{category.name}</span>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {hoveredId === category.id && category.subcategories && category.subcategories.length > 0 && (
                      <SubmenuLevel items={category.subcategories} level={1} />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
