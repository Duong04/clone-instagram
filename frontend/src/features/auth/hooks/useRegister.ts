import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/useAuthStore'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterSchema  } from '../schemas/registerSchema'

export function useRegister() {
  const [serverError, setServerError] = useState('')

  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', name: '', username: '', password: '' },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    setServerError('')

    try {
      await registerUser(data)
      navigate('/login')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message ?? 'Register failed')
      } else {
        setServerError('Register failed')
      }
    }
  })

  return { form, serverError, isLoading, handleSubmit }
}