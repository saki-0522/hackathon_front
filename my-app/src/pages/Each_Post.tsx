import React from "react";
import "../App.css";
import { useState } from "react";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { fireAuth } from "../firebase/firebase";
import { convertToObject } from "typescript";

interface UserData {
  name: string;
  age: number;
}

interface Reply {
    tweet_id: string;
    posted_by: string;
    posted_at: string;
    content: string;
    likes_count: number;
    status: number;
    display_name: string;
    parent_id: string;
}

// interface ReplyTweetGet {
//     display_name: string;
//     reply_content: string;
//     time: string;
// }

async function Liked(post_id: string, id: string, status: number, parent_id: string): Promise<void>{
    let user =sessionStorage.getItem('user');
    console.log(post_id, id, status, parent_id);
    if (user) {
        let user_ob = JSON.parse(user);
        id = user_ob.uid;
    }
    console.log(status)
    try {
    const response = await fetch(
        `http://localhost:8000/heart?status=${status}&uid=${id}`,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            post_id,
            id,
            parent_id,
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

function EachPost() {
    const [content, setContent] = useState("");
    const [replies, setReplyTweetGet] = useState<Reply[]>([]);
    const navigate = useNavigate();
  
    let initialPost = sessionStorage.getItem('content');
    let parent_id = sessionStorage.getItem('post_id')

  const goToHomePage = () => {
    sessionStorage.removeItem('content');
    sessionStorage.removeItem('post_id');
    sessionStorage.removeItem('posted_by');
    sessionStorage.removeItem('displayName');
    navigate('/');
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    if (!content) {
      alert("Nothing to post");
      return;
    }

    try{
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
              parent_id,
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
        goToHomePage();
      } else {
        goToHomePage();
      }
    } catch (err) {
      console.error(err)
    }
  };

  const goToEachPostPage = (post_id: string, content: string) => {
    sessionStorage.setItem('post_id', post_id);
    sessionStorage.setItem('content', content);
    // navigate('/eachpost', { replace: true });
    window.location.reload();
  }


    // async function Liked(post_id: string, id: string, status: number, parent_id: string): Promise<void>{
    //     let user =sessionStorage.getItem('user');
    //     if (user) {
    //         let user_ob = JSON.parse(user);
    //         id = user_ob.uid;
    //     }
    //     // console.log(id)
    //     try {
    //     const response = await fetch(
    //         `http://localhost:8000/heart?status=${status}&uid=${id}`,
    //         {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             post_id,
    //             id,
    //             parent_id,
    //         }),
    //         }
    //     );
    //     if (response.status === 200) {
    //         // fetchUsers();
    //     } else {
    //         console.error("POST request failed")
    //     }
    //     } catch (err){
    //     console.error(err)
    //     }
    // }

    const fetchReply = async () => {
        try{
        // console.log(parent_id)
        const getResponse = await fetch(`http://localhost:8000/reply?parent_id=${parent_id}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
      });
    
        if (getResponse.status === 200) {
            // GETリクエストの結果を処理
            const replies = await getResponse.json();
            setReplyTweetGet(replies);
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
    fetchReply();
  },[]);

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
            {replies && replies.length > 0 && replies.map((reply, index) => (
            <div key={index} className="txt_2">
                <button onClick={() => goToEachPostPage(reply.tweet_id, reply.content)}>
                <p>{reply.display_name} {reply.content}</p>
                </button>
                <button onClick={() => Liked(reply.tweet_id, reply.posted_by, reply.status, reply.parent_id)}>
                    <p>{reply.status === 1 ? '❤️' : '♡'} {reply.likes_count}</p>
                </button>
            </div>
            ))}
        </div>
    </div>
    );
  }

export default EachPost;