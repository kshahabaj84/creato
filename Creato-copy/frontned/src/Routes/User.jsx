import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Content } from '../Components/Content';
import { Header } from '../Components/Header';
import './User.css';

export const User = () => {
  const params = useParams();
  const { slug } = params;
  const [user, setUser] = useState('');
  const [isfollowed, setIsfollowed] = useState('');
  const [username, setUsername] = useState('');
  const [userdata, setUserdata] = useState('');
  const [profilephoto, setProfilephoto] = useState('');
  const [show, setShow] = useState('hi');
  const [create, setCreate] = useState([]);
  useEffect(() => {
    const fetchCreate = async () => {
      const res = await axios.get(`/find/creates/byusername/${slug}`);
      setCreate(res.data);
    };
    fetchCreate();
    const fetchUser = async () => {
      const res = await axios.get(`/find/creator/byusername/${slug}`);
      if (res.data !== 'no user') {
        setUser(res.data);
        setShow('');
        if (res.data.profilephoto === undefined) {
          setProfilephoto('uploads/profile_img.jpg');
        } else {
          setProfilephoto(res.data.profilephoto);
        }
      } else {
        window.location.href = '/404';
      }
    };
    fetchUser();
    const fetchData = async () => {
      const res = await axios.get('/user/authenticate', {
        withCredentials: true,
        headers: {
          Accept: 'application.json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
      setUsername(res.data.username);
      setUserdata(res.data);
      if (res.data) {
        const checkuserfollow = async () => {
          const resnew = await axios.post('/check/user/follow', {
            username: res.data.username,
            creatorusername: slug,
          });
          setIsfollowed(resnew.data);
        };

        checkuserfollow();
      }
    };
    fetchData();
  }, []);
  async function handleFollow(e) {
    e.preventDefault();
    if (username != null) {
      try {
        const res = await axios.post(
          '/add/follow',
          {
            username: username,
            user: user.username,
          },
          {
            withCredentials: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.data === 'followed') {
          window.location.reload();
        }
      } catch {}
    } else {
      window.location.href = '/login';
    }
  }
  async function handleUnfollow(e) {
    e.preventDefault();
    if (username != null) {
      try {
        const res = await axios.post(
          '/delete/follow',
          {
            username: username,
            user: user.username,
          },
          {
            withCredentials: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.data === 'unfollowed') {
          window.location.reload();
        }
      } catch {}
    } else {
      window.location.href = '/login';
    }
  }
  const serverBaseURI = 'http://localhost:5000';
  return (
    <div>
      {show !== 'hi' && (
        <>
          <Header user={userdata} />
          <div className="user_middle_div">
            <div className="user_middle_div_banner_div">
              <img
                className="user_middle_div_banner_img"
                src={`${serverBaseURI}/${userdata.banner}`}
                alt={`${serverBaseURI}/${profilephoto}`}
              />
            </div>
            <div className="user_middle_div_profilephoto_div">
              <img
                className="user_middle_div_profilephoto_img"
                src={`${serverBaseURI}/${profilephoto}`}
                alt={`${serverBaseURI}/${profilephoto}`}
              />
            </div>
            <h1>{user.username}</h1>
            <p>{user.about}</p>
            <div className="user_middle_div_bottom_div">
              <div className="user_middle_div_bottom_following_div">
                {user.followingusername.length != null && (
                  <h3>{user.followingusername.length}</h3>
                )}
                <h3>Following</h3>
              </div>
              <div className="user_middle_div_bottom_followers_div">
                {user.follwersusername.length != null && (
                  <h3>{user.follwersusername.length}</h3>
                )}
                <h3>Followers</h3>
              </div>
              {userdata.username !== slug && (
                <div>
                  {isfollowed === 'alredyfollowed' ? (
                    <button onClick={handleUnfollow}>Followed</button>
                  ) : (
                    <button onClick={handleFollow}>Follow</button>
                  )}
                </div>
              )}
            </div>
            <div className="home_content">
              <Content data={create} user={userdata} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
