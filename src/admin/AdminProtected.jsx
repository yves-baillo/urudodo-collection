import { Navigate, Outlet } from 'react-router-dom'

export default function AdminProtected() {
  const isAuth = localStorage.getItem('adminAuth') === 'true'
  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />
}