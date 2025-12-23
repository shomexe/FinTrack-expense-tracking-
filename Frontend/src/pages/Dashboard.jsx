import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { expenseAPI } from '../services/api'
import {
  CurrencyRupeeIcon,
  PlusIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'
import { format, startOfMonth, endOfMonth } from 'date-fns'

const Dashboard = () => {
  const [expenses, setExpenses] = useState([])
  const [stats, setStats] = useState({ total: 0, count: 0 })
  const [categoryData, setCategoryData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const currentDate = new Date()
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd')
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd')

      const [expensesRes, totalRes, categoryRes] = await Promise.all([
        expenseAPI.getByDateRange(startDate, endDate),
        expenseAPI.getTotalByDateRange(startDate, endDate),
        expenseAPI.getCategorySummary(startDate, endDate),
      ])

      setExpenses(expensesRes.data.slice(0, 5))
      setStats({
        total: totalRes.data.total,
        count: expensesRes.data.length,
      })
      setCategoryData(categoryRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const categoryColors = {
    FOOD: 'bg-yellow-500',
    TRANSPORTATION: 'bg-blue-500',
    UTILITIES: 'bg-green-500',
    ENTERTAINMENT: 'bg-purple-500',
    HEALTHCARE: 'bg-red-500',
    SHOPPING: 'bg-pink-500',
    EDUCATION: 'bg-indigo-500',
    TRAVEL: 'bg-cyan-500',
    HOUSING: 'bg-orange-500',
    INSURANCE: 'bg-teal-500',
    SAVINGS: 'bg-emerald-500',
    OTHER: 'bg-gray-500',
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/expenses/add" className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Expense
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <CurrencyRupeeIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-100">
                Total This Month
              </p>
              <p className="text-3xl font-bold">₹{stats.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ChartBarIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-100">Transactions</p>
              <p className="text-3xl font-bold">{stats.count}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ArrowTrendingUpIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-100">Average</p>
              <p className="text-3xl font-bold">
                ₹
                {stats.count > 0
                  ? (stats.total / stats.count).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryData).length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Spending by Category
          </h2>
          <div className="space-y-3">
            {Object.entries(categoryData)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const percentage = ((amount / stats.total) * 100).toFixed(1)
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">
                        {category}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        ₹{amount.toFixed(2)} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${
                          categoryColors[category] || 'bg-gray-500'
                        } h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
          <Link
            to="/expenses"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View All
          </Link>
        </div>

        {expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center">
                  <div
                    className={`${
                      categoryColors[expense.category]
                    } w-2 h-12 rounded-full mr-4`}
                  ></div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {expense.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {expense.category} •{' '}
                      {format(new Date(expense.expenseDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {expense.paymentMethod}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No expenses yet this month
          </p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
