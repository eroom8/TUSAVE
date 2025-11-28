import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const { register } = useAuth();
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

  return (
    <div className="min-h-screen w-full bg-[hsl(110,72%,79%)] flex items-center justify-center p-4 rounded-lg">
      <div className="flex items-center justify-center p-4 w-full min-h-screen">
        <div className="w-full max-w-md">
          <Card className="w-full border-0 shadow-lg">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-[#2c6e49]">Join Our Chama</CardTitle>
              <CardDescription className="text-[#4c956c]">
                Create your account to start managing your savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: 'Full name is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#1e4f34]">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
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
                        <FormLabel className="text-[#1e4f34]">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="254706361004" {...field} />
                        </FormControl>
                        <FormMessage />
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
                        <FormLabel className="text-[#1e4f34]">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    rules={{ required: 'Please confirm your password' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#1e4f34]">Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-[#2c6e49] hover:bg-[#1e4f34] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </Form>

              <div className="mt-4 text-center">
                <p className="text-sm text-[#4c956c]">
                  Already have an account?{' '}
                  <a href="/login" className="text-[#2c6e49] hover:underline font-semibold">
                    Sign in
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;