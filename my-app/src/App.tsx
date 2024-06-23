import React, { useState } from 'react';
// import logo from './logo/logo.svg';
import './App.css';
import LoginForm from "./pages/LoginFrom"
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth } from './firebase/firebase';
// import Contents from './Contexts.tsx'
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom"
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Post from './pages/Post';
import EachPost from './pages/Each_Post';
import First from './pages/First';
import Login from './pages/Login';
import VideoStream from './pages/Video'
import Human from './pages/Human'

function App() {
  // stateとしてログイン状態を管理する。ログインしていないときはnullになる。
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
  
  // ログイン状態を監視して、stateをリアルタイムで更新する
  onAuthStateChanged(fireAuth, user => {
    setLoginUser(user);
  });

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post" element={<Post />} />
          <Route path="/eachpost" element={<EachPost />} />
          <Route path="/first" element={<First />} />
          <Route path="/video" element={<VideoStream />} />
          <Route path="/human" element={<Human />} />
        </Routes>
      </div>

      
    </div>
  );
}

export default App;

