import { useEffect, useRef } from "react";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  console.log("Camera component mounted");

  if (!navigator.mediaDevices) {
    alert("Camera not supported");
    return;
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      console.log("Camera stream received");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera permission denied or error");
    }
  };

  startCamera();
}, []);

  return (
    <div className="flex justify-center items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-xl w-full max-w-2xl border"
      />
    </div>
  );
};

export default Camera;
