"use client";

import { useState, useEffect } from "react";

interface AnimatedCharacterProps {
  characterId: string;
  characterName: string;
  fallbackImage: string;
  frameCount?: number;
  basePath?: string;
}

export function AnimatedCharacter({
  characterId,
  characterName,
  fallbackImage,
  frameCount = 6,
  basePath = "/characters",
}: AnimatedCharacterProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (frameCount < 2) return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frameCount);
    }, 150); // Change frame every 150ms for smooth animation

    return () => clearInterval(interval);
  }, [frameCount]);

  // No animation frames prepared — use static image
  if (frameCount < 2) {
    return (
      <img
        src={fallbackImage}
        alt={characterName}
        className="w-full h-full object-contain pixelated"
        style={{ imageRendering: 'pixelated' }}
      />
    );
  }

  const frameFile = `frame_${String(currentFrame).padStart(3, '0')}.png`;

  return (
    <img
      src={`${basePath}/${characterId}/${frameFile}`}
      alt={`${characterName} - frame ${currentFrame}`}
      className="w-full h-full object-contain pixelated"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
