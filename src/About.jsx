import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
} from 'react-icons/fa'
import { ArrowRight, Quote } from 'lucide-react'
import { brandInfo, brandLinks } from './data'

// ── Real brand icons — same as Footer and Contact ──
const iconMap = {
  YouTube: FaYoutube,
  Linkedin: FaLinkedinIn,
  Instagram: FaInstagram,
  TikTok: FaTiktok,
}

const BANNER_IMAGES = [
  'https://i.postimg.cc/j55VzY3y/ur3.jpg',
  'https://i.postimg.cc/kgQdCctb/ur4.jpg',
  'https://i.postimg.cc/PJ0kXV4d/ur5.jpg',
  'https://i.postimg.cc/KY5FPNZs/ur6.jpg',
  'https://i.postimg.cc/c1kxkXQq/ur7.jpg',
  'https://i.postimg.cc/3NNKJvQt/ur8.jpg',
]

const stats = [
  { value: 2015, label: 'Founded', suffix: '' },
  { value: 9, label: 'Years of Craft', suffix: '+' },
  { value: 500, label: 'Custom Pieces', suffix: '+' },
  { value: 100, label: 'Happy Clients', suffix: '%' },
]

// ── Count-up hook ──
function useCountUp(target, start, duration = 2000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return

    let startTime = null
    let animationFrame

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    animationFrame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, start, duration])

  return count
}

function StatCard({ stat, visible, delay }) {
  const count = useCountUp(stat.value, visible)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="rounded-2xl bg-neutral-50 p-6 text-center"
    >
      <p className="mb-2 text-3xl font-bold text-amber-600 md:text-4xl">
        {count}
        {stat.suffix}
      </p>
      <p className="text-sm font-medium uppercase tracking-wider text-gray-600">
        {stat.label}
      </p>
    </motion.div>
  )
}

function About() {
  const [visible, setVisible] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BANNER_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="about" ref={sectionRef} className="bg-white py-24">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Our Story
          </span>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            About {brandInfo.name}
          </h2>
        </motion.div>

        {/* Split */}
        <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9 }}
          >
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              {brandInfo.origin}
            </p>

            <div className="relative mb-8 rounded-2xl bg-amber-50 p-6 pl-16">
              <Quote size={32} className="absolute top-6 left-6 text-amber-400" />
              <p className="italic leading-relaxed text-gray-800">
                {brandInfo.mission}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-xl border border-gray-200 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Founded
                </p>
                <p className="text-base font-bold text-gray-900">
                  {brandInfo.founded}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-xl border border-gray-200 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Founders
                </p>
                <p className="text-base font-bold text-gray-900">
                  {brandInfo.founders}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: image collage */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative h-[500px]"
          >
            <motion.img
              whileHover={{ scale: 1.03 }}
              src="https://i.postimg.cc/3NNKJvQt/ur8.jpg"
              alt="Urudodo Collections"
              className="absolute top-0 right-0 h-80 w-72 rounded-2xl object-cover shadow-xl md:w-80"
            />
            <motion.img
              whileHover={{ scale: 1.03 }}
              src="https://i.postimg.cc/c1kxkXQq/ur7.jpg"
              alt="Urudodo craftsmanship"
              className="absolute bottom-0 left-0 h-64 w-60 rounded-2xl object-cover shadow-xl md:w-64"
            />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="absolute bottom-16 right-4 rounded-2xl bg-black px-5 py-4 text-white shadow-2xl md:right-12"
            >
              <p className="text-3xl font-bold leading-none text-amber-400">
                2015
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-gray-300">
                Since
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Impact in Numbers */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl"
          >
            Impact in Numbers
          </motion.h3>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <StatCard
                key={stat.label}
                stat={stat}
                visible={visible}
                delay={i * 0.15}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Full-width looping banner */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="relative mb-20 w-full overflow-hidden"
      >
        {BANNER_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === bgIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={img} alt={`Urudodo look ${i + 1}`} className="h-full w-full object-cover" />
          </div>
        ))}

        <div className="invisible">
          <img src={BANNER_IMAGES[0]} alt="" className="h-[400px] w-full object-cover md:h-[520px]" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-6 pb-10 text-center md:px-12 md:pb-14 md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400"
            >
              Woven with Purpose
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-white md:mx-0 md:text-5xl"
            >
              Every thread tells a story of Rwandan craft.
            </motion.h3>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-10 flex gap-2 md:bottom-8 md:right-10">
          {BANNER_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setBgIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === bgIndex ? 'w-8 bg-amber-400' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* CTA + real brand icons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mx-auto w-full max-w-7xl px-6 text-center md:px-12"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
          <Link
            to="/collections"
            className="group inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 font-semibold text-white transition-colors duration-300 hover:bg-amber-500 hover:text-black"
          >
            View Our Collections
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Real brand icons — YouTube, LinkedIn, Instagram, TikTok */}
        <div className="mt-10 flex justify-center gap-5">
          {brandLinks.map((link, i) => {
            const Icon = iconMap[link.icon]
            return (
              <motion.a
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.25, y: -4 }}
                whileTap={{ scale: 0.9 }}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="text-gray-500 transition-colors hover:text-amber-500"
              >
                {Icon && <Icon size={26} />}
              </motion.a>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

export default About