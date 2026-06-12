import React, { useState, useEffect, UseRef } from "react";

export default function ScrollSnapEffect({ children }) {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const currentSection = Math.round(containerRef.current.scrollTop / window.innerHeight);
      setActiveIdx(currentSection);
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-zinc-950"
      style={{ scrollbarWidth: 'none' }} 
    >
      {React.Children.map(children, (child, idx) => (
        <div className={`h-screen w-full snap-start transition-all duration-700 ${activeIdx === idx ? 'opacity-100 blur-0' : 'opacity-30 blur-sm'}`}>
          {child}
        </div>
      ))}
    </div>
  );
}