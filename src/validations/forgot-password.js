import * as yup from 'yup';

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string('Enter your email')
    .email('Email is not valid')
    .required('Email is required')
    .matches(/^[a-zA-Z0-9.@_-]+$/)
});

export default forgotPasswordSchema;
