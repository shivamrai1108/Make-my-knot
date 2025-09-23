import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Clock, Users, Award, ArrowRight, CheckCircle } from 'lucide-react'
import Footer from '@/components/Footer'
import BrandLogo from '@/components/BrandLogo'
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Make My Knot | Our Legacy: From 1975 to 2025</title>
        <meta name="description" content="From Handshakes to Pheras - Discover our 3-generation legacy since 1975. 50 years of trusted matchmaking from Chaman Prakash Goyal's foundation to today's personalized platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <Link href="/" className="flex items-center">
                <BrandLogo size="sm" className="mr-2" />
                <span className="text-xl font-bold text-gray-900">Make My Knot</span>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Link href="/#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 px-3 py-2 rounded-md font-semibold text-sm">How It Works</Link>
                <Link href="/webinars" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 px-3 py-2 rounded-md font-semibold text-sm">Webinars</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1920&h=1080&fit=crop&auto=format"
              alt="Traditional Indian wedding ceremony"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <Clock className="h-12 w-12 text-gold-400 mr-4" />
              <span className="text-4xl font-bold text-gold-400">50 Years</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              A Legacy of <span className="text-gold-400">Love Stories</span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-8">
              Since 1975, the Goyal family has been India's most trusted name in matchmaking. What started with 
              Shri Chaman Prakash Goyal (Visionary Founder) as a heartfelt mission to create meaningful rishtas has evolved through 
              three generations into today's AI-powered platform under Managing Director Shri Anil Goyal and CEO Moulik Goyal, 
              but our commitment to "Matches Made with Mannat, Not Just Metrics" remains unchanged.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-lg text-gold-300 font-medium italic">
                "Where Matches Are Made With Mannat, Not Just Metrics"
              </p>
              <p className="text-sm text-gray-300 mt-2">The Goyal Family Philosophy</p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey Through Time</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From handwritten letters to AI algorithms, we've adapted with the times while preserving the human touch
              </p>
            </div>

            <div className="relative">
              {/* Timeline line - Hidden on mobile, centered on desktop */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200"></div>
              {/* Mobile Timeline line - Left aligned */}
              <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-primary-200"></div>

              {/* Timeline items */}
              <div className="space-y-12">
                {/* 1975 */}
                <div className="relative flex items-center">
                  {/* Mobile Layout */}
                  <div className="md:hidden pl-12 w-full">
                    <div className="mb-4">
                      <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop&auto=format"
                          alt="Traditional Indian family gathering representing 1975 matchmaking foundation"
                          fill
                          className="object-cover sepia"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">1975</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">The Foundation of Goyal Marriage Bureau</h4>
                    <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg p-4 mb-4">
                      <h5 className="font-bold text-primary-800 mb-2">Matches Made with Mannat, Not Just Metrics</h5>
                    </div>
                    <p className="text-gray-600 mb-3">
                      In 1975, <strong>Shri Chaman Prakash Goyal</strong> laid the foundation of Goyal Marriage Bureau, planting the roots of what has become one of the most trusted matchmaking services in India. His belief was simple yet powerful: every rishta deserves honesty, care, and blessings.
                    </p>
                    <p className="text-gray-600 mb-3">
                      At a time when matchmaking was limited to biodatas and formalities, Shri Chaman Prakash Goyal brought heart into the process. He personally met families, understood their values, and ensured that every match was built on trust and compatibility. His dedication turned countless dreams into successful marriages, earning him respect as one of India's most reliable matchmakers.
                    </p>
                    <p className="text-gray-600 mb-3">
                      For him, shaadi was never just about two individuals, but about uniting families. With sincerity, blessings, and a personal touch, he created a legacy of meaningful connections—one that continues to inspire generations.
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                      <p className="text-sm text-gray-700 italic">
                        💡 His philosophy became the foundation of our approach:
                      </p>
                      <p className="text-primary-800 font-semibold mt-2 text-center">
                        "Matches Made with Mannat, Not Just Metrics"
                      </p>
                    </div>
                  </div>
                  {/* Desktop Layout */}
                  <div className="hidden md:flex md:items-center md:w-full">
                    <div className="flex-1 text-right pr-8">
                      <div className="flex justify-end mb-4">
                        <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-lg">
                          <Image
                            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop&auto=format"
                            alt="Traditional Indian family gathering representing 1975 matchmaking foundation"
                            fill
                            className="object-cover sepia"
                          />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">1975</h3>
                      <h4 className="text-lg font-semibold text-primary-600 mb-2">The Foundation of Goyal Marriage Bureau</h4>
                      <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg p-4 mb-4">
                        <h5 className="font-bold text-primary-800 mb-2">Matches Made with Mannat, Not Just Metrics</h5>
                      </div>
                      <p className="text-gray-600 mb-3">
                        In 1975, <strong>Shri Chaman Prakash Goyal</strong> laid the foundation of Goyal Marriage Bureau, planting the roots of what has become one of the most trusted matchmaking services in India. His belief was simple yet powerful: every rishta deserves honesty, care, and blessings.
                      </p>
                      <p className="text-gray-600 mb-3">
                        At a time when matchmaking was limited to biodatas and formalities, Shri Chaman Prakash Goyal brought heart into the process. He personally met families, understood their values, and ensured that every match was built on trust and compatibility. His dedication turned countless dreams into successful marriages, earning him respect as one of India's most reliable matchmakers.
                      </p>
                      <p className="text-gray-600 mb-3">
                        For him, shaadi was never just about two individuals, but about uniting families. With sincerity, blessings, and a personal touch, he created a legacy of meaningful connections—one that continues to inspire generations.
                      </p>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                        <p className="text-sm text-gray-700 italic">
                          💡 His philosophy became the foundation of our approach:
                        </p>
                        <p className="text-primary-800 font-semibold mt-2 text-center">
                          "Matches Made with Mannat, Not Just Metrics"
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 pl-8"></div>
                  </div>
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                </div>

                {/* 2000 */}
                <div className="relative flex items-center">
                  {/* Mobile Layout */}
                  <div className="md:hidden pl-12 w-full">
                    <div className="mb-4">
                      <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop&auto=format"
                          alt="Second generation leadership in 2000"
                          fill
                          className="object-cover sepia"
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">2000</h3>
                    <h4 className="text-base font-semibold text-primary-600 mb-2">Second Generation Leadership</h4>
                    <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg p-3 mb-3">
                      <h5 className="font-bold text-primary-800 mb-1 text-sm">Carrying Forward a Legacy of Love</h5>
                    </div>
                    <p className="text-gray-600 mb-3 text-sm">
                      In 2000, <strong>Shri Anil Goyal</strong> carried forward this legacy of matchmaking with the same passion and integrity. With over 16 years of experience, he emphasized personal attention, emotional understanding, and sincerity.
                    </p>
                    <p className="text-gray-600 text-sm">
                      Every rishta was nurtured with care, guided by his belief that marriages are not transactions—they are lifelong commitments.
                    </p>
                  </div>
                  {/* Desktop Layout */}
                  <div className="hidden md:flex md:items-center md:w-full">
                    <div className="flex-1 pr-8"></div>
                    <div className="flex-1 pl-8">
                      <div className="mb-4">
                        <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-lg">
                          <Image
                            src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop&auto=format"
                            alt="Second generation leadership in 2000"
                            fill
                            className="object-cover sepia"
                          />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">2000</h3>
                      <h4 className="text-lg font-semibold text-primary-600 mb-2">Second Generation Leadership</h4>
                      <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg p-4 mb-4">
                        <h5 className="font-bold text-primary-800 mb-2">Carrying Forward a Legacy of Love</h5>
                      </div>
                      <p className="text-gray-600 mb-3">
                        In 2000, <strong>Shri Anil Goyal</strong> carried forward this legacy of matchmaking with the same passion and integrity. With over 16 years of experience, he emphasized personal attention, emotional understanding, and sincerity.
                      </p>
                      <p className="text-gray-600">
                        Every rishta was nurtured with care, guided by his belief that marriages are not transactions—they are lifelong commitments.
                      </p>
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-primary-600 rounded-full border-2 md:border-4 border-white"></div>
                </div>

                {/* 2010 */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="text-2xl font-bold text-gray-900">2010</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">The Digital Shift</h4>
                    <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg p-4 mb-4">
                      <h5 className="font-bold text-primary-800 mb-2">Where Technology Met Heart</h5>
                    </div>
                    <p className="text-gray-600 mb-3">
                      As technology reshaped India, so did matchmaking. While many reduced rishtas to online biodata lists, <strong>Shri Anil Goyal</strong> blended technology with human touch.
                    </p>
                    <p className="text-gray-600">
                      He believed in stories, not just profiles—helping families find matches that were not only compatible on paper but deeply meaningful in real life.
                    </p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* 2015 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8">
                    <h3 className="text-2xl font-bold text-gray-900">2015</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Handwritten Diaries to Platforms</h4>
                    <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg p-4 mb-4">
                      <h5 className="font-bold text-primary-800 mb-2">Every Rishta Tells a Story</h5>
                    </div>
                    <p className="text-gray-600 mb-3">
                      From handwritten diaries filled with biodatas to meaningful conversations, over 1,000 couples were united under the guidance of the Goyal family. Their philosophy remained unchanged:
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                      <p className="text-primary-800 font-semibold text-center">
                        “Shaadi ek event nahi — ek zindagi bhar ka saath hota hai.”
                      </p>
                    </div>
                    <p className="text-gray-600">
                      Every rishta was not just a profile—it was a story of love, trust, and companionship.
                    </p>
                  </div>
                </div>

                {/* 2020 */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="text-2xl font-bold text-gray-900">2020</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Third Generation Leadership</h4>
                    <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg p-4 mb-4">
                      <h5 className="font-bold text-primary-800 mb-2">Where Tradition Meets Innovation</h5>
                    </div>
                    <p className="text-gray-600 mb-3">
                      The legacy entered its third generation with <strong>Moulik Goyal</strong>, who had grown up watching his father and grandfather devote their lives to matchmaking. With 5+ years of experience at Make My Knot, he is now transforming the 50-year-old family business into India’s most advanced AI-powered matchmaking platform.
                    </p>
                    <p className="text-gray-600">
                      By blending traditional wisdom with cutting-edge technology, Moulik is ensuring that the Goyal family’s heritage continues to evolve for the modern world, supporting both Indian and NRI families in finding meaningful connections.
                    </p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* Interlude */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">From Handshake to Pheras</h4>
                      <p className="text-gray-600">
                        From meaningful rishtas to lifelong companionship, we&rsquo;ve supported families at every step. Today, we continue that tradition with modern tools and heartfelt service.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gold-400 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* 2025 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gold-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8">
                    <div className="mb-4">
                      <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&auto=format"
                          alt="Modern AI-powered technology with traditional Indian wedding elements"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">2025</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Tech-Powered Matchmaking & Beyond</h4>
                    <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg p-4 mb-4">
                      <h5 className="font-bold text-primary-800 mb-2">Heritage Meets Innovation</h5>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Today, after five decades of trust, the Goyal family legacy is stronger than ever. Through AI matchmaking, expert guidance, and personalized services, Make My Knot continues to help families create lasting, meaningful, and values-driven relationships.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                      <h6 className="font-bold text-blue-800 mb-2">✨ Coming Soon: End-to-end wedding services</h6>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-700">
                        <div className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2" /> Wedding Planners</div>
                        <div className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2" /> Caterers</div>
                        <div className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2" /> Decorators</div>
                        <div className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2" /> Photographers</div>
                        <div className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2" /> Anchors & Singers</div>
                        <div className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2" /> Honeymoon Packages</div>
                      </div>
                      <p className="text-sm text-blue-700 mt-2 italic">Making Make My Knot your one-stop partner from rishta to shaadi.</p>
                    </div>
                    <p className="text-gray-600">
                      From handshake to pheras, our journey has always been about one promise: turning dreams into lifelong bonds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Experts Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Meet Our Experts</h2>
              <p className="text-lg text-gray-600">Three generations of matchmaking expertise driving innovation while preserving tradition</p>
            </div>

            {/* Scroll Stack */}
            <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-xl">
              <ScrollStack className="bg-white">
                {/* Chaman Card */}
                <ScrollStackItem>
                  <div className="flex flex-col lg:flex-row items-start gap-8 p-6 lg:p-10">
                    <div className="flex-shrink-0">
                      <div className="w-64 h-80 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                          src="/images/chaman-prakash-goyal.jpg"
                          alt="Shri Chaman Prakash Goyal - Visionary Founder"
                          width={256}
                          height={320}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Shri Chaman Prakash Goyal</h3>
                      <p className="text-xl text-gold-600 font-semibold mb-4">Visionary Founder • 1975</p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        In 1975, <strong>Shri Chaman Prakash Goyal</strong> laid the foundation of Goyal Marriage Bureau, planting the roots of one of India’s most trusted matchmaking services. His belief was simple yet powerful: every rishta deserves honesty, care, and blessings.
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        He brought heart into the process—personally meeting families and ensuring every match was built on trust and compatibility.
                      </p>
                      <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-2xl p-6 border-l-4 border-gold-400">
                        <p className="text-lg font-medium text-primary-800 mb-2">His guiding philosophy that lives on today:</p>
                        <p className="text-2xl font-bold text-primary-900 italic">"Matches Made with Mannat, Not Just Metrics"</p>
                      </div>
                    </div>
                  </div>
                </ScrollStackItem>

                {/* Anil Card */}
                <ScrollStackItem>
                  <div className="flex flex-col lg:flex-row items-start gap-8 p-6 lg:p-10">
                    <div className="flex-shrink-0">
                      <div className="w-64 h-80 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                          src="/images/anil-goyal.jpg"
                          alt="Shri Anil Goyal - Managing Director"
                          width={256}
                          height={320}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Shri Anil Goyal</h3>
                      <p className="text-xl text-green-600 font-semibold mb-4">Managing Director</p>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        The bridge between tradition and modernity, <strong>Shri Anil Goyal</strong> dedicated over 16 years to nurturing the family vision with deep care and emotional understanding.
                      </p>
                      <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                        <div>
                          <strong className="text-gray-900">Experience:</strong><br />
                          16+ years dedicated service<br />
                          2nd generation leader
                        </div>
                        <div>
                          <strong className="text-gray-900">Expertise:</strong><br />
                          Relationship counseling<br />
                          Family dynamics, Traditional values
                        </div>
                        <div className="md:col-span-2">
                          <strong className="text-gray-900">Approach:</strong> Personal attention, Emotional understanding, Family-first mindset
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollStackItem>

                {/* Moulik Card */}
                <ScrollStackItem>
                  <div className="flex flex-col lg:flex-row items-start gap-8 p-6 lg:p-10">
                    <div className="flex-shrink-0">
                      <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                          src="/images/maulik-goyal.jpg"
                          alt="Moulik Goyal - Chief Executive Officer"
                          width={320}
                          height={384}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Moulik Goyal</h3>
                      <p className="text-xl text-primary-600 font-semibold mb-4">Chief Executive Officer</p>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        As the third-generation leader, Moulik blends traditional wisdom with AI and modern product thinking to build India’s most advanced matchmaking platform.
                      </p>
                      <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                        <div>
                          <strong className="text-gray-900">Experience:</strong><br />
                          10+ years in Technology<br />
                          5+ years leading Make My Knot
                        </div>
                        <div>
                          <strong className="text-gray-900">Expertise:</strong><br />
                          AI Matchmaking, Business Strategy, Digital Transformation
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollStackItem>
              </ScrollStack>
            </div>

            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-primary-600 to-gold-500 text-white rounded-2xl p-6 max-w-4xl mx-auto">
                <h4 className="text-2xl font-bold mb-4">Three Generations. One Wisdom. Infinite Connections.</h4>
                <p className="text-primary-100 leading-relaxed">
                  For over 50 years, the Goyal family has turned dreams into lifelong rishtas. From Shri Chaman Prakash Goyal's trust, to Shri Anil Goyal's personal care, to Moulik Goyal's AI-powered innovation — every generation carried the same belief: "Shaadi sirf do logon ka milan nahi, do parivaron ka bandhan hota hai."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact Over 50 Years</h2>
              <p className="text-xl text-gray-600">Numbers that tell our story of success</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-2">20,000+</div>
                <div className="text-lg text-gray-900 font-semibold mb-2">Happy Couples</div>
                <div className="text-gray-600">Marriages facilitated since 1975</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-2">89%</div>
                <div className="text-lg text-gray-900 font-semibold mb-2">Success Rate</div>
                <div className="text-gray-600">Of our matches lead to marriage</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-2">50,000+</div>
                <div className="text-lg text-gray-900 font-semibold mb-2">Children Born</div>
                <div className="text-gray-600">Next generation from our matches</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-2">4.8★</div>
                <div className="text-lg text-gray-900 font-semibold mb-2">Client Rating</div>
                <div className="text-gray-600">Average satisfaction score</div>
              </div>
            </div>
          </div>
        </section>



        {/* CTA Section */}
        <section className="py-20 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Be Part of Our Story?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands who have found love through 50 years of proven matchmaking expertise, 
              now enhanced with the latest AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-gold text-lg px-8 py-4 inline-flex items-center justify-center">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/webinars" className="btn-secondary bg-white text-primary-600 text-lg px-8 py-4 inline-flex items-center justify-center">
                Join Our Webinars
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
