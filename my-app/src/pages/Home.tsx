import React from "react";
import "../App.css";
import "../css/Eachpost.css";
import { useState } from "react";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { fireAuth } from "../firebase/firebase";
import { Box, Card, CardContent, CardActions, Button, Typography, IconButton, Container } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PostAddIcon from '@mui/icons-material/PostAdd';

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
  like_count: number;
  status: number;
  display_name: string;
  parent_id: string;
}

interface ParentTweet {
  tweet_id: string;
  user_id: string;
  content: string;
}

async function Liked(post_id: string, id: string, status: number, parent_id: string): Promise<void>{
  let user =sessionStorage.getItem('user');
  if (user) {
    let user_ob = JSON.parse(user);
    id = user_ob.uid;
  }
  // console.log(id)
  try {
    const response = await fetch(
      `https://hackathon-back-xydruijzdq-uc.a.run.app/heart?status=${status}&uid=${id}`,
      // `http://localhost:8000/heart?status=${status}&uid=${id}`,
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
      console.log(status);
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
  const [parents, setParent] = useState<ParentTweet[]>([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const goToPostPage = () => {
    navigate('/post');
  }
  

  const fetchTweets = async () => {
    try{
      let user =sessionStorage.getItem('user');
      if (user) {
        let user_ob = JSON.parse(user);
        const getResponse = await fetch(`https://hackathon-back-xydruijzdq-uc.a.run.app/tweet?uid=${user_ob.uid}`, {
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
    navigate('/');
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
  
  const PostButton = () => {
    return (
      <IconButton color="primary" aria-label="home" onClick={goToPostPage}>
        <PostAddIcon />
      </IconButton>
    );
  };

  const getParentContent = async (parent_id: string) => {
    try{
        // const getResponse = await fetch(`http://localhost:8000/tweet?uid=${parent_id}`, {
        const getResponse = await fetch(`https://hackathon-back-xydruijzdq-uc.a.run.app/tweet?uid=${parent_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (getResponse.status === 200) {
          // GETリクエストの結果を処理
          const parents = await getResponse.json();
          setParent(parents);
          getParentContent(parent_id);
          // userDataを適切に処理するコードをここに追加
        } else {
          // GETリクエストが失敗した場合の処理
          console.error("GET request failed");
        }
    } catch (err) {
    console.error(err)
    }
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

  const handleSearch = async () => {
    try {
      let user = sessionStorage.getItem('user');
      if (user) {
        const getResponse = await fetch(`https://hackathon-back-xydruijzdq-uc.a.run.app/tweet/search?search=${searchTerm}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (getResponse.status === 200) {
          const tweets = await getResponse.json();
          setTweet(tweets);
        } else {
          console.error("GET request failed");
        }
      }
    } catch (err) {
      console.error(err)
    }
  };

  const goToPhotoPage = (post_id: string, id: string, parent_id: string) => {
    sessionStorage.setItem('post_id', post_id);
    sessionStorage.setItem('id', id);
    sessionStorage.setItem('parent_id', parent_id);
    navigate('/video');
  }

  return (
    // <div className="App">
    //   <div>
    //     <button onClick={goToPostPage}>
    //       投稿
    //     </button>
    //   </div>
    //   <div className="logout-button">
    //     <button onClick={signOutWithEmailAndPassword}>
    //       ログアウト
    //     </button>
    //     <div>
    //     <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="検索キーワードを入力" />
    //     <button onClick={handleSearch}>
    //       検索
    //     </button>
    //   </div>
    //   </div>
    <div className="container">
      <div className="menu">
        <div className="item">
          <div className="put">
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
              </p>
            </div>
          </div>
      <Box>
        {tweets && tweets.length > 0 && tweets.map((tweet, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1">
                FROM {tweet.display_name}
              </Typography>
              <Typography 
                variant="body1"
                component="span"
                onClick={() => goToEachPostPage(tweet.tweet_id, tweet.content)}
                // sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
              >
                {tweet.content}
              </Typography>
            </CardContent>
            <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
              <IconButton  
                onClick={() => goToEachPostPage(tweet.tweet_id, tweet.content)}
              >
                {<ChatBubbleIcon />}
              </IconButton>
              <IconButton 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  goToPhotoPage(tweet.tweet_id, tweet.posted_by, tweet.parent_id);
                  Liked(tweet.tweet_id, tweet.posted_by, tweet.status, tweet.parent_id);
                }}
              >
                {tweet.status === 1 ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {tweet.like_count}
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

export default Home;