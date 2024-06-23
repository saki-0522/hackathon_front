import React from "react";
import "../App.css";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Portal, Paper } from '@mui/material';
import styled from '@emotion/styled';

function First() {
    const navigate = useNavigate();

    const goToSignupPage = () => {
        navigate('/signup');
    }

    const goToLoginPage = () => {
        navigate('/login');
    }

    return (
        // <div className="page">
        <Container>
            <StyledPaper>
                <div>
                    <button onClick={goToSignupPage} className="button3 signup">
                        Create account
                    </button>
                </div>
                <p className="text word1">
                By signing up, you agree to the Terms of Service and Privacy
                </p>
                <p className="text word1">
                Policy, including Cookie Use.
                </p>
                <p className="word2">
                    Already have an account?
                </p>
                <div>
                    <button onClick={goToLoginPage} className="button3 login">
                        Sign In
                    </button>
                </div>
            </StyledPaper>
        </Container>
        // </div>
    );
  }

const StyledPaper = styled(Paper)`
  display: flex;
  justify-content: center;
  width: 960px;
  height: 540px;
  flex-direction: column;
  .form {
    width: 60%;
    margin: 3rem;
    text-align: center;
  }
  .text {
    width: 100%;
    margin: 0;
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
  .word1 {
    font-size: 16px;
    color: #999999;
  }
  .word2 {
    font-size: 20px;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 画面全体の高さを使用 */
  background-color: white; /* 背景色を追加 */
`;

export default First;