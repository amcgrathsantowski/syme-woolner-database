import * as yup from 'yup';

const resetPasswordSchema = yup.object().shape({
  password: yup
    .string('Enter your password')
    .required('Password is required')
    .min(8, 'Password is too short - should be 8 chars minimum'),

  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export default resetPasswordSchema;
