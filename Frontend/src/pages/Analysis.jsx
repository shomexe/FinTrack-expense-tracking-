import React, { useState, useEffect } from 'react'
import { analysisAPI } from '../services/api'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import {
  SparklesIcon,
  CalendarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

const Analysis = () => {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  })

  useEffect(() => {
    fetchAnalysis()
  }, [])

  const fetchAnalysis = async () => {
    setLoading(true)
    try {
      const response = await analysisAPI.getAnalysis(
        dateRange.startDate,
        dateRange.endDate
      )
      setAnalysis(response.data)
    } catch (error) {
      console.error('Error fetching analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value })
  }

  const setPresetRange = (months) => {
    const end = new Date()
    const start = subMonths(end, months)
    setDateRange({
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    })
  }

  const COLORS = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
    '#F97316',
    '#06B6D4',
    '#84CC16',
  ]

  const chartData = analysis?.categoryBreakdown
    ? Object.entries(analysis.categoryBreakdown).map(([name, value]) => ({
        name,
        value: parseFloat(value),
      }))
    : []

  if (loading && !analysis) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          AI-Powered Analysis
        </h1>
      </div>

      {/* Date Range Filter */}
      <div className="card">
        <div className="flex items-center mb-4">
          <CalendarIcon className="h-5 w-5 text-gray-600 mr-2" />
          <span className="font-medium text-gray-700">Select Date Range</span>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="startDate" className="label">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="input-field"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="endDate" className="label">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="input-field"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>

          <button
            onClick={fetchAnalysis}
            disabled={loading}
            className="btn-primary flex items-center disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Analyze
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setPresetRange(1)}
            className="btn-secondary text-sm"
          >
            Last Month
          </button>
          <button
            onClick={() => setPresetRange(3)}
            className="btn-secondary text-sm"
          >
            Last 3 Months
          </button>
          <button
            onClick={() => setPresetRange(6)}
            className="btn-secondary text-sm"
          >
            Last 6 Months
          </button>
          <button
            onClick={() => setPresetRange(12)}
            className="btn-secondary text-sm"
          >
            Last Year
          </button>
        </div>
      </div>

      {analysis && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{parseFloat(analysis.totalExpenses || 0).toFixed(2)}
              </p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-900">
                {analysis.expenseCount}
              </p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-600 mb-1">
                Average per Transaction
              </p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{parseFloat(analysis.averageExpense || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Category Breakdown Chart */}
          {chartData.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Spending Distribution
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <p className="text-sm font-medium text-primary-900">
                  Top Category:{' '}
                  <span className="font-bold">{analysis.topCategory}</span>
                </p>
              </div>
            </div>
          )}

          {/* AI Insights */}
          <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
            <div className="flex items-center mb-4">
              <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">
                AI-Powered Insights
              </h2>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {analysis.aiInsights}
              </div>
            </div>
          </div>

          {/* Category Breakdown Table */}
          {analysis.categoryBreakdown &&
            Object.keys(analysis.categoryBreakdown).length > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Detailed Breakdown
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(analysis.categoryBreakdown)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount]) => {
                          const percentage = (
                            (amount / analysis.totalExpenses) *
                            100
                          ).toFixed(1)
                          return (
                            <tr key={category}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {category}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                                ₹{parseFloat(amount).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                {percentage}%
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </>
      )}

      {!analysis && !loading && (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">
            Select a date range and click Analyze to view insights
          </p>
        </div>
      )}
    </div>
  )
}

export default Analysis
