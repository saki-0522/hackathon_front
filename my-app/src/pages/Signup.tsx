import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireAuth } from "../firebase/firebase";
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button, Modal, Paper, TextField, Typography } from '@mui/material';
import "../App.css";


const Signup: React.FC = () => {
  // このクリアなくてもいいかも
  sessionStorage.clear();
  const [displayName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const sendUserInfo = async (user: { uid: string, displayName: string | null, email: string | null }) => {
    const userInfo = {
      uid: user.uid,
      displayName: displayName,
      email: user.email,
    };

    try {
      // const response = await fetch('http://localhost:8000/user', {
      const response = await fetch('https://hackathon-back-xydruijzdq-uc.a.run.app/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
      
      if (response.ok) {
        const resData = await response.json();
        console.log('ユーザー情報が正常に送信されました:', resData);
      } else {
        console.error('ユーザー情報の送信に失敗しました:', response.status, response.statusText);
        navigate("/signup");
      }
    } catch (error) {
      console.error('ユーザー情報の送信中にエラーが発生しました:', error);
      navigate("/signup");
    }
  };
  
  const createuser = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      alert("ログインユーザー: " + displayName);
      setUserName(displayName);
      sendUserInfo(user);
      sessionStorage.setItem('user', JSON.stringify({...user, displayName: displayName, email: email, uid: user.uid}));
      navigate('/');
    }).catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
  });
  }
  console.log(displayName);

  const signInWithEmailandPassword = () => {
    navigate('/login');
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
  }

  const isFormValid = email !== '' && password !== '' && displayName !== '';

  return (
    // <div>
    //   <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
    //     <label>Display Name: </label>
    //     <input
    //       type="string"
    //       value={displayName}
    //       onChange={(e) => setUserName(e.target.value)}
    //     ></input>
    //   </form>
    //   <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
    //     <label>Email: </label>
    //     <input
    //       type="string"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     ></input>
    //   </form>
    //   <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
    //     <label>Password (6 characters minimum): </label>
    //     <input
    //       type="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     ></input>
    //   </form>
    //   <div className="button-container">
    //     <button type={"submit"} onClick={createuser} >
    //         新規ユーザー作成
    //     </button>
    //     <button onClick={signInWithEmailandPassword}>
    //       ログインページへ
    //     </button>
    //   </div>
    // </div>
    <>
    <Container>
      {/* <Button onClick={handleOpen}>ログイン画面へ</Button> */}
      {/* <Modal open={open} onClose={handleOpen}> */}
        <StyledPaper>
          <form className='form' onSubmit={handleSubmit}>
            <Typography variant={'h5'} className='word'>Sign Up</Typography>
            <TextField
                label="表示名"
                variant="standard"
                className="text"
                value={displayName}
                onChange={(e) => setUserName(e.target.value)}
            />
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
            <center><Button className="login button3 ${!isFormValid ? 'disabled-button' : ''}" onClick={createuser} type={"submit"} disabled={!isFormValid}>新規ユーザー作成</Button></center>
            <center><Button className="signup button3" onClick={signInWithEmailandPassword}>ログインページへ</Button></center>
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
  background-color: #f0f0f0;
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

export default Signup;