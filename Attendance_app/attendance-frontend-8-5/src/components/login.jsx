import React, { useEffect, useState, useRef } from "react";
import { getToken } from '../interceptors/api';
import ReCAPTCHA from "react-google-recaptcha";
import LoadingSpinner from "./LoadingSpinner";
import { redirect } from "react-router-dom";
export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [recaptchaKey, setRecaptchaKey] = useState(0); // State variable to refresh the reCAPTCHA

  // Redirect to the home page if access_token is already present
  useEffect(() => {
    if (localStorage.getItem('access_token') != null) {
      window.location.href = '/home';
      //redirect("/home");

    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if the reCAPTCHA response is valid
    const recaptchaValue = recaptchaRef.current.getValue();
    if (!recaptchaValue) {
      setError('Veuillez compléter le CAPTCHA.');
      setIsLoading(false);
      return;
    }

    try {
      await getToken(username, password);
      window.location.href = '/home';
      // redirect("/home");
    } catch (error) {
      setError(error.message);
      // Update the reCAPTCHA key to trigger a refresh
      setRecaptchaKey((prevKey) => prevKey + 1);
    }

    setIsLoading(false);
  };

  const recaptchaRef = useRef();
  const [captchaScale, setCaptchaScale] = useState(1.0);
  const MIN_RECAPTCHA_WIDTH = 100; // Define your desired minimum width here

  useEffect(() => {
    function rescaleCaptcha() {
      const width = recaptchaContainerRef.current.offsetWidth;
      let scale = 1.0;
      if (width < MIN_RECAPTCHA_WIDTH) {
        scale = width / MIN_RECAPTCHA_WIDTH;
      }
      setCaptchaScale(scale);
    }

    rescaleCaptcha();
    window.addEventListener('resize', rescaleCaptcha);

    return () => {
      window.removeEventListener('resize', rescaleCaptcha);
    };
  }, []);

  const recaptchaContainerRef = useRef();

  return (
    <div
      style={{
        backgroundImage: "url(/login5.jpg)",
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      className="backdrop-blur-lg"
    >
      <div className="flex min-h-full min-w-5/6 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="shadow-2xl shadow-perpole-500 rounded p-20 w-full max-w-[29rem] space-y-8 bg-white">
          <div>
            <img
              className="mx-auto w-36 h-auto"
              src="ItSoulutions.png"
              alt="IT Soulutions"
            />
            <h2 className="mt-4 text-center text-xl tracking-tight text-gray-600 font-medium">
              Connection
            </h2>
          </div>
          <form className="mt-8 " onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px">
              <input
                id="Identifient"
                name="username"
                type="text"
                value={username}
                autoComplete="login"
                required
                placeholder="Identifient"
                className=" block w-full rounded-md border-1 border-gray-200 p-2.5 my-2 text-gray-900 ring-inset ring-gray-300 transition duration-200 ease-in-out placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-blue-600 sm:text-sm sm:leading-6"
                size="lg"
                onChange={e => setUsername(e.target.value)}
              />
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                autoComplete="current-password"
                required
                placeholder="Mot de passe"
                size="lg"
                className=" block w-full rounded-md border-1 border-gray-200 p-2.5 my-2 text-gray-900 ring-inset ring-gray-300 transition duration-200 ease-in-out placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-blue-600 sm:text-sm sm:leading-6"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <div
                style={{
                  transform: `scale(${captchaScale})`,
                  transformOrigin: '0 0',
                }}
                ref={recaptchaContainerRef}
                data-size="compact"
                className="recaptcha-container" // Add the class for the reCAPTCHA container
              >
                <ReCAPTCHA
                  key={recaptchaKey} // Add the key to trigger the reCAPTCHA refresh
                  ref={recaptchaRef}
                  sitekey="6LedhEEnAAAAAEr3511R1q0rA-ZLCSdZej6UtUVy"
                  onChange={() => setError('')}
                />
              </div>
              {error && (
                <div className="alert alert-danger mt-2" role="alert">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="mt-2 w-full inline-block rounded bg-primary px-6 pb-3.5 pt-2.5 text-xs sm:text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              >
                Connexion
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
