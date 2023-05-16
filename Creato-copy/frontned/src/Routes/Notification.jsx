import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBell, FaSearch, FaUserAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export const Notification = () => {
  const navigate = useNavigate();
  const [querysearchhistory, setQuerysearchhistory] = useState([]);
  const [user, setUser] = useState([]);
  const [notification, setNotification] = useState([]);
  const [query, setQuery] = useState('');
  const [querytag, setQuerytag] = useState([]);
  const [querytitle, setQuerytitle] = useState([]);
  const [queryusername, setQueryusername] = useState([]);
  const [
    home_header_rightbar_searchbar_input_table_div,
    setHome_header_rightbar_searchbar_input_table_div,
  ] = useState('home_header_rightbar_searchbar_input_table_div_none');
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
      setNotification(res.data.notification);
      if (res.data) {
        if (query.length !== 0) {
          const fetchSearchhistoryInSearch = async () => {
            const resnewhistory = await axios.post(
              `/find/serachhistory/all?q=${query}`,
              {
                username: res.data.username,
              }
            );
            setQuerysearchhistory(resnewhistory.data);
          };
          if (query.length === 0 || query.length > 0)
            fetchSearchhistoryInSearch();
        }
      }
    };
    fetchUser();
    const fetchTagInSearch = async () => {
      const resnew = await axios.get(`/find/tags/all?q=${query}`);
      setQuerytag(resnew.data[0]);
      setQueryusername(resnew.data[1]);
      setQuerytitle(resnew.data[2]);
    };
    if (query.length === 0 || query.length > 0) fetchTagInSearch();
  }, [query]);
  const handleLogout = async () => {
    const res = await axios.get('/logout', {
      withCredentials: true,
      headers: {
        Accept: 'application.json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
    if (res.data === 'logout') {
      window.location.href = '/';
    } else {
    }
  };
  const handleSearchchange = async (e) => {
    setQuery(e.target.value.toLowerCase());
    setHome_header_rightbar_searchbar_input_table_div(
      'home_header_rightbar_searchbar_input_table_div'
    );
  };
  const handlesearchbuttonclick = async (e) => {
    e.preventDefault();
    if (user.length !== 0) {
      if (query.length !== 0) {
        await axios.post('/add/user/searchhistory', {
          username: user.username,
          query: query,
        });
      }
    }
    navigate(`/tag/${query}`);
  };
  const handleClearSearchHistory = async (e) => {
    e.preventDefault();
    const res = await axios.post('/delete/user/searchhistory', {
      username: user.username,
    });
    if (res.data === 'deleted successful') {
      window.location.reload();
    }
  };
  const handleSearchtitleclicked = async (e) => {
    e.preventDefault();
    if (user.length !== 0) {
      await axios.post('/add/user/searchhistory', {
        username: user.username,
        query: e.target.value,
      });
    }
    navigate(`/tag/${e.target.value}`);
  };
  const handleSearchtagclicked = async (e) => {
    e.preventDefault();
    if (user.length !== 0) {
      await axios.post('/add/user/searchhistory', {
        username: user.username,
        query: e.target.value,
      });
    }
    navigate(`/tag/${e.target.value}`);
  };
  return (
    <div>
      <div className="home_header">
        <Link to="/">
          <div className="home_header_leftbar">
            <img
              className="home_header_leftbar_logo_img"
              alt="logo"
              src="/uploads/Creato_logo-removebg-preview.png"
            />
          </div>
        </Link>
        <div className="home_header_rightbar">
          <form className="home_header_rightbar_searchbar">
            <div className="home_header_rightbar_searchbar_input_div">
              <input
                className="home_header_rightbar_searchbar_input"
                placeholder="search here"
                type="text"
                onChange={handleSearchchange}
              />
              <div className={home_header_rightbar_searchbar_input_table_div}>
                <table>
                  <tbody>
                    {querysearchhistory.length !== 0 && (
                      <div>
                        <button onClick={handleClearSearchHistory}>
                          Clear History
                        </button>
                        <p>Search History</p>
                        {querysearchhistory.map((item) => (
                          <tr key={item.id}>
                            <a href={`/tag/${item.searchedtext}`}>
                              <td>{item.searchedtext}</td>
                            </a>
                          </tr>
                        ))}
                      </div>
                    )}
                    {querytitle.length !== 0 && (
                      <div>
                        <p>Titles</p>
                        {querytitle.map((item) => (
                          <tr key={item.id}>
                            <button
                              value={item.title}
                              onClick={handleSearchtitleclicked}
                            >
                              {item.title}
                            </button>
                          </tr>
                        ))}
                      </div>
                    )}
                    {queryusername.length !== 0 && (
                      <div>
                        <p>Users</p>
                        {queryusername.map((item) => (
                          <tr key={item.id}>
                            <a href={`/user/${item.username}`}>
                              <img
                                src={item.profilephoto}
                                alt={item.profilephoto}
                              />
                              <td>{item.username}</td>
                            </a>
                          </tr>
                        ))}
                      </div>
                    )}
                    {querytag.length !== 0 && (
                      <div>
                        <p>tags</p>
                        {querytag.map((item) => (
                          <tr key={item.id}>
                            <button
                              value={item.tag}
                              onClick={handleSearchtagclicked}
                            >
                              {item.tag}
                            </button>
                          </tr>
                        ))}
                      </div>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <button
              onClick={handlesearchbuttonclick}
              className="home_header_rightbar_searchbar_button"
            >
              <FaSearch />
            </button>
          </form>
          {user.length !== 0 ? (
            <div>
              <div className="home_header_show_rightlinks">
                <a className="home_header_show_rightlink_create" href="/create">
                  Create
                </a>
                <a
                  className="home_header_noshow_rightlinks_forum"
                  href="/forum"
                >
                  Forum
                </a>
                <a className="home_header_noshow_rightlinks_forum" href="/blog">
                  Blog
                </a>
                <a
                  className="home_header_noshow_rightlinks_forum"
                  href="/notification"
                >
                  <FaBell />
                  {user.notification.length !== 0 && user.notification.length}
                </a>
                <div className="home_header_show_rightlink_profile_link">
                  <Link to="/userdashboard">
                    <FaUserAlt className="home_header_show_rightlink_profile_icon" />
                  </Link>
                  <div className="home_header_show_rightlink_profile_name_div">
                    <a
                      href="/userdashboard"
                      className="home_header_show_rightlink_profile_name"
                    >
                      Hi {user.username}
                    </a>
                    <div className="home_header_show_rightlink_profile_name_dropdown_div">
                      <a
                        className="home_header_show_rightlink_profile_name_dropdown_a"
                        href="/userdashboard"
                      >
                        Dashboard
                      </a>
                      <button
                        className="home_header_show_rightlink_profile_name_dropdown_a home_header_show_rightlink_profile_name_dropdown_a_border_none"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="home_header_noshow_rightlinks">
                <a
                  className="home_header_noshow_rightlink_create"
                  href="/create"
                >
                  Create
                </a>
                <a
                  className="home_header_noshow_rightlinks_join"
                  href="/signup"
                >
                  Join
                </a>
                <a
                  className="home_header_noshow_rightlinks_signin"
                  href="/login"
                >
                  Signin
                </a>
                <a
                  className="home_header_noshow_rightlinks_forum"
                  href="/forum"
                >
                  Forum
                </a>
                <a className="home_header_noshow_rightlinks_forum" href="/blog">
                  Blog
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      {notification.length !== 0 && (
        <div>
          {notification.map((notification) => (
            <div>
              <h1>{notification.notificationtext}</h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
