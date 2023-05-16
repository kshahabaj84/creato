import axios from 'axios';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export const Logout = () => {
  useEffect(() => {
    axios
      .get('/logout', {
        withCredentials: true,
        headers: {
          Accept: 'application.json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        Navigate('/login', { replace: true });
        if (res.status !== 200) {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {};
  }, []);

  return (
    <div>
      <h1>logout</h1>
    </div>
  );
};
