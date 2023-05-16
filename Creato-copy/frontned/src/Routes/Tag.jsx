import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Content } from '../Components/Content';
import { Header } from '../Components/Header';
import './Tag.css';

export const Tag = () => {
  const params = useParams();
  const { slug } = params;
  const [show, setShow] = useState('');
  const [data, setData] = useState([]);
  const [query, setQuery] = useState(slug);
  const [create, setCreate] = useState([]);
  const [userdata, setUserdata] = useState([]);

  useEffect(() => {
    const fetchcreateusingtag = async () => {
      const res = await axios.get(`/find/creates/withtag/${slug}`, {
        withCredentials: true,
        headers: {
          Accept: 'application.json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
      setCreate(res.data);
    };

    fetchcreateusingtag();
    const fetchData = async () => {
      const res = await axios.get('/user/authenticate');
      setShow(res.data);
      setUserdata(res.data);
    };
    fetchData();
    const fetchCreate = async () => {
      const res = await axios.get(`/find/tags/all?q=${query}`);
      setData(res.data);
    };
    if (query.length === 0 || query.length > 0) fetchCreate();
  }, [query]);

  return (
    <>
      <Header user={userdata} />
      <div className="home_content">
        <Content data={create} user={userdata} />
      </div>
    </>
  );
};
