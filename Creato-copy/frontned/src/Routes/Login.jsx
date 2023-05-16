import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Login = () => {
  const [wongusernameforgetpass, setWongusernameforgetpass] = useState('');
  const [wrongusername, setWongusername] = useState('');
  const [wrongpassword, setWrongpassword] = useState('');
  const [forgetpass, setforgetpass] = useState('');
  const [username, setUsername] = useState('');
  const [forgetusername, setforgetUsername] = useState('');
  const [forgetemail, setforgetemail] = useState('');
  const [password, setPassword] = useState('');
  const [wrongotp, setWrongotp] = useState('');
  const [Login_rightbar, setLogin_rightbar] = useState('Login_rightbar');
  const [wongemailforgetpass, setWongemailforgetpass] = useState('');
  const [forgetpassotpverify, setForgetpassotpverify] = useState('');
  const [otplogin, setOtplogin] = useState('');
  const [changepassword, setChangepassword] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [confirmnewpassword, setConfirmnewpassword] = useState('');
  const [confirmnewpassworderror, setConfirmnewpassworderror] = useState('');
  const [passwordnotupdated, setPasswordnotupdated] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '/login',
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.data === 'Username not exist') {
        setWongusername('Username not exist');
      }
      if (res.data === 'incorrect pass') {
        setWrongpassword('Password incorrect');
        setWongusername('');
      }
      if (res.data === 'login') {
        window.location.href = '/';
      }
      if (res.data === 'adminlogin') {
        window.location.href = '/admindashboard';
      }
    } catch {}
  };
  const handleforgetpass = async (e) => {
    e.preventDefault();
    setforgetpass('forgetpass');
    setLogin_rightbar('Login_rightbar_none');
  };

  const handleforgetpasssubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '/login/forgetpass',
        {
          username: forgetusername,
          email: forgetemail,
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.data === 'usrname not exist') {
        setWongusernameforgetpass('usrname not exist');
      }
      if (res.data === 'email not exist') {
        setWongemailforgetpass('Email not exist');
      }
      if (res.data === 'sendotpsuccessful') {
        setForgetpassotpverify('forgetpassotpverify');
        setLogin_rightbar('Login_rightbar_none');
        setforgetpass('');
      }
    } catch {}
  };
  const handleloginotpsubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      '/login/forgetpass/otp_verify',
      {
        username: forgetusername,
        otp: otplogin,
      },
      {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
    if (res.data === 'wrong otp') {
      setWrongotp('Wrong OTP');
    }
    if (res.data === 'otpverified') {
      setForgetpassotpverify('setChangepassword');
      setChangepassword('changepassword');
    }
  };
  const handlechangepassword = async (e) => {
    e.preventDefault();
    if (newpassword === confirmnewpassword) {
      const res = await axios.post(
        '/login/forgetpass/changepassword',
        {
          username: forgetusername,
          password: newpassword,
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.data === 'updated') {
        window.location.href = '/login';
      } else {
        setPasswordnotupdated('Unable to update password');
      }
    } else {
      setConfirmnewpassworderror('Password not match');
    }
  };

  return (
    <>
      <div className="Login_main">
        <div className="Login_leftbar">
          <Link to={'/'}>
            <img
              className="Login_leftbar_logo"
              alt="logo"
              src="/uploads/Creato_logo-removebg-preview.png"
            ></img>
          </Link>
          <img
            className="Login_leftbar_backgroundimg"
            alt="Login"
            src="/uploads/login_page_img.jpg"
          ></img>
        </div>
        <div className={Login_rightbar}>
          <div className="Login_rightbar_part1">
            <p>Not have an account?</p>
            <a className="login_rightbar_part1_a" href="/signup">
              Sign up
            </a>
          </div>
          <div className="Login_rightbar_part2">
            <h1 className="Login_rightbar_part2_heading">Welcome back!</h1>
            <p className="Login_rightbar_part2_para">Login your account</p>
          </div>
          <div className="Login_rightbar_part3">
            <form className="Login_rightbar_part3_form" onSubmit={handleSubmit}>
              <label className="Login_rightbar_part3_form_label">
                Username
              </label>
              <input
                className="Login_rightbar_part3_form_input"
                placeholder="Enter Username"
                required
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              {wrongusername && (
                <p className="signup_usernameerror">{wrongusername}</p>
              )}

              <label className="Login_rightbar_part3_form_label">
                Password
              </label>
              <input
                className="Login_rightbar_part3_form_input"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
                placeholder="Enter Password"
                type="password"
              />
              {wrongpassword && (
                <p className="signup_usernameerror">{wrongpassword}</p>
              )}

              <button
                className="Login_rightbar_part3_form_buttom"
                type="submit"
              >
                Login
              </button>
            </form>
            <div className="Login_rightbar_part3_form_forgetpass_div">
              <button
                className="Login_rightbar_part3_form_forgetpass_button"
                onClick={handleforgetpass}
              >
                Forget Password?
              </button>
            </div>
          </div>
          <div className="Login_rightbar_part4">
            <p>Login with</p>
            <a href="/">Facebook</a>
            <a href="/">Google</a>
          </div>
        </div>
        {forgetpass === 'forgetpass' && (
          <div className="Login_forgetpass">
            <div className="Login_forgetpass_top_div">
              <h1>Change Password</h1>
            </div>
            <form
              className="signup_rightbar_part3_form"
              onSubmit={handleforgetpasssubmit}
            >
              <label className="signup_rightbar_part3_form_label">
                Username
              </label>
              <input
                className="signup_rightbar_part3_form_input"
                placeholder="Enter Username"
                required
                type="text"
                onChange={(e) => setforgetUsername(e.target.value)}
              />
              {wongusernameforgetpass && (
                <p className="signup_usernameerror">{wongusernameforgetpass}</p>
              )}
              <label className="signup_rightbar_part3_form_label">
                Email Adress
              </label>
              <input
                className="signup_rightbar_part3_form_input"
                onChange={(e) => setforgetemail(e.target.value)}
                required
                placeholder="Enter Your Email"
                type="email"
              />
              {wongemailforgetpass && (
                <p className="signup_usernameerror">{wongemailforgetpass}</p>
              )}
              <button
                className="signup_rightbar_part3_form_buttom"
                type="submit"
              >
                Send OTP
              </button>
            </form>
          </div>
        )}
        {forgetpassotpverify === 'forgetpassotpverify' && (
          <>
            <div className="login_forgetpassotpverify">
              <h1>OTP Verification</h1>
              <div className="login_forgetpassotpverify_para_div">
                We've sent a Verification code to your <br /> email -
                {forgetemail}
              </div>
              <div className="login_forgetpassotpverify_form_div">
                <form
                  className="login_forgetpassotpverify_form"
                  onSubmit={handleloginotpsubmit}
                >
                  <input
                    className="login_forgetpassotpverify_form_input"
                    placeholder="Enter otp"
                    onChange={(e) => setOtplogin(e.target.value)}
                  />
                  <button
                    className="login_forgetpassotpverify_form_button"
                    type="submit"
                  >
                    Verify
                  </button>
                </form>
                {wrongotp && (
                  <p className="login_forgetpassotpverify_paaworderror">
                    {wrongotp}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
        {changepassword === 'changepassword' && (
          <>
            <div className="login_changepassword">
              <h1>Change Password</h1>
              <div className="login_changepassword_form_div">
                <form
                  className="login_changepassword_form"
                  onSubmit={handlechangepassword}
                >
                  <label className="login_changepassword_form_label">
                    New Password
                  </label>
                  <input
                    className="login_changepassword_form_input"
                    placeholder="New Password"
                    required
                    type="password"
                    onChange={(e) => setNewpassword(e.target.value)}
                  />
                  <label className="login_changepassword_form_label">
                    Confirm New Password
                  </label>
                  <input
                    className="login_changepassword_form_input"
                    onChange={(e) => setConfirmnewpassword(e.target.value)}
                    required
                    placeholder="Confirm New Password"
                    type="password"
                  />
                  {confirmnewpassworderror === 'Password not match' && (
                    <p className="signupdiv_otperror">
                      {confirmnewpassworderror}
                    </p>
                  )}
                  <button
                    className="login_changepassword_form_button"
                    type="submit"
                  >
                    Send OTP
                  </button>
                </form>
                {passwordnotupdated === 'Unable to update password' && (
                  <p className="signupdiv_otperror">{passwordnotupdated}</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
