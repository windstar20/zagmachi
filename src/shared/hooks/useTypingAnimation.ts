import { useState, useEffect } from "react";

interface UseTypingAnimationOptions {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterTyping?: number;
  pauseAfterDeleting?: number;
}

interface UseTypingAnimationReturn {
  displayText: string;
  currentTextIndex: number;
  isTyping: boolean;
}

// 순수 함수: 다음 상태를 계산
const getNextTypingState = (
  currentText: string,
  charIndex: number,
  isTyping: boolean,
  currentTextIndex: number,
  totalTexts: number
) => {
  if (isTyping) {
    if (charIndex < currentText.length) {
      return {
        shouldUpdateDisplay: true,
        newDisplayText: currentText.slice(0, charIndex + 1),
        newCharIndex: charIndex + 1,
        newIsTyping: true,
        newTextIndex: currentTextIndex,
      };
    } else {
      return {
        shouldUpdateDisplay: false,
        newDisplayText: currentText,
        newCharIndex: charIndex,
        newIsTyping: false,
        newTextIndex: currentTextIndex,
      };
    }
  } else {
    if (charIndex > 0) {
      return {
        shouldUpdateDisplay: true,
        newDisplayText: currentText.slice(0, charIndex - 1),
        newCharIndex: charIndex - 1,
        newIsTyping: false,
        newTextIndex: currentTextIndex,
      };
    } else {
      return {
        shouldUpdateDisplay: false,
        newDisplayText: "",
        newCharIndex: 0,
        newIsTyping: true,
        newTextIndex: (currentTextIndex + 1) % totalTexts,
      };
    }
  }
};

// 순수 함수: 타이밍 계산
const getAnimationDelay = (
  isTyping: boolean,
  charIndex: number,
  currentTextLength: number,
  options: Required<Pick<UseTypingAnimationOptions, 'typingSpeed' | 'deletingSpeed' | 'pauseAfterTyping' | 'pauseAfterDeleting'>>
) => {
  if (isTyping) {
    return charIndex < currentTextLength
      ? options.typingSpeed
      : options.pauseAfterTyping;
  } else {
    return charIndex > 0
      ? options.deletingSpeed
      : options.pauseAfterDeleting;
  }
};

export const useTypingAnimation = ({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseAfterTyping = 2000,
  pauseAfterDeleting = 500,
}: UseTypingAnimationOptions): UseTypingAnimationReturn => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  const options = { typingSpeed, deletingSpeed, pauseAfterTyping, pauseAfterDeleting };

  useEffect(() => {
    const currentText = texts[currentTextIndex];

    const nextState = getNextTypingState(
      currentText,
      charIndex,
      isTyping,
      currentTextIndex,
      texts.length
    );

    const delay = getAnimationDelay(
      isTyping,
      charIndex,
      currentText.length,
      options
    );

    const timeout = setTimeout(() => {
      if (nextState.shouldUpdateDisplay) {
        setDisplayText(nextState.newDisplayText);
        setCharIndex(nextState.newCharIndex);
      }

      if (nextState.newIsTyping !== isTyping) {
        setIsTyping(nextState.newIsTyping);
      }

      if (nextState.newTextIndex !== currentTextIndex) {
        setCurrentTextIndex(nextState.newTextIndex);
        setCharIndex(0);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentTextIndex, charIndex, isTyping, texts, options.typingSpeed, options.deletingSpeed, options.pauseAfterTyping, options.pauseAfterDeleting]);

  return {
    displayText,
    currentTextIndex,
    isTyping,
  };
};
