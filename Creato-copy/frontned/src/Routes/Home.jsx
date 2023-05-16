import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Home.css';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import Carousel, { CarouselItem } from './Carousel';
import { Header } from '../Components/Header';
import { Content } from '../Components/Content';
import { Creatorlist } from '../Components/Creatorlist';

export const Home = () => {
  const [user, setUser] = useState([]);
  const [topcreators, setTopcreators] = useState([]);
  const [suggestedcreators, setSuggestedcreators] = useState([]);
  const [createbylikedtag, setCreatebylikedtag] = useState([]);
  const [createbyfollowings, setCreatebyfollowings] = useState([]);
  const [allcreates, setAllcreates] = useState([]);

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
        const fetchCretesByFollowings = async () => {
          const resnew = await axios.post('/find/creates/byfollowings', {
            username: res.data.username,
          });
          setCreatebyfollowings(resnew.data);
        };
        fetchCretesByFollowings();
        const fetchCretesBylikedtag = async () => {
          const resnew1 = await axios.post('/find/creates/bylikedtag', {
            username: res.data.username,
          });
          setCreatebylikedtag(resnew1.data);
        };
        fetchCretesBylikedtag();
        const fetchSuggestedCreator = async () => {
          const resnew2 = await axios.post('/find/creator/suggested', {
            username: res.data.username,
          });
          setSuggestedcreators(resnew2.data);
        };
        fetchSuggestedCreator();
      } else {
      }
    };
    fetchUser();
    const fetchTopCreators = async () => {
      const res = await axios.get('/find/creators/top');
      setTopcreators(res.data);
    };
    fetchTopCreators();
    const fetchallcreate = async () => {
      const res = await axios.get('/find/creates/all');
      setAllcreates(res.data);
    };
    fetchallcreate();
  }, []);

  TimeAgo.addLocale(en);

  return (
    <>
      <div className="home">
        <Header user={user} />
        <div className="home_contentbar">
          <div className="home_contentbar_leftbar">
            <div className="home_contentbar_leftbar_map_div">
              <Content data={createbyfollowings} user={user} />
            </div>
            <div>
              <Carousel>
                <CarouselItem>
                  <div className="home_contentbar_leftbar_map_div">
                    <Content data={allcreates} user={user} />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <Content data={allcreates} user={user} />
                </CarouselItem>
                <CarouselItem>
                  <Content data={allcreates} user={user} />
                </CarouselItem>
              </Carousel>
            </div>
            <div className="home_contentbar_leftbar_map_div">
              <Content data={createbylikedtag} user={user} />
            </div>
            <div className="home_contentbar_leftbar_map_div">
              <Content data={allcreates} user={user} />
            </div>
          </div>
          <div className="home_content_rightbar">
            {suggestedcreators.length !== 0 && (
              <div>
                <h3>User Suggetion for you</h3>
                <div className="home_content_rightbar_topcreators_map_div">
                  <Creatorlist data={suggestedcreators} user={user} />
                </div>
              </div>
            )}
            <div className="home_content_rightbar_topcreators_div">
              <h3 className="home_content_rightbar_topcreators_heading">
                Top Creators
              </h3>
              <div className="home_content_rightbar_topcreators_map_div">
                <Creatorlist data={topcreators} user={user} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
