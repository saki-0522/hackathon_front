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
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        {/* <LoginForm /> */}
        {/* UserがログインしていたらHomeに移動 */}
        {/* {loginUser ? <Home /> : <LoginForm />} */}
        {/* <Router> */}
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/post" element={<Post />} />
              <Route path="/eachpost" element={<EachPost />} />
            </Routes>
          </div>
        {/* </Router> */}
      </header>

    </div>
  );
}

export default App;

