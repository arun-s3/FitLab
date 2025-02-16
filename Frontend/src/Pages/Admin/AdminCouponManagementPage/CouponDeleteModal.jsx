import React, { useState, useEffect } from "react"

import { X } from "lucide-react"
import { RiCoupon4Line } from "react-icons/ri";

export default function CouponModal({ isOpen, onClose, onSubmit, coupon }){


  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    minimumOrderValue: "",
    usageLimitPerCustomer: "",
    applicableType: "all",
    applicableCategories: [],
    applicableProducts: [],
    isCustomerSpecific: false,
    specificCustomers: [],
  })

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    if (coupon) {
      setFormData({...coupon, startDate: coupon.startDate.split("T")[0], endDate: coupon.endDate.split("T")[0]  })
    } else {
      setFormData({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        endDate: "",
        usageLimit: "",
        minimumOrderValue: "",
        usageLimitPerCustomer: "",
        applicableType: "all",
        applicableCategories: [],
        applicableProducts: [],
        isCustomerSpecific: false,
        specificCustomers: [],
      })
    }

    // Fetch categories, products, and customers
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse, customersResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products"),
          fetch("/api/customers"),
        ])
        const categoriesData = await categoriesResponse.json()
        const productsData = await productsResponse.json()
        const customersData = await customersResponse.json()

        setCategories(categoriesData)
        setProducts(productsData)
        setCustomers(customersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [coupon])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
      setFormData((prev) => ({ ...prev, [name]: selectedOptions }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{coupon ? "Edit Coupon" : "Create Coupon"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Coupon Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
                Discount Type
              </label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="mt-1 block text-[14px] w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                Discount Value
              </label>
              <input
                type="number"
                id="discountValue"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                required
                min="0"
                step={formData.discountType === "percentage" ? "1" : "0.01"}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="minimumOrderValue" className="block text-sm font-medium text-gray-700">
                Minimum Order Value
              </label>
              <input
                type="number"
                id="minimumOrderValue"
                name="minimumOrderValue"
                value={formData.minimumOrderValue}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">
                Usage Limit (optional)
              </label>
              <input
                type="number"
                id="usageLimit"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="usageLimitPerCustomer" className="block text-sm font-medium text-gray-700">
                Usage Limit Per Customer
              </label>
              <input
                type="number"
                id="usageLimitPerCustomer"
                name="usageLimitPerCustomer"
                value={formData.usageLimitPerCustomer}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="applicableType" className="block text-sm font-medium text-gray-700">
              Applicable To
            </label>
            <select
              id="applicableType"
              name="applicableType"
              value={formData.applicableType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Products</option>
              <option value="categories">Specific Categories</option>
              <option value="products">Specific Products</option>
            </select>
          </div>
          {formData.applicableType === "categories" && (
            <div>
              <label htmlFor="applicableCategories" className="block text-sm font-medium text-gray-700">
                Select Categories
              </label>
              <select
                multiple
                id="applicableCategories"
                name="applicableCategories"
                value={formData.applicableCategories}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {formData.applicableType === "products" && (
            <div>
              <label htmlFor="applicableProducts" className="block text-sm font-medium text-gray-700">
                Select Products
              </label>
              <select
                multiple
                id="applicableProducts"
                name="applicableProducts"
                value={formData.applicableProducts}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isCustomerSpecific"
              name="isCustomerSpecific"
              checked={formData.isCustomerSpecific}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isCustomerSpecific" className="ml-2 block text-sm text-gray-900">
              Customer-specific coupon
            </label>
          </div>
          {formData.isCustomerSpecific && (
            <div>
              <label htmlFor="specificCustomers" className="block text-sm font-medium text-gray-700">
                Select Customers
              </label>
              <select
                multiple
                id="specificCustomers"
                name="specificCustomers"
                value={formData.specificCustomers}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {coupon ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


