import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from 'mdb-react-ui-kit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance, { initializeCsrfToken } from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import './login.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .required('Confirm Password is required'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      await initializeCsrfToken();

      const response = await axiosInstance.post('/register', formData);

      if (response.data.token) {
        sessionStorage.setItem('authToken', response.data.token);
        sessionStorage.setItem('user_id', response.data.user?.id || '');
        toast.success('Registered Successfully!', { position: 'top-right', autoClose: 3000 });
        setTimeout(() => navigate('/home'), 2000);
      } else {
        throw new Error('Token missing from response');
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err.response?.data?.message || 'Registration failed. Please try again.', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <MDBContainer fluid>
      <ToastContainer />
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
              <h2 className="fw-bold mb-2 text-uppercase">Sign Up</h2>
              <form onSubmit={handleSubmit} className="w-100">
                <MDBInput
                  wrapperClass='mb-4 w-100'
                  labelClass='text-white'
                  label='Name'
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  size="lg"
                />
                {errors.name && <p className="text-danger small">{errors.name}</p>}
                <MDBInput
                  wrapperClass='mb-4 w-100'
                  labelClass='text-white'
                  label='Email'
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  size="lg"
                />
                {errors.email && <p className="text-danger small">{errors.email}</p>}
                <MDBInput
                  wrapperClass='mb-4 w-100'
                  labelClass='text-white'
                  label='Password'
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  size="lg"
                />
                {errors.password && <p className="text-danger small">{errors.password}</p>}
                <MDBInput
                  wrapperClass='mb-4 w-100'
                  labelClass='text-white'
                  label='Confirm Password'
                  type='password'
                  name='password_confirmation'
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  size="lg"
                />
                {errors.password_confirmation && (
                  <p className="text-danger small">{errors.password_confirmation}</p>
                )}
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#606060',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Sign Up
                </button>
              </form>
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-white-50 fw-bold">Login</Link>
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Register;
