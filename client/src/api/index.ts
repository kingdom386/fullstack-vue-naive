import axios from 'axios'

export interface User {
  id: number
  name: string
  email: string
}

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export const fetchUsers = () =>
  api.get<{ success: boolean; data: User[] }>('/users').then(res => res.data.data)

export const fetchHealth = () =>
  api.get<{ success: boolean; status: string; timestamp: string }>('/health').then(res => res.data)
