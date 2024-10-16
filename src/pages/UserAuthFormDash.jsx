// src/pages/UserAuthFormDash.jsx
import React, { useRef, useContext } from 'react';
import InputBox from '../components/InputBox';
import { LuMail } from 'react-icons/lu';
import { IoKeyOutline } from 'react-icons/io5';
import { Link, Navigate } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { storeInLocal } from '../common/session'; // Correct import
import { UserContext } from '../App'; // Import UserContext from App

const UserAuthFormDash = () => {
  const authForm = useRef();
  const { userAuth, setUserAuth } = useContext(UserContext); // Get userAuth and setUserAuth from context

  const authenticateUserThroughServer = async (serverRoute, formData) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`, formData);
      storeInLocal("user", JSON.stringify(data)); // Store in localStorage
      setUserAuth(data); // Set the authenticated user in context
      toast.success("User signed in successfully!");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error); // Display server error
      } else {
        toast.error("An unexpected error occurred"); // Handle other errors
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serverRoute = "/admin-signin";  // Updated to admin sign-in route
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const form = new FormData(authForm.current);
    const formData = Object.fromEntries(form.entries());
    const { email, password } = formData;
    console.log(formData)

    if (!email) {
      return toast.error("Enter Email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase, and 1 uppercase letter");
    }

    authenticateUserThroughServer(serverRoute, formData);
  };

  if (userAuth?.access_token) {
    return <Navigate to="/admin" />; // Redirect to admin dashboard if authenticated
  }

  return (
    <AnimationWrapper keyValue="sign-in">
      <section className='h-cover flex items-center justify-center'>
        <Toaster />
        <form ref={authForm} onSubmit={handleSubmit} className='w-[80%] max-w-[400px]'>
          <h1 className='text-4xl font-gelasio capitalize text-center mb-24'>
            Admin Sign In
          </h1>

          <InputBox
            name='email'
            type='email'
            placeholder='Email'
            icon={LuMail}
          />
          <InputBox
            name='password'
            type='password'
            placeholder='Password'
            icon={IoKeyOutline}
          />
          <button className='btn-dark center mt-14' type='submit'>
            Sign In
          </button>
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthFormDash;
