import React, { useRef, useEffect } from "react";

const SEGMENT_COUNT = 1;
const EASING = 0.45;

const CursorTrail = ({ cursorImage }) => {
  const trailRef = useRef(
    Array.from({ length: SEGMENT_COUNT }, () => ({ x: -100, y: -100 }))
  );
  const mouseRef = useRef({ x: -100, y: -100 });
  const domRefs = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    document.body.style.cursor = "none";

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const updateTrail = () => {
      const trail = trailRef.current;
      const mouse = mouseRef.current;

      trail[0].x += (mouse.x - trail[0].x) * EASING;
      trail[0].y += (mouse.y - trail[0].y) * EASING;

      for (let i = 1; i < trail.length; i++) {
        const leader = trail[i - 1];
        trail[i].x += (leader.x - trail[i].x) * EASING;
        trail[i].y += (leader.y - trail[i].y) * EASING;
      }

      for (let i = 0; i < domRefs.current.length; i++) {
        const el = domRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${trail[i].x}px, ${trail[i].y}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(updateTrail);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "default";
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1000000 }}>
      {Array.from({ length: SEGMENT_COUNT }, (_, i) => {
        const isHead = i === 0;
        const size = 50;
        const opacity = 1;
        return (
          <div
            key={i}
            ref={(el) => { domRefs.current[i] = el; }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              backgroundImage: isHead && cursorImage ? `url(${cursorImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              background: isHead && cursorImage
                ? `url(${cursorImage}) center/cover no-repeat`
                : "radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 1) 0%, rgba(180, 140, 255, 1) 0%, rgba(120, 80, 220, 1) 100%)",
              opacity: opacity,
              boxShadow: isHead
                ? "none"
                : "0 0 0px 0px rgba(200, 170, 255, 0.9), 0 0 0px 0px rgba(150, 100, 255, 0.6), 0 0 0px 0px rgba(100, 60, 200, 0.3)",
              transform: "translate3d(-100px, -100px, 0)",
              willChange: "transform",
            }}
          />
        );
      })}
    </div>
  );
};

export { CursorTrail };
