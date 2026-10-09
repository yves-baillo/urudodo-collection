import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, ChevronDown } from 'lucide-react'

const HERO_IMAGES = [
  'https://i.postimg.cc/j55VzY3y/ur3.jpg',
  'https://i.postimg.cc/kgQdCctb/ur4.jpg',
  'https://i.postimg.cc/PJ0kXV4d/ur5.jpg',
  'https://i.postimg.cc/KY5FPNZs/ur6.jpg',
  'https://i.postimg.cc/c1kxkXQq/ur7.jpg',
  'https://i.postimg.cc/3NNKJvQt/ur8.jpg',
]

function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">

      {/* ═══ Rotating background images ═══ */}
      {HERO_IMAGES.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={img}
            alt="Urudodo Collection"
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* ═══ Dark overlay ═══ */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* ═══ Grid net ═══ */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ═══ Centered content ═══ */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto w-full max-w-4xl px-6 text-center md:px-12">

          {/* Small label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              Proudly Made in Rwanda
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Urudodo
            <br />
            <span className="text-amber-400">Collection</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-lg font-light italic text-gray-200 sm:text-xl md:text-2xl"
          >
            Threads of Rwandan Elegance
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="/collections"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black transition-colors duration-300 hover:bg-amber-400"
            >
              Explore Collection
              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20"
            >
              Contact Us
            </motion.a>
          </motion.div>

        </div>
      </div>

      {/* ═══ Scroll-down indicator ═══ */}
      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 0.5 },
          y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
        }}
        href="#about"
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-amber-400"
      >
        <ChevronDown size={32} />
      </motion.a>

    </section>
  )
}

export default Hero