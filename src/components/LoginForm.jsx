import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    defaultValues: {
      phone: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    const result = await login(data.phone, data.password);

    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(110,72%,79%)] flex items-center justify-center p-4 w-full rounded-lg">
      
        <div className="w-full max-w-md">
          <Card className="w-full border-0 shadow-lg">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-[#2c6e49]">Welcome Back</CardTitle>
              <CardDescription className="text-[#4c956c]">
                Sign in to your Chama account
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
                          <Input placeholder="254712345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    rules={{ required: 'Password is required' }}
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

                  <Button 
                    type="submit" 
                    className="w-full bg-[#2c6e49] hover:bg-[#1e4f34] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </Form>

              <div className="mt-4 text-center">
                <p className="text-sm text-[#4c956c]">
                  Don't have an account?{' '}
                  <a href="/register" className="text-[#2c6e49] hover:underline font-semibold">
                    Sign up
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default LoginForm;