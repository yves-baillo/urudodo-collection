import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Clock,
  Navigation,
  ArrowRight,
  Building2,
} from 'lucide-react'
import { visitInfo, brandInfo } from './data'

function VisitUs() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)

  // Fade-in on scroll
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

  return (
    <section
      id="visit-us"
      ref={sectionRef}
      className="bg-white py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">

        {/* ── Header ── */}
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Come See Us
          </span>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Visit Our Studio
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Step into our Kigali studio, feel the fabrics, and get measured
            for something made just for you.
          </p>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">

          {/* ── Left: details (2 cols) ── */}
          <div
            className={`space-y-6 lg:col-span-2 transition-all duration-1000 ease-out ${
              visible
                ? 'translate-x-0 opacity-100'
                : '-translate-x-8 opacity-0'
            }`}
          >

            {/* Address card */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-colors duration-300 group-hover:bg-amber-500 group-hover:text-white">
                <MapPin size={26} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Our Location
              </h3>
              <p className="text-gray-700">{visitInfo.address}</p>
              <p className="mt-1 text-sm text-gray-500">
                {visitInfo.landmark}
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  visitInfo.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition-colors hover:text-amber-700"
              >
                Get Directions
                <Navigation
                  size={16}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                />
              </a>
            </div>

            {/* Hours card */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-colors duration-300 group-hover:bg-amber-500 group-hover:text-white">
                <Clock size={26} />
              </div>
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Opening Hours
              </h3>

              <ul className="space-y-3">
                {visitInfo.hours.map((slot) => (
                  <li
                    key={slot.day}
                    className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm last:border-0"
                  >
                    <span className="text-gray-600">{slot.day}</span>
                    <span
                      className={`font-semibold ${
                        slot.time === 'Closed'
                          ? 'text-red-500'
                          : 'text-gray-900'
                      }`}
                    >
                      {slot.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-4 rounded-2xl bg-amber-50 p-5">
              <Building2
                size={22}
                className="mt-0.5 shrink-0 text-amber-600"
              />
              <p className="text-sm leading-relaxed text-gray-700">
                We welcome walk-ins, but for custom pieces and bridal
                fittings we recommend booking ahead by phone or WhatsApp.
              </p>
            </div>

          </div>

          {/* ── Right: map (3 cols) ── */}
          <div
            className={`lg:col-span-3 transition-all duration-1000 ease-out delay-200 ${
              visible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-8 opacity-0'
            }`}
          >
            <div className="relative h-full min-h-[500px] overflow-hidden rounded-3xl shadow-2xl">

              {/* Google Map embed */}
              <iframe
                title="Urudodo Collections Location"
                src={visitInfo.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 500 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
              />

              {/* Floating location badge */}
              <div className="pointer-events-none absolute bottom-6 left-6 right-6 rounded-2xl bg-black/85 p-5 backdrop-blur-md md:right-auto md:max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500 text-black">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400">
                      {brandInfo.name}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {visitInfo.address}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── CTA ── */}
        <div className="mt-16 text-center">
          <p className="mb-4 text-gray-600">
            Planning a visit? Let us know so we can prepare.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-amber-500 hover:text-black hover:scale-105"
          >
            Book a Visit
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

export default VisitUs