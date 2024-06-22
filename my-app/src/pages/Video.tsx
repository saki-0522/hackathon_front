import React, { useRef, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

async function Liked(status: number): Promise<void>{
  const navigate = useNavigate();
    let user =sessionStorage.getItem('user');
    // if (user) {
    //     let user_ob = JSON.parse(user);
    //     id = user_ob.uid;
    //     post_id = 
    // }
    let post_id = sessionStorage.getItem('post_id');
    let id = sessionStorage.getItem('id');
    let parent_id = sessionStorage.getItem('parent_id');

    console.log(status)
    console.log(post_id)
    console.log(id)
    console.log(parent_id)
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
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('post_id');
        sessionStorage.removeItem('parent_id');
        navigate('/');
    } else {
        console.error("POST request failed")
    }
    } catch (err){
    console.error(err)
    }
    navigate('/');
}

const VideoStream = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [photoData, setPhotoData] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
    const [smileDetected, setSmileDetected] = useState<boolean>(false);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraOn(true);
            }
        } catch (err) {
            console.error('Error accessing the camera:', err);
        }
    };

    const closeCamera = async () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            
            tracks.forEach(track => {
                track.stop();
                stream.removeTrack(track); // Remove track from the stream
            });
    
            videoRef.current.srcObject = null; // Release the video stream
            setIsCameraOn(false); // Set camera state to off
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/png');
                setPhotoData(dataUrl);

                // ここでPythonのAPIにBase64データを送信する
                sendPhotoToBackend(dataUrl);
            }
        }
    };

    const sendPhotoToBackend = async (photoData: string) => {
        console.log(photoData)
        try {
            const base64Data = photoData.split(',')[1]; 
            console.log( JSON.stringify({ "image": base64Data }))
            const response = await fetch('https://hackathon-python2-xydruijzdq-uc.a.run.app/process_image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "image": base64Data }), // Base64データのみを送信する

            });
    
            if (!response.ok) {
                throw new Error('Failed to send photo');
            }
    
            const responseData = await response.json();
            console.log('Response from backend:', responseData);
            if (responseData.smile_detected)
            {
                navigate('/');
            }
        } catch (err) {
            console.error('Error sending photo to backend:', err);
        }
    };

    const HomeButton = () => {
        return (
          <IconButton color="primary" aria-label="home" onClick={goToHomePage}>
            <HomeIcon />
          </IconButton>
        );
      };

    const goToHomePage = () => {
        navigate('/');
    }
    

    return (
        <div>
            <h1>Camera App</h1>
                <Container className="item2">
                    <HomeButton />
                </Container>
            <div>
                <button onClick={startCamera} disabled={isCameraOn}>Start Camera</button>
                <button onClick={takePhoto} disabled={!isCameraOn}>Take Photo</button>
                <button onClick={closeCamera} disabled={!isCameraOn}>Close Camera</button>
            </div>
            <div>
                <video ref={videoRef} autoPlay playsInline />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                {photoData && (
                    <div>
                        <h2>Preview</h2>
                        <img src={photoData} alt="Captured" />
                    </div>
                )}
            </div>
            {smileDetected && (
                <div>
                    <button onClick={() => Liked(1)}>Like</button>
                </div>
            )}
        </div>
    );
};

export default VideoStream;
