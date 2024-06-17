import React from "react";
import "../App.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { initializeApp } from "firebase/app";

interface UserData {
  name: string;
  uid: string;
  email: string;
}

interface Tweet {
  posted_by: string;
  content: string;
}

interface ReplyTweetPost {
    reply_tweet_id: string;
    posted_by: string;
    posted_at: string;
    content: string;
    owner_id: string;
}

interface ReplyTweetGet {
    display_name: string;
    reply_content: string;
    time: string;
}



function EachPost() {
  const [content, setContent] = useState("");
  const [replies, setReplyTweetGet] = useState<ReplyTweetGet[]>([]);
  const navigate = useNavigate();

  let initialPost = sessionStorage.getItem('content');
  let ini_tweet_id = sessionStorage.getItem('post_id')

  const goToHomePage = () => {
    sessionStorage.removeItem('content');
    sessionStorage.removeItem('post_id');
    sessionStorage.removeItem('posted_by');
    sessionStorage.removeItem('displayName');
    navigate('/');
  }
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    if (!content)
    {
      alert("Nothing to post");
      goToHomePage();
    }

    

    try{
        // user情報ではなくてtweet情報もssesionStrogeに入れておく
        // Home画面で処理？
        // 現在ログインしているuser情報
      let user =sessionStorage.getItem('user');
      if (user) {
        let user_ob = JSON.parse(user);
        let posted_by = user_ob.uid;
        let display_name = user_ob.displayName;
        const response = await fetch(
          "http://localhost:8000/reply",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content,
              posted_by,
              ini_tweet_id,
              display_name
            }),
          }
        );
        if (response.status === 200) {
          // fetchUsers();
        } else {
          console.error("POST request failed")
        }
        setContent("");
      } else {
        goToHomePage();
      }
    } catch (err) {
      console.error(err)
    }


    const fetchReply = async () => {
        try{
        let posted_by = sessionStorage.getItem('posted_by')
          const getResponse = await fetch(`http://localhost:8000/reply?ini_tweet_id=${ini_tweet_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        
          if (getResponse.status === 200) {
            const reply = await getResponse.json();
            setReplyTweetGet(reply);
            fetchReply();
          } else {
            console.error("Reply GET request failed");
          }
        } catch (err) {
          console.error(err)
        }
      };
    
    };
    // useEffect(() => {
    // fetchTweets();
    // },[]);



  return (
    <div className="App">
      <div>
        <button onClick={goToHomePage}>
          ホーム画面へ
        </button>
      </div>
      <div className="text_2">
        <p>
            { initialPost }
        </p>
      </div>
        <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
            <div>
            <label className="white-text">Reply: 
            <input
                type={"text"}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="txt_1"
            ></input></label>
            </div>
            <button type={"submit"} className="button-container button">POST</button>
        </form>
        <div>
        {/* 文字情報をsesstionStrageに入れたい→どうすればいいのかわかんないよねー */}
            {replies.map((reply, index) => (
            <div key={index} className="txt_2">
                <button>
                <p>{reply.display_name} {reply.reply_content}</p>
                </button>
            </div>
            ))}
        </div>
    </div>
    );
  }

  export default EachPost;