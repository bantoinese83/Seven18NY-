import React, { useMemo } from 'react';

interface TextRevealProps {
  text: string;
  isVisible: boolean;
  className?: string;
}

const TextReveal: React.FC<TextRevealProps> = ({ text, isVisible, className }) => {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <p className={className}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <span
            className="inline-block transition-all duration-500 ease-out"
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
              transitionDelay: `${50 + index * 30}ms`,
            }}
          >
            {word}&nbsp;
          </span>
        </span>
      ))}
    </p>
  );
};

export default TextReveal;
