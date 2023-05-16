import React, { useState } from 'react';
import './Signup.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export const Signup = () => {
  const navigate = useNavigate();
  const [usernameexist, setUsernameexist] = useState('');
  const [unabletosendotp, setUnabletosendotp] = useState('');
  const [emailexist, setEmailexist] = useState('');
  const [otptab, setOtptab] = useState('');
  const [passworderror, setPassworderror] = useState('');
  const [signup_rightbar, setSignup_rightbar] = useState('signup_rightbar');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState();
  const [otperror, setOtperror] = useState();
  const [usernameerror, setUsernameerror] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length > 1) {
      setUsernameerror('');
      if (password.length > 5) {
        const res = await axios.post('/signup', {
          username: username,
          email: email,
          password: password,
        });
        if (res.data === 'sendotpsuccessful') {
          setOtptab('true');
          setOtperror('');
          setSignup_rightbar('Signup_rightbar_none');
        }
        if (res.data === 'username already exist') {
          setUsernameexist('Username already taken');
          setEmailexist('');
          setPassworderror('');
        }
        if (res.data === 'email already exist') {
          setEmailexist('Email already registered');
          setPassworderror('');
        } else {
          setUnabletosendotp('Unable to send OTP');
        }
      } else {
        setPassworderror('Password should be at least 6 character');
        setEmailexist('');
        setUsernameexist('');
      }
    } else {
      setUsernameerror("Username shouldn't less than 2 characters");
    }
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleOtpsubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      '/signup/otp_verify',
      {
        username: username,
        email: email,
        password: password,
        otp: otp,
      },
      {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
    if (res.data === 'user created') {
      window.location.href = '/';
    } else {
      setOtperror('wrong otp');
    }
  };

  return (
    <>
      <div className="signup_main">
        <div className="signup_leftbar">
          <Link to={'/'}>
            <img
              className="signup_leftbar_logo"
              alt="logo"
              src="/uploads/Creato_logo-removebg-preview.png"
            ></img>
          </Link>
          <img
            className="signup_leftbar_backgroundimg"
            alt="signup"
            src="/uploads/istockphoto-1219250756-170667a.jpg"
          ></img>
        </div>
        <div className={signup_rightbar}>
          <div className="signup_rightbar_part1">
            <p className="signup_rightbar_part1_p">Already have an account?</p>
            <a className="signup_rightbar_part1_a" href="/login">
              Sign in
            </a>
          </div>
          <div className="signup_rightbar_part2">
            <h1 className="signup_rightbar_part2_heading">
              Welcome to Creato!
            </h1>
            <p className="signup_rightbar_part2_para">Regiter your account</p>
          </div>
          <div className="signup_rightbar_part3">
            <form
              className="signup_rightbar_part3_form"
              onSubmit={handleSubmit}
            >
              {unabletosendotp && (
                <p className="signup_usernameerror">{unabletosendotp}</p>
              )}
              <label className="signup_rightbar_part3_form_label">
                Username
              </label>
              <input
                className="signup_rightbar_part3_form_input"
                value={username}
                placeholder="Enter Username"
                required
                type="text"
                onChange={handleUsername}
              />
              {usernameexist && (
                <p className="signup_usernameerror">{usernameexist}</p>
              )}
              {usernameerror && (
                <p className="signup_usernameerror">{usernameerror}</p>
              )}
              <label className="signup_rightbar_part3_form_label">
                Email Adress
              </label>
              <input
                className="signup_rightbar_part3_form_input"
                onChange={(e) => setEmail(e.target.value)}
                required
                value={email}
                placeholder="Enter Your Email"
                type="email"
              />
              {emailexist && (
                <p className="signup_usernameerror">{emailexist}</p>
              )}
              <label className="signup_rightbar_part3_form_label">
                Password
              </label>
              <input
                className="signup_rightbar_part3_form_input"
                onChange={handlePassword}
                required
                placeholder="Enter Password"
                value={password}
                type="password"
              />
              {passworderror && (
                <p className="signup_passworderror">{passworderror}</p>
              )}

              <button
                className="signup_rightbar_part3_form_buttom"
                type="submit"
              >
                Sign Up
              </button>
            </form>
          </div>
          <div className="signup_rightbar_part4">
            <p>Register with</p>
            <a href="/">Facebook</a>
            <a href="/">Google</a>
          </div>
        </div>
        {otptab === 'true' && (
          <div className="signup_otptab">
            <h1>OTP Verification</h1>
            <div className="signup_otptab_para_div">
              We've sent a Verification code to your <br /> email -{email}
            </div>
            <div className="signup_otptab_form_div">
              <form className="signup_otptab_form" onSubmit={handleOtpsubmit}>
                <input
                  className="signup_otptab_form_input"
                  placeholder="Enter otp"
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button className="signup_otptab_form_button" type="submit">
                  Verify
                </button>
              </form>
            </div>
            {otperror === 'wrong otp' && (
              <div className="signupdiv_otperror">{otperror}</div>
            )}
            <div className="signup_otptab_bottom_div">
              <a className="signup_otptab_bottom_back_a" href="/signup">
                Back
              </a>
              <form onSubmit={handleSubmit}>
                <button
                  className="signup_otptab_bottom_resend_button"
                  type="submit"
                >
                  Resend OTP
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
