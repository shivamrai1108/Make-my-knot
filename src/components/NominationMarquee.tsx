import { useState } from 'react'
import { Heart, ArrowRight, X, User, Mail, Phone, MessageCircle } from 'lucide-react'

export default function NominationMarquee() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    nominatorName: '',
    nominatorEmail: '',
    nominatorPhone: '',
    nomineeName: '',
    nomineeEmail: '',
    nomineePhone: '',
    relationship: '',
    reason: '',
    nomineeKnows: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create nomination object
      const nomination = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'new',
        submittedAt: new Date().toISOString(),
        contacted: false,
        notes: ''
      }
      
      // Save to localStorage (will be replaced with API later)
      const existingNominations = JSON.parse(localStorage.getItem('makemyknot_nominations') || '[]')
      existingNominations.push(nomination)
      localStorage.setItem('makemyknot_nominations', JSON.stringify(existingNominations))
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSubmitting(false)
      setSubmitted(true)
      
      // Reset form after showing success
      setTimeout(() => {
        setShowModal(false)
        setSubmitted(false)
        setFormData({
          nominatorName: '',
          nominatorEmail: '',
          nominatorPhone: '',
          nomineeName: '',
          nomineeEmail: '',
          nomineePhone: '',
          relationship: '',
          reason: '',
          nomineeKnows: false
        })
      }, 2000)
    } catch (error) {
      console.error('Error submitting nomination:', error)
      setIsSubmitting(false)
      alert('Error submitting nomination. Please try again.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <>
      {/* Marquee Section */}
      <section className="bg-black text-white py-4 overflow-hidden relative">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          <div className="flex items-center space-x-8 mr-16">
            <span className="text-lg font-medium">
              ✨ Know someone who is a total catch?
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 whitespace-nowrap"
            >
              <Heart className="w-4 h-4" />
              <span>Nominate Them</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Duplicate content for seamless loop */}
          <div className="flex items-center space-x-8 mr-16">
            <span className="text-lg font-medium">
              ✨ Know someone who is a total catch?
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 whitespace-nowrap"
            >
              <Heart className="w-4 h-4" />
              <span>Nominate Them</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-8 mr-16">
            <span className="text-lg font-medium">
              ✨ Know someone who is a total catch?
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 whitespace-nowrap"
            >
              <Heart className="w-4 h-4" />
              <span>Nominate Them</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CSS Animation */}
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-33.333%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}</style>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {submitted ? (
              /* Success State */
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Nomination Submitted!</h2>
                <p className="text-gray-600 mb-4">
                  Thank you for thinking of someone special. We'll reach out to them about joining Make My Knot!
                </p>
                <div className="text-sm text-gray-500">
                  This window will close automatically...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Nominate a Friend</h2>
                    <p className="text-gray-600 mt-1">Help someone special find their perfect match</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Your Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary-600" />
                      Your Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                        <input
                          type="text"
                          name="nominatorName"
                          value={formData.nominatorName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Email *</label>
                        <input
                          type="email"
                          name="nominatorEmail"
                          value={formData.nominatorEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone (Optional)</label>
                        <input
                          type="tel"
                          name="nominatorPhone"
                          value={formData.nominatorPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nominee Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-primary-600" />
                      Person You're Nominating
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Their Name *</label>
                        <input
                          type="text"
                          name="nomineeName"
                          value={formData.nomineeName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="Enter their full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Their Email *</label>
                        <input
                          type="email"
                          name="nomineeEmail"
                          value={formData.nomineeEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="their.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Their Phone (Optional)</label>
                        <input
                          type="tel"
                          name="nomineePhone"
                          value={formData.nomineePhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Relationship *</label>
                        <select
                          name="relationship"
                          value={formData.relationship}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white"
                        >
                          <option value="">Select relationship</option>
                          <option value="friend">Friend</option>
                          <option value="colleague">Colleague</option>
                          <option value="family">Family Member</option>
                          <option value="acquaintance">Acquaintance</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2 text-primary-600" />
                      Tell Us More
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Why do you think they'd be great for Make My Knot? *
                        </label>
                        <textarea
                          name="reason"
                          value={formData.reason}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="Tell us about their personality, what makes them special, what they're looking for..."
                        />
                      </div>

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          name="nomineeKnows"
                          checked={formData.nomineeKnows}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label className="ml-3 text-sm text-gray-700">
                          <span className="font-medium">They know about this nomination</span>
                          <br />
                          <span className="text-gray-500">I've told them I'm nominating them for Make My Knot</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <strong>Privacy Note:</strong> We'll reach out to your nominee with a personalized invitation mentioning your recommendation. 
                      We won't share their information with anyone else or add them to marketing lists without their consent.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        Submit Nomination
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
