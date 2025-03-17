'use client';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import Alert from '../../components/Alert';
import ErrorAlert from '../../components/ErrorAlert';

const UPDATE_LANGUAGES_MUTATION = gql`
  mutation UpdatePreferredLanguages(
    $userId: ID!
    $preferredLanguages: String!
  ) {
    updatePreferredLanguages(
      userId: $userId
      preferredLanguages: $preferredLanguages
    ) {
      id
      preferredLanguages
    }
  }
`;

const GET_GREETING_QUERY = gql`
  query GetGreeting($userId: ID!) {
    getGreeting(userId: $userId)
  }
`;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [preferredLanguages, setPreferredLanguages] = useState('');
  const [localGreeting, setLocalGreeting] = useState('');

  const { data: greetingData, refetch } = useQuery(GET_GREETING_QUERY, {
    variables: { userId: user ? user.id : '' },
    skip: !user,
  });

  const [updateLanguages, { loading: updating, error: updateError }] =
    useMutation(UPDATE_LANGUAGES_MUTATION);

  useEffect(() => {
    if (user) {
      setPreferredLanguages(user.preferredLanguages || '');
    }
  }, [user]);

  useEffect(() => {
    if (greetingData && greetingData.getGreeting) {
      setLocalGreeting(greetingData.getGreeting);
    }
  }, [greetingData]);

  const handleUpdateLanguages = async (e) => {
    e.preventDefault();
    try {
      await updateLanguages({
        variables: { userId: user.id, preferredLanguages },
      });
      // refetch after updating
      refetch()(<Alert message={'Languages updated!'} />);
    } catch (err) {
      <ErrorAlert message={`Error updating languages: ${err}`} />;
    }
  };

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-black'>
        <p className='text-white text-xl'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-black'>
      <h1 className='text-4xl font-bold mb-8 text-white'>
        Welcome, {user.email}
      </h1>
      <p className='mb-6 font-bold text-white'>{localGreeting}</p>

      {/* Form for updating languages */}

      <form
        onSubmit={handleUpdateLanguages}
        className='w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-lg'
      >
        <label
          className='block text-zinc-300 mb-2'
          htmlFor='preferredLanguages'
        >
          Update Languages
        </label>
        <input
          id='preferredLanguages'
          type='text'
          value={preferredLanguages}
          onChange={(e) => setPreferredLanguages(e.target.value)}
          className='w-full p-3 rounded-lg bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-blue-500 mb-4'
          placeholder='e.g, English, Spanish, French'
        />
        <button
          type='submit'
          disabled={updating}
          className='w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200'
        >
          {updating ? 'Updating...' : 'Update Languages'}
        </button>
        {updateError && (
          <p className='text-red-500 mt-2'>
            {
              <div className='py-4'>
                <ErrorAlert message={updateError.message} />
              </div>
            }
          </p>
        )}
      </form>
      <button
        onClick={logout}
        className='mt-8 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition'
      >
        Logout
      </button>
    </div>
  );
}
