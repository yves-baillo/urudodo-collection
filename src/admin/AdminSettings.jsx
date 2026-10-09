import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import {
  User,
  Lock,
  Image as ImageIcon,
  Save,
  Check,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Upload,
  Link as LinkIcon,
} from 'lucide-react'
import { getAdmin, saveAdmin } from '../lib/jsonbin'
import { uploadImage } from '../lib/imgbb'

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    username: '',
    password: '',
    avatar: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  // Image upload
  const [uploading, setUploading] = useState(false)
  const [imageMode, setImageMode] = useState('file')
  const fileInputRef = useRef(null)

  // Load existing admin settings
  useEffect(() => {
    async function load() {
      try {
        const admin = await getAdmin()
        setForm({
          username: admin.username || '',
          password: admin.password || '',
          avatar: admin.avatar || '',
        })
      } catch (err) {
        setError(err.message || 'Could not load settings')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  // ── File upload ──
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WEBP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      const url = await uploadImage(file)
      setForm((prev) => ({ ...prev, avatar: url }))
    } catch (err) {
      console.error('Upload error:', err)
      setError('Could not upload image. Try again or paste a URL instead.')
    } finally {
      setUploading(false)
    }
  }

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await saveAdmin({
        username: form.username.trim(),
        password: form.password,
        avatar: form.avatar.trim(),
      })

      localStorage.setItem('adminUsername', form.username.trim())

      setSaving(false)
      setSaved(true)

      setTimeout(() => {
        setSaved(false)
        window.location.reload()
      }, 1200)
    } catch (err) {
      setError(err.message || 'Could not save settings')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white md:text-4xl">Settings</h1>
        <p className="mt-2 text-gray-400">
          Manage your admin account and profile.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ═══ Profile Picture ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
            <ImageIcon size={18} className="text-amber-400" />
            Profile Picture
          </h2>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

            {/* Preview */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-amber-500/30 bg-neutral-900">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = ''
                  }}
                />
              ) : (
                <User size={40} className="text-gray-600" />
              )}
            </div>

            {/* Input methods */}
            <div className="flex-1">

              {/* Tabs */}
              <div className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                    imageMode === 'file'
                      ? 'bg-amber-500 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Upload size={14} />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                    imageMode === 'url'
                      ? 'bg-amber-500 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <LinkIcon size={14} />
                  Paste URL
                </button>
              </div>

              {/* File upload */}
              {imageMode === 'file' && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="avatar-file"
                  />

                  <label
                    htmlFor="avatar-file"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] p-6 text-center transition-colors hover:border-amber-400/50"
                  >
                    {uploading ? (
                      <>
                        <Loader2
                          size={28}
                          className="mb-2 animate-spin text-amber-500"
                        />
                        <p className="text-sm text-amber-400">
                          Uploading...
                        </p>
                      </>
                    ) : form.avatar ? (
                      <>
                        <Check
                          size={28}
                          className="mb-2 text-green-400"
                        />
                        <p className="text-sm text-green-400">
                          Picture uploaded
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Click to choose a different image
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload
                          size={28}
                          className="mb-2 text-gray-500"
                        />
                        <p className="text-sm text-gray-400">
                          Click to upload a profile picture
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          JPG, PNG, WEBP · Max 5MB
                        </p>
                      </>
                    )}
                  </label>
                </>
              )}

              {/* URL input */}
              {imageMode === 'url' && (
                <input
                  type="url"
                  value={form.avatar}
                  onChange={handleChange('avatar')}
                  placeholder="https://i.postimg.cc/..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              )}

              <p className="mt-3 text-xs text-gray-500">
                Your profile picture appears in the header and welcome toast.
              </p>

            </div>
          </div>
        </motion.div>

        {/* ═══ Username ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
            <User size={18} className="text-amber-400" />
            Username
          </h2>

          <div className="group relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-amber-400"
            />
            <input
              type="text"
              required
              value={form.username}
              onChange={handleChange('username')}
              placeholder="Your username"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            This is what appears in the header and in the welcome toast.
          </p>
        </motion.div>

        {/* ═══ Password ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
            <Lock size={18} className="text-amber-400" />
            Password
          </h2>

          <div className="group relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-amber-400"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white placeholder-gray-500 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
              aria-label="Toggle password"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            You'll use this with your username to log in next time.
          </p>
        </motion.div>

        {/* ═══ Save Button ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="submit"
            disabled={saving || saved || uploading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold shadow-lg transition-all ${
              saved
                ? 'bg-green-500 text-white shadow-green-500/30'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-amber-500/20 hover:shadow-amber-500/40'
            } disabled:opacity-60`}
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check size={18} />
                Settings Saved
              </>
            ) : (
              <>
                <Save size={18} />
                Save Settings
              </>
            )}
          </button>
        </motion.div>

        {/* ═══ Info card ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5"
        >
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-amber-400" />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white">Important</p>
            <p className="mt-1 text-gray-400">
              If you change your username or password, you'll need to use the
              new credentials the next time you log in. Your profile picture
              appears in the header and welcome toast.
            </p>
          </div>
        </motion.div>

      </form>

    </div>
  )
}