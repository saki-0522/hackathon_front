import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireAuth } from "../firebase/firebase";
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signInWithEmailandPassword = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password).then((userCredential: { user: any; }) => {
      // Signed in 
      const user = userCredential.user;
      alert("ログインユーザー: " + user.displayName);
      setUserName(user.displayName)
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