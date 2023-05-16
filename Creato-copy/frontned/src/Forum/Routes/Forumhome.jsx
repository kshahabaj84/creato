import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Forumallques } from '../Components/Forumallques';
import { Forumheader } from '../Components/Forumheader';
import './Forumhome.css';

export const Forumhome = () => {
  const [ques, setQues] = useState('');
  const [user, setUser] = useState('');
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [quesbyfollowings, setQuesbyfollowings] = useState([]);
  const [
    home_header_rightbar_searchbar_input_table_div,
    setHome_header_rightbar_searchbar_input_table_div,
  ] = useState('home_header_rightbar_searchbar_input_table_div_none');
  const [allforum, setAllforum] = useState([]);
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
        const fetchQuesByFollowings = async () => {
          const resnew = await axios.post('/forum/find/ques/byfollowings', {
            username: res.data.username,
          });
          setQuesbyfollowings(resnew.data);
        };
        fetchQuesByFollowings();
      } else {
      }
    };
    fetchUser();
    const fetchallForum = async () => {
      const res = await axios.get('/forum/find/ques/all');
      setAllforum(res.data);
    };
    fetchallForum();
    const fetchQuesInSearch = async () => {
      const resnew = await axios.get(`/forum/find/ques/all?q=${query}`);
      setData(resnew.data);
    };
    if (query.length === 0 || query.length > 0) fetchQuesInSearch();
  }, [query]);
  const handleQuessubmit = async (e) => {
    e.preventDefault();

    if (user.username) {
      try {
        await axios.post(
          '/forum/add/ques',
          {
            quesusername: user.username,
            ques: ques,
          },
          {
            withCredentials: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
      } catch {}
    } else {
      window.location.href = '/login';
    }
  };
  return (
    <>
      <Forumheader user={user} />
      <div className="forum_home_content">
        <div>
          <form onSubmit={handleQuessubmit}>
            <input
              required
              placeholder="ask or share anything"
              onChange={(e) => {
                setQues(e.target.value);
              }}
            />
            <button type="submit">Post</button>
          </form>
        </div>
        <div>
          <Forumallques data={quesbyfollowings} user={user} />
        </div>
        <div>
          <Forumallques data={allforum} user={user} />
        </div>
      </div>
    </>
  );
};
