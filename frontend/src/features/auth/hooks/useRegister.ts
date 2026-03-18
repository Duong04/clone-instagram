import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import type { RegisterRequest } from '~/shared/types/auth'
import axios from 'axios'

export function useRegister() {
  const [form, setForm] = useState<RegisterRequest>({ email: '', name: '', username: '', password: '' })
  const [error, setError] = useState('')

  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await register(form)
      navigate('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Register failed')
      } else {
        setError('Register failed')
      }
    }
  }

  return { form, error, isLoading, handleChange, handleSubmit }
}