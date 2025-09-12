import React, {useState} from "react"
import {motion, AnimatePresence} from "framer-motion"

import {X, FileText, Download, FileSpreadsheet} from "lucide-react"



export default function ExportFileModal({ isOpen, onClose, onExport, productCount = 0 }){
    
  const [selectedFormat, setSelectedFormat] = useState("csv")
  const [isExporting, setIsExporting] = useState(false)

  const formatOptions = [
    {
      id: "csv",
      name: "CSV",
      description: "Spreadsheet file, easily opened in Excel",
      icon: FileSpreadsheet,
      extension: ".csv",
    },
    {
      id: "pdf",
      name: "PDF",
      description: "Document for easy sharing and printing",
      icon: FileText,
      extension: ".pdf",
    },
  ]

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await onExport(selectedFormat)
      onClose()
    }catch (error) {
      console.error("Export failed:", error)
    }finally {
      setIsExporting(false)
    }
  }


  return (

    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700
                w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white"> Export Products </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {productCount > 0 ? `${productCount} products` : "All products"} will be exported. Are you Sure?
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  disabled={isExporting}
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3"> Select export format: </h3>
                  <div className="space-y-3">
                    {formatOptions.map((format) => {
                      const IconComponent = format.icon
                      return (
                        <motion.label
                          key={format.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${
                              selectedFormat === format.id
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="format"
                            value={format.id}
                            checked={selectedFormat === format.id}
                            onChange={(e) => setSelectedFormat(e.target.value)}
                            className="sr-only"
                          />
                          <div
                            className={`
                            flex items-center justify-center w-10 h-10 rounded-lg mr-4
                            ${
                              selectedFormat === format.id
                                ? "bg-secondary text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }
                          `}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white"> {format.name} </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {format.extension}
                              </span>
                            </div>
                            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1"> {format.description} </p>
                          </div>
                          {selectedFormat === format.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center ml-2"
                            >
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </motion.div>
                          )}
                        </motion.label>
                      )
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onClose}
                    disabled={isExporting}
                    className="flex-1 px-4 py-2.5 text-[15px] text-gray-700 dark:text-gray-300 bg-gray-100
                      dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleExport}
                    disabled={isExporting}
                    whileHover={{ scale: isExporting ? 1 : 1.02 }}
                    whileTap={{ scale: isExporting ? 1 : 0.98 }}
                    className="flex-1 px-4 py-2.5 text-[15px] bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                      font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isExporting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Export {selectedFormat.toUpperCase()}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}


