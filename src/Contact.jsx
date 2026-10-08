import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
} from 'react-icons/fa'
import {
  Mail,
  Phone,
  Send,
  CheckCircle,
  MessageCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { contactInfo, brandLinks, brandInfo } from './data'
import { addMessage } from './lib/jsonbin'

const iconMap = {
  YouTube: FaYoutube,
  Linkedin: FaLinkedinIn,
  Instagram: FaInstagram,
  TikTok: FaTiktok,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

function Contact() {
  const [searchParams] = useSearchParams()
  const productFromUrl = searchParams.get('product')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: productFromUrl
      ? `Hello, I'm interested in the "${productFromUrl}" piece. Could you share more details?`
      : '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Prefill message when the URL param changes
  useEffect(() => {
    if (productFromUrl) {
      setFormData((prev) => ({
        ...prev,
        message: `Hello, I'm interested in the "${productFromUrl}" piece. Could you share more details?`,
      }))
    }
  }, [productFromUrl])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)

    try {
      const newMessage = {
        id: Date.now(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        product: productFromUrl || null,
        read: false,
        createdAt: new Date().toISOString(),
      }

      await addMessage(newMessage)

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })

      setSubmitting(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 6000)
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitError('Could not send your message. Please try again.')
      setSubmitting(false)
    }
  }

  const whatsappNumber = contactInfo.whatsapp.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    contactInfo.whatsappMessage
  )}`

  const telNumber = contactInfo.phone.replace(/\s/g, '')

  return (
    <section id="contact" className="bg-neutral-50 py-24">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">

        {/* ═══ Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Get In Touch
          </span>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Contact Us
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Interested in a piece, a custom design, or a bridal fitting?
            Send us a message and we'll get back to you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

          {/* ═══ LEFT: Contact info ═══ */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-2xl font-bold text-gray-900"
            >
              Reach Us Directly
            </motion.h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-5"
            >
              {/* Email */}
              <motion.a
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`mailto:${contactInfo.email}`}
                className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <motion.div
                  whileHover={{ rotate: 8 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white"
                >
                  <Mail size={22} />
                </motion.div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </p>
                  <p className="break-all text-base font-medium text-gray-900">
                    {contactInfo.email}
                  </p>
                </div>
              </motion.a>

              {/* Phone */}
              <motion.a
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`tel:${telNumber}`}
                className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <motion.div
                  whileHover={{ rotate: 8 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white"
                >
                  <Phone size={22} />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Phone
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {contactInfo.phone}
                  </p>
                </div>
              </motion.a>

              {/* WhatsApp */}
              <motion.a
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <motion.div
                  whileHover={{ rotate: 8 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors group-hover:bg-green-500 group-hover:text-white"
                >
                  <MessageCircle size={22} />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    WhatsApp
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {contactInfo.whatsapp}
                  </p>
                </div>
              </motion.a>
            </motion.div>

            {/* Brand icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
                Follow {brandInfo.name}
              </p>
              <div className="flex gap-5">
                {brandLinks.map((link, i) => {
                  const Icon = iconMap[link.icon]
                  return (
                    <motion.a
                      key={link.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
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
          </div>

          {/* ═══ RIGHT: Form ═══ */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="rounded-3xl bg-white p-8 shadow-lg md:p-10"
          >
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              Send a Message
            </h3>

            {/* Success banner */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden rounded-xl border border-green-500/30 bg-green-500/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      size={20}
                      className="mt-0.5 shrink-0 text-green-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-green-700">
                        Message sent successfully!
                      </p>
                      <p className="mt-1 text-xs text-green-600">
                        Thank you! We'll get back to you soon.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error banner */}
            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={20}
                      className="mt-0.5 shrink-0 text-red-600"
                    />
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all duration-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all duration-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+250 ..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all duration-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you're looking for..."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all duration-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 font-semibold text-white transition-all duration-300 hover:bg-amber-500 hover:text-black disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle size={20} />
                    Message Sent
                  </>
                ) : (
                  <>
                    Send Message
                    <Send
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

            </form>

          </motion.div>

        </div>

      </div>
    </section>
  )
}

export default Contact