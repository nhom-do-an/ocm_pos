'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api/auth-api';
import { useAuthStore } from '@/store/auth-store';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPhone } = useAuthStore();
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validate phone number (10 digits)
  const validatePhone = (value: string): string | undefined => {
    if (!value) return 'Vui lòng nhập số điện thoại';
    if (!/^0\d{9}$/.test(value)) return 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';
    return undefined;
  };

  // Validate password (8-20 chars, at least 1 letter and 1 number)
  const validatePassword = (value: string): string | undefined => {
    if (!value) return 'Vui lòng nhập mật khẩu';
    if (value.length < 8 || value.length > 20) return 'Mật khẩu phải có 8-20 ký tự';
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) return 'Mật khẩu phải có ít nhất 1 chữ cái và 1 chữ số';
    return undefined;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    if (errors.phone) {
      setErrors({ ...errors, phone: undefined });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const phoneError = validatePhone(phone);
    const passwordError = validatePassword(password);
    
    if (phoneError || passwordError) {
      setErrors({ phone: phoneError, password: passwordError });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const success = await loginWithPhone(phone, password);
      
      if (success) {
        // Redirect to POS page
        router.push('/pos');
      } else {
        setErrors({ general: 'Số điện thoại hoặc mật khẩu không đúng' });
      }
    } catch (error: any) {
      setErrors({ 
        general: error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Close button (optional) */}
        <button
          onClick={() => router.push('/pos')}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all shadow-sm"
        >
          ✕
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/omni-logo.svg" 
              alt="OMNI" 
              width={180} 
              height={60}
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8 whitespace-nowrap">
            Đăng nhập vào cửa hàng của bạn
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone Input */}
            <div>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Số điện thoại"
                className={`w-full px-4 py-3 bg-blue-50 border-2 ${
                  errors.phone ? 'border-red-400' : 'border-transparent'
                } rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-blue-100 transition-all`}
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 ml-1">{errors.phone}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Mật khẩu"
                  className={`w-full px-4 py-3 bg-blue-50 border-2 ${
                    errors.password ? 'border-red-400' : 'border-transparent'
                  } rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-blue-100 transition-all pr-12`}
                  disabled={isLoading}
                  style={{
                    // Hide browser's default password reveal button
                    WebkitTextSecurity: showPassword ? 'none' : undefined,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Quên mật khẩu
              </button>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                {errors.general}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-98"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 mb-4">Hoặc đăng nhập với</p>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-lg transition-all shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2025 OMNI POS System
        </p>
      </div>
    </div>
  );
}

