import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import axios from 'axios';
import React, { useState } from 'react';
import renderHTML from 'react-render-html';
import { Navigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import './Forumallques.css';
export const Forumallques = (child) => {
  const [answer, setAnswer] = useState('');
  const [quesid, setQuesid] = useState('');
  const handleAnswersubmit = async () => {
    if (child.user.length !== 0) {
      try {
        const res = await axios.post(
          '/forum/add/ans',
          {
            quesid: quesid,
            answer: answer,
            ansusername: child.user.username,
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
  return (
    <div>
      {child.data.map((item, y10) => (
        <div key={y10}>
          <a
            href={`/forum/ques/${item.questitle
              .replace(/\s+/g, '-')
              .toLowerCase()}`}
          >
            <h2>Q -- {renderHTML(item.quesdiscription)} </h2>
            <h2>Q -- {item.questitle} </h2>
          </a>
          <a href={`/user/${item.quesusername}`}>{item.quesusername}</a>
          {item.ans.slice(0, 1).map((ans) => (
            <div>
              <h2>Ans -- {renderHTML(ans.answer)}</h2>
              <p>{ans.ansusername}</p>
            </div>
          ))}
          <button
            onClick={(e) => {
              e.preventDefault();
              const str = item.questitle.replace(/\s+/g, '-').toLowerCase();
              window.location.href = `/forum/ques/${str}`;
            }}
          >
            See all Answers
          </button>
          <Popup
            trigger={
              <button>
                <input placeholder="Write Answer" />
              </button>
            }
            modal
            nested
          >
            {(close) => (
              <div className="modal">
                <div className="content">
                  {child.user.length === 0 ? (
                    <Navigate to="/login" />
                  ) : (
                    <form onSubmit={handleAnswersubmit}>
                      <CKEditor
                        required
                        editor={ClassicEditor}
                        onReady={(editor) => {}}
                        name="image"
                        config={{ ckfinder: { uploadUrl: '/hello' } }}
                        onChange={(e, editor) => {
                          setAnswer(editor.getData());
                          setQuesid(item._id);
                        }}
                      />
                      <button type="submit">Submit Answer</button>
                    </form>
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
