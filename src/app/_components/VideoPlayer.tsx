import { useEffect } from "react";

interface VideoPlayerProps {
  src: string;
  isActive: boolean;
  onEnded?: () => void;
  loop?: boolean;
  videoRef: React.RefObject<HTMLVideoElement> | any;
  position?: "absolute" | "relative";
}

export default function VideoPlayer({
  src,
  isActive,
  onEnded,
  loop,
  videoRef,
  position,
}: VideoPlayerProps) {
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current
          .play()
          .catch((err: any) => console.error("Error playing video:", err));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive, videoRef]);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      onEnded={onEnded}
      loop={loop}
      style={{
        width: "100%",
        height: "auto",
        position: position ? position : "absolute",
        top: 0,
        left: 0,
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
