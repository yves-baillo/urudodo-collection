import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Mail,
  Phone,
  Trash2,
  Check,
  Loader2,
  RefreshCw,
  Package,
  Inbox,
} from 'lucide-react'
import {
  getMessages,
  markMessageRead,
  deleteMessage,
} from '../lib/jsonbin'

const GRID_STYLE = {
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
  `,
  backgroundSize: '40px 40px',
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError('')

      const data = await getMessages()
      setMessages([...data].reverse())
    } catch (err) {
      setError(err.message || 'Failed to load messages')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered =
    filter === 'unread'
      ? messages.filter((m) => !m.read)
      : filter === 'read'
      ? messages.filter((m) => m.read)
      : messages

  const unreadCount = messages.filter((m) => !m.read).length

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id, true)
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const handleMarkUnread = async (id) => {
    try {
      await markMessageRead(id, false)
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: false } : m))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await deleteMessage(id)
      setMessages((prev) => prev.filter((m) => m.id !== id))
      setConfirmDelete(null)
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return 'Unknown'
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now - d
    const diffMin = Math.floor(diffMs / 60000)
    const diffHr = Math.floor(diffMs / 3600000)
    const diffDay = Math.floor(diffMs / 86400000)

    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHr < 24) return `${diffHr}h ago`
    if (diffDay < 7) return `${diffDay}d ago`
    return d.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="mt-1 text-sm text-gray-400">
            {unreadCount > 0 ? (
              <>
                <span className="font-semibold text-amber-400">
                  {unreadCount}
                </span>{' '}
                unread · {messages.length} total
              </>
            ) : (
              <>{messages.length} total</>
            )}
          </p>
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

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread' },
          { key: 'read', label: 'Read' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              filter === f.key
                ? 'bg-amber-500 text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f.label}
            {f.key === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 rounded-full bg-red-500 px-1.5 text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Messages list */}
      {filtered.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={GRID_STYLE}
          />
          <div className="relative">
            <Inbox size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">
              {messages.length === 0
                ? 'No messages yet. Contact form submissions will appear here.'
                : 'No messages match this filter.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
                  msg.read
                    ? 'border-white/10 bg-white/[0.02]'
                    : 'border-amber-500/30 bg-amber-500/[0.04]'
                }`}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.03]"
                  style={GRID_STYLE}
                />

                <div className="relative">
                  {/* Top row */}
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">

                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          msg.read
                            ? 'bg-white/10 text-gray-400'
                            : 'bg-amber-500 text-black'
                        }`}
                      >
                        {(msg.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">
                            {msg.name}
                          </p>
                          {!msg.read && (
                            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {formatDate(msg.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!msg.read ? (
                        <button
                          onClick={() => handleMarkRead(msg.id)}
                          className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400 transition-colors hover:bg-green-500/20"
                        >
                          <Check size={14} />
                          Mark read
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkUnread(msg.id)}
                          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-400 transition-colors hover:bg-white/10"
                        >
                          Mark unread
                        </button>
                      )}

                      <button
                        onClick={() => setConfirmDelete(msg)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="mb-4 flex flex-wrap gap-4 text-xs">
                    <a
                      href={`mailto:${msg.email}`}
                      className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-amber-400"
                    >
                      <Mail size={12} />
                      {msg.email}
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-amber-400"
                      >
                        <Phone size={12} />
                        {msg.phone}
                      </a>
                    )}
                    {msg.product && (
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <Package size={12} />
                        Inquiry: {msg.product}
                      </span>
                    )}
                  </div>

                  {/* Message body */}
                  <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete modal */}
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
                Delete message?
              </h3>
              <p className="mb-6 text-sm text-gray-400">
                Are you sure you want to delete the message from{' '}
                <span className="font-semibold text-white">
                  {confirmDelete.name}
                </span>
                ?
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