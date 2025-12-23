import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { expenseAPI } from '../services/api'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

const AddExpense = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'FOOD',
    expenseDate: format(new Date(), 'yyyy-MM-dd'),
    paymentMethod: 'CASH',
    vendor: '',
  })

  const categories = [
    'FOOD',
    'TRANSPORTATION',
    'UTILITIES',
    'ENTERTAINMENT',
    'HEALTHCARE',
    'SHOPPING',
    'EDUCATION',
    'TRAVEL',
    'HOUSING',
    'INSURANCE',
    'SAVINGS',
    'OTHER',
  ]

  const paymentMethods = [
    'CASH',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'BANK_TRANSFER',
    'DIGITAL_WALLET',
    'OTHER',
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await expenseAPI.create({
        ...formData,
        amount: parseFloat(formData.amount),
      })
      navigate('/expenses')
    } catch (error) {
      console.error('Error creating expense:', error)
      alert('Failed to create expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Add New Expense
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="input-field"
              placeholder="e.g., Grocery shopping"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="input-field"
              placeholder="Optional notes about this expense"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="amount" className="label">
                Amount (₹) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                required
                min="0.01"
                step="0.01"
                className="input-field"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="expenseDate" className="label">
                Date *
              </label>
              <input
                type="date"
                id="expenseDate"
                name="expenseDate"
                required
                className="input-field"
                value={formData.expenseDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="label">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                className="input-field"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="paymentMethod" className="label">
                Payment Method *
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                required
                className="input-field"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="vendor" className="label">
              Vendor/Store
            </label>
            <input
              type="text"
              id="vendor"
              name="vendor"
              className="input-field"
              placeholder="e.g., Walmart, Amazon"
              value={formData.vendor}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Expense'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpense
