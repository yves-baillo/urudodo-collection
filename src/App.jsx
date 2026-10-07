import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default App