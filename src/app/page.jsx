'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { magic } from '../config/magic';

export default function Home() {
  const [email, setEmail] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyLoading, setVerifyLoading] = useState(false);
  const [isUserAutenticatedLoading, setIsUserAuthenticatedLoading] =
    useState(false);

  const authRef = useRef();

  const router = useRouter();

  useEffect(() => {
    handleUserAuth();
  }, []);

  const handleUserAuth = async () => {
    setIsUserAuthenticatedLoading(true);
    try {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        router.push('/dashboard');
      }
      setIsUserAuthenticatedLoading(false);
    } catch (err) {
      setIsUserAuthenticatedLoading(false);
    }
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      authRef.current = magic.auth.loginWithEmailOTP({
        email: email,
        showUI: false,
      });
      authRef.current
        .on('email-otp-sent', () => {
          setEmailSuccess(true);
          setIsLoading(false);
        })
        .on('invalid-email-otp', () => {
          setIsLoading(false);
          setVerifyLoading(false);
          setError('OTP is invalid');
        })
        .on('done', (result) => {
          setError('');
          setVerifyLoading(false);
          setIsLoading(false);
          setOTP('');
          const didToken = result;
          localStorage.setItem('token', didToken);
          router.push('/dashboard');
        })
        .on('error', (reason) => {
          setError(JSON.stringify(reason));
          setIsLoading(false);
          setVerifyLoading(false);
        });
    } catch (err) {
      setError(JSON.stringify(err));
      setIsLoading(false);
      setVerifyLoading(false);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    authRef.current.emit('verify-email-otp', otp);
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
    <main className='flex min-h-screen flex-col items-center justify-center bg-blue-500'>
      <div className='w-5/6 md:w-2/6 shadow-xl rounded-xl bg-white overflow-hidden min-h-[280px]'>
        <div className='text-center p-2 md:p-8'>
          <h2 className='text-xl font-bold mb-4 pt-4'>
            Login or Register with Email
          </h2>
          <div
            className={`delay-400 duration-500 ease-in-out transition-all transform mt-6 px-4 ${
              emailSuccess ? 'translate-x-0 -mb-[100px]' : 'translate-x-full'
            }`}
          >
            <p className='text-md font-bold'>Check your email</p>
            <p>
              We have sent an OTP code to{' '}
              <span className='text-blue-500'>{email}</span>
            </p>

            <form onSubmit={handleVerifyOTP} className='mt-3'>
              <input
                name='otp'
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className='border border-gray-400 shadow-xl rounded-lg p-2 block mx-auto w-full md:w-3/4'
                placeholder='Enter OTP code'
                required
              />
              {error ? <p className='text-sm text-red-400'>{error}</p> : null}
              <button
                type='submit'
                className='bg-blue-500 text-white p-2 rounded-lg shadow-lg w-[180px] mt-4'
              >
                {isVerifyLoading ? 'Verifying...' : 'Verfiy'}
              </button>
            </form>
          </div>
          <div
            className={`-mt-[160px] px-4 delay-400 duration-500 ease-in-out transition-all transform ${
              emailSuccess ? '-translate-x-full' : 'translate-x-0 '
            }`}
          >
            <p>Enter your Email</p>
            <form onSubmit={handleEmailAuth}>
              <input
                name='email'
                value={email}
                type='email'
                required
                onChange={(e) => setEmail(e.target.value)}
                className='border border-gray-400 shadow-xl rounded-lg p-2 block mx-auto w-full md:w-3/4'
                placeholder='Email'
              />
              <button
                type={'submit'}
                className='bg-blue-500 text-white p-2 rounded-lg shadow-lg w-[180px] mt-4'
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
