import React, { useState, useEffect, useRef, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"

import { Minus, Plus } from "lucide-react"
import { MdFavorite, MdFavoriteBorder } from "react-icons/md"

import { toast as sonnerToast } from "sonner"

import ProductDiscountBadge from "../../../Components/UI/Badges/DiscountBadges/ProductDiscountBadge"
import CategoryDiscountBadge from "../../../Components/UI/Badges/DiscountBadges/CategoryDiscountBadge"
import OfferDiscountBadge from "../../../Components/UI/Badges/DiscountBadges/OfferDiscountBadge"
import StarGenerator from "../../../Components/Tools/StarGenerator/StarGenerator"

import { capitalizeFirstLetter } from "../../../Utils/helperFunctions"
import { SiteSecondaryFillButton } from "../../../Components/UI/SiteButtons/SiteButtons"
import { CustomHashLoader } from "../../../Components/UI/Loader/Loader"
import { increaseOfferImpression } from "../../../Slices/offerSlice"
import { ProtectedUserContext } from "../../../Components/Route-guards/ProtectedUserRoutes/ProtectedUserRoutes"
import {
    addProductToList,
    removeProductFromList,
    getUserWishlist,
    resetWishlistStates,
} from "../../../Slices/wishlistSlice"
import WishlistOptionsModal from "../../../Components/Features/Wishlist/WishlistModals/WishlistOptionsModal"
import WishlistModal from "../WishlistPage/Modals/WishlistModal"
import { calculateOfferPricing } from "../../../Utils/offerCalculator"


export default function ProductDetail({ product = null, quantity, setQuantity, onAddToCart, isLoading }) {

    const [selectedVariantValue, setSelectedVariantValue] = useState(null)
    const [variantValueIndex, setVariantValueIndex] = useState(0)

    const [currentImageIndex, setCurrentImageIndex] = useState(null)

    const thumbnailRef = useRef(null)
    const containerRef = useRef(null)

    const [isZoomed, setIsZoomed] = useState(false)

    const { setIsAuthModalOpen, checkAuthOrOpenModal } = useContext(ProtectedUserContext)
    setIsAuthModalOpen({ status: false, accessFor: "shopping" })

    const [isWishlistOptionsModalOpen, setIsWishlistOptionsModalOpen] = useState(false)
    const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)

    const { wishlist, listProductAdded, listProductRemoved, wishlistError } = useSelector((state) => state.wishlist)
    const { bestOffer } = useSelector((state) => state.offers)
    const { user } = useSelector((state) => state.user)

    const dispatch = useDispatch()

    useEffect(() => {
        if (product && Object.keys(product).length > 0) {
            if (!product?.mainProduct) {
                setSelectedVariantValue(product[`${product.variantType}s`][0])
            } else {
                const requiredVariantIndex =
                    product.mainProduct.variants.findIndex(
                        (variant) => variant._id.toString() === product._id.toString(),
                    ) + 1
                setSelectedVariantValue(product[`${product.variantType}s`][requiredVariantIndex])
                setVariantValueIndex(requiredVariantIndex)
            }

            const thumbnailIndex = product.images.findIndex((img) => img.isThumbnail)
            setCurrentImageIndex(thumbnailIndex)
        }
    }, [product])

    useEffect(() => {
        const handleOfferImpression = (offer) => {
            const key = `offer_seen_${offer._id}`
            const alreadySeen = sessionStorage.getItem(key)

            if (!alreadySeen) {
                dispatch(increaseOfferImpression({ offerId: offer._id }))
                sessionStorage.setItem(key, "true")
            }
        }
        if (bestOffer) {
            handleOfferImpression(bestOffer)
        }
    }, [bestOffer])

    useEffect(() => {
        if (!user) return
        dispatch(getUserWishlist())
    }, [])

    useEffect(() => {
        if (listProductAdded) {
            sonnerToast.success("The product have been added to the Wishlist!")
            dispatch(resetWishlistStates())
        }
        if (listProductRemoved) {
            sonnerToast.success("The product have been removed from the Wishlist!")
            dispatch(resetWishlistStates())
        }
    }, [listProductAdded, listProductRemoved])

    useEffect(() => {
        if (wishlistError) {
            sonnerToast.error(wishlistError)
            dispatch(resetWishlistStates())
        }
    }, [wishlistError])

    const images = product?.images || []
    const mainImageUrl = images[currentImageIndex]?.url || product?.thumbnail?.url || ""

    const selectImage = (index) => {
        thumbnailRef.current.src = product.images[index].url
        setCurrentImageIndex(index)
    }

    const handleMouseMove = (e) => {
        if (!isZoomed || !thumbnailRef.current || !containerRef.current) return

        const { left, top, width, height } = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100

        thumbnailRef.current.style.transformOrigin = `${x}% ${y}%`
        thumbnailRef.current.style.transform = "scale(1.6)"
    }

    const handleMouseLeave = () => {
        setIsZoomed(false)
        if (thumbnailRef.current) {
            thumbnailRef.current.style.transformOrigin = "center center"
            thumbnailRef.current.style.transform = "scale(1)"
        }
    }

    const addToWishlist = () => {
        if (checkAuthOrOpenModal && checkAuthOrOpenModal()) return
        const requiredProductVariantId =
            variantValueIndex === 0 ? product._id : product.variants[variantValueIndex - 1]._id
        const userCreatedListsExists =
            Object.keys(wishlist).length &&
            wishlist?.lists.some((list) => list.name === "Default Shopping List") &&
            wishlist?.lists.length > 1
        if (userCreatedListsExists) {
            setIsWishlistOptionsModalOpen(true)
        } else {
            dispatch(addProductToList({ productId: requiredProductVariantId }))
        }
    }

    const deleteFromWishlist = () => {
        if (checkAuthOrOpenModal && checkAuthOrOpenModal()) return
        const requiredProductVariantId =
            variantValueIndex === 0 ? product._id : product.variants[variantValueIndex - 1]._id
        const productOfDefaultList =
            Object.keys(wishlist).length &&
            wishlist?.lists.some((list) => {
                list.name === "Default Shopping List" && list.products.some((item) => item.product === product._id)
            })

        if (productOfDefaultList) {
            dispatch(removeProductFromList({ productId: product._id }))
        } else {
            const targetList = wishlist.lists.find((list) =>
                list.products.find((item) => item.product === requiredProductVariantId),
            )
            dispatch(removeProductFromList({ listName: targetList.name, productId: requiredProductVariantId }))
        }
    }

    const sectionVariants = {
        hidden: { opacity: 0, y: 8 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.08,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 16 } },
    }

    const thumbVariants = {
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
    }

    const imageSwap = {
        initial: { opacity: 0, scale: 0.995 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.995, transition: { duration: 0.25, ease: "easeIn" } },
    }

    const smallButton = {
        rest: { scale: 1 },
        hover: { scale: 1.06, boxShadow: "0 8px 22px rgba(0,0,0,0.12)" },
        tap: { scale: 0.96 },
    }

    const addToCartButton = {
        rest: { scale: 1 },
        hover: { scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.14)" },
        tap: { scale: 0.98 },
    }


    return (
        <section className='grid grid-cols-1 md:grid-cols-2 gap-[1.5rem] s-sm:gap-[2rem] x-sm:gap-[3rem]'>
            <motion.div className='space-y-[12px] xs-sm:space-y-[16px]' variants={itemVariants}>

                <motion.div className='border rounded-lg p-[12px] xs-sm:p-[16px] bg-white' variants={itemVariants}>
                    <div
                        ref={containerRef}
                        className='relative w-full overflow-hidden rounded group'
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <AnimatePresence mode='wait'>
                            {mainImageUrl ? (
                                <motion.img
                                    key={mainImageUrl}
                                    src={mainImageUrl}
                                    alt={product?.title || "Product Thumbnail"}
                                    className={`w-full h-auto object-contain transition-transform duration-300 ease-out cursor-zoom-in`}
                                    ref={thumbnailRef}
                                    initial='initial'
                                    animate='animate'
                                    exit='exit'
                                    variants={imageSwap}
                                    loading='lazy'
                                    style={{ willChange: "transform, opacity" }}
                                />
                            ) : (
                                <motion.div
                                    key='placeholder'
                                    className='w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400'
                                    initial='initial'
                                    animate='animate'
                                    exit='exit'
                                    variants={imageSwap}>
                                    No image
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
                <motion.div
                    className='flex gap-[12px] xs-sm:gap-[16px] overflow-x-visible pb-2'
                    variants={sectionVariants}>
                    {product && Object.keys(product).length === 0 ? null : (
                        <AnimatePresence>
                            {product.images.map((image, index) => (
                                <motion.img
                                    key={image.url}
                                    src={image.url}
                                    alt={image.name}
                                    className={`flex-shrink-0 border rounded-lg w-[80px] h-[80px] xs-sm:w-[96px] xs-sm:h-[96px] 
                                        object-cover cursor-pointer
                                        ${currentImageIndex === index ? "outline outline-2 outline-secondary outline-offset-[2px]" : ""}`}
                                    onClick={() => selectImage(index)}
                                    variants={thumbVariants}
                                    initial='hidden'
                                    animate='show'
                                    whileHover={{ scale: 1.06, translateY: -4 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                                    loading='lazy'
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </motion.div>
            </motion.div>

            <motion.div className='space-y-[16px] s-sm:space-y-[20px] x-sm:space-y-[24px]' variants={sectionVariants}>
                <motion.div className='space-y-[6px] xs-sm:space-y-[8px]' variants={sectionVariants}>
                    <motion.div className='flex items-center gap-[6px] xs-sm:gap-[8px]' variants={itemVariants}>

                        <StarGenerator product={product} />

                        <motion.span className='text-[13px] xs-sm:text-[14px] text-gray-500'>
                            {" "}
                            ({`${product.totalReviews}`} Reviews){" "}
                        </motion.span>

                    </motion.div>
                    <motion.h1
                        className='flex gap-4 text-[20px] xs-sm:text-[22px] s-sm:text-[24px] max-xxs-sm:break-words 
                            font-bold capitalize leading-tight'
                        variants={itemVariants}
                    >
                        {capitalizeFirstLetter(product.title)}

                        {bestOffer?.offerOrOtherDiscount === "offer" ? (

                            <OfferDiscountBadge />

                        ) : bestOffer?.offerOrOtherDiscount === "product" ? (

                            <ProductDiscountBadge />

                        ) : (
                            bestOffer?.offerOrOtherDiscount === "category" && 

                            <CategoryDiscountBadge />
                        )}
                    </motion.h1>
                    <motion.p
                        className='text-gray-600 text-[14px] xs-sm:text-base leading-relaxed break-words whitespace-normal 
                            max-w-full overflow-hidden'
                        variants={itemVariants}>
                        {capitalizeFirstLetter(product.subtitle)}
                    </motion.p>
                    <motion.div
                        className='!mt-8 flex flex-col xs-sm:flex-row xs-sm:items-center gap-[0.5rem] xs-sm:gap-[1rem]'
                        variants={itemVariants}
                    >
                        <motion.div
                            className='flex flex-col text-[20px] xs-sm:text-[22px] s-sm:text-[24px] font-bold'
                            variants={itemVariants}
                        >
                            <motion.p
                                className={` ${bestOffer && bestOffer.bestDiscount > 0 && "line-through decoration-[2px] decoration-red-500"}`}
                                variants={itemVariants}
                            >
                                &#8377; {product && product.prices[variantValueIndex] * quantity}
                            </motion.p>

                            {bestOffer && bestOffer.bestDiscount > 0 && (
                                <motion.span
                                    className='mt-[-3px] xs-sm:mt-[-5px] text-green-500'
                                    variants={itemVariants}
                                >
                                    &#8377;{" "}
                                    {bestOffer.offerOrOtherDiscount === "offer"
                                        ? product.prices[variantValueIndex] - bestOffer.bestDiscount
                                        : calculateOfferPricing(bestOffer, product.prices[variantValueIndex], quantity)
                                              .totalFinalPrice}
                                </motion.span>
                            )}
                        </motion.div>
                        {bestOffer && bestOffer.offerOrOtherDiscount && (
                            <motion.p
                                className={`mb-[5px] px-[18px] xs-sm:px-[10px] py-[5px] bg-inputBgSecondary self-start 
                                    xs-sm:self-end flex items-center gap-[3px] text-[12px] font-medium text-secondary border
                                    border-inputBorderSecondary rounded-[7px] hover:underline hover:transition 
                                    hover:duration-300 flex-wrap`}
                                variants={itemVariants}
                            >
                                <span>

                                    {bestOffer &&
                                        bestOffer.offerOrOtherDiscount === "offer" &&
                                        `${
                                            bestOffer.offerDiscountType === "percentage"
                                                ? `${bestOffer.offerDetails.discountValue} %`
                                                : `₹ ${"-" + bestOffer.offerDetails.discountValue}`
                                        } Offer `
                                    }

                                    {bestOffer &&
                                        bestOffer.offerOrOtherDiscount === "product" &&
                                        `${
                                            bestOffer.offerDiscountType === "percentage"
                                                ? `${bestOffer.nonOfferDiscountValue} %`
                                                : `₹ ${"-" + bestOffer.nonOfferDiscountValue}`
                                        } Product Discount `
                                    }

                                    {bestOffer &&
                                        bestOffer.offerOrOtherDiscount === "category" &&
                                        `${bestOffer.nonOfferDiscountValue} % Catgeory Discount `
                                    }

                                </span>
                                <span className='pl-[3px] xs-sm:pl-[5px] capitalize text-red-500'>
                                    {bestOffer &&
                                        bestOffer.offerOrOtherDiscount === "offer" &&
                                        bestOffer?.offerDetails &&
                                        "-" + " " + bestOffer.offerDetails.name + "!"
                                    }
                                </span>

                                {bestOffer &&
                                    bestOffer.offerOrOtherDiscount === "offer" &&
                                    bestOffer?.offerDetails &&
                                    bestOffer?.offerDetails?.maxDiscount && (
                                        <span className='pl-[3px] xs-sm:pl-[5px] capitalize text-green-500'>
                                            {`(Max discount: ₹ ${bestOffer?.offerDetails?.maxDiscount})`}
                                        </span>
                                )}
                                
                            </motion.p>
                        )}
                    </motion.div>

                    {product?.variantType && (
                        <motion.div className='!mt-8' variants={sectionVariants}>
                            <motion.h3
                                className='text-[14px] xs-sm:text-[15px] font-medium mb-[6px] xs-sm:mb-[8px]'
                                variants={itemVariants}
                            >
                                {product.variantType === "motorPower"
                                    ? "MOTOR-POWER"
                                    : product.variantType.toUpperCase()}
                                :
                                <span className='ml-[5px] capitalize'>
                                    {selectedVariantValue &&
                                        selectedVariantValue +
                                            `${product.variantType === "weight" ? "  Kg" : product.variantType === "motorPower" ? "  Hp" : ""}`}
                                </span>
                            </motion.h3>
                            <motion.div
                                className='grid grid-cols-2 gap-[6px] xs-sm:gap-[8px] gap-x-[0.8rem] xs-sm:gap-x-[1rem]'
                                variants={sectionVariants}
                            >
                                {product &&
                                    product[`${product.variantType}s`] &&
                                    product[`${product.variantType}s`].map((value, index) => (
                                        <motion.div key={value} variants={itemVariants}>
                                            <motion.div
                                                initial='rest'
                                                whileHover='hover'
                                                whileTap='tap'
                                                variants={smallButton}
                                                onClick={() => setSelectedVariantValue(value)}
                                            >
                                                <SiteSecondaryFillButton
                                                    key={value}
                                                    variant={selectedVariantValue === value ? "default" : "outline"}
                                                    className='w-full text-[13px] xs-sm:text-base py-[8px] capitalize'
                                                    clickHandler={() => {
                                                        setSelectedVariantValue(value)
                                                        setVariantValueIndex(index)
                                                    }}>
                                                    {value +
                                                        `${product.variantType === "weight" ? "  KG" : product.variantType === "motorPower" ? "  HP" : ""}`}
                                                </SiteSecondaryFillButton>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                            </motion.div>
                        </motion.div>
                    )}

                    <motion.div
                        className='!mt-8 flex items-center justify-between gap-[12px] xs-sm:gap-[16px]'
                        variants={itemVariants}>
                        <motion.div className='flex items-center border rounded-md' variants={itemVariants}>
                            <motion.div
                                initial='rest'
                                whileHover='hover'
                                whileTap='tap'
                                variants={smallButton}
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <SiteSecondaryFillButton
                                    variant='ghost'
                                    size='icon'
                                    customStyle={{ paddingInline: "10px" }}
                                    clickHandler={() => setQuantity(Math.max(1, quantity - 1))}>
                                    <Minus className='w-[14px] h-[14px] xs-sm:w-[16px] xs-sm:h-[16px]' />
                                </SiteSecondaryFillButton>
                            </motion.div>

                            <motion.span
                                className='w-[40px] xs-sm:w-[48px] text-center text-[14px] xs-sm:text-base'
                                variants={itemVariants}>
                                {quantity}
                            </motion.span>

                            <motion.div
                                onClick={() => setQuantity(quantity + 1)}
                                initial='rest'
                                whileHover='hover'
                                whileTap='tap'
                                variants={smallButton}
                            >
                                <SiteSecondaryFillButton
                                    variant='ghost'
                                    size='icon'
                                    customStyle={{ paddingInline: "10px" }}
                                    clickHandler={() => setQuantity(quantity + 1)}>
                                    <Plus className='w-[14px] h-[14px] xs-sm:w-[16px] xs-sm:h-[16px]' />
                                </SiteSecondaryFillButton>
                            </motion.div>
                        </motion.div>

                        <motion.div initial='rest' whileHover='hover' whileTap='tap' variants={smallButton}>
                            <SiteSecondaryFillButton variant='outline' size='icon' className='!px-[10px] !py-[8px]'>
                                {wishlist.lists.some((list) =>
                                    list.products.some((item) => item.product === product._id),
                                ) ? (
                                    <MdFavorite
                                        className='hover:scale-110 transition-transform duration-100 text-secondary'
                                        onClick={() => deleteFromWishlist()}
                                    />
                                ) : (
                                    <MdFavoriteBorder
                                        className='hover:scale-110 transition-transform duration-100 text-secondary'
                                        onClick={() => addToWishlist()}
                                    />
                                )}
                            </SiteSecondaryFillButton>
                        </motion.div>

                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <motion.div initial='rest' whileHover='hover' whileTap='tap' variants={addToCartButton}>
                            <SiteSecondaryFillButton
                                className='w-full bg-[#CCFF00] hover:bg-primary text-black py-[12px] text-[14px] xs-sm:text-base'
                                clickHandler={() => onAddToCart(product, variantValueIndex)}>
                                {isLoading ? <CustomHashLoader loading={isLoading} /> : "Add to Cart"}
                            </SiteSecondaryFillButton>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>

            <WishlistOptionsModal
                isOpen={isWishlistOptionsModalOpen}
                onClose={() => setIsWishlistOptionsModalOpen(false)}
                product={product}
                setIsWishlistModalOpen={setIsWishlistModalOpen}
                wishlist={wishlist}
            />

            <WishlistModal isOpen={isWishlistModalOpen} onClose={() => setIsWishlistModalOpen(false)} />
                
        </section>
    )
}
