import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useParams } from 'react-router-dom';
import { Forumheader } from '../Components/Forumheader';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-quill/dist/quill.snow.css';
import renderHTML from 'react-render-html';
import './ForumQues.css';

export const ForumQues = () => {
  const params = useParams();
  const { slug } = params;
  const [ques, setQues] = useState('');
  const [answer, setAnswer] = useState('');
  const [quesid, setQuesid] = useState('');
  const [query, setQuery] = useState('');
  const [user, setUser] = useState('');
  const [data, setData] = useState([]);
  const [thisans, setThisans] = useState([]);
  const [thisQues, setThisQues] = useState('');
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
    };
    fetchUser();
    const fetchallquesbyques = async () => {
      const res = await axios.get(`/forum/find/ques/byques/${slug}`);
      setThisQues(res.data);
      setThisans(res.data.ans);
    };
    fetchallquesbyques();
    const fetchQuesInSearch = async () => {
      const resnew = await axios.get(`/forum/find/ques/all?q=${query}`);
      setData(resnew.data);
    };
    if (query.length === 0 || query.length > 0) fetchQuesInSearch();
  }, [query]);
  const handleAnswersubmit = async () => {
    if (user.username !== undefined) {
      try {
        const res = await axios.post(
          '/forum/add/ans',
          {
            quesid: thisQues._id,
            answer: answer,
            ansusername: user.username,
          },
          {
            withCredentials: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.data === 'saved') {
          window.location.href = '/forum';
        }
      } catch {}
    } else {
      window.location.href = '/login';
    }
  };
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

  const ckchange = (e, editor) => {
    const data = editor.getData();
    setAnswer(data);
  };

  return (
    <>
      <Forumheader user={user} />
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
      <div></div>
      <div>
        <h1>{thisQues.ques}</h1>
        {thisans.map((ans) => (
          <div>
            <h1>Ans-{renderHTML(ans.answer)}</h1>
            <p>{ans.ansusername}</p>
          </div>
        ))}

        <form>
          <div className="forumques_writeans_div">
            <div className="create_left"></div>
            <CKEditor
              editor={ClassicEditor}
              onReady={(editor) => {}}
              name="image"
              config={{ ckfinder: { uploadUrl: '/hello' } }}
              onChange={ckchange}
            />
          </div>
          <button onClick={handleAnswersubmit}>Submit Answer</button>
        </form>
      </div>
    </>
  );
};
