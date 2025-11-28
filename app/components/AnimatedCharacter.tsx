"use client";

import { useState, useEffect } from "react";

interface AnimatedCharacterProps {
  characterId: string;
  characterName: string;
  fallbackImage: string;
}

export function AnimatedCharacter({ characterId, characterName, fallbackImage }: AnimatedCharacterProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 6; // cross-punch has 6 frames (0-5)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 150); // Change frame every 150ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  // Alien overlord boss doesn't have cross-punch, use static image
  if (characterId === "alien-overlord-boss") {
    return (
      <img
        src={fallbackImage}
        alt={characterName}
        className="w-full h-full object-contain pixelated"
        style={{ imageRendering: 'pixelated' }}
      />
    );
  }

  return (
    <img
      src={`/characters/${characterId}/frame_00${currentFrame}.png`}
      alt={`${characterName} - frame ${currentFrame}`}
      className="w-full h-full object-contain pixelated"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
