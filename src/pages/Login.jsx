import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import backgroundImage from '../assets/COVER_IMAGE.jfif';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3005/users/Login', { email, password })
      .then(result => {
        if (result.data.message === 'Login successful') {
          localStorage.setItem('userId', result.data.user.id);
          localStorage.setItem('role', result.data.user.role);
          const role = result.data.user.role;
          if (role === 'admin') {
            navigate('/Home');
          } else {
            navigate(`/UserDashboard/${result.data.user.id}`);
          }
        } else {
          setError(result.data.message);
        }
      })
      .catch(err => {
        console.log(err);
        setError('Invalid Credentials');
      });
  };

  return (
    <div className='text-white h-[100vh] flex justify-center items-center bg-cover' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className='bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative'>
        <div className='text-orange-700'>{error}</div>
        <h1 className='text-4xl text-white font-bold text-center mb-6'>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className='relative my-4'>
            <input type='email' id='email' className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder='' onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor='email' className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Your Email</label>
          </div>
          <div className='relative my-4'>
            <input type='password' id='password' className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder='' onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor='password' className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Your Password</label>
          </div>
          <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
              <Checkbox className='peer' />
              <label>Accept Terms & Conditions</label>
            </div>
          </div>
          <button className='w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-black hover:bg-orange-500 hover:text-white py-2 transition-colors duration-300' type='submit'>Login</button>
          <div>
            <span className='m-4'>New Here? <Link className='text-orange-500' to='/Register'>Create an Account</Link></span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
