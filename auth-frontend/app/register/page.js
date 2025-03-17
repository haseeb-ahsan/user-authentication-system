'use client';
import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';
import ErrorAlert from '../../components/ErrorAlert';

const REGISTER_MUTATION = gql`
  mutation Register(
    $email: String!
    $password: String!
    $preferredLanguages: String
  ) {
    register(
      email: $email
      password: $password
      preferredLanguages: $preferredLanguages
    ) {
      token
      user {
        id
        email
        preferredLanguages
      }
    }
  }
`;

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguages, setPreferredLanguages] = useState('');
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);
  const { login: handleAuthLogin } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({
        variables: { email, password, preferredLanguages },
      });

      if (data && data.register && data.register.token && data.register.user) {
        handleAuthLogin(data.register.token, data.register.user);
        setSuccessMessage('Registration successful! You are now logged in.');
        router.push('/dashboard');
      } else {
        setErrorMessage(
          new Error('Invalid response from server. Please try again.')
        );
      }
    } catch (err) {
      //   alert('Error during registration');
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const errorMessage = err.graphQLErrors[0].message;
        if (errorMessage.includes('User already exists')) {
          setErrorMessage(new Error('User with this email already exists.'));
        } else {
          setErrorMessage(err);
        }
      } else {
        setErrorMessage(err);
      }
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 to-black'>
      <div className='bg-zinc-900 p-8 rounded-2xl shadow-lg max-w-sm w-full'>
        <h2 className='text-white text-2xl font-semibold text-center mb-6'>
          Create an Account
        </h2>
        <p className='text-zinc-400 text-center mb-8'>
          Already have an account?{' '}
          <Link href='/login' className='text-blue-500 hover:underline'>
            Log in
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
          <div>
            <label
              htmlFor='preferredLanguages'
              className='block text-zinc-400 mb-2'
            >
              Preferred Greeting Languages
            </label>
            <input
              id='preferredLanguages'
              type='text'
              value={preferredLanguages}
              onChange={(e) => setPreferredLanguages(e.target.value)}
              className='w-full p-3 rounded-lg bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='e.g, English, Spanish'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200'
          >
            {loading ? 'Registering...' : 'Register'}
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
