import React from "react";
// import "../App.css";
import "../css/Post.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
// import SpeechInput from './Speech';

interface UserData {
  name: string;
  uid: string;
  email: string;
}

interface Tweet {
  posted_by: string;
  content: string;
}

function Post() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const goToHomePage = () => {
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
      let user =sessionStorage.getItem('user');
      if (user) {
        let user_ob = JSON.parse(user);
        console.log(user_ob);
        let posted_by = user_ob.uid;
        let display_name = user_ob.displayName;
        const response = await fetch(
          // "http://localhost:8000/tweet",
          "https://hackathon-back-xydruijzdq-uc.a.run.app/tweet",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content,
              posted_by,
              display_name,
            }),
          }
        );
        if (response.status === 200) {
          // fetchUsers();
        } else {
          console.error("POST request failed")
        }
        setContent("");
        navigate('/')
      } else {
        navigate('/login');
        // return <></>
      }
    } catch (err) {
      console.error(err)
    }
  };


  return (
    // <div className="App">
    //   <div>
    //     <button onClick={goToHomePage}>
    //       ホーム画面へ
    //     </button>
    //   </div>
    //     <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
    //       <div>
    //         <label className="white-text">What' new?: 
    //         <input
    //           type={"text"}
    //           value={content}
    //           onChange={(e) => setContent(e.target.value)}
    //           className="txt_1"
    //         ></input></label>
    //       </div>
    //       <button type={"submit"} className="button-container button">POST</button>
    //     </form>
    // </div>
    <div className="App">
      <div className="header">
        <button onClick={goToHomePage} className="home-button">
          ホーム画面へ
        </button>
      </div>
      <form className="tweet-form" onSubmit={handleSubmit}>
        <div className="tweet-box">
          {/* <img src="profile-placeholder.png" alt="Profile" className="profile-pic" /> */}
          <div className="tweet-input-container">
            <textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="tweet-input"
            ></textarea>
            {/* <SpeechInput /> */}
          </div>
        </div>
        <div className="tweet-footer">
          <span className="char-count">{200 - content.length}</span>
          <button type="submit" className="tweet-button" disabled={content.length === 0}>
            投稿
          </button>
        </div>
      </form>
    </div>
    );
  }

  export default Post;