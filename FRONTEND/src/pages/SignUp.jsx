import React from 'react'
import { SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Paramount Nursing Home</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Sign Up Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">
                Join us to book appointments and manage your healthcare
              </p>
            </div>

            <SignUp 
              routing="path" 
              path="/sign-up"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-4 py-3 text-sm font-medium",
                  socialButtonsBlockButtonText: "text-gray-700",
                  dividerLine: "bg-gray-300",
                  dividerText: "text-gray-500 text-sm",
                  formButtonPrimary: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200",
                  formFieldInput: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200",
                  formFieldLabel: "text-sm font-medium text-gray-700 mb-2 block",
                  footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                  footerActionText: "text-gray-600"
                }
              }}
            />
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact us at{' '}
              <a href="mailto:support@paramountnursing.com" className="text-blue-600 hover:text-blue-700 font-medium">
                support@paramountnursing.com
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-2 flex items-center justify-center">
              Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> for better healthcare
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
