import React, {useState, useEffect} from 'react'
import './WishlistPage.css'
import {useSelector, useDispatch} from 'react-redux'
import {motion, AnimatePresence} from "framer-motion"

import {Search, Trash, ArrowRight, SquarePen, Plus} from "lucide-react"
import {PiListHeartDuotone} from "react-icons/pi"
import {format} from "date-fns"
import {toast as sonnerToast} from 'sonner'

import {resetWishlistStates} from '../../../Slices/wishlistSlice'


export default function ListBoard({currentList, onNewCurrenList, onSearch, onUpdateList, onDeleteList, 
    onOpenNewListModal, setLoadingListCard, isListCardLoading}){

    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)

    const open = hovered || focused
    
    const {wishlist, listCreated, listUpdated, listRemoved} = useSelector(state=> state.wishlist) 
    
    const dispatch = useDispatch()

    const priorityDetails = [
        {name: 'high', value: 1, color: 'text-red-500', bg: 'bg-red-50'},
        {name: 'medium', value: 2, color: 'text-yellow-500', bg: 'bg-red-50'},
        {name: 'low', value: 3, color: 'text-green-500', bg: 'bg-red-50'}
    ]

    useEffect(()=> {
        if(listCreated){
            sonnerToast.success("Created wishlist successfully!")
            dispatch(resetWishlistStates())
        }
        if(listUpdated){
            sonnerToast.success("Updated wishlist successfully!")
            setLoadingListCard({})
            dispatch(resetWishlistStates())
        }
        if(listRemoved){
            sonnerToast.success("Deleted wishlist successfully!")
            dispatch(resetWishlistStates())
        }
    },[listCreated, listUpdated, listRemoved])

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.08, duration: 0.4, ease: "easeOut" },
        },
    }

    const itemVariants = {
      hidden: { opacity: 0, y: 30, scale: 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.35, ease: "easeOut" }
      },
      hover: {
        scale: 1.02,
        y: -4,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
        transition: { duration: 0.2 }
      },
      exit: { opacity: 0, y: 15, transition: { duration: 0.3 } },
    }

    
    return(

        <div className='max-md:relative'>
            
            <h3 className="inline-block md:hidden mb-4 text-[17px] text-secondary font-[600] tracking-[0.3px]">
              Your Lists
            </h3>
        
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`p-[12px] px-[20px] bg-purple-50 border border-dashed border-secondary rounded-[7px] h-[20rem] 
                ${
                  wishlist.lists.length > 2
                    ? "md:h-[30rem] overflow-y-auto"
                    : "md:h-fit overflow-y-auto md:overflow-visible"
                }
                overflow-x-hidden`}
            >
        
            <div 
              className="absolute max-md:left-0 max-md:-top-[5px] md:relative flex items-center justify-between mb-[1.3rem] w-full group"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => !focused && setHovered(false)}
            >
                <AnimatePresence>
                  {
                    !open &&
                    <motion.span
                      className="hidden md:inline-block text-[17px] text-secondary font-[550] uppercase tracking-[0.2px] whitespace-nowrap"
                      animate={{ opacity: open ? 0 : 1, x: open ? -8 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      All Lists
                    </motion.span>
                  }
                </AnimatePresence>
              
                <div className="relative flex items-center justify-end w-full h-[36px] ml-2">
                    <motion.div
                      className="absolute right-2 flex items-center justify-center cursor-pointer z-10"
                      animate={{
                        scale: open ? 0.95 : 1,
                        color: open ? "#8b5cf6" : "#9ca3af",
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <Search className="w-[20px] h-[20px]" />
                    </motion.div>
                  
                    <AnimatePresence>
                      {open && (
                        <motion.input
                          key="search-input"
                          type="text"
                          placeholder="Search lists..."
                          onChange={(e) => onSearch && onSearch(e)}
                          onFocus={() => setFocused(true)}
                          onBlur={() => {
                            setFocused(false);
                            setHovered(false);
                          }}
                          initial={{ x: 180, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 180, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute right-0 h-[2.2rem] w-[60%] md:w-[180px] text-[13px] pl-4 pr-10 text-secondary 
                                     border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 
                                     focus:ring-secondary focus:border-0 bg-white shadow-sm placeholder:text-gray-400"
                        />
                      )}
                    </AnimatePresence>
                </div>
            </div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full pr-[5px] flex flex-col gap-[10px]"
            >
              <AnimatePresence>
                {wishlist?.lists &&
                  wishlist.lists.length > 0 &&
                  [...wishlist.lists]
                    .sort((a, b) => {
                      const priorityA = a.priority.toString()
                      const priorityB = b.priority.toString()
                    
                      if (priorityA === "1") return -1
                      if (priorityB === "1") return 1
                      if (priorityA === "2") return -1
                      if (priorityB === "2") return 1
                      return 0;
                    })
                    .map((list) =>
                      isListCardLoading?.[list._id] ? (
                        <div
                          key={list.name}
                          className="w-full h-[240.6px] px-[12px] py-[10px] border border-dropdownBorder rounded-[5px] 
                            shadow-lg cursor-default skeleton-loader"
                        />
                      ) : (
                        <motion.div
                          key={list.name}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          exit="exit"
                          layout
                          className={`relative w-full px-[12px] py-[10px] min-w-[11rem]
                            ${
                              currentList === list.name
                                ? "bg-whitesmoke shadow-lg"
                                : "bg-white shadow-sm"
                            } flex flex-row md:flex-col gap-[10px]
                            justify-between border border-dropdownBorder rounded-[5px] cursor-pointer
                            hover:bg-whitesmoke hover:shadow-md`}
                          id="list"
                        >
                          <SquarePen
                            className="absolute left-[7px] right-auto md:right-[7px] md:left-auto top-[7px] w-4 h-4 text-[#aa65db]
                              transition duration-300 hover:text-secondary hover:scale-105 hover:rotate-[360deg] cursor-pointer"
                            onClick={() => onUpdateList(list)}
                          />
                          <div
                            className="ml-[7px] md:ml-0 flex flex-col justify-between gap-[10px] self-center"
                            onClick={() =>
                              onNewCurrenList((prev) =>
                                prev === list.name ? "" : list.name
                              )
                            }
                          >
                            <div>
                              <figure
                                className={` ${ 
                                  !list?.thumbnail &&
                                  "flex justify-center items-center"
                                } w-[100px] h-[100px] rounded-[10px]`}
                              >
                                {list?.thumbnail ? (
                                  <img
                                    src={list?.thumbnail.url}
                                    className="w-[100px] h-[100px] object-cover rounded-[10px]"
                                  />
                                ) : (
                                  <PiListHeartDuotone className="w-[50px] h-[50px] text-[#dde1e7]" />
                                )}
                              </figure>
                              <div className="flex gap-[10px]">
                                <h4 className="mt-[5px] text-[13px] font-[450] capitalize">
                                  {list.name}
                                </h4>
                              </div>
                              <h5 className="text-[11px] text-muted font-[450] capitalize">
                                {` (${list.products.length} ${
                                  list.products.length === 1 ? "item" : "items"
                                }) `}
                              </h5>
                            </div>
                            <h3 className="text-[11px]">
                              <span className="text-muted"> Priority: </span>
                              <span
                                className={`ml-[3px] ${
                                  priorityDetails.find(
                                    (status) => status.value === list.priority
                                  ).color
                                } font-[450] capitalize`}
                              >
                                {
                                  priorityDetails.find(
                                    (status) => status.value === list.priority
                                  ).name
                                }
                              </span>
                            </h3>
                            <h5 className="text-[11px] text-muted">
                              Created:{" "}
                              {format(new Date(list.createdAt), "MMM dd, yyyy")}
                            </h5>
                          </div>
                          <div className="w-auto md:w-full flex flex-col md:flex-row justify-between controls">
                            <Trash
                              className="w-[15px] h-[15px] text-muted hover:scale-110 hover:text-red-500 transition
                                ease-in-out duration-300"
                              onClick={() =>
                                onDeleteList({
                                  listId: list._id,
                                  listName: list.name,
                                })
                              }
                            />
                            <ArrowRight
                              className="w-[15px] h-[15px] text-muted hover:text-green-500 hover:translate-x-2
                                hover:scale-110 transition duration-300 ease-in-out"
                              onClick={() =>
                                onNewCurrenList((prev) =>
                                  prev === list.name ? "" : list.name
                                )
                              }
                            />
                          </div>
                        </motion.div>
                      )
                    )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
                
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="mb-[2rem] w-full h-[3rem] pl-[1rem] flex items-center gap-[10px] cursor-pointer"
            onClick={() => onOpenNewListModal()}
          >
                <Plus className="text-secondary w-[20px] h-[20px]" />
                <span className="text-[14px] text-muted font-[500] tracking-[0.5px] capitalize">
                  Add New List
                </span>
          </motion.div>

        </div>
    )
}