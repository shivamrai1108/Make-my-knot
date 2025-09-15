import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Heart, Shield, Eye, EyeOff, ArrowRight } from 'lucide-react'

// Mock admin credentials - in production, this would be handled by secure authentication
const ADMIN_CREDENTIALS = {
  email: 'admin@makemyknot.com',
  password: 'admin123'
}

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simple authentication check - in production, this would be a secure API call
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Set admin session
      localStorage.setItem('admin_authenticated', 'true')
      localStorage.setItem('admin_login_time', new Date().toISOString())
      router.push('/admin/dashboard')
    } else {
      setError('Invalid email or password')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <Head>
        <title>Admin Login - Make My Knot</title>
        <meta name="description" content="Admin login for Make My Knot dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mr-3 p-2">
                <Image
                  src="/images/logo.png"
                  alt="Make My Knot Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <Shield className="h-12 w-12 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400">Make My Knot Administrative Dashboard</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="admin@makemyknot.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm pr-12"
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Sign In to Admin
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Demo Credentials:</h4>
              <div className="text-xs text-slate-400 space-y-1">
                <p>Email: admin@makemyknot.com</p>
                <p>Password: admin123</p>
              </div>
            </div>
          </div>

          {/* Back to Site */}
          <div className="text-center">
            <Link href="/" className="text-slate-400 hover:text-slate-300 text-sm flex items-center justify-center">
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Make My Knot Logo"
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </div>
              Back to Make My Knot
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
