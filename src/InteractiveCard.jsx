import React from "react";
import Tilt from "react-parallax-tilt";

const InteractiveCard = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Tilt
      className={`interactive-3d-card ${className || ""}`}
      perspective={2500}
      max={1}                
      speed={1000}            
      reverse={true}          
      glareEnable={true}       
      glareMaxOpacity={0.12}   
      glareColor="#ffffff"     
      glarePosition="all"
      glareBorderRadius="16px" 
      gyroscope={true}         
      style={{
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        background: "rgba(18, 18, 22, 0.45)",
        backdropFilter: "blur(25px) saturate(140%)",
        WebkitBackdropFilter: "blur(25px) saturate(140%)",
        border: "1px solid rgba(255, 255, 255, 0.09)",
        boxShadow: "0 40px 80px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
      }}
      {...props}
    >
      {/* Forces the direct children components to live within the 3D perspective context */}
      <div style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" }}>
        {children}
      </div>
    </Tilt>
  );
});

InteractiveCard.displayName = "InteractiveCard";

export { InteractiveCard };
