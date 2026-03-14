import { createBrowserRouter, redirect } from 'react-router-dom'
import AuthLayout from '~/layouts/AuthLayout'
import MainLayout from '~/layouts/MainLayout'
import { HomePage } from '~/pages/Home'
import { LoginPage } from '~/pages/Login'
import { RegisterPage } from '~/pages/Register'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    // Redirect mọi route lạ về login
    path: '*',
    loader: () => redirect('/login'),
  },
])