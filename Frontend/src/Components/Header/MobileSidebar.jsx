import React, {useState, useEffect, useRef} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import {motion, AnimatePresence, useScroll, useSpring} from "framer-motion"

import {Menu, ArrowUpRight, Home, LineChart, Info, BookText, PhoneCall, ShoppingCart, Bookmark, UserIcon, ChevronRight, LogIn, UserPlus,
  X, LayoutGrid, Package, LifeBuoy, User, CreditCard, BadgePercent, Clock, Search, Headset, Newspaper, Video, CircleUserRound, MapPin,
  MessageSquare, LogOut} from "lucide-react"
import {IoBagCheckOutline} from "react-icons/io5"

import CartSidebar from '../../Components/CartSidebar/CartSidebar'
import TextChatBox from '../../Pages/User/TextChatBox/TextChatBox'
import {signout} from '../../Slices/userSlice'


export default function MobileSidebar() {


  const [open, setOpen] = useState(false)

  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 30, mass: 0.2 })

  const [showOptions, setShowOptions] = useState({menu: true, browse: false, support: true, notice: true})

  const [openChatBox, setOpenChatBox] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const {user} = useSelector((state)=> state.user)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const topBarIcons = [
    {Icon: Home, label:'Home', path: '/'},
    {Icon: ShoppingCart, label:'Shopping Cart', path: null},
    {Icon: User, label:'User Profile', path: '/account'} ,
  ]

  useEffect(()=> {
    const onKey = (e)=> e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return ()=> window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    if (open) document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(()=> {
    if(user){
      setShowOptions(options=> ({...options, browse: true}))
    }else{
      setShowOptions(options=> ({...options, browse: false}))
    }
  }, [user])


  return (
    <>
      <header className="lg:mt-0 absolute sm:sticky right-[5px] sm:right-0 top-[25px] z-40">

        <nav
          className="mx-auto flex items-center justify-between rounded-full px-4  text-white lg:px-6"
          aria-label="Primary"
        >

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 p-2 text-white
             hover:bg-white/10 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              ref={scrollRef}
              className="fixed right-0 top-0 z-50 h-dvh w-[88%] max-w-sm overflow-hidden rounded-l-[12px] bg-neutral-900 text-white 
                shadow-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-[#2c0f4a]"    
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.04}
              onDragEnd={(_, info) => {
                if (info.offset.x > 80) setOpen(false)
              }}
              style={{ touchAction: "none" }}
            >
              <div className="relative grid h-full grid-rows-[auto,1fr,auto]">
                <div>
                  <div className="flex items-center justify-between bg-neutral-900/95 px-4 py-3 backdrop-blur
                  supports-[backdrop-filter]:bg-neutral-900/75">
                    <div className="flex items-center gap-3">
                      {
                        topBarIcons &&
                        topBarIcons.map(item=> (
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 cursor-pointer">
                            <item.Icon className="h-4 w-4" 
                              onClick={()=> {
                                item?.path && navigate(item.path)
                                if(item.label === 'Shopping Cart') setIsCartOpen(true)
                                setOpen(false)
                              }}/>
                          </span>
                        ))
                      }
                    </div>

                    <button
                      onClick={()=> setOpen(false)}
                      aria-label="Close menu"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 ring-1
                       ring-white/10 transition hover:bg-neutral-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mx-4 h-px bg-white/10" />

                  <div className="mx-4 mt-2 h-1 rounded-full bg-primaryDark overflow-hidden">
                    <motion.div
                      className="h-full w-full origin-left bg-primaryDark"
                      style={{ scaleX: scrollProgress }}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div ref={scrollRef} 
                  className="scroll-smooth overflow-y-auto overscroll-contain">
                  <div className="px-5 pt-4">
                    <div className="overflow-hidden rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 ring-1 ring-white/10">
                      <div className="flex items-stretch gap-4 p-4">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white/60">Frequently ordered</p>
                          <h3 className="mt-1 text-base font-semibold tracking-tight">Gym product of the month</h3>
                          <p className="mt-1 text-xs text-white/70">Creatine Monohydrate 100g • 30 servings</p>
                          <p className="mt-1 text-xs text-white/50">4.8 • Free delivery for members</p>
                        </div>
                        <img src="/creatine.jpg"
                          alt="Creatine Monohydrate thumbnail"
                          className="h-24 w-24 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
                        />
                      </div>

                      <div className="flex items-center justify-between bg-neutral-800/60 px-4 py-2 text-sm">
                        <button className="inline-flex items-center gap-1.5 text-white transition hover:text-white/90">
                          <span className="font-medium">Subscribe</span>
                          <ChevronRight size={18} className="text-white/50" />
                        </button>
                        <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 font-semibold
                         text-black ring-1 ring-black/10 transition hover:bg-amber-300">
                          Order now <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pt-5">
                    {
                      user ?
                        <button className="w-full flex flex-1 items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2 
                          text-[15px] text-whitesmoke ring-1 ring-white/10 transition hover:bg-white/10">
                            <div className="flex items-center gap-[5px]">
                              {
                                user && user?.profilePic ?
                                  <div className='w-[33px] h-[33px] rounded-[15px]'>
                                    <img src={user.profilePic}
                                      alt="" 
                                      className='rounded-[15px]'/>
                                  </div>
                                  : <User className='h-[18px] w-[18px]' />  
                              }
                              <span> {user.email.length>15? user.email.slice(0,15)+"...": user.email} </span>
                            </div>
                            <Link onClick={()=>{ user.googleId ? dispatch(signout(user.googleId)) : dispatch(signout()) }} > 
                              <LogOut className='h-[18px] w-[18px] text-red-500' />  
                            </Link>
                        </button>
                          :
                        <div className="flex items-center gap-3">
                          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm
                           ring-1 ring-white/10 transition hover:bg-white/10">
                            <Link to='/signin'> <LogIn size={18} /> Login </Link>
                          </button>
                          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm
                           font-medium text-black ring-1 ring-black/10 transition hover:bg-white/90">
                            <Link to='/signup'> <UserPlus size={18} /> Sign up </Link>
                          </button>
                        </div>
                    }
                  </div>

                  <nav className="mt-4 flex flex-col">
                    <div className="px-5">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium uppercase tracking-wide text-white/60"> Browse </p>
                        <span className="text-white/40 cursor-pointer"
                          onClick={()=> setShowOptions(options=> ({...options, browse: !options.browse}))}>
                            {showOptions.browse ? '-' : '+'}
                        </span>
                      </div>
                       
                    {
                      user && showOptions.browse &&
                        <motion.ul
                          className="flex flex-col"
                          initial="hidden"
                          animate="show"
                          variants={{
                            hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                            show: { transition: { staggerChildren: 0.06 } },
                          }}
                        >
                          {[
                            { label: "Account", Icon: CircleUserRound, path: '/account' },
                            { label: "Wallet", Icon: CreditCard, path: '/wallet' },
                            { label: "Coupons", Icon: BadgePercent, path: '/coupons' },
                            { label: "Checkout", Icon: IoBagCheckOutline, path: '/checkout' },
                            { label: "Order History", Icon: Clock, path: '/orders' },
                            { label: "Manage Addresses", Icon: MapPin, path: '/account/addresses' },
                          ].map(({ label, Icon, path }) => (
                            <motion.li
                              key={label}
                              variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }}
                            >
                              <button
                                className="group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm
                                 hover:bg-white/5"
                                onClick={()=> {navigate(path);  setOpen(false)}}
                              >
                                <span className="flex items-center gap-3 text-white/90">
                                  <span className="grid h-8 w-8 place-items-center rounded-md bg-white/5 ring-1 ring-white/10 text-white/80">
                                    <Icon size={18} />
                                  </span>
                                    {label} 
                                </span>
                                <ChevronRight className="text-white/30 group-hover:text-white/60" size={18} />
                              </button>
                            </motion.li>
                          ))}
                      </motion.ul>
                      }
                    </div>

                    <div className="my-3 h-px w-full bg-white/10" />

                      
                    <div className="px-5">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium uppercase tracking-wide text-white/60">Menu</p>
                        <span className="text-white/40 cursor-pointer"
                          onClick={()=> setShowOptions(options=> ({...options, menu: !options.menu}))}>
                            {showOptions.menu ? '-' : '+'}
                        </span>
                      </div>
                    {
                      showOptions.menu &&
                        <motion.ul
                          className="flex flex-col"
                          initial="hidden"
                          animate="show"
                          variants={{
                            hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                            show: { transition: { staggerChildren: 0.06 } },
                          }}
                        >
                          {[
                            { label: "Home", Icon: Home, path: '/'  },
                            { label: "Shop by Categories", Icon: LayoutGrid, path: '/shop'  },
                            { label: "Products", Icon: Package, path: '/shop'  },
                            { label: "Blogs", Icon: Newspaper, path: '/'  },
                            { label: "About Us", Icon: Info, path: '/'  },
                          ].map(({ label, Icon, path }) => (
                            <motion.li
                              key={label}
                              variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }}
                            >
                              <button
                                className="group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm
                                 hover:bg-white/5"
                                onClick={()=> {navigate(path); setOpen(false)}}
                              >
                                <span className="flex items-center gap-3 text-white/90">
                                  <span className="grid h-8 w-8 place-items-center rounded-md bg-white/5 ring-1 ring-white/10 text-white/80">
                                    <Icon size={18} />
                                  </span>
                                    {label} 
                                </span>
                                <ChevronRight className="text-white/30 group-hover:text-white/60" size={18} />
                              </button>
                            </motion.li>
                          ))}
                        </motion.ul>
                      }
                    </div>

                    <div className="my-3 h-px w-full bg-white/10" />

                    <div className="px-5">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium uppercase tracking-wide text-white/60"> Support </p>
                        <span className="text-white/60 cursor-pointer"
                          onClick={()=> setShowOptions(options=> ({...options, support: !options.support}))}>
                            {showOptions.support ? '-' : '+'}
                        </span>
                      </div>
                    {
                      showOptions.support && 
                        [
                          { label: "Video and Text Chat", Icon: Video },
                          { label: "Text Chat", Icon: MessageSquare },
                        ].map(({ label, Icon }) => (
                          <button
                            key={label}
                            className="group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm hover:bg-white/5"
                            onClick={()=> {
                              if(label === 'Text Chat'){
                                setOpenChatBox(true)
                              }else{
                                navigate('/support')
                              }
                              setOpen(fale)
                            }}
                          >
                            <span className="flex items-center gap-3 text-white/90">
                              <span className="grid h-8 w-8 place-items-center rounded-md bg-white/5 ring-1 ring-white/10 text-white/80">
                                <Icon size={18} />
                              </span>
                              {label}
                            </span>
                            <ChevronRight className="text-white/30 group-hover:text-white/60" size={18} />
                          </button>
                        ))
                    }
                    </div>

                    <div className="my-3 h-px w-full bg-white/10" />

                    <div className="px-5 mb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium uppercase tracking-wide text-white/60"> Notice </p>
                        <span className="text-white/60 cursor-pointer"
                          onClick={()=> setShowOptions(options=> ({...options, notice: !options.notice}))}>
                            {showOptions.notice ? '-' : '+'}
                        </span>
                      </div>
                    {
                      showOptions.notice &&
                        <button
                          className="group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm hover:bg-white/5"
                          onClick={() => setOpen(false)}
                        >
                          <span className="flex items-center gap-3 text-white/90">
                            <span className="grid h-8 w-8 place-items-center rounded-md bg-white/5 ring-1 ring-white/10 text-white/80">
                              <ChevronRight size={18} />
                            </span>
                            FAQ
                          </span>
                          <ChevronRight className="text-white/30 group-hover:text-white/60" size={18} />
                        </button>
                    }
                    </div>

                  </nav>
                </div>

                <div className="p-5 border-t border-white/10 bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/50">
                  <button className="w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-black shadow-sm
                    ring-1 ring-black/10 transition hover:bg-amber-300">
                      Join Fitlab Community
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}

        <CartSidebar isOpen={isCartOpen} onClose={()=> setIsCartOpen(false)} retractedView={true} />
        
        {
            openChatBox &&
            <div className="fixed bottom-[2rem] right-[2rem] z-50">
          
                <TextChatBox closeable={true} onCloseChat={()=> setOpenChatBox(false)}/>
                  
            </div>
        }

      </AnimatePresence>
    </>
  )
}
