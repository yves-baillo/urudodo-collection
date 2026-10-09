import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Home,
} from 'lucide-react'
import { verifyAdmin } from '../lib/jsonbin'

const SIDE_IMAGES = [
  'https://i.postimg.cc/j55VzY3y/ur3.jpg',
  'https://i.postimg.cc/kgQdCctb/ur4.jpg',
  'https://i.postimg.cc/PJ0kXV4d/ur5.jpg',
  'https://i.postimg.cc/KY5FPNZs/ur6.jpg',
  'https://i.postimg.cc/c1kxkXQq/ur7.jpg',
  'https://i.postimg.cc/3NNKJvQt/ur8.jpg',
]

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % SIDE_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const valid = await verifyAdmin(username, password)

      if (valid) {
        localStorage.setItem('adminAuth', 'true')
        localStorage.setItem('adminUsername', username)
        sessionStorage.removeItem('adminWelcomeShown')
        navigate('/admin/dashboard')
      } else {
        setError('Invalid username or password')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Could not verify credentials. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 lg:flex-row">

      {/* ═══════════ LEFT / TOP — Looping Images ═══════════ */}
      <div className="relative h-[40vh] w-full overflow-hidden lg:h-screen lg:w-1/2">

        <AnimatePresence mode="sync">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={SIDE_IMAGES[bgIndex]}
              alt="Urudodo Collection"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80" />

        <div className="relative z-10 flex h-full flex-col justify-between p-6 lg:p-12">

          {/* Logo top */}
          <div className="flex items-center gap-3">
            <img
              src="https://i.postimg.cc/1zQ50bs3/uru-1-removebg-preview.png"
              alt="Urudodo"
              className="h-10 w-auto lg:h-12"
            />
          </div>

          {/* Center text */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 backdrop-blur-sm">
                <ShieldCheck size={14} className="text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  Admin Panel
                </span>
              </div>

              <h1 className="mb-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                Manage your <br />
                <span className="text-amber-400">Urudodo Collection</span>
              </h1>

              <p className="hidden text-gray-300 sm:block lg:text-base">
                Sign in to add new pieces, manage products, and keep your
                collection up to date.
              </p>
            </motion.div>
          </div>

          {/* Dots */}
          <div className="flex items-center gap-3">
            {SIDE_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setBgIndex(i)}
                aria-label={`Image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === bgIndex
                    ? 'w-8 bg-amber-400'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ═══════════ RIGHT / BOTTOM — Login Form ═══════════ */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12 lg:w-1/2">

        {/* Grid net */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Amber glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-amber-500 blur-3xl"
        />

        <div className="relative w-full max-w-md">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-2xl md:p-10"
          >

            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-white">
                Welcome back
              </h2>
              <p className="text-sm text-gray-400">
                Sign in to access your admin dashboard
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Username */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Username
                </label>
                <div className="group relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-amber-400"
                  />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all focus:border-amber-400 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Password
                </label>
                <div className="group relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-amber-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white placeholder-gray-500 outline-none transition-all focus:border-amber-400 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 font-semibold text-black shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </motion.button>

            </form>

          </motion.div>

          <p className="mt-6 text-center text-xs text-gray-600">
            © 2026 Urudodo Collections
          </p>

        </div>
      </div>

      {/* ═══════════ Floating "Back to Website" ═══════════ */}
      <motion.a
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        href="/"
        aria-label="Back to website"
        className="group fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-neutral-900/90 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-500 hover:text-black sm:bottom-8 sm:right-8 sm:h-14 sm:w-14"
      >
        <Home size={20} className="sm:hidden" />
        <Home size={22} className="hidden sm:block" />

        <span className="pointer-events-none absolute inset-0 rounded-full border border-amber-400/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.a>

    </div>
  )
}