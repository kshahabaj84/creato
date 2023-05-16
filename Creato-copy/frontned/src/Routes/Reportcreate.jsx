import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Reportcreate = () => {
  const params = useParams();
  const { slug } = params;
  const [user, setUser] = useState([]);
  const [show, setShow] = useState();
  const [reason, setReason] = useState('');
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get('/user/authenticate', {
        withCredentials: true,
        headers: {
          Accept: 'application.json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
      setUser(res.data);
      if (res.data) {
        setShow(true);
      }
    };
    fetchUser();
  }, []);

  const handleSubmitReport = async () => {
    const res = await axios.post('/add/report/create', {
      id: slug,
      user: user.username,
      reason: reason,
    });
    if (res.data === 'submited') {
      window.location.href = `/createsee/${slug}`;
    }
  };

  return (
    <div>
      {show === true ? (
        <div>
          <h1>Report</h1>
          <input
            type="checkbox"
            checked={reason === 'Copyright'}
            onChange={() => setReason('Copyright')}
          />
          <lable>Copyright</lable>
          <br />
          <input
            type="checkbox"
            checked={reason === 'bad create'}
            onChange={() => setReason('bad create')}
          />
          <lable>Bad Create</lable>
          {reason !== '' ? (
            <button onClick={handleSubmitReport}>Submit Report</button>
          ) : (
            <>
              <button disabled>Submit Report</button>
            </>
          )}
        </div>
      ) : (
        <>hi</>
      )}
    </div>
  );
};
