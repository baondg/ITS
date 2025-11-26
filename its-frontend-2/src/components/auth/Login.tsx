import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { BookOpen } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface LoginProps {
    onLogin: (userData: {
      firstName: string;
      lastName: string;
      email: string;
      role: 'STUDENT' | 'INSTRUCTOR';
      token: string;
    }) => void;
  onNavigateToRegister: () => void;
}

export default function Login({ onLogin, onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      try {
        const res = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          if (res.status === 400) {
            setErrorMessage("Wrong email or password");
          } else {
            const data = await res.json();
            setErrorMessage(data.message || "Something went wrong. Please try again.");
          }
          return;
        }

        const data = await res.json();
        console.log("LOGIN RESPONSE DATA:", data);
        onLogin({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          role: data.user.role,
          token: data.accessToken,
        });
        setErrorMessage(null);
      } catch (err) {
          setErrorMessage("Something went wrong. Please try again.");
          //alert("Login failed: " + err);
      }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration/Gradient */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMTIgMTJjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

        <div className="relative z-10 max-w-md text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-white">ITS</span>
          </div>

          <h1 className="text-white mb-4">
            Welcome to Intelligent Tutoring System
          </h1>
          <p className="text-blue-100 mb-8">
            Empowering learning through intelligent, personalized education. Join thousands of students and instructors transforming the way they teach and learn.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-white mb-1">Interactive</p>
              <p className="text-blue-100">Engaging content</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-white mb-1">Personalized</p>
              <p className="text-blue-100">Adaptive learning</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
              <h2 className="text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue your learning journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}

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
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                Log In
              </Button>
            </form>

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

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={onNavigateToRegister}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
