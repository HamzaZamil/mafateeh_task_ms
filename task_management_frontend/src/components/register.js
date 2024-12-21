import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance, { initializeCsrfToken } from '../api/axiosInstance';
import { useNavigate, Link } from "react-router-dom";
import * as Yup from 'yup';
import './login.css'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

      toast.success('Registered Successfully!', { position: "top-right", autoClose: 3000 });
      sessionStorage.setItem('authToken', response.data.token || '');
      sessionStorage.setItem('user_id', response.data.user?.id || '');
      setTimeout(() => navigate('/home'), 3000);
    } catch (err) {
      if (err.name === 'ValidationError') {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        const serverErrors = err.response?.data?.errors || {};
        const errorMessages = Object.values(serverErrors).flat().join(' ');
        setErrors(serverErrors);
        toast.error(errorMessages, { position: "top-right", autoClose: 5000 });
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
              <p className="text-white-50 mb-5">Please fill in the details to create your account!</p>

              <form onSubmit={handleSubmit} className='w-100'>
                <MDBInput
                  wrapperClass='mb-4 w-100'
                  labelClass='text-white'
                  label='Name'
                  id='nameInput'
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  size="lg"
                />
                {errors.name && <p className="text-danger small text-center">{errors.name}</p>}

                <MDBInput
                  wrapperClass='mb-4 w-100'
                  labelClass='text-white'
                  label='Email'
                  id='emailInput'
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  size="lg"
                />
                {errors.email && <p className="text-danger small text-center">{errors.email}</p>}

                <MDBInput
                  wrapperClass='mb-4 w-100'
                  labelClass='text-white'
                  label='Password'
                  id='passwordInput'
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  size="lg"
                />
                {errors.password && <p className="text-danger small text-center">{errors.password}</p>}

                <MDBInput
                  wrapperClass='mb-4 w-100'
                  labelClass='text-white'
                  label='Confirm Password'
                  id='passwordConfirmInput'
                  type='password'
                  name='password_confirmation'
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  size="lg"
                />
                {errors.password_confirmation && <p className="text-danger small text-center">{errors.password_confirmation}</p>}

                <button
  type="submit"
  style={{
    backgroundColor: '#606060',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px 0',
    transition: 'background-color 0.3s ease',
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = '#a4a8ac')}
  onMouseOut={(e) => (e.target.style.backgroundColor = '#606060')}
>
  Sign Up
</button>

                <p>
        Already have an account?{' '}
        <Link to="/login" className="text-white-50 fw-bold">Login</Link>
      </p>
              </form>

                

            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
}

export default Register;
