import React from "react";
import "../App.css";
import { useState } from "react";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { fireAuth } from "../firebase/firebase";


interface UserData {
  name: string;
  age: number;
}

function Home() {
  const [age, setAge] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [userData, setUserData] = useState<UserData[]>([]);
  const navigate = useNavigate();
  const user_string = sessionStorage.getItem('user');
  let user;
  
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    if (!name) {
      alert("Please enter name");
      return;
    }
    
    if (name.length > 50) {
      alert("Please enter a name shorter than 50 characters");
      return;
    }
    
    if (age < 20 || age > 80) {
      alert("Please enter age between 20 and 80");
      return;
    }
    
    try{
      const response = await fetch(
        "http://localhost:8000/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            age,
          }),
        }
        );
        if (response.status === 200) {
          fetchUsers();
        } else {
          console.error("POST request failed")
        }
        
        setName("");
        setAge(0);
      } catch (err) {
        console.error(err)
      }
    };
    const fetchUsers = async () => {
      try{
        const getResponse = await fetch("http://localhost:8000/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (getResponse.status === 200) {
          // GETリクエストの結果を処理
          const userData = await getResponse.json();
          setUserData(userData);
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
    fetchUsers();
  },[]);
  
  if (user_string) {
    user = JSON.parse(user_string);
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

  return (
    <div className="App">
      {user.displayName}
        <button onClick={signOutWithEmailAndPassword}>
        ログアウト
      </button>
    </div>
    );
  }

  export default Home;