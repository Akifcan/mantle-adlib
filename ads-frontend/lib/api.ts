import axios from 'axios'
import Cookies from 'js-cookie'

// Token yönetimi için utility fonksiyonları
export const tokenManager = {
  // Token'ı cookie'ye kaydet
  setToken: (token: string) => {
    Cookies.set('auth_token', token, { 
      expires: 7, // 7 gün
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  },

  // Token'ı cookie'den al
  getToken: (): string | undefined => {
    return Cookies.get('auth_token')
  },

  // Token'ı cookie'den sil
  removeToken: () => {
    Cookies.remove('auth_token')
  }
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Request interceptor - her istekte token'ı header'a ekle
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken()
    if (token) {
      config.headers.authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - 401 durumunda token'ı temizle
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken()
      // Optional: redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API fonksiyonları
export const authAPI = {
  // Advertiser login
  loginAdvertiser: async (address: string) => {
    const response = await api.get('/wallet/me')
    if (response.data.token) {
      tokenManager.setToken(response.data.token)
    }
    return response.data
  },

  // Publisher login  
  loginPublisher: async (address: string) => {
    const response = await api.post('/wallet/publisher', { address })
    if (response.data.token) {
      tokenManager.setToken(response.data.token)
    }
    return response.data
  },

  // Logout
  logout: () => {
    tokenManager.removeToken()
  }
}