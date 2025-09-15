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
        <title>About Us - Make My Knot | 50 Years of Matchmaking Excellence</title>
        <meta name="description" content="Discover our 3-generation legacy of bringing families together since 1950. From traditional matchmaking to AI-powered compatibility and end-to-end wedding services, we honor trust, values, and love." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center">
                <BrandLogo size="sm" className="mr-2" />
                <span className="text-2xl font-bold text-gray-900">Make My Knot</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">How It Works</Link>
                <Link href="/webinars" className="text-gray-700 hover:text-primary-600 transition-colors">Webinars</Link>
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
              Since 1950, the Goyal family has been India's most trusted name in matchmaking. What started with 
              Chaman Prakash Goyal (Dadu) as a heartfelt mission to create meaningful rishtas has evolved through 
              three generations into today's AI-powered platform, but our commitment to "Mannat, not just metrics" 
              remains unchanged.
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
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200"></div>

              {/* Timeline items */}
              <div className="space-y-12">
                {/* 1950 */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <div className="flex justify-end mb-4">
                      <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop&auto=format"
                          alt="Traditional Indian family gathering representing 1950s matchmaking"
                          fill
                          className="object-cover sepia"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">1950</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">The Foundation</h4>
                    <p className="text-gray-600">
                      Where Matches Are Made With Mannat, Not Just Metrics
                    </p>
                    <p className="text-gray-600 mt-2">
                      It all started with <strong>Chaman Prakash Goyal (Dadu)</strong>. Back then, matchmaking wasn't just about profiles—it was about dreams, trust, and family bonds. Dadu believed that every rishta deserved care and attention, creating India's trusted path for meaningful connections.
                    </p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* 1985s */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8">
                    <div className="mb-4">
                      <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop&auto=format"
                          alt="Traditional Indian wedding celebration representing the 1980s"
                          fill
                          className="object-cover sepia"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">1985</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Second Generation</h4>
                    <p className="text-gray-600">
                      Carrying Forward a Legacy of Love. The mission was taken forward by <strong>Shri Anil Goyal</strong>, who dedicated over 16 years to nurturing this vision. With deep care, personal attention, and emotional understanding, he ensured that every rishta was handled with love and sincerity, continuing the legacy Dadu had begun.
                    </p>
                  </div>
                </div>

                {/* 1990s */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="text-2xl font-bold text-gray-900">1995</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Digital Revolution</h4>
                    <p className="text-gray-600">
                      Where Technology Meets Heart. As the world changed, so did matchmaking. While many saw just biodata, <strong>Shri Anil Goyal</strong> saw human stories. He offered guidance, intuition, and trust—combining technology with a personal touch so each connection reflected the dreams and emotions of families across India.
                    </p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* 2005 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8">
                    <h3 className="text-2xl font-bold text-gray-900">2005</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Notepad & Platform</h4>
                    <p className="text-gray-600">
                      Where Every Rishta Was a Story. Armed with handwritten diaries and heartfelt conversations, <strong>Shri Anil Goyal</strong> helped unite over 1000 couples. Guided by the belief:
                      <span className="block mt-2 italic">“Shaadi ek event nahi — ek zindagi bhar ka saath hota hai.”</span>
                      Every match was more than a profile—it was a journey of love, trust, and lifelong companionship.
                    </p>
                  </div>
                </div>

                {/* 2015 */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="text-2xl font-bold text-gray-900">2015</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Third Generation Leadership</h4>
                    <p className="text-gray-600">
                      Where Tradition Meets Innovation. <strong>Moulik Goyal</strong> joined as CEO, bringing the third generation of leadership. He blended modern technology with traditional matchmaking wisdom, expanding services internationally to support the NRI community.
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
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Tech-Powered Matchmaking & Weddings</h4>
                    <p className="text-gray-600 mb-4">
                      Heritage Meets Innovation. Today, the legacy of three generations continues as a technology-powered matchmaking platform. We help families create lasting relationships and meaningful connections—now with end-to-end wedding services.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                      <div className="flex items-center"><CheckCircle className="h-4 w-4 text-primary-600 mr-2" /> Anchors & Emcees</div>
                      <div className="flex items-center"><CheckCircle className="h-4 w-4 text-primary-600 mr-2" /> Caterers</div>
                      <div className="flex items-center"><CheckCircle className="h-4 w-4 text-primary-600 mr-2" /> Decorators</div>
                      <div className="flex items-center"><CheckCircle className="h-4 w-4 text-primary-600 mr-2" /> Photographers</div>
                      <div className="flex items-center"><CheckCircle className="h-4 w-4 text-primary-600 mr-2" /> Event Management</div>
                      <div className="flex items-center"><CheckCircle className="h-4 w-4 text-primary-600 mr-2" /> Singers & Performers</div>
                    </div>
                    <p className="text-gray-600 mt-4">
                      From matchmaking to wedding celebrations, we make sure every journey honors trust, family values, and love stories—just as it has for over 50 years.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership</h2>
              <p className="text-xl text-gray-600">Third generation leadership driving innovation while preserving tradition</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <div className="text-6xl font-bold text-primary-600">MG</div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Moulik Goyal</h3>
                  <div className="text-lg text-primary-600 font-semibold mb-4">Chief Executive Officer</div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    As the third-generation leader of the Goel family legacy, Maulik brings together traditional matchmaking 
                    wisdom with cutting-edge technology. Armed with an MBA from IIM Ahmedabad and a passion for innovation, 
                    he has transformed our 50-year-old family business into India's most sophisticated AI-powered matchmaking platform.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
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
                  </div>
                </div>
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
                <div className="text-gray-600">Marriages facilitated since 1950</div>
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
              Join thousands who have found love through 75 years of proven matchmaking expertise, 
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
