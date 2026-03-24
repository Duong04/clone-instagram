import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useAuthStore } from '../../../store/authStore'
import { loginSchema, type LoginSchema } from '../schemas/loginSchema'

export function useLogin() {
  const [serverError, setServerError] = useState('')

  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    setServerError('')

    try {
      await login(data)
      navigate('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message ?? 'Login failed')
      } else {
        setServerError('Login failed')
      }
    }
  })

  return {
    form,
    serverError,
    isLoading,
    handleSubmit,
  }
}