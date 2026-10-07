import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Bell } from 'lucide-react'
import { brandInfo } from './data'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Collections', path: '/collections' },
  { name: 'Visit Us', path: '/visit-us' },
  { name: 'Contact', path: '/contact' },
]

const LOGO_URL = 'https://i.postimg.cc/1zQ50bs3/uru-1-removebg-preview.png'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)

  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'
  const closeMenu = () => setIsOpen(false)

  const notifications = [
    {
      id: 1,
      title: 'New collection dropped',
      text: 'Batik Print Shirt is now available.',
      time: '2h ago',
    },
    {
      id: 2,
      title: 'Custom orders open',
      text: 'Book a bridal fitting for this season.',
      time: '1d ago',
    },
    {
      id: 3,
      title: 'Visit our studio',
      text: 'Kacyiru, Kigali — Monday to Friday.',
      time: '3d ago',
    },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.bell-container')) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const solid = scrolled || !isHome

  const handleOpenNotifications = () => {
    setShowNotifications((prev) => !prev)
    if (!showNotifications) setNotificationCount(0)
  }

  const goToContact = () => {
    setShowNotifications(false)
    navigate('/contact')
  }

  return (
    <>
      {/* ── Header bar ── */}
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          solid
            ? 'bg-[#2a2a2a]/60 backdrop-blur-2xl shadow-lg border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-12">

          {/* Logo — scaled on smaller screens */}
          <NavLink
            to="/"
            onClick={closeMenu}
            className="flex shrink-0 items-center"
          >
            <img
              src={LOGO_URL}
              alt={brandInfo.name}
              className="h-10 w-auto transition-all duration-500 sm:h-12 md:h-14"
            />
          </NavLink>

          {/* Desktop nav — hidden below lg */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative font-display text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-500 ${
                    isActive
                      ? 'text-amber-300'
                      : 'text-white/90 hover:text-amber-200'
                  }`
                }
              >
                {link.name}
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
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-amber-300 sm:h-10 sm:w-10"
              >
                <Bell size={20} className="sm:hidden" />
                <Bell size={22} className="hidden sm:block" />

                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black shadow-md sm:h-5 sm:w-5 sm:text-[10px]">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Dropdown panel — responsive width */}
              {showNotifications && (
                <div className="fixed left-3 right-3 top-16 mt-1 overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f1f] shadow-2xl backdrop-blur-xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 sm:max-w-[90vw]">

                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <p className="text-sm font-semibold text-white">
                      Notifications
                    </p>
                    <span className="text-xs text-gray-400">
                      {notifications.length} new
                    </span>
                  </div>

                  <ul className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className="cursor-pointer border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/5"
                      >
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <p className="text-sm font-medium text-white">
                            {n.title}
                          </p>
                          <span className="shrink-0 text-[10px] text-gray-500">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-gray-400">
                          {n.text}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={goToContact}
                    className="w-full border-t border-white/10 bg-amber-500/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-amber-400 transition-colors hover:bg-amber-500 hover:text-black"
                  >
                    Contact Us
                  </button>

                </div>
              )}
            </div>

            {/* Hamburger — visible below lg */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center text-white/90 transition-colors duration-500 hover:text-amber-200 lg:hidden sm:h-10 sm:w-10"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X size={24} className="sm:hidden" />
              ) : (
                <Menu size={24} className="sm:hidden" />
              )}
              {isOpen ? (
                <X size={26} className="hidden sm:block" />
              ) : (
                <Menu size={26} className="hidden sm:block" />
              )}
            </button>

          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}

      {/* Backdrop */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Slide-in panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] overflow-y-auto bg-[#1f1f1f] p-6 pt-20 shadow-2xl transition-transform duration-300 ease-out sm:w-80 lg:hidden ${
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

        <div className="mb-6">
          <img src={LOGO_URL} alt={brandInfo.name} className="h-14 w-auto sm:h-16" />
        </div>

        {/* Mobile nav links */}
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 font-display text-sm font-medium uppercase tracking-[0.18em] transition-colors ${
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

        {/* Contact shortcuts in drawer */}
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

        <div className="my-6 h-px bg-white/10" />

        <p className="mb-3 text-xs uppercase tracking-widest text-white/40">
          Follow Us
        </p>
      </aside>
    </>
  )
}

export default Navbar