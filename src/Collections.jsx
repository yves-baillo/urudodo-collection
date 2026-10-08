import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Eye,
  MessageCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react'
import { getProducts } from './lib/jsonbin'
import { brandInfo } from './data'

const CATEGORIES = ['All', 'Men', 'Women', 'Wedding']

const GRID_STYLE = {
  backgroundImage: `
    linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
  `,
  backgroundSize: '40px 40px',
}

function Collections() {
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const scrollRef = useRef(null)

  // ── Load products ──
  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProducts()
        if (mounted) setProducts(data)
      } catch (err) {
        console.error('Failed to load products:', err)
        if (mounted) setError(err.message || 'Failed to load products')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setShowAll(false)
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }

  const scroll = (direction) => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section
      id="collections"
      className="relative overflow-hidden bg-neutral-50 py-16 sm:py-24"
    >
      {/* Grid net */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.6]"
        style={GRID_STYLE}
      />

      {/* Amber glows */}
      <div className="pointer-events-none absolute -top-40 right-0 z-0 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-0 z-0 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12">

        {/* ═══ HEADER ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center sm:mb-12"
        >
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 sm:text-sm">
            Our Work
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Urudodo Collections
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-base">
            {brandInfo.unique}
          </p>
        </motion.div>

        {/* ═══ LOADING ═══ */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <Loader2 size={32} className="animate-spin text-amber-500" />
            <p className="mt-4 text-sm">Loading collections...</p>
          </div>
        )}

        {/* ═══ ERROR ═══ */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm font-semibold text-red-700">
              Could not load collections
            </p>
            <p className="mt-2 text-xs text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ═══ CONTENT ═══ */}
        {!loading && !error && (
          <>
            {/* Filters + arrows */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Category pills — scroll horizontally on mobile */}
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                {CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryChange(cat)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 sm:px-6 sm:text-sm ${
                      activeCategory === cat
                        ? 'bg-black text-white shadow-lg'
                        : 'bg-white/80 text-gray-700 backdrop-blur-sm hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Arrows — desktop only */}
              {filteredProducts.length > 0 && (
                <div className="hidden gap-2 md:flex">
                  <button
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white/80 text-gray-700 backdrop-blur-sm transition-all hover:border-amber-500 hover:bg-amber-500 hover:text-white"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white/80 text-gray-700 backdrop-blur-sm transition-all hover:border-amber-500 hover:bg-amber-500 hover:text-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Empty states */}
            {products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl border border-dashed border-gray-300 bg-white/60 p-10 text-center backdrop-blur-sm sm:p-16"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={GRID_STYLE}
                />
                <div className="relative">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                    <Package size={28} className="text-amber-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">
                    Collections coming soon
                  </h3>
                  <p className="mx-auto max-w-md text-sm text-gray-500 sm:text-base">
                    We're preparing our latest pieces. Check back soon or
                    contact us for a custom design.
                  </p>
                  <a
                    href="/contact"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 font-semibold text-white transition-all hover:bg-amber-500 hover:text-black"
                  >
                    Request Custom Design
                    <ArrowRight size={18} />
                  </a>
                </div>
              </motion.div>
            ) : filteredProducts.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/60 p-10 text-center backdrop-blur-sm sm:p-16">
                <div
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={GRID_STYLE}
                />
                <p className="relative text-gray-500">
                  No products in this category yet.
                </p>
              </div>
            ) : (
              <>
                {/* ═══ MOBILE: 2-COLUMN GRID ═══ */}
                <div className="grid grid-cols-2 gap-3 sm:hidden">
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      className="group relative overflow-hidden rounded-2xl bg-white shadow-md"
                    >
                      <div
                        className="pointer-events-none absolute inset-0 z-0 opacity-[0.4]"
                        style={GRID_STYLE}
                      />

                      {/* Image */}
                      <div className="relative z-10 aspect-[3/4] overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'https://via.placeholder.com/400x533?text=No+Image'
                          }}
                        />

                        <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-gray-900 backdrop-blur-sm">
                          {product.category}
                        </span>

                        {product.price && (
                          <span className="absolute top-2 right-2 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-amber-400 backdrop-blur-sm">
                            {product.price}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="relative z-10 p-3">
                        <h3 className="mb-1 line-clamp-1 text-xs font-bold text-gray-900">
                          {product.name}
                        </h3>
                        <a
                          href={`/contact?product=${encodeURIComponent(
                            product.name
                          )}`}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600"
                        >
                          Inquire
                          <ArrowRight size={10} />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* ═══ DESKTOP: HORIZONTAL CAROUSEL ═══ */}
                <div className="hidden sm:block">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    ref={scrollRef}
                    className="scrollbar-thin flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6"
                    style={{
                      scrollbarWidth: 'thin',
                      WebkitOverflowScrolling: 'touch',
                    }}
                  >
                    {filteredProducts.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        whileHover={{ y: -8 }}
                        className="group relative w-72 shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-500 hover:shadow-2xl lg:w-80"
                      >
                        <div
                          className="pointer-events-none absolute inset-0 z-0 opacity-[0.4]"
                          style={GRID_STYLE}
                        />

                        <div className="relative z-10 aspect-[3/4] overflow-hidden">
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.7 }}
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                'https://via.placeholder.com/600x800?text=No+Image'
                            }}
                          />

                          <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                            <motion.a
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.95 }}
                              href={`/contact?product=${encodeURIComponent(
                                product.name
                              )}`}
                              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black"
                              aria-label="Inquire about this product"
                            >
                              <MessageCircle size={20} />
                            </motion.a>

                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black"
                              aria-label="View product"
                            >
                              <Eye size={20} />
                            </motion.button>
                          </div>

                          <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm">
                            {product.category}
                          </span>

                          {product.price && (
                            <span className="absolute top-4 right-4 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-amber-400 backdrop-blur-sm">
                              {product.price}
                            </span>
                          )}
                        </div>

                        <div className="relative z-10 p-5">
                          <h3 className="mb-2 text-base font-bold text-gray-900">
                            {product.name}
                          </h3>
                          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                            {product.description}
                          </p>

                          <a
                            href={`/contact?product=${encodeURIComponent(
                              product.name
                            )}`}
                            className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition-colors hover:text-amber-700"
                          >
                            Inquire Now
                            <ArrowRight
                              size={16}
                              className="transition-transform duration-300 group-hover/btn:translate-x-1"
                            />
                          </a>
                        </div>
                      </motion.div>
                    ))}

                    <div className="w-6 shrink-0" />
                  </motion.div>

                  <p className="mt-4 text-center text-xs text-gray-500">
                    Swipe or use arrows to browse {filteredProducts.length}{' '}
                    pieces
                  </p>
                </div>
              </>
            )}

            {/* CTA */}
            {products.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mt-12 text-center sm:mt-16"
              >
                <p className="mb-4 text-sm text-gray-600 sm:text-base">
                  Looking for something custom? We make made-to-measure pieces.
                </p>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-amber-500 hover:text-black sm:px-8 sm:py-4 sm:text-base"
                >
                  Request Custom Design
                  <ArrowRight size={18} className="sm:hidden" />
                  <ArrowRight size={20} className="hidden sm:block" />
                </motion.a>
              </motion.div>
            )}
          </>
        )}

      </div>
    </section>
  )
}

export default Collections