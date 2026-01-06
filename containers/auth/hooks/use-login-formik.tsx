'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { useAuthStore } from '@/store/auth-store';
import { loginSchema, initialValues, type LoginFormValues } from '../login-schema';

export const useLoginFormik = () => {
  const router = useRouter();
  const { loginWithPhone } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setGeneralError('');

      try {
        const success = await loginWithPhone(values.phone, values.password);

        if (success) {
          // Redirect to POS page
          router.push('/pos');
        } else {
          setGeneralError('Số điện thoại hoặc mật khẩu không đúng');
        }
      } catch (error: any) {
        setGeneralError(
          error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Format phone number input to only allow digits and max 10 characters
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    formik.setFieldValue('phone', value);
  };

  return {
    formik,
    showPassword,
    setShowPassword,
    generalError,
    handlePhoneChange,
  };
};
