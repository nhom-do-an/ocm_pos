'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginFormik } from './hooks/use-login-formik';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

const LoginView: React.FC = () => {
  const { formik, showPassword, setShowPassword, generalError, handlePhoneChange } =
    useLoginFormik();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <Image
              src="/pos/omni-logo.svg"
              alt="OMNI"
              width={180}
              height={60}
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-center text-gray-800 mb-10 whitespace-nowrap">
            Đăng nhập vào cửa hàng của bạn
          </h1>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Phone Input */}
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0123456789"
                value={formik.values.phone}
                onChange={handlePhoneChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
                disabled={formik.isSubmitting}
                className="bg-blue-50 border-transparent focus:border-blue-400 focus:bg-blue-100"
              />
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && formik.errors.password
                      ? formik.errors.password
                      : undefined
                  }
                  disabled={formik.isSubmitting}
                  className="bg-blue-50 border-transparent focus:border-blue-400 focus:bg-blue-100 pr-12"
                />

              </div>
            </div>

            {/* General Error */}
            {generalError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                {generalError}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              variant="success"
              size="lg"
              className="w-full !bg-blue-500 shadow-md hover:shadow-lg cursor-pointer"
            >
              {formik.isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
