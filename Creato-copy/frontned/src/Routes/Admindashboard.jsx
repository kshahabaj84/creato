import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';

export const Admindashboard = () => {
  const [admin, setAdmin] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('http://localhost:5000/user/dashbord', {
        withCredentials: true,
        headers: {
          Accept: 'application.json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
      if (res.data.isAdmin === true) {
        setAdmin('true');
      }
    };
    fetchData();
  }, []);
  return <>{admin === 'true' ? <div>Admindashboard</div> : 'no'}</>;
};
