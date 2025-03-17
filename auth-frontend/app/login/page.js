'use client';
import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Alert from '../../components/Alert';
import ErrorAlert from '../../components/ErrorAlert';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const { login: handleAuthLogin } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      //   token save and user in authcontext
      handleAuthLogin(data.login.token, data.login.user);
      setSuccessMessage('Login successful!');
    } catch (err) {
      setErrorMessage(err);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 to-black'>
      <div className='bg-zinc-900 p-8 rounded-2xl shadow-lg max-w-sm w-full'>
        <h2 className='text-white text-2xl font-semibold text-center mb-6'>
          Welcome!
        </h2>
        <p className='text-zinc-400 text-center mb-8'>
          Dont have an account?{' '}
          <Link href='/register' className='text-blue-500'>
            Sign Up
          </Link>
        </p>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor='email' className='text-zinc-400 block mb-2'>
              Email address
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full p-3 rounded-lg bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label htmlFor='password' className='text-zinc-400 block mb-2'>
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full p-3 rounded-lg bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {errorMessage && (
          <div className='py-4'>
            <ErrorAlert message={errorMessage.message} />
          </div>
        )}
        {successMessage && (
          <div className='py-4'>
            <Alert message={successMessage} />
          </div>
        )}
        {/* {error && <p className='text-red-500 mt-4'>{error.message}</p>} */}
      </div>
    </div>
  );
}
