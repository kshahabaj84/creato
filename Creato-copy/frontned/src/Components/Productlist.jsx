import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import './Productlist.css';

export const Productlist = (child) => {
  const [enquiryname, setEnquiryname] = useState();
  const [enquiryno, setEnquiryno] = useState();
  const [enquirysuccessfull, setEnquirysuccessfull] = useState('');
  const handleContactsellersubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/add/product/enquiry', {
      username: enquiryname,
      mobileno: enquiryno,
      productid: e.target.value,
    });
    if (res.data) {
      setEnquirysuccessfull('true');
    }
  };
  const serverBaseURI = 'http://localhost:5000';
  return (
    <div className="productlist_map_div">
      {child.data.map((product) => (
        <div className="productlist_div">
          <a href={`/product/${product._id}`}>
            <img
              className="productlist_img"
              src={`${serverBaseURI}/${product.imageurl}`}
              alt={product.imageurl}
            />
          </a>
          <a
            href={`/user/${product.username}`}
            className="productlist_username"
          >
            {product.username}
          </a>
          <h1 className="productlist_title">{product.title}</h1>
          <h1 className="productlist_price">{product.price}</h1>
          <p className="productlist_rating">Rating{product.rating}</p>
          <a href={`/product/${product._id}`}>
            <button>See detail</button>
          </a>
          <Popup trigger={<button>Contact Seller</button>} modal nested>
            {(close) => (
              <div className="modal">
                <div className="content">
                  {enquirysuccessfull === 'true' ? (
                    <div>hi</div>
                  ) : (
                    <div>
                      <h1>Contact Seller</h1>
                      <p>Leave your mobile no here</p>
                      <form type="submit">
                        <lable>Name</lable>
                        <input
                          type="text"
                          onChange={(e) => {
                            setEnquiryname(e.target.value);
                          }}
                          required
                        />
                        <lable>Mobile Number</lable>
                        <input
                          type="number"
                          onChange={(e) => {
                            setEnquiryno(e.target.value);
                          }}
                          required
                        />
                        <button
                          value={product._id}
                          onClick={handleContactsellersubmit}
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  )}
                </div>
                <div>
                  <button onClick={() => close()}>Close modal</button>
                </div>
              </div>
            )}
          </Popup>
        </div>
      ))}
    </div>
  );
};
