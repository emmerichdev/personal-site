import { useState, useEffect, useCallback } from 'react';

export default function TypingText({ text, className, onRetypeReady }: { text: string; className?: string; onRetypeReady?: (canRetype: boolean, handleRetype: () => void) => void }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasTypedOnce, setHasTypedOnce] = useState(false);
  const [hasInitiallyStarted, setHasInitiallyStarted] = useState(false);

  const startTyping = useCallback(() => {
    if (isTyping) return;

    setIsTyping(true);
    setDisplayText('');

    let i = 0;
    const typeChar = () => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
        setTimeout(typeChar, 50);
      } else {
        setIsTyping(false);
        setHasTypedOnce(true);
        try {
          sessionStorage.setItem('aboutTypedOnce', '1');
        } catch {}
      }
    };

    setTimeout(typeChar, 100);
  }, [text, isTyping]);

  useEffect(() => {
    if (hasInitiallyStarted) return;
    let skipTyping = false;
    try {
      skipTyping = sessionStorage.getItem('aboutTypedOnce') === '1';
    } catch {}

    if (skipTyping) {
      setDisplayText(text);
      setHasTypedOnce(true);
      setHasInitiallyStarted(true);
      return;
    }

    const timer = setTimeout(() => {
      startTyping();
      setHasInitiallyStarted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [startTyping, hasInitiallyStarted, text]);

  useEffect(() => {
    if (onRetypeReady) {
      onRetypeReady(hasTypedOnce && !isTyping, startTyping);
    }
  }, [hasTypedOnce, isTyping, onRetypeReady, startTyping]);

  return (
    <div>
      <p className={`${className ?? ''} typing-text`}>
        {displayText}
      </p>
      {hasTypedOnce && !isTyping && (
        <p className="text-xs sm:text-sm text-retro-purple mt-3 sm:mt-4 opacity-60">
          [TAP_TO_RETYPE]
        </p>
      )}
    </div>
  );
}


