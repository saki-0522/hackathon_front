import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireAuth } from "../firebase/firebase";
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
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
      const getResponse = await fetch(`http://localhost:8000/user?uid=${user.uid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }})
        const res = await getResponse.json();
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

  return (
    <div>
      <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
        <label>Email: </label>
        <input
          type="string"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </form>
      <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
        <label>Password: </label>
        <input
          type="string"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </form>
      <div className="button-container">
        <button onClick={signInWithEmailandPassword}>
          メール・パスワードでログイン
        </button>
        <button onClick={goToSignupPage}>
          新規ユーザー作成へ
        </button>
      </div>
    </div>
    
  );
};
export default LoginForm;