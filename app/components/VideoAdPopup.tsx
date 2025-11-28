"use client";

import { useState, useEffect, useRef } from "react";

// Add more videos to this array as needed
const AD_VIDEOS = [
  "/videos/Ape_and_Fox_Shoot_Aliens_Video.mp4",
  "/videos/can_you_make_these_character.mp4",
];

export function VideoAdPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if user has already seen an ad this session
    const hasSeenAd = sessionStorage.getItem("hasSeenVideoAd");

    if (!hasSeenAd) {
      // Get last played video from localStorage to avoid repeats
      const lastPlayed = localStorage.getItem("lastVideoAd");

      // Filter out the last played video if we have more than 1
      let availableVideos = AD_VIDEOS;
      if (lastPlayed && AD_VIDEOS.length > 1) {
        availableVideos = AD_VIDEOS.filter(v => v !== lastPlayed);
      }

      // Randomly select from available videos
      const randomIndex = Math.floor(Math.random() * availableVideos.length);
      const selected = availableVideos[randomIndex];

      // Save this as last played
      localStorage.setItem("lastVideoAd", selected);

      setSelectedVideo(selected);
      setIsOpen(true);
    }
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnd = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenVideoAd", "true");
  };

  if (!isOpen || !selectedVideo) return null;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        {/* Video container */}
        <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20">
          <video
            ref={videoRef}
            src={selectedVideo}
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-auto"
            controls={false}
          />

          {/* Play button overlay - only shows before playing */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <button
                onClick={handlePlay}
                className="w-24 h-24 rounded-full bg-cyan-500 hover:bg-cyan-400 transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-cyan-500/50"
              >
                <svg
                  className="w-12 h-12 text-white ml-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Message */}
        <p className="text-center text-gray-400 text-sm mt-4">
          {isPlaying ? "Video will close when finished" : "Press play to continue"}
        </p>
      </div>
    </div>
  );
}
