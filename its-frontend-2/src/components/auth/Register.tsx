import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { BookOpen } from 'lucide-react';

interface RegisterProps {
  onRegister: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    role: 'STUDENT' | 'INSTRUCTOR';
  }) => void;
  onNavigateToLogin: () => void;
}

export default function Register({ onRegister, onNavigateToLogin }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

      // 1. Check firstName và lastName chỉ chữ
      const nameRegex = /^[A-Za-z]+$/;
      if (!nameRegex.test(firstName)) {
        setErrorMessage('First Name can only contain letters.');
        return;
      }
      if (!nameRegex.test(lastName)) {
        setErrorMessage('Last Name can only contain letters.');
        return;
      }
      // 1. Check email hợp lệ
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      // 2. Check password length
      if (password.length < 6 || password.length > 40) {
        setErrorMessage('Password must be between 6 and 40 characters.');
        return;
      }
      // 3. Check confirm password
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match!');
        return;
      }

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, firstName, lastName }),
      });

    if (!res.ok) {
      if (res.status === 400) {
        setErrorMessage('Email already exists.');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
      return;
    }

      const data = await res.json();

      // Lấy user object từ data.user
      onRegister({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
      });

    } catch (err) {
      console.error(err);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration/Gradient */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-teal-500 via-blue-600 to-blue-500 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMTIgMTJjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative z-10 max-w-md text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-white">ITS</span>
          </div>
          
          <h1 className="text-white mb-4">
            Start Your Learning Journey
          </h1>
          <p className="text-blue-100 mb-8">
            Create your account and unlock access to personalized learning experiences designed to help you succeed.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <p className="text-white">Access quality content</p>
                <p className="text-blue-100">Learn from expert instructors</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <p className="text-white">Track your progress</p>
                <p className="text-blue-100">Monitor learning achievements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <p className="text-white">Interactive exercises</p>
                <p className="text-blue-100">Practice with engaging content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-900">ITS</span>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join our learning community today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>I want to register as...</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('STUDENT')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      role === 'STUDENT'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('INSTRUCTOR')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      role === 'INSTRUCTOR'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Instructor
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                Create Account
              </Button>
              {errorMessage && (
                <div
                  style={{
                    marginTop: "1em",
                    color: "red",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {errorMessage}
                </div>
              )}
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={onNavigateToLogin}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Log in here
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
