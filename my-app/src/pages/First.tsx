import React from "react";
import "../App.css";
import "../css/Firstpage.css";
import { Typography } from '@mui/material';
import ReactDOM from 'react-dom';
import Signup from "./Signup";
import { useState } from "react";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { fireAuth } from "../firebase/firebase";
import { convertToObject } from "typescript";
import { Portal, Paper } from '@mui/material';

function First() {
    const navigate = useNavigate();

    const goToSignupPage = () => {
        navigate('/signup');
    }

    const goToLoginPage = () => {
        navigate('/login');
    }


//   return (
//     <div className="overlay">
//       {/* ページの上に表示させたい内容 */}
//       <div className="overlay-content">
//         <Typography>Overlay Content</Typography>
//       </div>
//     </div>
//     // <Portal>
//     //   <Paper elevation={3} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 200, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//     //     {/* ページの上に表示させたい内容 */}
//     //     {/* <Typography>Overlay Content</Typography> */}
//     //     <Typography variant="h1" color="primary">
//     //         This is a Heading
//     //     </Typography>
//     //     <Typography variant="body1" color="textSecondary">
//     //         This is a paragraph of text.
//     //     </Typography>
//     //   </Paper>
//     // </Portal>
//     );
    // return ReactDOM.createPortal(
    //     <div className="overlay">
    //     <div className="overlay-content">
    //         <Typography>Overlay Content</Typography>
    //         <Signup /> {/* ログインページをここに表示する */}
    //     </div>
    //     </div>,
    //     document.body
    // );
    return (
        <div className="page">
            <div>
                <button onClick={goToSignupPage} className="button create">
                    Create account
                </button>
            </div>
            <p className="text">
            By signing up, you agree to the Terms of Service and Privacy
            </p>
            <p className="text">
            Policy, including Cookie Use.
            </p>
            <p>
                Already have an account?
            </p>
            <div>
                <button onClick={goToLoginPage} className="button signin">
                    Sign In
                </button>
            </div>
        </div>
    );
  }

export default First;