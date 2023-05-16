import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Create.css';

export const Create = () => {
  const [selectedImage, setSelectedImage] = useState();
  const [username, setUsername] = useState();
  const [showinputmedia, setShowinputmedia] = useState('');
  const [entryptformdata, setEnctryptformdata] = useState('');

  const [show, setShow] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/user/authenticate', {
        withCredentials: true,
        headers: {
          Accept: 'application.json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
      if (res.data !== '') {
        setShow('hi');
        setUsername(res.data.username);
      } else {
        window.location.href = '/login';
      }
    };
    fetchData();
  }, []);
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage();
  };

  const handleTypeSelect = (e) => {
    e.preventDefault();
    setShowinputmedia(e.target.value);
    if (e.target.value !== '') {
      setEnctryptformdata('multipart/form-data');
    }
  };

  return (
    <>
      {show ? (
        <>
          <div>
            <Link to={'/'}>
              <img
                className="create_logo"
                alt="logo"
                src="/uploads/Creato_logo-removebg-preview.png"
              ></img>
            </Link>
          </div>
          <div className="create_div">
            <div className="create_left">
              {selectedImage && (
                <div style={styles.preview}>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    style={styles.image}
                    alt="Thumb"
                  />
                  <button onClick={removeSelectedImage} style={styles.delete}>
                    Remove This Image
                  </button>
                </div>
              )}
            </div>
            <div className="create_right">
              <div className="create_h1_div">
                <h1 className="create_h1">Create new create</h1>
              </div>
              <div className="create_form_div">
                <form
                  className="create_form"
                  action="/create"
                  method="post"
                  enctype={entryptformdata}
                >
                  <input
                    className="create_form_username_input"
                    name="username"
                    value={username}
                  />
                  <label>Title</label>
                  <input
                    name="title"
                    className="create_form_title_input"
                    type="string"
                    required
                    placeholder="Enter Title here"
                  />
                  <label>Discription</label>
                  <input
                    name="discription"
                    className="create_form_title_input"
                    type="string"
                    placeholder="Enter discription"
                  />
                  <label>Link</label>
                  <input
                    name="link"
                    className="create_form_title_input"
                    type="string"
                    placeholder="Enter links"
                  />
                  <label>Tags</label>
                  <input
                    name="tag"
                    className="create_form_title_input"
                    type="string"
                    placeholder="Enter tags"
                    required
                  />
                  <label>Type</label>
                  <select
                    className="create_form_select"
                    name="type"
                    onChange={handleTypeSelect}
                  >
                    <option className="create_form_option" value="Nomedia">
                      No Media
                    </option>
                    <option className="create_form_option" value="Image">
                      Image
                    </option>
                    <option className="create_form_option" value="Audio">
                      Audio
                    </option>
                    <option className="create_form_option" value="Video">
                      Video
                    </option>
                  </select>
                  {showinputmedia === 'Image' ? (
                    <div>
                      <label>Create</label>
                      <input
                        className="create_form_file"
                        type="file"
                        name="create"
                        accept="image/*"
                        required
                        onChange={imageChange}
                      />
                    </div>
                  ) : showinputmedia === 'Audio' ? (
                    <div>
                      <label>Create</label>
                      <input
                        className="create_form_file"
                        type="file"
                        name="create"
                        accept="audio/*"
                        required
                        onChange={imageChange}
                      />
                    </div>
                  ) : showinputmedia === 'Video' ? (
                    <div>
                      <label>Create</label>
                      <input
                        className="create_form_file"
                        type="file"
                        name="create"
                        accept="video/*"
                        required
                        onChange={imageChange}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <button className="create_form_button" type="submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};
const styles = {
  preview: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'column',
  },
  image: { maxWidth: '100%', maxHeight: 320 },
  delete: {
    cursor: 'pointer',
    padding: 15,
    background: 'red',
    color: 'white',
    border: 'none',
  },
};
