import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../Components/Header';

export const Product = () => {
  const [user, setUser] = useState([]);
  const [product, setProduct] = useState([]);
  const params = useParams();
  const { slug } = params;
  useEffect(() => {
    const fetchUsername = async () => {
      const res = await axios.get('/user/authenticate', {
        withCredentials: true,
        headers: {
          Accept: 'application.json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
      setUser(res.data);
    };
    fetchUsername();
    const fetchproduct = async () => {
      const res = await axios.get(`/find/product/byID/${slug}`);
      setProduct(res.data);
    };
    fetchproduct();
  }, []);
  const serverBaseURI = 'http://localhost:5000';
  return (
    <div>
      <Header user={user} />
      <div>
        <img
          src={`${serverBaseURI}/${product.imageurl}`}
          alt={product.imageurl}
        />
        <p>{product.username}</p>
        <h1>{product.title}</h1>
      </div>
    </div>
  );
};
