import React, { useState } from "react"
import { Wallet, RefreshCw } from "lucide-react"
import AutoRechargeModal from "./AutoRechargeModal"

export default function AutoRechargeFeature() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [autoRechargeSettings, setAutoRechargeSettings] = useState(null)

  // Mock saved payment methods
  const savedPaymentMethods = [
    { id: "card1", type: "visa", last4: "4242", expiry: "05/25" },
    { id: "card2", type: "mastercard", last4: "8888", expiry: "09/24" },
  ]

  const handleSaveSettings = (settings) => {
    console.log("Auto-recharge settings saved:", settings)
    setAutoRechargeSettings(settings)
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Wallet Settings</h2>
          <div className="flex items-center text-sm">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${autoRechargeSettings?.isEnabled ? "bg-green-500" : "bg-gray-400"}`}
            ></div>
            <span>{autoRechargeSettings?.isEnabled ? "Auto-recharge enabled" : "Auto-recharge disabled"}</span>
          </div>
        </div>

        {autoRechargeSettings?.isEnabled && (
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Recharges when balance falls below ${autoRechargeSettings.thresholdAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Wallet className="h-4 w-4 mr-2" />
              <span>
                Adds ${autoRechargeSettings.rechargeAmount.toFixed(2)} using {autoRechargeSettings.paymentMethod}
              </span>
            </div>
          </div>
        )}

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Configure your wallet to automatically recharge when your balance gets low.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          Configure Auto-Recharge
        </button>
      </div>

      <AutoRechargeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        savedPaymentMethods={savedPaymentMethods}
        onSave={handleSaveSettings}
        currentSettings={autoRechargeSettings}
      />
    </div>
  )
}
