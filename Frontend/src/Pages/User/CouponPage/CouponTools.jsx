import React from "react"
import './CouponPage.css'
import {motion, AnimatePresence} from "framer-motion"

import {Search} from "lucide-react"
import {RiArrowDropDownLine} from "react-icons/ri"
import {MdSort} from "react-icons/md"

import useFlexiDropdown from '../../../Hooks/FlexiDropdown'


export default function CouponTools({searchTerm, setSearchTerm, limit, onLimitChange, onSortClick, onSortChange, options}){

  const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['limitDropdown', 'sortDropdown'])

  const sortTypes = [
    {name: 'Coupons: Recent to Oldest', value: '-1', sortBy: 'createdAt'}, {name: 'Coupons: Oldest to Recent', value: '1', sortBy: 'createdAt'},
    {name: 'Alphabetical: A to Z', value: '-1', sortBy: 'code'}, {name: 'Alphabetical: Z to A', value: '1', sortBy: 'code'}
  ]


  return (

        <motion.div
           className="mr-4 x-sm:mr-auto mb-6 flex flex-col s-sm:flex-row s-sm:justify-between s-sm:items-center gap-4"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, ease: "easeOut" }}
        >         
           <motion.div
             className="relative w-full s-sm:w-[22rem] x-sm:w-[28rem] x-md:w-[32rem] xx-lg:w-[35rem]"
             whileHover={{ scale: 1.01 }}
             transition={{ type: "spring", stiffness: 200 }}
           >
             <Search className="absolute left-3 top-1/2 h-[19px] w-[19px] transform -translate-y-1/2 text-gray-400" />
             <input
               type="text"
               placeholder="Search coupons..."
               className="pl-10 w-full h-[2.5rem] p-2 border border-gray-300 rounded-md placeholder:text-[13px] 
                          focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </motion.div>

           <div className="flex items-center gap-3">
             <motion.div
               whileTap={{ scale: 0.97 }}
               className="h-[35px] text-[14px] text-muted bg-white flex items-center gap-[10px] justify-between 
                          border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer hover:bg-gray-50 
                          transition-colors relative w-[8rem] mob:w-auto"
               onClick={(e) => toggleDropdown('limitDropdown')}
               id="limit-dropdown"
               ref={dropdownRefs.limitDropdown}
             >
               <span className="relative flex items-center border-r border-dropdownBorder py-[8px] pl-[10px] pr-[2px]">
                 {limit}
                 <i><RiArrowDropDownLine /></i>
               </span>
               <span className="flex items-center py-[8px] pr-[16px]">
                 <span className="font-[470]">Coupons</span>
               </span>

               <AnimatePresence>
                 {limit && openDropdowns.limitDropdown && (
                   <motion.ul
                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
                     transition={{ duration: 0.2 }}
                     className="absolute top-[44px] left-[3px] right-0 py-[10px] w-[101%] rounded-b-[4px] flex flex-col 
                                items-center gap-[10px] text-[13px] bg-white border border-dropdownBorder rounded-[6px] cursor-pointer z-10"
                   >
                     {[6, 10, 20, 30, 40].map((limit) => (
                       <li key={limit} onClick={() => onLimitChange(limit)}>
                         {limit}
                       </li>
                     ))}
                   </motion.ul>
                 )}
               </AnimatePresence>
             </motion.div>
               
             <motion.div
               whileTap={{ scale: 0.97 }}
               className="relative h-[35px] px-[12px] mob:px-[16px] py-[8px] text-[14px] text-muted bg-white flex items-center gap-[10px] 
                          justify-between border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer hover:bg-gray-50 
                          transition-colors w-[9rem] mob:w-auto"
               onClick={(e) => toggleDropdown('sortDropdown')}
               id="sort-options"
               ref={dropdownRefs.sortDropdown}
             >
               <span className="text-[13px] font-[470] whitespace-nowrap">Sort By</span>
               <MdSort className="h-[15px] w-[15px] text-secondary" />
               
               <AnimatePresence>
                 {openDropdowns.sortDropdown && (
                   <motion.ul
                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
                     transition={{ duration: 0.2 }}
                     className="list-none px-[10px] py-[1rem] absolute top-[44px] right-0 flex flex-col gap-[10px] justify-center 
                                w-[12rem] text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer"
                   >
                     {sortTypes.map((sortType) => (
                       <li key={`${sortType.value}-${sortType.sortBy}`}>
                         <span className="flex items-center gap-[5px]">
                           <input
                             type="radio"
                             value={sortType.value}
                             onClick={(e) => onSortClick(e, sortType.sortBy)}
                             onChange={(e) => onSortChange(e, sortType.value, sortType.sortBy)}
                             className="h-[10px] w-[10px] text-secondary focus:ring-secondary focus:text-secondary"
                             checked={
                               options.sort === Number(sortType.value) &&
                               options.sortBy === sortType.sortBy
                             }
                           />
                           <span>{sortType.name}</span>
                         </span>
                       </li>
                     ))}
                   </motion.ul>
                 )}
               </AnimatePresence>
             </motion.div>
           </div>
        </motion.div>
    
  )
}

