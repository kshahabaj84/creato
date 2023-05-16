import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './Routes/Signup';
import { Home } from './Routes/Home';
import { Login } from './Routes/Login';
import { Userdashboard } from './Routes/Userdashboard';
import { Create } from './Routes/Create';
import { PageNotFound } from './Routes/PageNotFound';
import { Logout } from './Routes/Logout';
import { User } from './Routes/User';
import { Createsee } from './Routes/Createsee';
import { Forum } from './Routes/Forum';
import { Admindashboard } from './Routes/Admindashboard';
import { Tag } from './Routes/Tag';
import { ForumQues } from './Routes/ForumQues';
import { Reportcreate } from './Routes/Reportcreate';
import { Blog } from './Routes/Blog';
import { Notification } from './Routes/Notification';

function App() {
  return (
    <>
      <BrowserRouter>
        <>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/userdashboard" element={<Userdashboard />} />
            <Route path="/create" element={<Create />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/user/:slug" element={<User />} />
            <Route path="/tag/:slug" element={<Tag />} />
            <Route path="/createsee/:slug" element={<Createsee />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/admindashboard" element={<Admindashboard />} />
            <Route path="/forum/ques/:slug" element={<ForumQues />} />
            <Route path="/report/create/:slug" element={<Reportcreate />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/notification" element={<Notification />} />
          </Routes>
        </>
      </BrowserRouter>
    </>
  );
}

export default App;
