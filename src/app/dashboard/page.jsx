'use client';
import { magic } from '@/config/magic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
const Dashboard = () => {
  const [userEmail, setUserEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [loadingLogout, setLoadingLogout] = useState('');
  const [isUserAutenticatedLoading, setIsUserAuthenticatedLoading] =
    useState(false);

  const router = useRouter();

  useEffect(() => {
    getData();
    handleUserAuth();
  }, []);

  const handleUserAuth = async () => {
    setIsUserAuthenticatedLoading(true);
    try {
      const isLoggedIn = await magic.user.isLoggedIn();
      setIsUserAuthenticatedLoading(false);
      if (isLoggedIn) {
        return;
      } else {
        router.push('/');
      }
    } catch (err) {
      setIsUserAuthenticatedLoading(false);
    }
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const { email, publicAddress } = await magic.user.getInfo();
      setIsLoading(false);
      setUserEmail(email);
      setAddress(publicAddress);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await magic.user.logout();
      router.push('/');
      setLoadingLogout(false);
    } catch (err) {
      setLoadingLogout(false);
    }
  };

  if (isUserAutenticatedLoading) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center bg-blue-500'>
        <div className='w-5/6 md:w-2/6 shadow-xl rounded-xl bg-white overflow-hidden min-h-[280px] flex items-center justify-center'>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-blue-500'>
      <div className='w-[98%] md:w-2/6 text-center shadow-xl rounded-xl bg-white overflow-hidden px-5 py-10 relative'>
        <h2 className='text-xl font-bold mb-4'>Dashboard</h2>
        <button
          onClick={handleLogout}
          className='absolute top-4 right-4 border-blue-400 border rounded-md p-1'
        >
          {loadingLogout ? 'Logging out...' : 'Logout'}
        </button>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>
              Email:{' '}
              <span className='text-md md:text-lg text-blue-400'>
                {userEmail}
              </span>
            </p>
            <p>
              Address:{' '}
              <span className='text-sm md:text-lg text-blue-400'>
                {address}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
