import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { X, Plus, Minus, Check, ChevronDown } from "lucide-react"


export default function RestockModal({ isOpen, product, onClose, onSave }) {
    
    const [quantity, setQuantity] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
    const [showVariantDropdown, setShowVariantDropdown] = useState(false)

    const hasVariants = product?.variants && product.variants.length > 0

    const getCurrentStock = () => {
        return product?.stocks?.[selectedVariantIndex] || 0
    }

    const getVariantLabel = () => {
        const variantType = product?.variantType
        let value = ""

        if (variantType === "weight" && product?.weights) {
            value = product.weights[selectedVariantIndex]
            return value ? `${value} kg` : "Variant"
        } else if (variantType === "motorPower" && product?.motorPowers) {
            value = product.motorPowers[selectedVariantIndex]
            return value ? `${value} Hp` : "Variant"
        } else if (variantType === "size" && product?.sizes) {
            value = product.sizes[selectedVariantIndex]
            return value ? `${value}` : "Variant"
        } else if (variantType === "color" && product?.colors) {
            value = product.colors[selectedVariantIndex]
            return value ? `${value}` : "Variant"
        }

        return "Variant"
    }

    const getVariantOptions = () => {
        if (!hasVariants) {
            return []
        }

        const variantType = product?.variantType
        const options = []

        if (variantType === "weight" && product?.weights && Array.isArray(product.weights)) {
            product.weights.forEach((w, idx) => {
                options.push({ label: `${w} kg`, index: idx })
            })
        } else if (variantType === "motorPower" && product?.motorPowers && Array.isArray(product.motorPowers)) {
            product.motorPowers.forEach((m, idx) => {
                options.push({ label: `${m} Hp`, index: idx })
            })
        } else if (variantType === "size" && product?.sizes && Array.isArray(product.sizes)) {
            product.sizes.forEach((s, idx) => {
                options.push({ label: `${s}`, index: idx })
            })
        } else if (variantType === "color" && product?.colors && Array.isArray(product.colors)) {
            product.colors.forEach((c, idx) => {
                options.push({ label: `${c}`, index: idx })
            })
        }

        return options
    }

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 0
        setQuantity(Math.max(0, value))
    }

    const increment = () => setQuantity((q) => q + 1)
    const decrement = () => setQuantity((q) => (q > 0 ? q - 1 : 0))

    const handleSave = async () => {
        setIsLoading(true)

        const currentStock = getCurrentStock()
        const totalStock = quantity + product.totalStock

        const saveData = {
            productId: selectedVariantIndex === 0 ? product._id : product.variants[selectedVariantIndex - 1]._id,
            quantity,
            totalStock,
            isMainProduct: selectedVariantIndex === 0,
            isVariant: selectedVariantIndex > 0,
            variantType: hasVariants ? product?.variantType : null,
            variantIndex: selectedVariantIndex,
            parentProductId: hasVariants && selectedVariantIndex > 0 ? product?._id : null,
        }

        onSave?.(saveData)

        setTimeout(() => {
            setIsLoading(false)
            onClose()
        }, 500)
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const currentStock = getCurrentStock()
    const stockDifference = quantity
    const variantOptions = getVariantOptions()

    const getTotalStocks = () => {
        return (product?.stocks || []).reduce((sum, stock) => sum + (stock || 0), 0)
    }

    const getNewTotalStocks = () => {
        const totalBefore = getTotalStocks()
        return totalBefore - currentStock + (quantity + currentStock)
    }

    const totalStocks = getTotalStocks()
    const newTotalStocks = getNewTotalStocks()


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleBackdropClick}
                    className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className='bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden'>
                        <div className='bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5 flex items-center justify-between'>
                            <h2 className='text-xl font-bold text-white'>Restock Product</h2>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className='text-white hover:bg-purple-800 p-1 rounded-full transition-colors'>
                                <X size={24} />
                            </motion.button>
                        </div>

                        <div className='p-6 space-y-6 max-h-[30rem] overflow-y-auto'>
                            <div className='space-y-3'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center'>
                                        <img
                                            src={product.thumbnail.url}
                                            alt={product.title}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-semibold text-gray-900 capitalize truncate'>
                                            {product.title}
                                        </h3>
                                        <p className='text-sm text-gray-500 capitalize truncate'>{product?.subtitle}</p>
                                    </div>
                                </div>

                                {hasVariants && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        transition={{ duration: 0.3 }}
                                        className='space-y-2'>
                                        <label className='mt-4 block text-sm font-semibold text-gray-900'>
                                            Select Variant ({product?.variantType})
                                        </label>
                                        <div className='relative'>
                                            <motion.button
                                                onClick={() => setShowVariantDropdown(!showVariantDropdown)}
                                                className='w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg flex items-center justify-between hover:border-purple-300 transition-colors'>
                                                <span className='text-gray-900 font-medium'>{getVariantLabel()}</span>
                                                <motion.div
                                                    animate={{ rotate: showVariantDropdown ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}>
                                                    <ChevronDown size={20} className='text-gray-600' />
                                                </motion.div>
                                            </motion.button>

                                            <AnimatePresence>
                                                {showVariantDropdown && variantOptions.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className='absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto'>
                                                        {variantOptions.map((option, idx) => (
                                                            <motion.button
                                                                key={idx}
                                                                onClick={() => {
                                                                    setSelectedVariantIndex(option.index)
                                                                    setShowVariantDropdown(false)
                                                                    setQuantity(0)
                                                                }}
                                                                whileHover={{ backgroundColor: "#f3f4f6" }}
                                                                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                                                                    selectedVariantIndex === option.index
                                                                        ? "bg-purple-50 border-l-4 border-purple-600"
                                                                        : "border-l-4 border-transparent"
                                                                }`}>
                                                                <span
                                                                    className={
                                                                        selectedVariantIndex === option.index
                                                                            ? "text-purple-700 font-semibold"
                                                                            : "text-gray-700"
                                                                    }>
                                                                    {option.label}
                                                                </span>
                                                                <span className='text-xs text-gray-500 font-medium'>
                                                                    {product?.stocks?.[option.index] || 0} units
                                                                </span>
                                                            </motion.button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                )}

                                <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-gray-600 text-sm'>Current Stock</span>
                                        <span className='font-bold text-gray-900'>{currentStock} units</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-gray-600 text-sm'>Price per Unit</span>
                                        <span className='font-semibold text-gray-900'>
                                            ₹{(product?.prices?.[selectedVariantIndex] || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <label className='block text-sm font-semibold text-gray-900'>New Stock Level</label>

                                <div className='flex items-center gap-2 bg-gray-50 rounded-lg p-2'>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={decrement}
                                        disabled={quantity === 0}
                                        className='bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-300 text-gray-700 rounded-lg p-2 transition-colors'>
                                        <Minus size={18} />
                                    </motion.button>

                                    <input
                                        type='number'
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className='flex-1 bg-transparent text-center font-bold text-lg text-gray-900 focus:outline-none'
                                        min='0'
                                    />

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={increment}
                                        className='bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg p-2 transition-colors'>
                                        <Plus size={18} />
                                    </motion.button>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{ duration: 0.2 }}
                                    className={`text-sm font-medium text-center py-2 rounded-lg ${
                                        stockDifference > 0
                                            ? "bg-green-50 text-green-700"
                                            : stockDifference < 0
                                              ? "bg-red-50 text-red-700"
                                              : "bg-gray-100 text-gray-700"
                                    }`}>
                                    {stockDifference > 0 && `+${stockDifference} units`}
                                    {stockDifference < 0 && `${stockDifference} units`}
                                    {stockDifference === 0 && "No change"}
                                </motion.div>
                                <p className='mt-[3px] text-[11px] text-gray-500 text-center'>
                                    Total stock will be {quantity + currentStock} units
                                </p>
                            </div>

                            <div className='border-t border-gray-200 pt-4 space-y-4'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-gray-600'>Total Price</span>
                                    <motion.span
                                        key={quantity}
                                        initial={{ scale: 1.1, color: "#2563eb" }}
                                        animate={{ scale: 1, color: "#111827" }}
                                        transition={{ duration: 0.3 }}
                                        className='font-bold text-xl'>
                                        ₹
                                        {(
                                            (quantity + currentStock) *
                                            (product?.prices?.[selectedVariantIndex] || 0)
                                        ).toFixed(2)}
                                    </motion.span>
                                </div>
                                {hasVariants && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className='bg-purple-50 rounded-lg p-3'>
                                        <div className='flex justify-between items-center mb-2'>
                                            <span className='text-sm font-semibold text-gray-900'>
                                                Total Stock (All Variants)
                                            </span>
                                            <div className='flex items-center gap-2'>
                                                <motion.span
                                                    key={totalStocks}
                                                    initial={{ scale: 1.1 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                    className='font-bold text-lg text-purple-700'>
                                                    {totalStocks}
                                                </motion.span>
                                                <span className='text-gray-500'>→</span>
                                                <motion.span
                                                    key={newTotalStocks}
                                                    initial={{ scale: 1.1, color: "#059669" }}
                                                    animate={{ scale: 1, color: "#111827" }}
                                                    transition={{ duration: 0.2 }}
                                                    className='font-bold text-lg text-green-600'>
                                                    {newTotalStocks}
                                                </motion.span>
                                            </div>
                                        </div>
                                        <p className='text-xs text-gray-600'>
                                            After restocking, your total inventory will be{" "}
                                            <span className='font-semibold'>{newTotalStocks} units</span>
                                        </p>
                                    </motion.div>
                                )}

                                <div className='bg-amber-50 rounded-lg p-3 border border-amber-200'>
                                    <p className='text-xs text-amber-800'>
                                        <span className='font-semibold'>Low-Stock Threshold:</span> The low-stock
                                        threshold is set at 5 units to maintain optimal inventory levels.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='bg-gray-50 px-6 py-4 flex gap-3'>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className='flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors'>
                                Cancel
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                disabled={isLoading || quantity === 0}
                                className={`flex-1 px-4 py-2.5 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                                    isLoading || quantity === 0
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700 text-white"
                                }`}>
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Check size={18} />
                                        </motion.div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        Save Changes
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
