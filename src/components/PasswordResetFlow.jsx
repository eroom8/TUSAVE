// components/PasswordResetFlow.jsx
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
import ChamaProLogo from './ChamaProLogo';

const PasswordResetFlow = () => {
  const { requestPasswordReset, verifyResetCode, resetPassword } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Request, 2: Verify, 3: Reset
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phone, setPhone] = useState('');
  const [resetCode, setResetCode] = useState('');

  const requestForm = useForm({
    defaultValues: { phone: '' }
  });

  const verifyForm = useForm({
    defaultValues: { code: '' }
  });

  const resetForm = useForm({
    defaultValues: { 
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Step 1: Request Reset
  const handleRequestReset = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    const result = await requestPasswordReset(data.phone);
    
    setIsLoading(false);
    
    if (result.success) {
      setPhone(data.phone);
      setSuccess(result.message);
      setStep(2);
    } else {
      setError(result.message);
    }
  };

  // Step 2: Verify Code
  const handleVerifyCode = async (data) => {
    setIsLoading(true);
    setError('');
    
    const result = await verifyResetCode(phone, data.code);
    
    setIsLoading(false);
    
    if (result.success) {
      setResetCode(data.code);
      setSuccess(result.message);
      setStep(3);
    } else {
      setError(result.message);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      resetForm.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    setIsLoading(true);
    setError('');
    
    const result = await resetPassword(phone, resetCode, data.newPassword);
    
    setIsLoading(false);
    
    if (result.success) {
      setSuccess(result.message);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(result.message);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
      setSuccess('');
    } else {
      navigate('/login');
    }
  };

  // Dynamic styles
  const backgroundGradient = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900'
    : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50';

  const cardBackground = theme === 'dark' 
    ? 'bg-gray-800/80 border-gray-700'
    : 'bg-white/80 border-emerald-200';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const descriptionColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const inputBorder = theme === 'dark' ? 'border-gray-600 focus:border-emerald-500' : 'border-emerald-300 focus:border-emerald-500';

  return (
    <div className={`min-h-screen w-full ${backgroundGradient} flex items-center justify-center p-4 transition-colors duration-300`}>
      <div className="w-full max-w-md">
        
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
            Reset Your Password
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((stepNum) => (
            <React.Fragment key={stepNum}>
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${step >= stepNum ? 'bg-emerald-500 text-white' : 
                    theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-emerald-100 text-gray-400'}
                  font-semibold
                `}>
                  {step > stepNum ? '✓' : stepNum}
                </div>
                <div className={`mt-2 text-xs ${step >= stepNum ? 'text-emerald-500 font-medium' : descriptionColor}`}>
                  {stepNum === 1 && 'Request'}
                  {stepNum === 2 && 'Verify'}
                  {stepNum === 3 && 'Reset'}
                </div>
              </div>
              {stepNum < 3 && (
                <div className={`flex-1 h-1 mx-2 ${step > stepNum ? 'bg-emerald-500' : 
                  theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card className={`w-full shadow-xl backdrop-blur-sm ${cardBackground}`}>
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className={`text-2xl font-bold ${textColor}`}>
              {step === 1 && 'Reset Password'}
              {step === 2 && 'Verify Code'}
              {step === 3 && 'New Password'}
            </CardTitle>
            <CardDescription className={descriptionColor}>
              {step === 1 && 'Enter your phone number to receive a reset code'}
              {step === 2 && 'Enter the 6-digit code sent to your phone'}
              {step === 3 && 'Create a new password for your account'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8">
            {/* Error Message */}
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

            {/* Success Message */}
            {success && (
              <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                theme === 'dark' ? 'bg-emerald-900/50 border border-emerald-800' : 'bg-emerald-50 border border-emerald-200'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  theme === 'dark' ? 'bg-emerald-800' : 'bg-emerald-100'
                }`}>
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-emerald-500 text-sm flex-1">{success}</p>
              </div>
            )}

            {/* Step 1: Request Reset */}
            {step === 1 && (
              <Form {...requestForm}>
                <form onSubmit={requestForm.handleSubmit(handleRequestReset)} className="space-y-6">
                  <FormField
                    control={requestForm.control}
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

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      className="flex-1 border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                    >
                      Back to Login
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Code'}
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {/* Step 2: Verify Code */}
            {step === 2 && (
              <Form {...verifyForm}>
                <form onSubmit={verifyForm.handleSubmit(handleVerifyCode)} className="space-y-6">
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-50'} mb-4`}>
                    <p className={`text-sm ${descriptionColor} text-center`}>
                      A 6-digit code has been sent to <span className="font-semibold text-emerald-500">{phone}</span>
                    </p>
                  </div>

                  <FormField
                    control={verifyForm.control}
                    name="code"
                    rules={{ 
                      required: 'Verification code is required',
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'Code must be 6 digits'
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`font-medium ${textColor}`}>Verification Code</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="123456" 
                              {...field} 
                              maxLength={6}
                              className={`text-center text-2xl tracking-widest ${inputBorder} ${
                                theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                              }`}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="text-center">
                    <button 
                      type="button"
                      className="text-sm text-emerald-500 hover:text-emerald-400 font-medium hover:underline transition-colors"
                      onClick={() => handleRequestReset({ phone })}
                      disabled={isLoading}
                    >
                      Resend Code
                    </button>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      className="flex-1 border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Verifying...' : 'Verify Code'}
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-6">
                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    rules={{ 
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`font-medium ${textColor}`}>New Password</FormLabel>
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
                    control={resetForm.control}
                    name="confirmPassword"
                    rules={{ required: 'Please confirm your new password' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`font-medium ${textColor}`}>Confirm New Password</FormLabel>
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

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      className="flex-1 border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className={descriptionColor}>
                Remember your password?{' '}
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
      </div>
    </div>
  );
};

export default PasswordResetFlow;