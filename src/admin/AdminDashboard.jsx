import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Package,
  Layers,
  DollarSign,
  PlusCircle,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  ExternalLink,
  Search,
  Filter,
  Trash2,
  Edit,
  Image as ImageIcon,
  X,
  Save,
  Check,
  AlertCircle,
  Upload,
  Link as LinkIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  getProducts,
  addProduct,
  saveProducts,
  deleteProduct,
  getMessages,
} from '../lib/jsonbin'
import { uploadImage } from '../lib/imgbb'

const EMPTY_FORM = {
  id: null,
  name: '',
  category: 'Men',
  description: '',
  price: '',
  image: '',
}

const GRID_STYLE = {
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
  `,
  backgroundSize: '40px 40px',
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formError, setFormError] = useState('')

  const [uploading, setUploading] = useState(false)
  const [imageMode, setImageMode] = useState('file')
  const fileInputRef = useRef(null)

  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError('')

      const [prods, msgs] = await Promise.all([
        getProducts(),
        getMessages(),
      ])
      setProducts(prods)
      setMessages(msgs)
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const categories = [...new Set(products.map((p) => p.category))]

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || p.category === filter
    return matchesSearch && matchesFilter
  })

  const recent = [...products].reverse().slice(0, 3)
  const recentMessages = [...messages].reverse().slice(0, 3)
  const unreadCount = messages.filter((m) => !m.read).length

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setIsEditing(false)
    setShowForm(true)
    setFormError('')
    setSaved(false)
    setImageMode('file')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name || '',
      category: product.category || 'Men',
      description: product.description || '',
      price: product.price || '',
      image: product.image || '',
    })
    setIsEditing(true)
    setShowForm(true)
    setFormError('')
    setSaved(false)
    setImageMode('url')

    setTimeout(() => {
      document
        .getElementById('product-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const closeForm = () => {
    setShowForm(false)
    setIsEditing(false)
    setForm(EMPTY_FORM)
    setFormError('')
    setSaved(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file (JPG, PNG, WEBP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image must be under 5MB')
      return
    }

    setFormError('')
    setUploading(true)

    try {
      const url = await uploadImage(file)
      setForm((prev) => ({ ...prev, image: url }))
    } catch (err) {
      console.error('Upload error:', err)
      setFormError('Could not upload image. Try again or paste a URL instead.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!form.image) {
      setFormError('Please upload an image or paste an image URL')
      return
    }

    setSaving(true)

    try {
      if (isEditing) {
        const updated = products.map((p) =>
          p.id === form.id
            ? {
                ...p,
                name: form.name.trim(),
                category: form.category,
                description: form.description.trim(),
                price: form.price.trim(),
                image: form.image.trim(),
              }
            : p
        )
        await saveProducts(updated)
        setProducts(updated)
      } else {
        const newProduct = {
          id: Date.now(),
          name: form.name.trim(),
          category: form.category,
          description: form.description.trim(),
          price: form.price.trim(),
          image: form.image.trim(),
        }
        await addProduct(newProduct)
        const updated = await getProducts()
        setProducts(updated)
      }

      setSaving(false)
      setSaved(true)

      setTimeout(() => closeForm(), 1200)
    } catch (err) {
      setFormError(err.message || 'Could not save product')
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      setConfirmDelete(null)
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: Layers,
      gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Priced Items',
      value: products.filter((p) => p.price).length,
      icon: DollarSign,
      gradient: 'from-green-500/20 via-green-500/5 to-transparent',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/20',
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Dashboard</h1>
          <p className="mt-2 text-gray-400">Manage all your collection from here.</p>
        </div>

        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-300 transition-all hover:border-amber-400/30 hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`group relative overflow-hidden rounded-2xl border ${stat.borderColor} bg-gradient-to-br ${stat.gradient} p-6`}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={GRID_STYLE}
              />
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Icon size={20} className={stat.iconColor} />
                </div>
                <p className="text-3xl font-bold tabular-nums text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-300">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ADD + SEARCH */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => (showForm && !isEditing ? closeForm() : openAdd())}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-lg transition-all ${
            showForm && !isEditing
              ? 'border border-white/10 bg-white/5 text-white'
              : 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-amber-500/20 hover:shadow-amber-500/40'
          }`}
        >
          {showForm && !isEditing ? (
            <>
              <X size={18} />
              Close Form
            </>
          ) : (
            <>
              <PlusCircle size={18} />
              Add Product
            </>
          )}
        </motion.button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-amber-400 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter size={16} className="shrink-0 text-gray-500" />
            {['All', 'Men', 'Women', 'Wedding'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  filter === f
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            id="product-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-6">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={GRID_STYLE}
              />

              <div className="relative">
                <h2 className="mb-5 text-lg font-semibold text-white">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h2>

                {formError && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                >

                  <div className="space-y-5 lg:col-span-2">

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Product Name
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="e.g. Batik Print Shirt"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                          Category
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-400"
                        >
                          <option>Men</option>
                          <option>Women</option>
                          <option>Wedding</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                          Price
                        </label>
                        <input
                          value={form.price}
                          onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                          }
                          placeholder="e.g. RWF 35,000"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        placeholder="Describe the piece..."
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Product Image
                      </label>

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

                      {imageMode === 'file' && (
                        <>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="product-image-file"
                          />

                          <label
                            htmlFor="product-image-file"
                            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] p-8 text-center transition-colors hover:border-amber-400/50"
                          >
                            {uploading ? (
                              <>
                                <Loader2
                                  size={32}
                                  className="mb-3 animate-spin text-amber-500"
                                />
                                <p className="text-sm text-amber-400">
                                  Uploading image...
                                </p>
                              </>
                            ) : form.image ? (
                              <>
                                <Check
                                  size={32}
                                  className="mb-3 text-green-400"
                                />
                                <p className="text-sm text-green-400">
                                  Image uploaded successfully
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Click to choose a different file
                                </p>
                              </>
                            ) : (
                              <>
                                <Upload
                                  size={32}
                                  className="mb-3 text-gray-500"
                                />
                                <p className="text-sm text-gray-400">
                                  Click to upload an image
                                </p>
                                <p className="mt-1 text-xs text-gray-600">
                                  JPG, PNG, WEBP · Max 5MB
                                </p>
                              </>
                            )}
                          </label>
                        </>
                      )}

                      {imageMode === 'url' && (
                        <input
                          type="url"
                          value={form.image}
                          onChange={(e) =>
                            setForm({ ...form, image: e.target.value })
                          }
                          placeholder="https://i.postimg.cc/..."
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-amber-400"
                        />
                      )}
                    </div>

                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Preview
                      </p>
                      <div className="overflow-hidden rounded-lg">
                        {form.image ? (
                          <img
                            src={form.image}
                            alt="Preview"
                            className="aspect-[3/4] w-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                'https://via.placeholder.com/300x400?text=Invalid+Image'
                            }}
                          />
                        ) : (
                          <div className="flex aspect-[3/4] items-center justify-center bg-neutral-800">
                            <ImageIcon size={32} className="text-gray-600" />
                          </div>
                        )}
                      </div>
                      <p className="mt-3 truncate text-sm font-semibold text-white">
                        {form.name || 'Product name'}
                      </p>
                      <p className="text-xs text-amber-400">
                        {form.price || 'Price'}
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={saving || saved || uploading || !form.image}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold shadow-lg transition-all ${
                        saved
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:shadow-amber-500/40'
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
                          {isEditing ? 'Updated' : 'Added'}
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          {isEditing ? 'Update Product' : 'Publish'}
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={closeForm}
                      className="w-full rounded-xl border border-white/10 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      Cancel
                    </button>

                  </div>

                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRODUCTS GRID */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Your Products</h2>
            <p className="text-xs text-gray-500">
              {filtered.length} of {products.length} shown
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={GRID_STYLE}
            />
            <div className="relative">
              <ImageIcon size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">
                {products.length === 0
                  ? 'No products yet. Click "Add Product" to start.'
                  : 'No products match your search.'}
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
                    style={GRID_STYLE}
                  />

                  <div className="relative z-10 aspect-[3/4] overflow-hidden bg-neutral-900">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/400x533?text=No+Image'
                      }}
                    />

                    <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      {p.category}
                    </span>

                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openEdit(p)}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-400"
                        aria-label="Edit"
                      >
                        <Edit size={18} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setConfirmDelete(p)}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="relative z-10 p-4">
                    <h3 className="truncate text-sm font-semibold text-white">
                      {p.name}
                    </h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-amber-400">
                        {p.price || '—'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* RECENT + MESSAGES + LIVE SITE */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={GRID_STYLE}
          />
          <div className="relative">
            <h2 className="mb-4 text-lg font-bold text-white">
              Recent Products
            </h2>

            {recent.length === 0 ? (
              <p className="text-sm text-gray-500">No products yet.</p>
            ) : (
              <ul className="space-y-2">
                {recent.map((item) => (
                  <li
                    key={item.id}
                    className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'https://via.placeholder.com/80?text=?'
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.category}
                        {item.price ? ` · ${item.price}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={GRID_STYLE}
          />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Recent Messages
              </h2>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount} new
                </span>
              )}
            </div>

            {recentMessages.length === 0 ? (
              <p className="text-sm text-gray-500">No messages yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentMessages.map((msg) => (
                  <li
                    key={msg.id}
                    className={`flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-white/5 ${
                      !msg.read ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        msg.read
                          ? 'bg-white/10 text-gray-400'
                          : 'bg-amber-500 text-black'
                      }`}
                    >
                      {(msg.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {msg.name}
                      </p>
                      <p className="line-clamp-1 text-xs text-gray-500">
                        {msg.message}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/admin/messages"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-amber-400 transition-colors hover:text-amber-300"
            >
              View all messages
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        <a
          href="/collections"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-transparent p-6 transition-all hover:border-amber-400/30"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={GRID_STYLE}
          />
          <div className="relative">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
              <ExternalLink size={18} className="text-amber-400" />
            </div>
            <p className="text-base font-bold text-white">View Live Site</p>
            <p className="mt-1 text-xs text-gray-400">
              See how your products look on the public page
            </p>
          </div>
          <ArrowUpRight
            size={20}
            className="relative mt-6 self-end text-gray-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-400"
          />
        </a>

      </div>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setConfirmDelete(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <Trash2 size={22} className="text-red-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">
                Delete product?
              </h3>
              <p className="mb-6 text-sm text-gray-400">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-white">
                  "{confirmDelete.name}"
                </span>
                ? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-white hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete.id)}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}