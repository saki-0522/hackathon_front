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
  likes_count: number;
  status: number;
}

async function Liked(post_id: string, id: string): Promise<void>{
  let user =sessionStorage.getItem('user');
    if (user) {
      let user_ob = JSON.parse(user);
      id = user_ob.uid;
    }
  // console.log(id)
  try {
    const response = await fetch(
      "http://localhost:8000/heart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id,
          id,
        }),
      }
    );
    if (response.status === 200) {
      // fetchUsers();
    } else {
      console.error("POST request failed")
    }
  } catch (err){
    console.error(err)
  }
}

function Home() {
  const [tweets, setTweet] = useState<Tweet[]>([]);
  const navigate = useNavigate();

  const goToPostPage = () => {
    navigate('/post');
  }
  

  const fetchTweets = async () => {
    try{
      let user =sessionStorage.getItem('user');
      if (user) {
        let user_ob = JSON.parse(user);
        const getResponse = await fetch(`http://localhost:8000/tweet?uid=${user_ob.uid}`, {
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
          // console.log(tweets);
          // userDataを適切に処理するコードをここに追加
        } else {
          // GETリクエストが失敗した場合の処理
          console.error("GET request failed");
        }
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

  const goToEachPostPage = (post_id: string, content: string) => {
    let user =sessionStorage.getItem('user');
    if (user) {
      let user_ob = JSON.parse(user);
      sessionStorage.setItem('posted_by', user_ob.uid);
      sessionStorage.setItem('displayName', user_ob.displayName);
    }
    sessionStorage.setItem('post_id', post_id);
    sessionStorage.setItem('content', content);
    navigate('/eachpost');
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
            <button onClick={() => goToEachPostPage(tweet.tweet_id, tweet.content)}>
              <p>{tweet.posted_at}, {tweet.content}</p>
            </button>
            <button onClick={() => Liked(tweet.tweet_id, tweet.posted_by)}>
              <p>{tweet.status === 1 ? '❤️' : '♡'} {tweet.likes_count}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;