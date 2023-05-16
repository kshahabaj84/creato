import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { FaSearch, FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Userdashboard.css';

export const Userdashboard = () => {
  const [username, setUsername] = useState('');
  const [
    userdashboard_content_leftbar_button_notclicked_personalinfo,
    setuserdashboard_content_leftbar_button_notclicked_personalinfo,
  ] = useState('button_clicked');
  const [
    userdashboard_content_leftbar_button_notclicked_yourfollowers,
    setuserdashboard_content_leftbar_button_notclicked_yourfollowers,
  ] = useState('button_notclicked');
  const [
    userdashboard_content_leftbar_button_notclicked_youfollow,
    setuserdashboard_content_leftbar_button_notclicked_youfollow,
  ] = useState('button_notclicked');
  const [
    userdashboard_content_leftbar_button_notclicked_likecreates,
    setuserdashboard_content_leftbar_button_notclicked_likecreates,
  ] = useState('button_notclicked');
  const [
    userdashboard_content_leftbar_button_notclicked_saveforlater,
    setuserdashboard_content_leftbar_button_notclicked_saveforlater,
  ] = useState('button_notclicked');
  const [
    userdashboard_content_leftbar_button_notclicked_yourcreates,
    setuserdashboard_content_leftbar_button_notclicked_yourcreates,
  ] = useState('button_notclicked');
  const [profileImage, setProfileImage] = useState();
  const [userdata, setUserdata] = useState([]);
  const [likecreate, setLikecreate] = useState([]);
  const [saveforlatercreate, setSaveforlatercreate] = useState([]);
  const [yourcreate, setYourcreate] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [show, setShow] = useState('');
  const [newabout, setNewabout] = useState(userdata.about);
  const [newwebsite, setNewwebsite] = useState(userdata.website);
  const [newadress, setNewadress] = useState(userdata.adress);
  const [newstate, setNewstate] = useState(userdata.state);
  const [newcountry, setNewcountry] = useState(userdata.country);
  const [newpincode, setNewpincode] = useState(userdata.pincode);
  const [newtwitter, setNewtwitter] = useState(userdata.twitter);
  const [newfacebook, setNewfacebook] = useState(userdata.facebook);
  const [newpinterest, setNewpinterest] = useState(userdata.pinterest);
  const [newlanguage, setNewlanguage] = useState(userdata.language);
  const [newgender, setNewgender] = useState(userdata.gender);
  const [newage, setNewage] = useState(userdata.age);
  const [newyoutube, setNewyoutube] = useState(userdata.youtube);
  const [showpersonalinfo, setShowpersonalinfo] = useState('true');
  const [showyourfollowers, setShowyourfollowers] = useState('');
  const [showyoufollow, setShowyoufollow] = useState('');
  const [showlikecreates, setShowlikecreates] = useState('');
  const [showsaveforlater, setShowsaveforlater] = useState('');
  const [showyourcreates, setShowyourcreates] = useState('');

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
      setUserdata(res.data);
      setShow('hi');
      setUsername(res.data.username);
      if (res.data) {
        const resnew = await axios.post('/find/create/like', {
          username: res.data.username,
        });
        setLikecreate(resnew.data);
        const resnew1 = await axios.post('/find/create/saveforlater', {
          username: res.data.username,
        });
        setSaveforlatercreate(resnew1.data);
        const resnew2 = await axios.post('/find/creates/byusername', {
          username: res.data.username,
        });
        setYourcreate(resnew2.data);
      }
    };
    fetchData();
  }, []);
  async function handleupdate(e) {
    e.preventDefault();
    await axios.post('/user/update/data', {
      username: username,
      newabout: newabout,
      newwebsite: newwebsite,
      newadress: newadress,
      newstate: newstate,
      newcountry: newcountry,
      newpincode: newpincode,
      newtwitter: newtwitter,
      newfacebook: newfacebook,
      newpinterest: newpinterest,
      newgender: newgender,
      newage: newage,
      newlanguage: newlanguage,
      newyoutube: newyoutube,
    });
  }
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };
  const profileimageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };
  const removeSelectedImage = () => {
    setSelectedImage();
  };
  const removeprofileImage = () => {
    setProfileImage();
  };
  const handleDeleteuser = async (e) => {
    e.preventDefault();
    const res = await axios.post('/user/delete', {
      username: username,
    });
    if (res.data === 'account deleted') {
      window.location.href = '/';
    }
  };
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
  const handlePersonalInfo = async () => {
    setShowpersonalinfo('true');
    setShowyourfollowers('');
    setShowyoufollow('');
    setShowlikecreates('');
    setShowsaveforlater('');
    setShowyourcreates('');
    setuserdashboard_content_leftbar_button_notclicked_personalinfo(
      'button_clicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourfollowers(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_youfollow(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_likecreates(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_saveforlater(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourcreates(
      'button_notclicked'
    );
  };
  const handleYourFollowers = async () => {
    setShowpersonalinfo('');
    setShowyourfollowers('true');
    setShowyoufollow('');
    setShowlikecreates('');
    setShowsaveforlater('');
    setShowyourcreates('');
    setuserdashboard_content_leftbar_button_notclicked_personalinfo(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourfollowers(
      'button_clicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_youfollow(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_likecreates(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_saveforlater(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourcreates(
      'button_notclicked'
    );
  };
  const handleYouFollow = async () => {
    setShowpersonalinfo('');
    setShowyourfollowers('');
    setShowyoufollow('true');
    setShowlikecreates('');
    setuserdashboard_content_leftbar_button_notclicked_personalinfo(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourfollowers(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_youfollow(
      'button_clicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_likecreates(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_saveforlater(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourcreates(
      'button_notclicked'
    );
    setShowyourcreates('');
    setShowsaveforlater('');
  };
  const handleLikeCreates = async (e) => {
    setShowpersonalinfo('');
    setShowyourfollowers('');
    setShowyoufollow('');
    setuserdashboard_content_leftbar_button_notclicked_personalinfo(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourfollowers(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_youfollow(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_likecreates(
      'button_clicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_saveforlater(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourcreates(
      'button_notclicked'
    );
    setShowlikecreates('true');
    setShowsaveforlater('');
    setShowyourcreates('');
  };
  const handleSaveForLater = async () => {
    setShowpersonalinfo('');
    setShowyourfollowers('');
    setShowyoufollow('');
    setShowlikecreates('');
    setShowsaveforlater('true');
    setuserdashboard_content_leftbar_button_notclicked_personalinfo(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourfollowers(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_youfollow(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_likecreates(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_saveforlater(
      'button_clicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourcreates(
      'button_notclicked'
    );
    setShowyourcreates('');
  };
  const handleYourCreates = async () => {
    setShowpersonalinfo('');
    setShowyourfollowers('');
    setShowyoufollow('');
    setShowlikecreates('');
    setShowsaveforlater('');
    setuserdashboard_content_leftbar_button_notclicked_personalinfo(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourfollowers(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_youfollow(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_likecreates(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_saveforlater(
      'button_notclicked'
    );
    setuserdashboard_content_leftbar_button_notclicked_yourcreates(
      'button_clicked'
    );
    setShowyourcreates('true');
  };
  const handleRemoveCreate = async (e) => {
    e.preventDefault();
    const res = await axios.post('/delete/create/byID', {
      ID: e.target.value,
      username: username,
    });
    setYourcreate(res.data);
  };
  const serverBaseURI = '';

  return (
    <>
      {show === 'hi' && (
        <>
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
                <input
                  className="home_header_rightbar_searchbar_input"
                  placeholder="search here"
                />
                <button className="home_header_rightbar_searchbar_button">
                  <FaSearch />
                </button>
              </form>
              {show ? (
                <div>
                  <div className="home_header_show_rightlinks">
                    <a
                      className="home_header_show_rightlink_create"
                      href="/create"
                    >
                      Create
                    </a>
                    <a
                      className="home_header_noshow_rightlinks_forum"
                      href="/forum"
                    >
                      Forum
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
                          Hi {userdata.username}
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
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="userdashboard_content">
            <div className="userdashboard_content_leftbar">
              <button
                className={
                  userdashboard_content_leftbar_button_notclicked_personalinfo
                }
                onClick={handlePersonalInfo}
              >
                Personal Info
              </button>
              <button
                className={
                  userdashboard_content_leftbar_button_notclicked_yourfollowers
                }
                onClick={handleYourFollowers}
              >
                Your Followers
              </button>
              <button
                className={
                  userdashboard_content_leftbar_button_notclicked_youfollow
                }
                onClick={handleYouFollow}
              >
                You Follow
              </button>
              <button
                className={
                  userdashboard_content_leftbar_button_notclicked_likecreates
                }
                onClick={handleLikeCreates}
              >
                Like Creates
              </button>
              <button
                className={
                  userdashboard_content_leftbar_button_notclicked_saveforlater
                }
                onClick={handleSaveForLater}
              >
                Save For Later
              </button>
              <button
                className={
                  userdashboard_content_leftbar_button_notclicked_yourcreates
                }
                onClick={handleYourCreates}
              >
                Your Creates
              </button>
            </div>
            <div className="userdashboard_content_rightbar">
              {showpersonalinfo === 'true' && (
                <div className="userdashboard_content_rightbar_personal_info">
                  <div className="userdashboard_content_rightbar_personal_info_images_div">
                    <form
                      action="/user/update/profileimage"
                      method="post"
                      enctype="multipart/form-data"
                      className="userdashboard_content_rightbar_personal_info_images_profileimages_form"
                    >
                      <input
                        className="create_form_username_input"
                        name="username"
                        value={username}
                      />
                      <label>Profile Photo</label>
                      <input
                        type="file"
                        name="profileimage"
                        accept="image/*"
                        required
                        onChange={profileimageChange}
                      />
                      <button type="submit">Update</button>
                    </form>
                    <form
                      action="/user/update/banner"
                      method="post"
                      enctype="multipart/form-data"
                    >
                      <input
                        className="create_form_username_input"
                        name="username"
                        value={username}
                      />
                      <label>Banner</label>
                      <input
                        type="file"
                        name="banner"
                        accept="image/*"
                        required
                        onChange={imageChange}
                      />
                      <button type="submit">Update</button>
                    </form>
                  </div>
                  <div>
                    {selectedImage && (
                      <div style={styles.preview}>
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          style={styles.image}
                          alt="Thumb"
                        />
                        <button
                          onClick={removeSelectedImage}
                          style={styles.delete}
                        >
                          Remove This Image
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    {profileImage && (
                      <div style={styles.preview}>
                        <img
                          src={URL.createObjectURL(profileImage)}
                          style={styles.image}
                          alt="Thumb"
                        />
                        <button
                          onClick={removeprofileImage}
                          style={styles.delete}
                        >
                          Remove This Image
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="userdashboard_content_rightbar_personal_info_otherinfo_div">
                    <label>website </label>
                    <input
                      type="text"
                      defaultValue={userdata.website}
                      onChange={(e) => {
                        setNewwebsite(e.target.value);
                      }}
                    />
                    <label>about </label>
                    <input
                      type="text"
                      defaultValue={userdata.about}
                      onChange={(e) => {
                        setNewabout(e.target.value);
                      }}
                    />
                    <label>adress </label>
                    <input
                      type="text"
                      defaultValue={userdata.adress}
                      onChange={(e) => {
                        setNewadress(e.target.value);
                      }}
                    />
                    <label>State </label>
                    <input
                      type="text"
                      defaultValue={userdata.state}
                      onChange={(e) => {
                        setNewstate(e.target.value);
                      }}
                    />
                    <label>country </label>
                    <input
                      type="text"
                      defaultValue={userdata.country}
                      onChange={(e) => {
                        setNewcountry(e.target.value);
                      }}
                    />
                    <label>pincode </label>
                    <input
                      type="number"
                      defaultValue={userdata.pincode}
                      onChange={(e) => {
                        setNewpincode(e.target.value);
                      }}
                    />
                    <label>twitter </label>
                    <input
                      type="text"
                      defaultValue={userdata.twitter}
                      onChange={(e) => {
                        setNewtwitter(e.target.value);
                      }}
                    />
                    <label>facebook </label>
                    <input
                      type="text"
                      defaultValue={userdata.facebook}
                      onChange={(e) => {
                        setNewfacebook(e.target.value);
                      }}
                    />
                    <label>pinterest </label>
                    <input
                      type="text"
                      defaultValue={userdata.pinterest}
                      onChange={(e) => {
                        setNewpinterest(e.target.value);
                      }}
                    />
                    <label>youtube </label>
                    <input
                      type="text"
                      defaultValue={userdata.youtube}
                      onChange={(e) => {
                        setNewyoutube(e.target.value);
                      }}
                    />
                    <label>age </label>
                    <input
                      type="number"
                      defaultValue={userdata.age}
                      onChange={(e) => {
                        setNewage(e.target.value);
                      }}
                    />
                    <label>gender </label>
                    <input
                      type="text"
                      defaultValue={userdata.gender}
                      onChange={(e) => {
                        setNewgender(e.target.value);
                      }}
                    />
                    <label>language </label>
                    <input
                      type="text"
                      defaultValue={userdata.language}
                      onChange={(e) => {
                        setNewlanguage(e.target.value);
                      }}
                    />

                    <button onClick={handleupdate}>Update</button>
                  </div>
                  <div>
                    <button onClick={handleDeleteuser}>
                      Permanently Delete My Account
                    </button>
                  </div>
                </div>
              )}
              {showyourfollowers === 'true' && (
                <div className="userdashboard_content_rightbar_your_followers">
                  <h1>Followers</h1>
                  {userdata.follwersusername.map((username) => (
                    <a>{username}</a>
                  ))}
                </div>
              )}
              {showyoufollow === 'true' && (
                <div className="userdashboard_content_rightbar_you_follow">
                  <h1>You Follow</h1>
                  {userdata.followingusername.map((username) => (
                    <a>{username}</a>
                  ))}
                </div>
              )}
              {showlikecreates === 'true' && (
                <div>
                  <div className="home_content">
                    {likecreate.map((create, y8) => (
                      <>
                        <Link to={`/createsee/${create._id}`}>
                          <div className="home_content_singleelement_div">
                            {create.type === 'Image' ? (
                              <>
                                <img
                                  className="home_content_map_img"
                                  alt={create.title}
                                  src={`${serverBaseURI}/${create.url}`}
                                ></img>
                                <Link
                                  className="home_content_map_img_h3_link"
                                  to={`/user/${create.username}`}
                                >
                                  <h3>{create.username}</h3>
                                </Link>
                              </>
                            ) : (
                              <>
                                <video width="320" height="240" controls>
                                  <source
                                    src={`${serverBaseURI}/${create.url}`}
                                    type="video/mp4"
                                  />
                                  <source
                                    src={`${serverBaseURI}/${create.url}`}
                                    type="video/ogg"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                                <Link
                                  className="home_content_map_img_h3_link"
                                  to={`/user/${create.username}`}
                                >
                                  <h3>{create.username}</h3>
                                </Link>
                              </>
                            )}
                          </div>
                        </Link>
                      </>
                    ))}
                  </div>
                </div>
              )}
              {showsaveforlater === 'true' && (
                <div>
                  <div className="home_content">
                    {saveforlatercreate.map((create, y8) => (
                      <>
                        <Link to={`/createsee/${create._id}`}>
                          <div className="home_content_singleelement_div">
                            {create.type === 'Image' ? (
                              <>
                                <img
                                  className="home_content_map_img"
                                  alt={create.title}
                                  src={`${serverBaseURI}/${create.url}`}
                                ></img>
                                <Link
                                  className="home_content_map_img_h3_link"
                                  to={`/user/${create.username}`}
                                >
                                  <h3>{create.username}</h3>
                                </Link>
                              </>
                            ) : (
                              <>
                                <video width="320" height="240" controls>
                                  <source
                                    src={`${serverBaseURI}/${create.url}`}
                                    type="video/mp4"
                                  />
                                  <source
                                    src={`${serverBaseURI}/${create.url}`}
                                    type="video/ogg"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                                <Link
                                  className="home_content_map_img_h3_link"
                                  to={`/user/${create.username}`}
                                >
                                  <h3>{create.username}</h3>
                                </Link>
                              </>
                            )}
                          </div>
                        </Link>
                      </>
                    ))}
                  </div>
                </div>
              )}
              {showyourcreates === 'true' && (
                <div>
                  <div className="home_content">
                    {yourcreate.map((create, y8) => (
                      <>
                        <Link to={`/createsee/${create._id}`}>
                          <div className="home_content_singleelement_div">
                            {create.type === 'Image' ? (
                              <>
                                <img
                                  className="home_content_map_img"
                                  alt={create.title}
                                  src={`${serverBaseURI}/${create.url}`}
                                ></img>
                                <Link
                                  className="home_content_map_img_h3_link"
                                  to={`/user/${create.username}`}
                                >
                                  <h3>{create.username}</h3>
                                </Link>
                              </>
                            ) : (
                              <>
                                <video width="320" height="240" controls>
                                  <source
                                    src={`${serverBaseURI}/${create.url}`}
                                    type="video/mp4"
                                  />
                                  <source
                                    src={`${serverBaseURI}/${create.url}`}
                                    type="video/ogg"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                                <Link
                                  className="home_content_map_img_h3_link"
                                  to={`/user/${create.username}`}
                                >
                                  <h3>{create.username}</h3>
                                </Link>
                              </>
                            )}
                          </div>
                        </Link>
                        <button value={create._id} onClick={handleRemoveCreate}>
                          Remove create
                        </button>
                      </>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
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
