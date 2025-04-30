import React, { useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import './travelHome.css'

const VideoPlayer = () => {
  const videoUrl = "https://travel-guide-backend-pfri.onrender.com/file/Wildlife.mp4";
  const videoRef = useRef(null);
  const [Muted, setMuted] = useState(true);
  const [Playing, setPlaying] = useState(true);

  const videoPlay = () => {
    if (videoRef.current) {
      if (Playing) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setPlaying(!Playing)
    }
  }

  const videoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !Muted;
      setMuted(!Muted);
    }
  };

  return (
    <div className="video-container">
      <video ref={videoRef} className="video" autoPlay loop onClick={videoPlay} muted={Muted} >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p onClick={videoMute} className="mute-button"> {Muted ? <FaVolumeMute /> : <FaVolumeUp />}</p>
    </div>
  );
};

export default VideoPlayer;
