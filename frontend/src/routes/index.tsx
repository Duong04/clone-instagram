import { createBrowserRouter } from 'react-router-dom'
import AuthLayout from '~/layouts/AuthLayout'
import MainLayout from '~/layouts/MainLayout'
import { ExplorePage } from '~/pages/Explore'
import { Forbidden } from '~/pages/Forbidden'
import { HomePage } from '~/pages/Home'
import { LoginPage } from '~/pages/Login'
import { MessagesPage } from '~/pages/Messages'
import { NotFound } from '~/pages/NotFound'
import { ProfilePage } from '~/pages/Profile'
import { ReelsPage } from '~/pages/Reels'
import { RegisterPage } from '~/pages/Register'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/explore',
        element: <ExplorePage />,
      },
      {
        path: '/reels',
        element: <ReelsPage />,
      },
      {
        path: '/messages',
        element: <MessagesPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
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
    element: <NotFound />,
  },
  {
    // Redirect mọi route lạ về login
    path: '403',
    element: <Forbidden />,
  },
])