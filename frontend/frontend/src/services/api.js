
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

let accessToken = localStorage.getItem('access')
let refreshToken = localStorage.getItem('refresh')

export const saveTokens = (access, refresh) => {
  accessToken = access
  refreshToken = refresh

  localStorage.setItem('access', access)
  localStorage.setItem('refresh', refresh)
}

export const clearTokens = () => {
  accessToken = null
  refreshToken = null

  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}

async function refreshAccessToken() {
  if (!refreshToken) return false

  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      clearTokens()
      return false
    }

    const data = await response.json()

    accessToken = data.access
    localStorage.setItem('access', data.access)

    return true
  } catch {
    clearTokens()
    return false
  }
}

export async function apiRequest(endpoint, options = {}, retry = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401 && retry && refreshToken) {
    const refreshed = await refreshAccessToken()

    if (refreshed) {
      return apiRequest(endpoint, options, false)
    }
  }

  if (response.status === 204 || response.status === 205) {
    if (!response.ok) {
      throw new Error('Request failed')
    }
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      Object.values(data || {}).flat().join(' ') ||
      'Something went wrong.'

    throw new Error(message)
  }

  return data
}

export const authAPI = {
  register: (payload) =>
    apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  me: () => apiRequest('/auth/me/'),

  logout: (refresh) =>
    apiRequest('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }),
}

export const notesAPI = {
  list: (params = '') => apiRequest(`/notes/${params}`),

  recent: () => apiRequest('/notes/recent/'),

  create: (payload) =>
    apiRequest('/notes/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiRequest(`/notes/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    apiRequest(`/notes/${id}/`, {
      method: 'DELETE',
    }),

  togglePin: (id, isPinned) =>
    apiRequest(`/notes/${id}/pin/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_pinned: isPinned }),
    }),

  stats: () => apiRequest('/dashboard/stats/'),
}

export const categoriesAPI = {
  list: () => apiRequest('/categories/'),

  stats: () => apiRequest('/dashboard/category-stats/'),

  create: (payload) =>
    apiRequest('/categories/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiRequest(`/categories/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    apiRequest(`/categories/${id}/`, {
      method: 'DELETE',
    }),
}

export const subjectsAPI = {
  list: () => apiRequest('/subjects/'),

  create: (payload) =>
    apiRequest('/subjects/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiRequest(`/subjects/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    apiRequest(`/subjects/${id}/`, {
      method: 'DELETE',
    }),
}

export const aiAPI = {
  summarize: (noteId) =>
    apiRequest('/ai/summarize/', {
      method: 'POST',
      body: JSON.stringify({ note_id: noteId }),
    }),
  getHistory: (noteId) =>
    apiRequest(`/ai/notes/${noteId}/summaries/`),
  deleteSummary: (summaryId) =>
    apiRequest(`/ai/summaries/${summaryId}/`, {
      method: 'DELETE',
    }),
}
