import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { testimonials, brandInfo } from './data'

function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  // Auto-rotate every 6 seconds unless paused
  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [paused])

  const next = () =>
    setCurrent((prev) => (prev + 1) % testimonials.length)

  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )

  const active = testimonials[current]

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-neutral-900 py-24 text-white"
    >

      {/* ── Decorative background glow ── */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-12">

        {/* ── Header ── */}
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            Kind Words
          </span>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Real voices from people who wear {brandInfo.name}.
          </p>
        </div>

        {/* ── Main testimonial card ── */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative mb-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:p-12"
        >

          {/* Quote icon */}
          <Quote
            size={48}
            className="mb-6 text-amber-500/60"
          />

          {/* Stars */}
          <div className="mb-6 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>

          {/* Quote text with fade transition */}
          <div className="relative min-h-[180px] md:min-h-[140px]">
            {testimonials.map((t, i) => (
              <blockquote
                key={t.id}
                className={`absolute inset-0 text-lg leading-relaxed text-gray-100 transition-all duration-700 md:text-2xl ${
                  i === current
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-4 opacity-0'
                }`}
              >
                "{t.quote}"
              </blockquote>
            ))}
          </div>

          {/* Author with fade */}
          <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
            {/* Avatar circle with initial */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-xl font-bold text-black">
              {active.name.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                {active.name}
              </p>
              <p className="text-sm text-gray-400">{active.role}</p>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between">

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 bg-amber-400'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-3">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:bg-amber-500 hover:text-black hover:border-amber-500"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:bg-amber-500 hover:text-black hover:border-amber-500"
              >
                <ChevronRight size={20} />
              </button>
            </div>

          </div>

        </div>

        {/* ── Mini grid preview of all testimonials ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setCurrent(i)}
              className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                i === current
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <p className="mb-2 text-sm font-semibold text-white">
                {t.name}
              </p>
              <p className="line-clamp-2 text-xs text-gray-400">
                {t.quote}
              </p>
            </button>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="mt-16 text-center">
          <p className="mb-4 text-gray-400">
            Ready to become our next happy client?
          </p>
          <Link
            to="/collections"
            className="group inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-4 font-semibold text-black transition-all duration-300 hover:bg-amber-400 hover:scale-105"
          >
            Explore Collections
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default Testimonials