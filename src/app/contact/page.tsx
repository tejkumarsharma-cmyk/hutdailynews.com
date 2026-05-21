import type { Metadata } from 'next'
import { FileText, Globe2, Mail, MapPin, Phone, Send, Users, Clock, HelpCircle } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/contact',
    title: 'Contact Us - Hutdaily News',
    description: 'Get in touch with Hutdaily News for media inquiries, press release distribution, and partnership opportunities.',
    keywords: ['contact', 'media inquiries', 'press release distribution', 'partnerships'],
  })
}

const contactOptions = [
  {
    icon: FileText,
    title: 'Press Release Distribution',
    description: 'Submit your press releases for distribution to our media network',
    email: 'releases@hutdailynews.com',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Fri, 9AM-6PM EST'
  },
  {
    icon: Globe2,
    title: 'Media Inquiries',
    description: 'Journalists and media professionals seeking information or interviews',
    email: 'media@hutdailynews.com',
    phone: '+1 (555) 123-4568',
    hours: '24/7 for urgent media requests'
  },
  {
    icon: Users,
    title: 'Partnerships',
    description: 'Explore collaboration opportunities and strategic partnerships',
    email: 'partnerships@hutdailynews.com',
    phone: '+1 (555) 123-4569',
    hours: 'Mon-Fri, 10AM-5PM EST'
  }
]

const faqs = [
  {
    question: 'How quickly are press releases distributed?',
    answer: 'Standard distribution occurs within 24 hours. Express distribution options are available for same-day publishing.'
  },
  {
    question: 'What is your media reach?',
    answer: 'Our network includes over 5,000 media outlets, journalists, and industry influencers across various sectors and regions.'
  },
  {
    question: 'Do you offer analytics and reporting?',
    answer: 'Yes, we provide comprehensive analytics including pickup tracking, audience reach, engagement metrics, and detailed performance reports.'
  },
  {
    question: 'Can I target specific industries or regions?',
    answer: 'Absolutely! We offer targeted distribution options to reach specific industries, geographic regions, or types of media outlets.'
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavbarShell />
      
      <main>
        {/* Hero Section */}
        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="mx-auto max-w-6xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] bg-blue-100 text-blue-600 border border-blue-200">
              <HelpCircle className="h-4 w-4" />
              Get in Touch
            </span>
            <h1 className="mt-6 text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl">
              Contact Hutdaily News
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl leading-8 text-gray-600">
              Reach out to our team for press release distribution, media inquiries, and partnership opportunities
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How Can We Help?</h2>
              <p className="text-xl text-gray-600">Choose the right contact channel for your needs</p>
            </div>
            
            <div className="grid gap-12 md:grid-cols-3">
              {contactOptions.map((option, index) => {
                const Icon = option.icon
                const iconColors = ['bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600']
                return (
                  <div key={index} className="text-center">
                    <div className={`w-20 h-20 ${iconColors[index]} rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <Icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{option.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{option.description}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <a href={`mailto:${option.email}`} className="hover:text-blue-600 transition-colors font-medium">
                          {option.email}
                        </a>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <a href={`tel:${option.phone}`} className="hover:text-blue-600 transition-colors font-medium">
                          {option.phone}
                        </a>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{option.hours}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 bg-gray-50">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
              <p className="text-xl text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
            </div>
            
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
              <form className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Acme Corporation"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select a topic</option>
                    <option value="press-release">Press Release Distribution</option>
                    <option value="media-inquiry">Media Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 bg-white">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">Quick answers to common questions about our services</p>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl bg-gray-50 p-8 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
