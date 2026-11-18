import React, { useState } from 'react';

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    if (handleLogin) {
      const isSuccess = handleLogin(email.trim(), password.trim());
      if (isSuccess === false) {
        setErrorMessage('Invalid credentials. Please verify your email and password.');
        return;
      }
    }
    setEmail('');
    setPassword('');
    setErrorMessage('');
  };

  const fillCredentials = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMessage('');
  };

  return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0d0d11] p-4 text-white'>
      <div className='w-full max-w-md bg-[#181820] border border-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-sm'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20'>
            <svg
              className='w-7 h-7'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
          </div>
          <h1 className='text-3xl font-extrabold tracking-tight'>Sign In</h1>
          <p className='text-sm text-gray-400 mt-1'>
            Welcome to the Employee Management System
          </p>
        </div>

        {errorMessage && (
          <div className='mb-6 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium text-center'>
            {errorMessage}
          </div>
        )}

        <form onSubmit={submitHandler} className='flex flex-col gap-5'>
          <div>
            <label className='block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2'>
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full bg-[#20202c] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-500 py-3 px-4 rounded-xl outline-none text-sm transition-all'
              type='email'
              placeholder='Enter your email'
              required
            />
          </div>

          <div>
            <label className='block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2'>
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full bg-[#20202c] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-500 py-3 px-4 rounded-xl outline-none text-sm transition-all'
              type='password'
              placeholder='Enter your password'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all text-white font-semibold py-3 px-4 rounded-xl shadow-lg cursor-pointer text-sm tracking-wide'
          >
            Log In
          </button>
        </form>

        <div className='mt-8 pt-6 border-t border-gray-800 text-center'>
          <p className='text-xs font-medium text-gray-400 mb-3'>
            Quick Demo Login (Click to populate):
          </p>
          <div className='flex gap-2 justify-center'>
            <button
              type='button'
              onClick={() => fillCredentials('admin@example.com', '123')}
              className='text-xs bg-gray-800/80 hover:bg-gray-700 text-gray-200 py-1.5 px-3 rounded-lg border border-gray-700 transition cursor-pointer'
            >
              🔑 Admin (admin@example.com)
            </button>
            <button
              type='button'
              onClick={() => fillCredentials('employee1@example.com', '123')}
              className='text-xs bg-gray-800/80 hover:bg-gray-700 text-gray-200 py-1.5 px-3 rounded-lg border border-gray-700 transition cursor-pointer'
            >
              👤 Employee (employee1@example.com)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
