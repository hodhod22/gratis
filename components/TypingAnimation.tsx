"use client";

import { useState, useEffect } from "react";

interface TypingAnimationProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export default function TypingAnimation({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 1500,
}: TypingAnimationProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (isWaiting) return;

    const currentWord = words[currentWordIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }, deletingSpeed);
    } else {
      timeout = setTimeout(() => {
        setCurrentText((prev) => currentWord.slice(0, prev.length + 1));
        if (currentText === currentWord) {
          setIsWaiting(true);
          setTimeout(() => {
            setIsWaiting(false);
            setIsDeleting(true);
          }, delayBetweenWords);
        }
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [
    currentText,
    isDeleting,
    currentWordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    delayBetweenWords,
    isWaiting,
  ]);

  return (
    <span className="inline-block">
      {currentText}
      <span className="animate-pulse border-r-2 border-blue-600 ml-1 h-6" />
    </span>
  );
}
