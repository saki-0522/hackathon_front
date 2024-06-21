

// import React, { useEffect, useRef, useState } from 'react';

// const FaceSmileDetection = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [opencvLoaded, setOpencvLoaded] = useState(false);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = `${process.env.PUBLIC_URL}/opencv.js`;
//     script.async = true;
//     script.onload = () => {
//       setOpencvLoaded(true);
//     };
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   useEffect(() => {
//     if (opencvLoaded) {
//       const startVideo = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();

//         const faceCascade = new window.cv.CascadeClassifier();
//         const smileCascade = new window.cv.CascadeClassifier();
//         faceCascade.load('haarcascade_frontalface_default.xml');
//         smileCascade.load('haarcascade_smile.xml');

//         const processVideo = () => {
//           if (window.cv && videoRef.current.readyState === 4) {
//             const src = new window.cv.Mat(videoRef.current.videoHeight, videoRef.current.videoWidth, window.cv.CV_8UC4);
//             const gray = new window.cv.Mat();
//             const faces = new window.cv.RectVector();
//             const smiles = new window.cv.RectVector();
//             const size = new window.cv.Size(0, 0);

//             window.cv.imread(videoRef.current, src);
//             window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);

//             faceCascade.detectMultiScale(gray, faces, 1.1, 5, 0, size, size);

//             for (let i = 0; i < faces.size(); ++i) {
//               const face = faces.get(i);
//               const point1 = new window.cv.Point(face.x, face.y);
//               const point2 = new window.cv.Point(face.x + face.width, face.y + face.height);
//               window.cv.rectangle(src, point1, point2, [255, 0, 0, 255], 2);

//               const roiGray = gray.roi(face);
//               smileCascade.detectMultiScale(roiGray, smiles, 1.2, 10, 0, new window.cv.Size(20, 20), size);
//               for (let j = 0; j < smiles.size(); ++j) {
//                 const smile = smiles.get(j);
//                 const point1 = new window.cv.Point(face.x + smile.x, face.y + smile.y);
//                 const point2 = new window.cv.Point(face.x + smile.x + smile.width, face.y + smile.y + smile.height);
//                 window.cv.rectangle(src, point1, point2, [0, 0, 255, 255], 2);
//               }
//               roiGray.delete();
//             }

//             window.cv.imshow(canvasRef.current, src);

//             src.delete();
//             gray.delete();
//             faces.delete();
//             smiles.delete();
//           }
//           requestAnimationFrame(processVideo);
//         };

//         processVideo();
//       };

//       startVideo();
//     }
//   }, [opencvLoaded]);

//   return (
//     <div>
//       <h2>Face and Smile Detection</h2>
//       <video ref={videoRef} style={{ display: 'none' }} />
//       <canvas ref={canvasRef}></canvas>
//     </div>
//   );
// };

// export default FaceSmileDetection;
