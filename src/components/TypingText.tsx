import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';

export default function TypingText({ text, className, onRetypeReady }: { text: string; className?: string; onRetypeReady?: (canRetype: boolean, handleRetype: () => void) => void }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasTypedOnce, setHasTypedOnce] = useState(false);
  const [hasInitiallyStarted, setHasInitiallyStarted] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);
  const [shouldAnimateHint, setShouldAnimateHint] = useState(false);
  const [shouldAnimateHeight, setShouldAnimateHeight] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  const measureFinalHeight = useCallback(() => {
    if (measureRef.current) {
      setMeasuredHeight(measureRef.current.offsetHeight);
    }
  }, []);

  const startTyping = useCallback(() => {
    if (isTyping) return;

    setIsTyping(true);
    setShouldAnimateHeight(true);
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
        setShouldAnimateHint(true);
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
      setShouldAnimateHint(false);
      setShouldAnimateHeight(false);
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

  useLayoutEffect(() => {
    measureFinalHeight();
  }, [displayText, className, hasTypedOnce, isTyping, measureFinalHeight]);

  useEffect(() => {
    const handleResize = () => measureFinalHeight();
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [measureFinalHeight]);

  return (
    <div ref={containerRef} style={{ height: measuredHeight ?? undefined, position: 'relative', overflow: 'hidden', transition: shouldAnimateHeight ? 'height 220ms ease' : 'none' }}>
      <p className={`${className ?? ''} typing-text`}>
        {displayText}
      </p>
      <p
        className="text-xs sm:text-sm text-retro-purple mt-3 sm:mt-4 opacity-60 text-center xl:text-left"
        aria-hidden={!(hasTypedOnce && !isTyping)}
        style={{
          opacity: hasTypedOnce && !isTyping ? 1 : 0,
          transform: hasTypedOnce && !isTyping ? 'translateY(0)' : 'translateY(4px)',
          transition: shouldAnimateHint ? 'opacity 200ms ease, transform 200ms ease' : 'none'
        }}
      >
        [TAP_TO_RETYPE]
      </p>
      <div
        ref={measureRef}
        aria-hidden
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: '100%', left: 0, top: 0 }}
      >
        <p className={`${className ?? ''} typing-text`}>
          {displayText}
        </p>
        {hasTypedOnce && !isTyping && (
          <p className="text-xs sm:text-sm text-retro-purple mt-3 sm:mt-4 opacity-60 text-center xl:text-left">[TAP_TO_RETYPE]</p>
        )}
      </div>
    </div>
  );
}


