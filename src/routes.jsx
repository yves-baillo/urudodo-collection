import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './Home'
import About from './About'
import Collections from './Collections'
import VisitUs from './VisitUs'
import Contact from './Contact'

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
])

export default router