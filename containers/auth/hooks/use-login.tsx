'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export const useLogin = () => {
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

  return {
    phone,
    password,
    showPassword,
    errors,
    isLoading,
    setShowPassword,
    handlePhoneChange,
    handlePasswordChange,
    handleSubmit,
    router,
  };
};
