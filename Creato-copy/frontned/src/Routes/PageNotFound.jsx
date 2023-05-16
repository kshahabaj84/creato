//imports
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
////css
import './PageNotFound.css';

export const PageNotFound = () => {
  const [create, setCreate] = useState([]);
  useEffect(() => {
    const fetchCreate = async () => {
      const res = await axios.get('/find/creates/all');
      setCreate(res.data);
    };
    fetchCreate();
  }, []);
  return (
    <div>
      <div>Page Not Found</div>
      <div>
        {create.map((create, y9) => (
          <div key={y9}>
            <img alt={create.title} src={create.url}></img>
            <Link to={`/user/${create.username}`}>
              <h3>{create.username}</h3>
            </Link>
          </div>
        ))}
      </div>
      {/* <div className="bottom_404">
        <div className="bottom_left_404">
          <img
            src="https://img.freepik.com/free-vector/thoughtful-woman-with-laptop-looking-big-question-mark_1150-39362.jpg?w=740&t=st=1669101905~exp=1669102505~hmac=83bc72c30e0017b64716172fd625ade895a16d44756d081e08975505da2a89b3"
            className="bottom_left_img_404"
            alt="imagehye"
          ></img>
        </div>
        <div className="bottom_right_404">
          <p className="bottom_right_404_p1">404</p>
          <p className="bottom_right_404_p2">Somthing went</p>
          <p className="bottom_right_404_p3">WRONG!</p>
          <Link to={'/'}>
            <button className="bottom_right_404_btn">Back to Homepage</button>
          </Link>
        </div>
      </div> */}
    </div>
  );
};
