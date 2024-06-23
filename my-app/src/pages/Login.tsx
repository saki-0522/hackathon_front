import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button, Modal, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireAuth } from "../firebase/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "../App.css";


const Login = () => {
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => {
//     setOpen((prevOpen) => !prevOpen);
//   };

sessionStorage.clear();
const [userName, setUserName] = useState<string | null>(null);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

const signInWithEmailandPassword = () => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password).then(async (userCredential: { user: any; }) => {
    // Signed in 
    const user = userCredential.user;
  
      console.log(user.uid)
    
    // エラーハンドリング
    // const getResponse = await fetch(`http://localhost:8000/user?uid=${user.uid}`, {
    const getResponse = await fetch(`https://hackathon-back-xydruijzdq-uc.a.run.app/user?uid=${user.uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }})
      const res = await getResponse.json();
      console.log(res);
      let displayName = "";
    if (res.length > 0) {
      sessionStorage.setItem('user', JSON.stringify({...user, displayName: res[0].name}));
      displayName = res[0].name;
      
    }else{
      throw new Error()
    }
    

    alert("ログインユーザー: " + displayName);
    setUserName(displayName)
    navigate('/');
    }).catch((err: any) => {
      alert(err);
    });
    }

    const goToSignupPage = () => {
    navigate('/signup');
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    }

  const isFormValid = email !== '' && password !== '';

  return (
    <>
    <Container>
        <StyledPaper>
          <form className='form' onSubmit={handleSubmit}>
            <Typography variant={'h5'} className='word'>ログイン</Typography>
            <TextField
                label="メールアドレス"
                variant="standard"
                className="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="パスワード"
                type="password"
                variant="standard"
                className="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {/* <TextField label="メールアドレス" variant="standard" className="text" /> */}
            {/* <TextField label="パスワード" type="password" variant="standard" className="text" /> */}
            <center><Button className="login button3 ${!isFormValid ? 'disabled-button' : ''}" onClick={signInWithEmailandPassword}
            disabled={!isFormValid}
            >ログイン</Button></center>
            <center><Button className="signup button3" onClick={goToSignupPage}>新規会員登録はこちら</Button></center>
            {/* <center><Button  variant="outlined">閉じる</Button></center> */}
          </form>
        </StyledPaper>
      {/* </Modal> */}
    </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 画面全体の高さを使用 */
  background-color: white;
  flex-direction: column;
`;

const StyledPaper = styled(Paper)`
  display: flex;
  justify-content: center;
  width: 960px;
  height: 540px;
  .form {
    width: 60%;
    margin: 3rem;
    text-align: center;
  }
  .text {
    width: 100%;
    margin: 1rem 0;
  }
  .btn {
    width: 60%;
    color: white;
    text-align: center;
    margin: 1.5rem 0;
  }
  .login {
    background-color: white;
    color: #1DA1F2;
    border: 1px solid #999999;
  }
  .signup {
    background-color: #1DA1F2;
    color: white;
  }
  .button3 {
    font-weight: bold;
    font-size: 20px;
    width: 60%;
    border-radius: 999px;
    padding: auto;
    height: 45px;
    margin: 1.5rem 0;
  }
  .word {
    color: #1DA1F2;
    font-weight: bold;
  }
`;

export default Login;