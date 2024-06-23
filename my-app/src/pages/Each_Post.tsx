import React from "react";
import "../css/Eachpost.css";
import { useState } from "react";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { fireAuth } from "../firebase/firebase";
import { convertToObject } from "typescript";
import logo from '../logo/account.svg';
import { AppBar, Toolbar, IconButton, Typography, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Card, CardContent, CardActions, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PostAddIcon from '@mui/icons-material/PostAdd';


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

async function Liked(post_id: string, id: string, status: number, parent_id: string): Promise<void>{
    let user =sessionStorage.getItem('user');
    console.log(status);
    if (user) {
        let user_ob = JSON.parse(user);
        id = user_ob.uid;
    }
    console.log(status);
    try {
    const response = await fetch(
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
        window.location.reload();
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

  const goToPhotoPage = () => {
    console.log("test");
    sessionStorage.removeItem('content');
    sessionStorage.removeItem('post_id');
    sessionStorage.removeItem('posted_by');
    sessionStorage.removeItem('displayName');
    navigate('/video');
  }

  const HomeButton = () => {
    return (
      <IconButton color="primary" aria-label="home" onClick={goToHomePage}>
        <HomeIcon />
      </IconButton>
    );
  };

  const PostButton = () => {
    return (
      <IconButton color="primary" aria-label="home" onClick={goToPostPage}>
        <PostAddIcon />
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

    const fetchReply = async () => {
        var user_id;
        let user =sessionStorage.getItem('user');
        if (user) {
            let user_ob = JSON.parse(user);
            user_id = user_ob.uid;
        }
        try{
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
            // fetchReply();
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
    const timer = setTimeout (() => {
      fetchReply();
      navigate('/eachpost')
    }, 1000);
    return () => 
    clearTimeout(timer);
  },[]);

  let user = sessionStorage.getItem('user');
  if (user) {
    user = JSON.parse(user);
  } else {
    navigate('/login');
    return <></>
  }

  const isFormValid = content !== '';

  return (
    <div className="container">
      <div className="menu">
        <div className="item">
          <div className="put">
            {/* <Container className="item2"> */}
              <HomeButton />
              <button onClick={goToHomePage} className="button2">
                HOME
              </button>
            {/* </Container> */}
          </div>
          <div>
            <PostButton />
            <button onClick={goToPostPage} className="button2">
              POST
            </button>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="item">
          <div className="EachPost">
            <div className="under">
              <p className="text3 left-align">
                {initialPost}
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
                    className="reply reply-content"
                    type={"text"}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ backgroundColor: 'inherit', border: 'none', fontSize: '20px' }}
                    onBlur={() => {
                      if (content === '') {
                        setFlag(true);
                      }
                    }}
                    placeholder="投稿内容を入力"
                  ></input>
                </label>
              </div>
              <div className="right-align">
                <button
                  type="submit"
                  className={`reply create ${!isFormValid ? 'disabled-button' : ''} button3`}
                  disabled={!isFormValid}
                >
                  Reply
                </button>
              </div>
            </div>
          </form>
          <Box>
            {replies && replies.length > 0 && replies.slice().reverse().map((reply, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1">
                    FROM {reply.display_name}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="span"
                    onClick={() => goToEachPostPage(reply.tweet_id, reply.content)}
                    sx={{ cursor: 'pointer', color: 'primary.main' }}
                  >
                    {reply.content}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
                  <IconButton onClick={() => goToEachPostPage(reply.tweet_id, reply.content)}>
                    {<ChatBubbleIcon />}
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // イベントのバブリングを停止する
                      // if (reply.status === 0) {
                        goToPhotoPage(); // statusが1の場合、goToPhotoPage関数を呼び出す
                      // } else {
                        Liked(reply.tweet_id, reply.posted_by, reply.status, reply.parent_id); // それ以外の場合、Liked関数を呼び出す
                      // }
                    }}
                  >
                    {reply.status === 1 ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {reply.like_count}
                    </Typography>
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        </div>
      </div>
    </div>
    );
  }

export default EachPost;