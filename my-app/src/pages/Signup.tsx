import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireAuth } from "../firebase/firebase";
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  // このクリアなくてもいいかも
  sessionStorage.clear();
  // const [displayName, setUserName] = useState<string | null>(null);
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

  return (
    <div>
      <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
        <label>Display Name: </label>
        <input
          type="string"
          value={displayName}
          onChange={(e) => setUserName(e.target.value)}
        ></input>
      </form>
      <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
        <label>Email: </label>
        <input
          type="string"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </form>
      <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
        <label>Password (6 characters minimum): </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </form>
      <div className="button-container">
        <button type={"submit"} onClick={createuser} >
            新規ユーザー作成
        </button>
        <button onClick={signInWithEmailandPassword}>
          ログインページへ
        </button>
      </div>
    </div>
    
  );
};
export default Signup;