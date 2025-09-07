"use client";

import { useTypingAnimation } from "@/shared/hooks/useTypingAnimation";

const Hero = () => {
  const dynamicTexts = [
    "Frontend 개발자 현민입니다.",
    "도전하는 개발자 HYUNMIN 입니다.",
  ];

  const { displayText } = useTypingAnimation({
    texts: dynamicTexts,
    typingSpeed: 100,
    deletingSpeed: 100,
    pauseAfterTyping: 2000,
    pauseAfterDeleting: 500,
  });

  return (
    <section className="flex items-center bg-gradient-to-br from-blue-50 to-indigo-400 border-radius">
      <div className="px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800/90 mb-6 font-escoredream">
          안녕하세요!
        </h2>
        <div className="text-xl md:text-3xl text-blue-500 h-16 flex items-center justify-center min-w-0">
          <span className="relative flex items-center min-w-[540px] font-escoredream font-semibold">
            {displayText}
            <div className="animate-pulse ml-1 border-r-4 border-blue-600 w-1 h-8" />
          </span>
        </div>

      </div>
    </section >
  );
};

export default Hero;
