import * as yup from 'yup';

const namePattern = /^[a-zA-Z,'"-.]+$/;

const registerSchema = (no_pass = false) =>
  yup.object().shape({
    first_name: yup
      .string('Enter your first name')
      .matches(namePattern, 'First name is not valid')
      .required('First name is required')
      .max(50, 'First name is too long - should be 50 chars maximum'),

    last_name: yup
      .string('Enter your last name')
      .matches(namePattern, 'Last name is not valid')
      .required('Last name is required')
      .max(50, 'Last name is too long - should be 50 chars maximum'),

    email: yup
      .string('Enter your email')
      .email('Email is not valid')
      .required('Email is required')
      .matches(/^[a-zA-Z0-9.@_-]+$/),

    username: yup.string('Enter Username').required('Userame is required'),
    password: no_pass
      ? yup.string()
      : yup
          .string('Enter your password')
          .required('Password is required')
          .min(8, 'Password is too short - should be 8 chars minimum'),

    confirm_password: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
  });

export default registerSchema;
