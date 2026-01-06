import * as Yup from 'yup';

export interface LoginFormValues {
  phone: string;
  password: string;
}

export const loginSchema = Yup.object().shape({
  phone: Yup.string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^0\d{9}$/, 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(20, 'Mật khẩu không được quá 20 ký tự')
    .matches(
      /(?=.*[a-zA-Z])(?=.*\d)/,
      'Mật khẩu phải có ít nhất 1 chữ cái và 1 chữ số'
    ),
});

export const initialValues: LoginFormValues = {
  phone: '',
  password: '',
};
