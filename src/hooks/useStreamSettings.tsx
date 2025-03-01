// hooks/useStreamSettings.tsx
"use client";

import {useState, useEffect} from "react";

export const useStreamSettings = () => {
  // Initialize state with defaults
  const [isMuted, setIsMuted] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [isScreenShared, setScreenShared] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDarkMode = localStorage.getItem("isDark");
      const storedChatOpen = localStorage.getItem("chatOpen");

      if (storedDarkMode !== null) setDarkMode(JSON.parse(storedDarkMode));
      if (storedChatOpen !== null) setIsChatOpen(JSON.parse(storedChatOpen));
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isDark", JSON.stringify(darkMode));
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatOpen", JSON.stringify(isChatOpen));
    }
  }, [isChatOpen]);

  // Methods for future API integration
  const toggleMicrophone = () => {
    // Future implementation: connect to WebRTC API to toggle actual microphone
    setIsMuted((prevState) => !prevState);
  };

  const toggleVideo = () => {
    // Future implementation: connect to WebRTC API to toggle actual video
    setVideoEnabled((prevState) => !prevState);
  };

  const toggleScreenShare = () => {
    // Future implementation: connect to WebRTC API for screen sharing
    setScreenShared((prevState) => !prevState);
  };

  return {
    // State values
    isMuted,
    videoEnabled,
    isScreenShared,
    darkMode,
    isChatOpen,

    // State setters
    setIsMuted,
    setVideoEnabled,
    setScreenShared,
    setDarkMode,
    setIsChatOpen,

    // API methods (for future implementation)
    toggleMicrophone,
    toggleVideo,
    toggleScreenShare,
  };
};

export default useStreamSettings;
