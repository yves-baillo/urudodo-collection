import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Bell } from 'lucide-react'
import { brandInfo } from './data'
import { getProducts } from './lib/jsonbin'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Collection', path: '/collections' },
  { name: 'Visit Us', path: '/visit-us' },
  { name: 'Contact', path: '/contact' },
]

const LOGO_URL = 'https://i.postimg.cc/1zQ50bs3/uru-1-removebg-preview.png'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [products, setProducts] = useState([])
  const [loadingNotifs, setLoadingNotifs] = useState(true)

  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'
  const closeMenu = () => setIsOpen(false)

  // ── Load products ──
  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const data = await getProducts()
        if (mounted) setProducts(data)
      } catch (err) {
        console.error('Notifications load failed:', err)
      } finally {
        if (mounted) setLoadingNotifs(false)
      }
    }

    load()
    const interval = setInterval(load, 30000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const latestProducts = [...products].reverse().slice(0, 3)
  const notificationCount = latestProducts.length

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.bell-container')) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const solid = scrolled || !isHome

  const handleOpenNotifications = () => {
    setShowNotifications((prev) => !prev)
  }

  const goToCollections = () => {
    setShowNotifications(false)
    navigate('/collections')
  }

  return (
    <>
      {/* ── Header ── */}
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          solid
            ? 'bg-[#2a2a2a]/60 backdrop-blur-2xl shadow-lg border-b border-white/10 py-1'
            : 'bg-transparent py-2'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-12">

          {/* Logo — enhanced */}
          <NavLink
            to="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center"
          >
            <div className="relative">
              <img
                src={LOGO_URL}
                alt={brandInfo.name}
                className="h-12 w-auto drop-shadow-lg transition-all duration-500 group-hover:scale-105 sm:h-16 md:h-20"
              />
              {/* Subtle glow behind logo */}
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-amber-400/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </NavLink>

          {/* Desktop nav — Playfair Display */}
          <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `group relative font-display text-sm font-medium uppercase tracking-[0.15em] transition-colors duration-300 ${
                    isActive
                      ? 'text-amber-300'
                      : 'text-white/90 hover:text-amber-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {/* Underline indicator */}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-[2px] bg-amber-400 transition-all duration-300 ${
                        isActive
                          ? 'w-full'
                          : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right group */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">

            {/* Bell */}
            <div className="relative bell-container">
              <button
                onClick={handleOpenNotifications}
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-amber-300 sm:h-11 sm:w-11"
              >
                <Bell size={22} />

                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black shadow-md">
                    {notificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="fixed left-3 right-3 top-20 mt-1 overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f1f] shadow-2xl backdrop-blur-xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 sm:max-w-[90vw]">

                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <p className="text-sm font-semibold text-white">
                      New Arrivals
                    </p>
                    <span className="text-xs text-gray-400">
                      {notificationCount} items
                    </span>
                  </div>

                  {loadingNotifs ? (
                    <div className="p-6 text-center">
                      <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                      <p className="mt-2 text-xs text-gray-500">
                        Loading...
                      </p>
                    </div>
                  ) : latestProducts.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell size={24} className="mx-auto mb-2 text-gray-600" />
                      <p className="text-xs text-gray-500">
                        No new collections yet
                      </p>
                    </div>
                  ) : (
                    <ul className="max-h-72 overflow-y-auto">
                      {latestProducts.map((p) => (
                        <li
                          key={p.id}
                          onClick={goToCollections}
                          className="flex cursor-pointer items-start gap-3 border-b border-white/5 p-3 transition-colors hover:bg-white/5 last:border-0"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-11 w-11 shrink-0 rounded-lg object-cover"
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
                          <span className="shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-400">
                            New
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={goToCollections}
                    className="w-full border-t border-white/10 bg-amber-500/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-amber-400 transition-colors hover:bg-amber-500 hover:text-black"
                  >
                    View All Collections
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center text-white/90 transition-colors duration-500 hover:text-amber-200 lg:hidden sm:h-11 sm:w-11"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}

      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] overflow-y-auto bg-[#1f1f1f] p-6 pt-24 shadow-2xl transition-transform duration-300 ease-out sm:w-80 lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 text-white/90 hover:text-amber-300 transition-colors"
          aria-label="Close menu"
        >
          <X size={26} />
        </button>

        <div className="mb-8">
          <img
            src={LOGO_URL}
            alt={brandInfo.name}
            className="h-20 w-auto drop-shadow-lg"
          />
        </div>

        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 font-display text-base font-medium uppercase tracking-[0.15em] transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-black'
                    : 'text-white/90 hover:bg-white/10'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="my-6 h-px bg-white/10" />

        <p className="mb-3 text-xs uppercase tracking-widest text-white/40">
          Contact
        </p>
        <a
          href="tel:+250789215052"
          className="mb-2 block rounded-lg px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
        >
          +250 789 215 052
        </a>
        <a
          href="https://wa.me/250789215052"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 block rounded-lg px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
        >
          WhatsApp Us
        </a>
      </aside>
    </>
  )
}

export default Navbar