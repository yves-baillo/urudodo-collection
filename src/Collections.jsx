import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, Eye, MessageCircle } from 'lucide-react'
import { products, categories, brandInfo } from './data'

function Collections() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <section id="collections" className="bg-neutral-50 py-24">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Our Work
          </span>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Collections
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">{brandInfo.unique}</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 flex flex-wrap justify-center gap-3"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-500 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7 }}
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <motion.a
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      href={`/contact?product=${encodeURIComponent(product.name)}`}
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
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    {product.description}
                  </p>

                  <a
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
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
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="mb-4 text-gray-600">
            Looking for something custom? We make made-to-measure pieces.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 font-semibold text-white transition-colors duration-300 hover:bg-amber-500 hover:text-black"
          >
            Request Custom Design
            <ArrowRight size={20} />
          </motion.a>
        </motion.div>

      </div>
    </section>
  )
}

export default Collections