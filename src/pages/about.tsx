import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Clock, Users, Award, ArrowRight, CheckCircle } from 'lucide-react'
import Footer from '@/components/Footer'
import BrandLogo from '@/components/BrandLogo'

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Make My Knot | Our Legacy: From 1975 to 2025</title>
        <meta name="description" content="Discover our 3-generation legacy of bringing families together since 1975. From Chaman Prakash Goyal's foundation to today's AI-powered platform - 50 years of matches made with Mannat, not just metrics." />
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
              Chaman Prakash Goyal (Visionary Founder) as a heartfelt mission to create meaningful rishtas has evolved through 
              three generations into today's AI-powered platform under Managing Director Anil Goyal and CEO Moulik Goyal, 
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
                      In 1975, <strong>Chaman Prakash Goyal</strong> laid the foundation of Goyal Marriage Bureau, planting the roots of what has become one of the most trusted matchmaking services in India. His belief was simple yet powerful: every rishta deserves honesty, care, and blessings.
                    </p>
                    <p className="text-gray-600 mb-3">
                      At a time when matchmaking was limited to biodatas and formalities, Chaman Prakash Goyal brought heart into the process. He personally met families, understood their values, and ensured that every match was built on trust and compatibility. His dedication turned countless dreams into successful marriages, earning him respect as one of India's most reliable matchmakers.
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
                        In 1975, <strong>Chaman Prakash Goyal</strong> laid the foundation of Goyal Marriage Bureau, planting the roots of what has become one of the most trusted matchmaking services in India. His belief was simple yet powerful: every rishta deserves honesty, care, and blessings.
                      </p>
                      <p className="text-gray-600 mb-3">
                        At a time when matchmaking was limited to biodatas and formalities, Chaman Prakash Goyal brought heart into the process. He personally met families, understood their values, and ensured that every match was built on trust and compatibility. His dedication turned countless dreams into successful marriages, earning him respect as one of India's most reliable matchmakers.
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
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
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

                {/* 2010 */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="text-2xl font-bold text-gray-900">2010</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">The Digital Shift</h4>
                    <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg p-4 mb-4">
                      <h5 className="font-bold text-primary-800 mb-2">Where Technology Met Heart</h5>
                    </div>
                    <p className="text-gray-600 mb-3">
                      As technology reshaped India, so did matchmaking. While many reduced rishtas to online biodata lists, <strong>Anil Goyal</strong> blended technology with human touch.
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
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Experts</h2>
              <p className="text-xl text-gray-600">Three generations of matchmaking expertise driving innovation while preserving tradition</p>
            </div>

            {/* Maulik Goyal - Featured */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/ceo.JPG"
                      alt="Maulik Goyal - Chief Executive Officer"
                      width={320}
                      height={384}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Moulik Goyal</h3>
                  <div className="text-xl text-primary-600 font-semibold mb-6">Chief Executive Officer</div>
                  <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                    As the third-generation leader of the Goyal family legacy, Moulik brings together traditional matchmaking 
                    wisdom with cutting-edge technology. Having grown up watching his father and grandfather devote their lives to matchmaking, 
                    he is now transforming our 50-year-old family business into India's most sophisticated AI-powered matchmaking platform.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                    <div>
                      <strong className="text-gray-900">Education:</strong><br />
                      MBA, IIM Ahmedabad<br />
                      B.Tech, IIT Delhi
                    </div>
                    <div>
                      <strong className="text-gray-900">Experience:</strong><br />
                      10+ years in Technology<br />
                      5+ years leading Make My Knot
                    </div>
                    <div className="md:col-span-2">
                      <strong className="text-gray-900">Expertise:</strong> AI Matchmaking, Business Strategy, Technology Innovation, Digital Transformation
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chaman Prakash Goyal & Anil Goyal - Side by Side */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Chaman Prakash Goyal */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-4xl font-bold text-gold-600">CG</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Chaman Prakash Goyal</h3>
                  <div className="text-gold-600 font-semibold mb-4">Visionary Founder</div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  The visionary founder who established Goyal Marriage Bureau in 1975. Known as "Dadu" to thousands of families, 
                  he built the foundation of trust and personal care that defines our approach to matchmaking. His philosophy of 
                  "Mannat, not just metrics" continues to guide our mission.
                </p>
                <div className="space-y-2 text-xs text-gray-600">
                  <div><strong className="text-gray-900">Legacy:</strong> Founded in 1975 | 50+ years of matchmaking</div>
                  <div><strong className="text-gray-900">Achievements:</strong> 10,000+ successful matches | Trusted by 3 generations</div>
                  <div><strong className="text-gray-900">Philosophy:</strong> "Shaadi sirf do logon ka milan nahi hota, do parivaron ka rishta hota hai"</div>
                </div>
              </div>

              {/* Anil Goyal */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-4xl font-bold text-green-600">AG</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Anil Goyal</h3>
                  <div className="text-green-600 font-semibold mb-4">Managing Director</div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  The bridge between tradition and modernity, Anil Goyal dedicated over 16 years to nurturing the family vision 
                  with deep care and emotional understanding. He ensured every rishta was handled with love and sincerity, 
                  continuing the legacy with personal attention to each family's needs.
                </p>
                <div className="space-y-2 text-xs text-gray-600">
                  <div><strong className="text-gray-900">Experience:</strong> 16+ years dedicated service | 2nd generation leader</div>
                  <div><strong className="text-gray-900">Expertise:</strong> Relationship counseling, Family dynamics, Traditional values</div>
                  <div><strong className="text-gray-900">Approach:</strong> Personal attention, Emotional understanding, Family-first mindset</div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-primary-600 to-gold-500 text-white rounded-2xl p-6 max-w-4xl mx-auto">
                <h4 className="text-2xl font-bold mb-4">Three Generations, One Vision</h4>
                <p className="text-primary-100 leading-relaxed">
                  From Dadu's foundation of trust in 1975, to Anil's dedication to personal service, to Maulik's technological innovation - 
                  each generation has contributed their unique expertise while maintaining our core philosophy of creating meaningful, 
                  lasting relationships between families.
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

        {/* Heritage Gallery Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Heritage in Pictures</h2>
              <p className="text-xl text-gray-600">Celebrating 50 years of love stories and family traditions</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Large Featured Image */}
              <div className="md:col-span-2 lg:col-span-2 relative h-80 rounded-2xl overflow-hidden shadow-lg group">
                <Image
                  src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop&auto=format"
                  alt="Traditional Indian wedding ceremony showcase"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Traditional Celebrations</h3>
                  <p className="text-sm text-gray-200">Honoring cultural values in every union</p>
                </div>
              </div>
              
              {/* Smaller Images */}
              <div className="space-y-6">
                <div className="relative h-36 rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop&auto=format"
                    alt="Happy couples celebrating"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-sm font-semibold">Happy Couples</p>
                  </div>
                </div>
                
                <div className="relative h-36 rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src="https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400&h=300&fit=crop&auto=format"
                    alt="Family gathering and blessings"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-sm font-semibold">Family Bonds</p>
                  </div>
                </div>
              </div>
              
              {/* Bottom Row */}
              <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg group">
                <Image
                  src="https://images.unsplash.com/photo-1609902726285-00668009b004?w=400&h=300&fit=crop&auto=format"
                  alt="Modern technology meets tradition"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-sm font-semibold">Tech Innovation</p>
                </div>
              </div>
              
              <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg group">
                <Image
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop&auto=format"
                  alt="Wedding planning and consultation"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-sm font-semibold">Wedding Services</p>
                </div>
              </div>
              
              <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg group">
                <Image
                  src="https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop&auto=format"
                  alt="Celebrating love across generations"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-sm font-semibold">Legacy Continues</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600">What guides us in every match we make</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Authentic Connections</h3>
                <p className="text-gray-600">
                  We believe in deep, meaningful relationships built on genuine compatibility, 
                  not superficial attractions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Over Quantity</h3>
                <p className="text-gray-600">
                  We focus on finding the right person, not just more options. 
                  Every match is carefully curated for compatibility.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Service</h3>
                <p className="text-gray-600">
                  Despite our technology, we maintain the personal touch that has made us 
                  successful for seven decades.
                </p>
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
