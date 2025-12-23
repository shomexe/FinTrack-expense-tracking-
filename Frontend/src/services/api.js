import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

// Expense APIs
export const expenseAPI = {
  getAll: () => api.get('/expenses'),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getByDateRange: (startDate, endDate) =>
    api.get('/expenses/date-range', { params: { startDate, endDate } }),
  getByCategory: (category) => api.get(`/expenses/category/${category}`),
  getTotal: () => api.get('/expenses/total'),
  getTotalByDateRange: (startDate, endDate) =>
    api.get('/expenses/total/date-range', { params: { startDate, endDate } }),
  getCategorySummary: (startDate, endDate) =>
    api.get('/expenses/category-summary', { params: { startDate, endDate } }),
}

// Analysis APIs
export const analysisAPI = {
  getAnalysis: (startDate, endDate) =>
    api.get('/analysis', { params: { startDate, endDate } }),
}

export default api
