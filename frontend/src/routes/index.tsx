import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '~/features/auth/components/ProtectedRoute'
import { PublicRoute } from '~/features/auth/components/PublicRoute'
import AuthLayout from '~/layouts/AuthLayout'
import MainLayout from '~/layouts/MainLayout'
import { ExplorePage } from '~/pages/Explore'
import { Forbidden } from '~/pages/Forbidden'
import { FeedPage } from '~/features/feed/pages'
import { LoginPage } from '~/features/auth/pages/LoginPage'
import { MessagesPage } from '~/pages/Messages'
import { NotFound } from '~/pages/NotFound'
import { ProfilePage } from '~/features/profile/pages/Profile'
import { ReelsPage } from '~/pages/Reels'
import { RegisterPage } from '~/features/auth/pages/RegisterPage'

export const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <FeedPage />,
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
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
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