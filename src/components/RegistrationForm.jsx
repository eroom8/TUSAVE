import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

// Logo Component (same as above)
const ChamaProLogo = ({ size = "lg", className = "" }) => {
  const { theme } = useTheme();
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  return (
    <div className={`${sizes[size]} ${className} relative`}>
      <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
        <div className="transform -rotate-12 text-white font-bold text-center">
          {size === 'sm' && <span className="text-xs">CP</span>}
          {size === 'md' && <span className="text-sm">CP</span>}
          {size === 'lg' && <span className="text-xl">CP</span>}
          {size === 'xl' && <span className="text-2xl">CP</span>}
        </div>
      </div>
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur opacity-30"></div>
    </div>
  );
};

// Enhanced Registration Form with Dark Mode
const RegistrationForm = () => {
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await register({
      name: data.name,
      phone: data.phone,
      password: data.password
    });

    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  // Dynamic styles based on theme
  const backgroundGradient = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900'
    : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50';

  const cardBackground = theme === 'dark' 
    ? 'bg-gray-800/80 border-gray-700'
    : 'bg-white/80 border-emerald-200';

  const benefitsBackground = theme === 'dark'
    ? 'bg-gray-800/50 border-gray-700'
    : 'bg-white/50 border-emerald-200';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const descriptionColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const inputBorder = theme === 'dark' ? 'border-gray-600 focus:border-emerald-500' : 'border-emerald-300 focus:border-emerald-500';
  const benefitBg = theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-100';
  const benefitText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`min-h-screen w-full ${backgroundGradient} flex items-center justify-center p-4 transition-colors duration-300`}>
      <div className="w-full max-w-md">

        {/* Theme Toggle positioned at top right */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ChamaProLogo size="xl" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent mb-2">
            ChamaPro
          </h1>
          <p className={`${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'} text-lg`}>
            Join Smart Chama Management
          </p>
        </div>

        <Card className={`w-full shadow-xl backdrop-blur-sm ${cardBackground}`}>
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className={`text-2xl font-bold ${textColor}`}>Join Our Chama</CardTitle>
            <CardDescription className={descriptionColor}>
              Create your account to start managing your savings
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            {error && (
              <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                theme === 'dark' ? 'bg-red-900/50 border border-red-800' : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  theme === 'dark' ? 'bg-red-800' : 'bg-red-100'
                }`}>
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-500 text-sm flex-1">{error}</p>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: 'Full name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`font-medium ${textColor}`}>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="John Doe" 
                            {...field} 
                            className={`pl-12 ${inputBorder} ${
                              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                            }`}
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  rules={{ 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^254\d{9}$/,
                      message: 'Phone must be in format 254XXXXXXXXX'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`font-medium ${textColor}`}>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="254712345678" 
                            {...field} 
                            className={`pl-12 ${inputBorder} ${
                              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                            }`}
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{ 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`font-medium ${textColor}`}>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            className={`pl-12 ${inputBorder} ${
                              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                            }`}
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  rules={{ required: 'Please confirm your password' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`font-medium ${textColor}`}>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            className={`pl-12 ${inputBorder} ${
                              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                            }`}
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2 text-sm">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className={`w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 ${
                      theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-emerald-300'
                    }`} 
                    required
                  />
                  <label htmlFor="terms" className={`${descriptionColor} cursor-pointer`}>
                    I agree to the{' '}
                    <a href="#" className="text-emerald-500 hover:text-emerald-400 font-medium hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-emerald-500 hover:text-emerald-400 font-medium hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 text-lg font-medium shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-200 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Your Account'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className={descriptionColor}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-emerald-500 hover:text-emerald-400 font-semibold hover:underline transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className={`mt-8 backdrop-blur-sm rounded-xl p-6 border ${benefitsBackground}`}>
          <h3 className={`font-semibold mb-4 text-center ${textColor}`}>Why Join ChamaPro?</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 ${benefitBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-emerald-500 text-xs">✓</span>
              </div>
              <span className={benefitText}>Secure Savings</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 ${benefitBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-emerald-500 text-xs">✓</span>
              </div>
              <span className={benefitText}>Easy Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 ${benefitBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-emerald-500 text-xs">✓</span>
              </div>
              <span className={benefitText}>Mobile Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 ${benefitBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-emerald-500 text-xs">✓</span>
              </div>
              <span className={benefitText}>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;