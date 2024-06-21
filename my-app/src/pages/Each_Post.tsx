import React from "react";
import "../App.css";
import { useState } from "react";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { fireAuth } from "../firebase/firebase";
import { convertToObject } from "typescript";
import MenuBar from './MenuBar';
import logo from '../logo/account.svg';
import { AppBar, Toolbar, IconButton, Typography, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface UserData {
  name: string;
  age: number;
}



interface Reply {
    tweet_id: string;
    posted_by: string;
    posted_at: string;
    content: string;
    like_count: number;
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
    if (user) {
        let user_ob = JSON.parse(user);
        id = user_ob.uid;
    }
    console.log(status)
    try {
    const response = await fetch(
        // `http://localhost:8000/heart?status=${status}&uid=${id}`,
        `https://hackathon-back-xydruijzdq-uc.a.run.app/heart?status=${status}&uid=${id}`,
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
    const [flag, setFlag] = useState(false);
  
    let initialPost = sessionStorage.getItem('content');
    let parent_id = sessionStorage.getItem('post_id')

  const goToHomePage = () => {
    sessionStorage.removeItem('content');
    sessionStorage.removeItem('post_id');
    sessionStorage.removeItem('posted_by');
    sessionStorage.removeItem('displayName');
    navigate('/');
  }

  const goToPostPage = () => {
    sessionStorage.removeItem('content');
    sessionStorage.removeItem('post_id');
    sessionStorage.removeItem('posted_by');
    sessionStorage.removeItem('displayName');
    navigate('/post');
  }

  const HomeButton = () => {
    return (
      <IconButton color="primary" aria-label="home" onClick={goToHomePage}>
        <HomeIcon />
      </IconButton>
    );
  };

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
        //   "http://localhost:8000/reply",
          "https://hackathon-back-xydruijzdq-uc.a.run.app/reply",
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
    //         `https://hackathon-back-xydruijzdq-uc.a.run.app/heart?status=${status}&uid=${id}`,
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
        var user_id;
        let user =sessionStorage.getItem('user');
        if (user) {
            let user_ob = JSON.parse(user);
            user_id = user_ob.uid;
        }
        try{
        // console.log(parent_id)
        // const getResponse = await fetch(`http://localhost:8000/reply?parent_id=${parent_id}&uid=${user_id}`, {
        const getResponse = await fetch(`https://hackathon-back-xydruijzdq-uc.a.run.app/reply?parent_id=${parent_id}&uid=${user_id}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
      });
    
        if (getResponse.status === 200) {
            // GETリクエストの結果を処理
            const replies = await getResponse.json();
            setReplyTweetGet(replies);
            fetchReply();
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
    navigate('/eachpost')
  },[]);

  let user = sessionStorage.getItem('user');
  if (user) {
    user = JSON.parse(user);
  } else {
    navigate('/login');
    return <></>
  }

  return (
    // <div className="twitter__block">
    //   <figure>
    //     <img src="icon.png" />
    //   </figure>
    //   <div className="twitter__block-text">
    //     <div className="name">うさきち<span className="name_reply">@usa_tan</span></div>
    //     <div className="date">1時間前</div>
    //     <div className="text">
    //       残業でお腹空いたから朝までやってるお店でラーメン食べることにした(^o^)神の食べ物すぎる・・うまぁ
    //       <div className="in-pict">
    //         {/* <img src="sample.jpg"> */}
    //       </div>
    //     </div>
    //     <div className="twitter__icon">
    //       <span className="twitter-bubble">1</span>
    //       <span className="twitter-loop">4</span>
    //       <span className="twitter-heart">122</span>
    //     </div>
    //   </div>
    // </div>
    <div className="Menu">
      <div className="item">
        {/* <MenuBar onSignOut={goToHomePage} /> */}
        <div className="put "><Container className="item2">
            <HomeButton />
          <button onClick={goToHomePage} className="button2 item2">
              HOME
          </button>
          </Container>
        </div>
        <div>
          <button onClick={goToPostPage} className="button2">
              POST
          </button>
        </div>
      </div>
      <div className="item">
        <div className="EachPost">
          <div className="under">
            <p className="text3 left-align">
                { initialPost }
            </p>
          </div>

          </div>
            <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
                <div className="put">
                  <div className="item1">
                    <img src={logo} className="circular-image" alt="logo" />
                  </div>
                  <div>
                    <label>
                    <input
                        className="reply"
                        type={"text"}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ backgroundColor: 'inherit', border: 'none', color: 'white',}}
                        onBlur={() => {
                          if (content === '') {
                            setFlag(true);}
                          }}
                        placeholder={flag ? 'Post your reply' : ''}
                        ></input></label>
                    </div>
                    <div className=".right-align">
                      {/* {!flag && ( */}
                          <button type="submit" className="button3 create">Reply</button>
                      {/* )} */}
                      {/* <button type={"submit"} className="button3 create">Reply</button> */}
                    </div>
                  </div>
            </form>
            <div className="tweet">
              {replies && replies.length > 0 && replies.map((reply, index) => (
                <div key={index} className="txt_2">
                  <button onClick={() => goToEachPostPage(reply.tweet_id, reply.content)} className="inside-tweet">
                  <p>{reply.display_name} {reply.content}</p>
                  </button>
                  <button onClick={() => Liked(reply.tweet_id, reply.posted_by, reply.status, reply.parent_id)} className="inside-tweet">
                      <p>{reply.status === 1 ? '❤️' : '♡'} {reply.like_count}</p>
                  </button>
              </div>
              ))}
            </div>
          </div>
        </div>
    // </div>
    );
  }

export default EachPost;