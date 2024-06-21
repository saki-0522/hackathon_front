import React, { useState } from 'react';
// import logo from './logo/logo.svg';
import './App.css';
import LoginForm from "./pages/Login"
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth } from './firebase/firebase';
// import Contents from './Contexts.tsx'
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom"
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Post from './pages/Post';
import EachPost from './pages/Each_Post';
import First from './pages/First';


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
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post" element={<Post />} />
          <Route path="/eachpost" element={<EachPost />} />
          <Route path="/first" element={<First />} />
        </Routes>
      </div>

      <div className="BottomBar">
        <p>© 2024 Y Corp.</p>
      </div>
    </div>
  );
}

export default App;

