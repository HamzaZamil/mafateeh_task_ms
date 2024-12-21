import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
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
import './login.css'



function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await validationSchema.validate(formData);
      setErrors({});

      const response = await axiosInstance.post('/login', formData, {
        withCredentials: true,
      });

      console.log(response);

      if (response.data.token || response.data.user) {
        toast.success('Login successful!', { position: "top-right", autoClose: 2000 });
        sessionStorage.setItem('authToken', response.data.token || '');
        sessionStorage.setItem('user_id', response.data.user?.id || '');
        setTimeout(() => {
          navigate('/home');
        }, 3000);
      }
    } catch (validationError) {
      if (validationError.name === 'ValidationError') {
        const validationErrors = validationError.inner.reduce((acc, error) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
        setErrors(validationErrors);
      } else {
        const serverErrors = validationError.response?.data?.errors || {};
        setErrors(serverErrors);
        toast.error(
          validationError.response?.data?.message || 'Something went wrong!',
          { position: "top-right", autoClose: 5000 }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MDBContainer fluid>
      <ToastContainer />

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

              <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
              <p className="text-white-50 mb-5">Please enter your login and password!</p>

              <form onSubmit={handleSubmit} className="w-100">
                <MDBInput
                  wrapperClass='mb-4 w-100'
                  labelClass='text-white'
                  label='Email address'
                  id='formControlLg'
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
                  id='formControlLgPassword'
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  size="lg"
                />
                {errors.password && <p className="text-danger small text-center">{errors.password}</p>}

                <MDBBtn outline className='mx-2 px-5 text-white' color='white' size='lg' type="submit" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Login'}
                </MDBBtn>
              </form>

              
              <div>
                <p className="mb-0">Don't have an account? <a href="#!" className="text-white-50 fw-bold">Sign Up</a></p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
}

export default Login;
