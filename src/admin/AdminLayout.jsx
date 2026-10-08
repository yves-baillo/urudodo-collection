import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
} from 'lucide-react'
import { getProducts, getMessages, getAdmin } from '../lib/jsonbin'

const LOGO_URL = 'https://i.postimg.cc/1zQ50bs3/uru-1-removebg-preview.png'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [messages, setMessages] = useState([])
  const [toast, setToast] = useState(null)
  const [adminUsername, setAdminUsername] = useState('Admin')
  const [adminAvatar, setAdminAvatar] = useState('')

  // ── Load admin + welcome toast ──
  useEffect(() => {
    async function loadAdmin() {
      try {
        const admin = await getAdmin()
        setAdminUsername(admin.username || 'Admin')
        setAdminAvatar(admin.avatar || '')
        localStorage.setItem('adminUsername', admin.username || '')
      } catch (err) {
        console.error('Admin load failed:', err)
        const saved = localStorage.getItem('adminUsername')
        if (saved) setAdminUsername(saved)
      }
    }
    loadAdmin()

    const shown = sessionStorage.getItem('adminWelcomeShown')
    if (shown) return

    const savedUsername = localStorage.getItem('adminUsername') || 'Admin'
    setToast({
      title: `Welcome back, ${savedUsername}!`,
      text: 'Ready to manage your collections.',
    })
    sessionStorage.setItem('adminWelcomeShown', 'true')

    const timer = setTimeout(() => setToast(null), 4500)
    return () => clearTimeout(timer)
  }, [])

  // ── Load products + messages ──
  useEffect(() => {
    async function load() {
      try {
        const [prods, msgs] = await Promise.all([
          getProducts(),
          getMessages(),
        ])
        setProducts(prods)
        setMessages(msgs)
      } catch (err) {
        console.error('Data load failed:', err)
      }
    }
    load()

    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  const latestProducts = [...products].reverse().slice(0, 4)
  const unreadCount = messages.filter((m) => !m.read).length
  const notificationCount = latestProducts.length + unreadCount

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUsername')
    sessionStorage.removeItem('adminWelcomeShown')
    navigate('/admin/login')
  }

  const currentTitle =
    links.find((l) => l.to === location.pathname)?.label || 'Dashboard'

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">

      {/* Grid + glows */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="pointer-events-none fixed -top-40 -right-40 z-0 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -left-40 z-0 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-3xl" />

      {/* ═══ HEADER ═══ */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-neutral-900/80 backdrop-blur-xl lg:left-64">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="shrink-0 text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <img
              src={LOGO_URL}
              alt="Urudodo"
              className="h-8 w-auto lg:hidden"
            />

            <div className="hidden min-w-0 lg:block">
              <h2 className="truncate text-lg font-semibold text-white">
                {currentTitle}
              </h2>
              <p className="truncate text-xs text-gray-500">
                Manage your collection
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            <div className="relative hidden xl:block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                placeholder="Search..."
                className="w-56 rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-amber-400"
              />
            </div>

            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                      <p className="text-sm font-semibold text-white">
                        Notifications
                      </p>
                      <span className="text-xs text-gray-500">
                        {notificationCount} new
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto">

                      {/* Messages section */}
                      {unreadCount > 0 && (
                        <>
                          <div className="border-b border-white/5 bg-amber-500/5 px-4 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                              {unreadCount} new message
                              {unreadCount > 1 ? 's' : ''}
                            </p>
                          </div>
                          {messages
                            .filter((m) => !m.read)
                            .slice(0, 2)
                            .map((m) => (
                              <NavLink
                                key={m.id}
                                to="/admin/messages"
                                onClick={() => setNotifOpen(false)}
                                className="flex items-start gap-3 border-b border-white/5 p-3 transition-colors hover:bg-white/5"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-black">
                                  {(m.name || '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-white">
                                    {m.name}
                                  </p>
                                  <p className="line-clamp-1 text-xs text-gray-500">
                                    {m.message}
                                  </p>
                                </div>
                              </NavLink>
                            ))}
                        </>
                      )}

                      {/* Products section */}
                      {latestProducts.length > 0 && (
                        <>
                          <div className="border-b border-white/5 bg-white/5 px-4 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                              Recent products
                            </p>
                          </div>
                          {latestProducts.slice(0, 2).map((p) => (
                            <NavLink
                              key={p.id}
                              to="/admin/dashboard"
                              onClick={() => setNotifOpen(false)}
                              className="flex items-start gap-3 border-b border-white/5 p-3 transition-colors hover:bg-white/5"
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-10 w-10 shrink-0 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    'https://via.placeholder.com/80?text=?'
                                }}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">
                                  {p.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {p.category}
                                  {p.price ? ` · ${p.price}` : ''}
                                </p>
                              </div>
                            </NavLink>
                          ))}
                        </>
                      )}

                      {notificationCount === 0 && (
                        <div className="p-6 text-center">
                          <Bell
                            size={24}
                            className="mx-auto mb-2 text-gray-600"
                          />
                          <p className="text-xs text-gray-500">
                            No notifications yet
                          </p>
                        </div>
                      )}

                    </div>

                    <div className="grid grid-cols-2 border-t border-white/10">
                      <NavLink
                        to="/admin/messages"
                        onClick={() => setNotifOpen(false)}
                        className="border-r border-white/10 bg-amber-500/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-amber-400 transition-colors hover:bg-amber-500 hover:text-black"
                      >
                        Messages
                      </NavLink>
                      <NavLink
                        to="/admin/dashboard"
                        onClick={() => setNotifOpen(false)}
                        className="bg-white/5 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        Dashboard
                      </NavLink>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User */}
            <div className="flex items-center gap-3 border-l border-white/10 pl-2 sm:pl-4">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-black">
                {adminAvatar ? (
                  <img
                    src={adminAvatar}
                    alt={adminUsername}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  adminUsername.charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium text-white">
                  {adminUsername}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Administrator
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ═══ SIDEBAR ═══ */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 border-r border-white/10 bg-neutral-900/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">

          <div className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <img
                src={LOGO_URL}
                alt="Urudodo Collections"
                className="h-11 w-auto"
              />
              <div>
                <h1 className="text-sm font-bold text-white">Urudodo</h1>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {links.map((link) => {
              const Icon = link.icon
              const isMessages = link.to === '/admin/messages'

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-transparent text-amber-400'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-amber-400" />
                      )}
                      <Icon size={18} />
                      <span>{link.label}</span>

                      {/* Unread badge for Messages */}
                      {isMessages && unreadCount > 0 ? (
                        <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      ) : (
                        <ChevronRight
                          size={14}
                          className="ml-auto opacity-0 transition-opacity group-hover:opacity-50"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          <div className="space-y-1 border-t border-white/10 p-4">
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <Home size={18} />
              View Site
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

        </div>
      </aside>

      {/* ═══ WELCOME TOAST ═══ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[100] w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-amber-500/30 bg-neutral-900/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start gap-3 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-500/10">
                {adminAvatar ? (
                  <img
                    src={adminAvatar}
                    alt={adminUsername}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img src={LOGO_URL} alt="Urudodo" className="h-7 w-auto" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  {toast.title}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">{toast.text}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="shrink-0 text-gray-500 hover:text-white"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.5, ease: 'linear' }}
              className="h-1 origin-left bg-gradient-to-r from-amber-400 to-amber-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAIN ═══ */}
      <main className="relative z-10 flex-1 lg:ml-64">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative px-4 pt-20 pb-6 sm:px-6 lg:px-8 lg:pt-24"
        >
          <Outlet />
        </motion.div>
      </main>

    </div>
  )
}