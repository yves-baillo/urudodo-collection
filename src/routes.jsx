import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './Home'
import About from './About'
import Collections from './Collections'
import VisitUs from './VisitUs'
import Contact from './Contact'

import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminProtected from './admin/AdminProtected'
import AdminDashboard from './admin/AdminDashboard'
import AdminMessages from './admin/AdminMessages'
import AdminSettings from './admin/AdminSettings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'collections', element: <Collections /> },
      { path: 'visit-us', element: <VisitUs /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminProtected />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'messages', element: <AdminMessages /> },
          { path: 'settings', element: <AdminSettings /> },
        ],
      },
    ],
  },
])

export default router