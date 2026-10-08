import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { brandInfo } from './data'

const heroImages = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQneZZ1wGeOx233yJpPJ6pk_oik5HW_oDEOAGVOdnZONg&s=10',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80',
]

function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-200 w-full overflow-hidden bg-black">

      {/* Background images */}
      {heroImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={img}
            alt="Urudodo Collections fashion"
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Centered content with motion */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto w-full max-w-4xl px-6 text-center md:px-12">

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl"
          >
            {brandInfo.name}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mb-10 max-w-2xl text-xl text-gray-200 md:text-2xl"
          >
            {brandInfo.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="/collections"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black transition-colors duration-300 hover:bg-amber-400"
            >
              Explore Collections
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

      

      {/* Scroll-down arrow */}
      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 0.5 },
          y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
        }}
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/80 transition-colors hover:text-white"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </motion.a>

    </section>
  )
}

export default Hero