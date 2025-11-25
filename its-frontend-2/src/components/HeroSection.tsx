import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  variant: 'student' | 'instructor';
  userName: string;
  onButtonClick: () => void;
}

export function HeroSection({ variant, userName, onButtonClick }: HeroSectionProps) {
  const isStudent = variant === 'student';

  const heading = 'Welcome to Intelligent Tutoring System';
  const subtitle = isStudent 
    ? `Hello, ${userName}! You're logged in as a student.`
    : `Hello, ${userName}! You're logged in as an instructor.`;
  const description = isStudent
    ? 'Start exploring personalized learning paths, track your progress, and grow your skills at your own pace.'
    : 'Create engaging learning materials, manage your content library, and empower students with personalized educational experiences.';
  const buttonText = isStudent
    ? 'Go to Content'
    : 'Manage Learning Content';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Side - Text Content */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-gray-900">
                    {heading}
                  </h1>
                  <p className="text-gray-600">
                    {subtitle}
                  </p>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {description}
                </p>

                <div className="pt-4">
                  <Button
                    onClick={onButtonClick}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all group"
                  >
                    {buttonText}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="relative bg-gradient-to-br from-blue-100 to-teal-100 order-1 lg:order-2 min-h-[300px] lg:min-h-[500px]">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1673515335586-f9f662c01482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGVkdWNhdGlvbiUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjQwNTU3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Learning illustration"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-8 right-8 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-12 left-12 w-32 h-32 bg-teal-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Optional Feature Cards Below Hero */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-gray-900 mb-2">Rich Content</h3>
            <p className="text-gray-600">Access diverse learning materials including text, videos, and interactive exercises.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your learning journey with detailed analytics and personalized insights.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600">Experience intelligent tutoring that adapts to your unique learning style and pace.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
