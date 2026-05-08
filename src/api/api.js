import axios from 'axios'

// Normalize base URL from env. Expect REACT_APP_API_URL to include '/api' if desired.
const rawBase = process.env.REACT_APP_API_URL
console.log('API base URL:', rawBase) // Debug log to verify the base URL
// remove trailing slash if present
const baseURL = rawBase.replace(/\/+$/, '')

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config)=>{
  const token = localStorage.getItem('access_token')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
