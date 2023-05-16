import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  FacebookShareButton,
  FacebookIcon,
  InstapaperShareButton,
  PinterestShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  InstapaperIcon,
  PinterestIcon,
  WhatsappIcon,
  TwitterIcon,
} from 'react-share';
import './Createsee.css';
import { Header } from '../Components/Header';
import { Content } from '../Components/Content';
export const Createsee = () => {
  const [create, setCreate] = useState('');
  const [isliked, setIsliked] = useState('');
  const [issaved, setIssaved] = useState('');
  const [userothercreate, setUserothercreate] = useState([]);
  // const [followed, setFollowed] = useState('');
  const [comment, setComment] = useState([]);
  const [tag, setTag] = useState([]);
  const [newcomment, setNewcomment] = useState('');
  const [userdata, setUserdata] = useState([]);
  const [allcreate, setAllcreate] = useState([]);
  const [show, setShow] = useState('');
  const [likes, setLikes] = useState();
  const params = useParams();
  const [username, setUsername] = useState('');
  const { slug } = params;
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/find/create/withID/${slug}`);
      setCreate(res.data);
      setLikes(res.data.likeusername.length);
      setComment(res.data.comment);
      setTag(res.data.tag);
      if (res.data) {
        const fiandallcresteofuser = async () => {
          const resnew = await axios.post('/find/creates/byusername', {
            username: res.data.username,
          });
          setUserothercreate(resnew.data);
        };
        fiandallcresteofuser();
      } else {
      }
    };
    fetchData();
    const fetchallcreate = async () => {
      const res = await axios.get('/find/creates/all');
      setAllcreate(res.data);
    };
    fetchallcreate();
    const fetchUsername = async () => {
      const res = await axios.get('/user/authenticate', {
        withCredentials: true,
        headers: {
          Accept: 'application.json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
      setUsername(res.data.username);
      setShow(res.data);
      setUserdata(res.data);
      if (res.data) {
        const checkuserlike = async () => {
          const resnew = await axios.post('/check/user/like', {
            username: res.data.username,
            createid: slug,
          });
          setIsliked(resnew.data);
        };

        checkuserlike();
        const checkusersave = async () => {
          const resnew1 = await axios.post('/check/user/save', {
            username: res.data.username,
            createid: slug,
          });
          setIssaved(resnew1.data);
        };
        checkusersave();
      }
    };
    fetchUsername();
  }, []);
  async function handleLike(e) {
    e.preventDefault();
    if (username != null) {
      try {
        const res = await axios.post(
          '/add/like',
          {
            likeusername: username,
            likecreateid: create._id,
          },
          {
            withCredentials: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.data === 'liked') {
          window.location.reload();
        }
      } catch {}
    } else {
      window.location.href = '/login';
    }
  }
  async function handlecomment(e) {
    e.preventDefault();
    if (username != null) {
      try {
        const res = await axios.post('/add/comment', {
          id: create._id,
          newcomment: newcomment,
          username: username,
        });
        if (res === 'successfull') {
        }
      } catch {}
    } else {
      window.location.href = '/login';
    }
  }
  const handleReportCreate = (e) => {
    if (userdata) {
      window.location.href = `/report/create/${slug}`;
    } else {
      window.location.href = '/login';
    }
  };
  async function handleDislike(e) {
    e.preventDefault();
    if (username != null) {
      try {
        const res = await axios.post(
          '/create/dislike',
          {
            likeusername: username,
            likecreateid: create._id,
          },
          {
            withCredentials: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.data === 'disliked') {
          window.location.reload();
        }
      } catch {}
    } else {
      window.location.href = '/login';
    }
  }
  const serverBaseURI = '';
  const handleSaveForLater = async (e) => {
    e.preventDefault();
    if (username != null) {
      try {
        const res = await axios.post('/add/create/savedcreate', {
          createID: slug,
          username: userdata.username,
        });
        if (res.data === 'saved') {
          window.location.reload();
        }
      } catch {}
    } else {
      window.location.href = '/login';
    }
  };
  const handleRemoveSaveForLater = async (e) => {
    e.preventDefault();
    if (username != null) {
      try {
        const res = await axios.post('/delete/create/savedcreate', {
          createID: slug,
          username: userdata.username,
        });
        if (res.data === 'deleted') {
          window.location.reload();
        }
      } catch {}
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <>
      <Header user={userdata} />
      <div className="createsee_contentbar">
        <div className="createsee_contentbar_leftside">
          {create.type === 'Image' ? (
            <>
              <img
                className="createsee_contentbar_leftside_create"
                alt={create.title}
                src={`${serverBaseURI}/${create.url}`}
              ></img>
            </>
          ) : (
            <>
              <video
                width="320"
                height="240"
                controls
                controlsList="nodownload"
              >
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
            </>
          )}
        </div>
        <div className="createsee_contentbar_rightside">
          <a href={`/user/${create.username}`}>{create.username}</a>
          <h1>{create.title}</h1>
          <p>{create.discription}</p>
          <p>{create.view}</p>
          {likes !== null && <h3>{likes}</h3>}
          {isliked === 'alreadylikecreateid' ? (
            <button onClick={handleDislike}>Liked</button>
          ) : (
            <button onClick={handleLike}>Like</button>
          )}
          {tag.map((tag) => (
            <>
              <a href={`/tag/${tag}`}>#{tag}</a>
            </>
          ))}
          {issaved === 'alreadysaved' ? (
            <button onClick={handleRemoveSaveForLater}>Saved</button>
          ) : (
            <button onClick={handleSaveForLater}>Save for later</button>
          )}
          <button onClick={handleReportCreate}>Report Create</button>
          <FacebookShareButton url={`http://localhost:3000/createsee/${slug}`}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <InstapaperShareButton
            url={`http://localhost:3000/createsee/${slug}`}
          >
            <InstapaperIcon size={32} round />
          </InstapaperShareButton>{' '}
          <PinterestShareButton url={`http://localhost:3000/createsee/${slug}`}>
            <PinterestIcon size={32} round />
          </PinterestShareButton>
          <WhatsappShareButton url={`http://localhost:3000/createsee/${slug}`}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <TwitterShareButton url={`http://localhost:3000/createsee/${slug}`}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                `http://localhost:3000/createsee/${slug}`
              )
            }
          >
            Copy link
          </button>
          <div className="createsee_contentbar_rightside_comment_div">
            <h1>Comment</h1>
            <div className="createsee_contentbar_rightside_comment_allcomment_div">
              {comment.slice(0, 3).map((comment) => (
                <>
                  <h3>{comment.username}</h3>
                  <p>{comment.comment}</p>
                </>
              ))}
            </div>
            <div className="createsee_contentbar_rightside_comment_add_div">
              <form>
                <input
                  onChange={(e) => {
                    setNewcomment(e.target.value);
                  }}
                  required
                  placeholder="Enter Comment"
                />
                <button onClick={handlecomment} type="submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="home_content">
        <Content data={userothercreate} user={userdata} />
      </div>
      <div className="home_content">
        <Content data={allcreate} user={userdata} />
      </div>
    </>
  );
};
