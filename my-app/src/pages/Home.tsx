import React from "react";
import "../App.css";
import { useState } from "react";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { fireAuth } from "../firebase/firebase";


interface UserData {
  name: string;
  uid: string;
  email: string;
  // age: number;
}

interface Tweet {
  tweet_id: string;
  posted_by: string;
  posted_at: string;
  content: string;
}

function Home() {
  const [tweets, setTweet] = useState<Tweet[]>([]);
  const navigate = useNavigate();

  const goToPostPage = () => {
    navigate('/post');
  }

  const fetchTweets = async () => {
    try{
      const getResponse = await fetch("http://localhost:8000/tweet", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (getResponse.status === 200) {
        // GETリクエストの結果を処理
        const tweets = await getResponse.json();
        setTweet(tweets);
        fetchTweets();
        // userDataを適切に処理するコードをここに追加
      } else {
        // GETリクエストが失敗した場合の処理
        console.error("GET request failed");
    }
  } catch (err) {
    console.error(err)
  }
  };
  
  useEffect(() => {
    fetchTweets();
  },[]);
    
  let user = sessionStorage.getItem('user');
  if (user) {
    user = JSON.parse(user);
  } else {
    navigate('/login');
    return <></>
  }

  const signOutWithEmailAndPassword = () => {
    signOut(fireAuth).then(() => {
      sessionStorage.clear();
      alert("ログアウトしました");
      navigate('/login');
    }).catch(err => {
      alert(err);
    });
    }

  return (
    <div className="App">
      <div>
        <button onClick={goToPostPage}>
          投稿
        </button>
      </div>
      <div className="user-info">
        {/* { user.displayName } */}
      </div>
      <div className="logout-button">
        <button onClick={signOutWithEmailAndPassword}>
          ログアウト
        </button>
      </div>
      <div>
        {/* 文字情報をsesstionStrageに入れたい→どうすればいいのかわかんないよねー */}
        {tweets.map((tweet, index) => (
          <div key={index} className="txt_2">
            <p>{tweet.posted_at}, {tweet.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;