import axios from 'axios';
import React from 'react';
import TimeAgo from 'javascript-time-ago';
import { FaEllipsisV } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import en from 'javascript-time-ago/locale/en.json';

export const Content = (child) => {
  const user = child.user;
  const handleSaveForLater = async (e) => {
    e.preventDefault();
    if (user.username != null) {
      try {
        const res = await axios.post('/add/create/savedcreate', {
          createID: e.target.value,
          username: user.username,
        });
        if (res.data === 'saved') {
          window.location.reload();
        }
      } catch {}
    } else {
      window.location.href = '/login';
    }
  };
  const usersave = user.savedcreate;
  const handleRemoveSaveForLater = async (e) => {
    e.preventDefault();
    if (user.username != null) {
      try {
        const res = await axios.post('/delete/create/savedcreate', {
          createID: e.target.value,
          username: user.username,
        });
        if (res.data === 'deleted') {
          window.location.reload();
        }
      } catch {}
    } else {
      window.location.href = '/login';
    }
  };
  const serverBaseURI = '';
  TimeAgo.addLocale(en);
  return (
    <div>
      {child.data.map((create, y8) => (
        <>
          <div className="home_contentbar_leftbar_map_singlecreate_div">
            <div className="home_contentbar_leftbar_map_singlecreate_top_div">
              <div className="home_contentbar_leftbar_map_singlecreate_top_leftside_div">
                <div className="home_contentbar_leftbar_map_singlecreate_top_leftside_creatorname_div">
                  <img
                    className="home_contentbar_leftbar_map_singlecreate_top_leftside_creatorname_img"
                    src={`${serverBaseURI}/${create.url}`}
                    alt={create.url}
                  />
                  <a
                    className="home_contentbar_leftbar_map_singlecreate_top_leftside_creatorname_a"
                    href={`/user/${create.username}`}
                  >
                    {create.username}
                  </a>
                </div>
                <div className="home_contentbar_leftbar_map_singlecreate_top_leftside_uploadtime_div">
                  <p className="home_contentbar_leftbar_map_singlecreate_top_leftside_uploadtime_p">
                    Uploaded
                    <ReactTimeAgo date={create.date} locale="en-US" />
                  </p>
                </div>
                <h2 className="home_contentbar_leftbar_map_singlecreate_top_leftside_createtitle_h1">
                  {create.title}
                </h2>
              </div>
              <div className="home_contentbar_leftbar_map_singlecreate_top_rightside_div">
                <div className="home_contentbar_leftbar_map_singlecreate_top_rightside_fa_div">
                  <FaEllipsisV className="home_contentbar_leftbar_map_singlecreate_top_rightside_fa" />
                </div>
                <div className="home_contentbar_leftbar_map_singlecreate_top_rightside_fa_dropdown_div">
                  {user.length !== 0 ? (
                    <div>
                      {user.savedcreate.find((e) => e === create._id) ? (
                        <button
                          className="home_contentbar_leftbar_map_singlecreate_top_rightside_fa_dropdown_button_saveforlater"
                          onClick={handleRemoveSaveForLater}
                          value={create._id}
                        >
                          Saved
                        </button>
                      ) : (
                        <button
                          className="home_contentbar_leftbar_map_singlecreate_top_rightside_fa_dropdown_button_saveforlater"
                          onClick={handleSaveForLater}
                          value={create._id}
                        >
                          Save for later
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      className="home_contentbar_leftbar_map_singlecreate_top_rightside_fa_dropdown_button_saveforlater"
                      onClick={handleSaveForLater}
                      value={create._id}
                    >
                      Save for later
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="home_contentbar_leftbar_map_singlecreate_bottom_div">
              <a href={`/createsee/${create._id}`}>
                {create.type === 'Nomedia' ? (
                  <></>
                ) : create.type === 'Image' ? (
                  <>
                    <img
                      className="home_content_map_img"
                      alt={create.title}
                      src={`${serverBaseURI}/${create.url}`}
                    ></img>
                  </>
                ) : create.type === 'Audio' ? (
                  <>
                    <audio controls>
                      <source
                        src={`${serverBaseURI}/${create.url}`}
                        type="audio/ogg"
                      />
                      <source
                        src={`${serverBaseURI}/${create.url}`}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio tag.
                    </audio>
                  </>
                ) : (
                  <>
                    <video
                      width="320"
                      className="home_content_map_video"
                      height="240"
                      controls
                      controlsList="nodownload nofullscreen noremoteplayback"
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
                    <Link
                      className="home_content_map_img_h3_link"
                      to={`/user/${create.username}`}
                    >
                      <h3>{create.username}</h3>
                    </Link>
                  </>
                )}
              </a>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};
