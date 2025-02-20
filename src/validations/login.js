import * as yup from 'yup';

const loginSchema = yup.object().shape({
  username: yup.string('Enter Username').required('Userame is required'),

  password: yup
    .string('Enter your password')
    .required('Password is required')
    .min(8, 'Password is too short - should be 8 chars minimum')
});

export default loginSchema;