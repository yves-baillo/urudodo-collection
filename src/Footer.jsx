import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
} from 'react-icons/fa'
import { ArrowUp } from 'lucide-react'
import { brandInfo, brandLinks } from './data'

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Collections', path: '/collections' },
  { name: 'Visit Us', path: '/visit-us' },
  { name: 'Contact', path: '/contact' },
]

const iconMap = {
  YouTube: FaYoutube,
  Linkedin: FaLinkedinIn,
  Instagram: FaInstagram,
  TikTok: FaTiktok,
}

const LOGO_URL = 'https://i.postimg.cc/1zQ50bs3/uru-1-removebg-preview.png'

const FOOTER_IMAGES = [
  'https://i.postimg.cc/j55VzY3y/ur3.jpg',
  'https://i.postimg.cc/kgQdCctb/ur4.jpg',
  'https://i.postimg.cc/PJ0kXV4d/ur5.jpg',
  'https://i.postimg.cc/KY5FPNZs/ur6.jpg',
  'https://i.postimg.cc/c1kxkXQq/ur7.jpg',
  'https://i.postimg.cc/3NNKJvQt/ur8.jpg',
]

function Footer() {
  const [bgIndex, setBgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % FOOTER_IMAGES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden text-gray-300">

      {/* Looping background */}
      <div className="absolute inset-0">
        {FOOTER_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === bgIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/85" />
      </div>

      {/* Amber accent */}
      <div className="relative h-1 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-8 md:px-12">

        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8">

          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-4">
            <img src={LOGO_URL} alt={brandInfo.name} className="h-12 w-auto" />
            <p className="max-w-[220px] text-center text-xs italic leading-relaxed tracking-wide text-gray-400 md:text-left">
              Hand‑made clothing rooted in culture, for everyone.
            </p>
          </div>

          {/* Quick links */}
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm tracking-wide">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="transition-colors hover:text-amber-400"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Real brand icons + back to top */}
          <div className="flex items-center gap-5">
            {brandLinks.map((link) => {
              const Icon = iconMap[link.icon]
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="text-gray-300 transition-all duration-300 hover:text-amber-400 hover:scale-125"
                >
                  {Icon && <Icon size={26} />}
                </a>
              )
            })}

            <button
              onClick={scrollToTop}
              className="group ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-amber-400 hover:text-amber-400"
              aria-label="Back to top"
            >
              <ArrowUp
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-1"
              />
            </button>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-white/10 pt-5 text-center">
          <p className="text-sm tracking-wide text-gray-300">
            © 2026 {brandInfo.name}
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer