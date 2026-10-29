import React from "react";

const ViewerProgressBar = ({ progressPercentage }) => {
  return (
    <div 
      className="viewer__progress-container" 
      style={{ 
        position: "sticky", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "8px", 
        backgroundColor: "rgba(255,255,255,0.15)", 
        zIndex: 9999, 
        pointerEvents: "none" 
      }}
    >
      <div 
        className="viewer__progress-bar" 
        style={{ 
          width: `${progressPercentage}%`, 
          height: "100%", 
          backgroundColor: "#ff4500", 
          transition: "width 0.2s ease-out",
          boxShadow: "0 0 12px #ff4500"
        }} 
      />
      
      {/* 25%, 50%, 75% Static Checkpoint Nodes */}
      <div style={{ position: "absolute", left: "25%", top: "-2px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: progressPercentage >= 25 ? "#ff4500" : "#555", boxShadow: progressPercentage >= 25 ? "0 0 8px #ff4500" : "none", transition: "background 0.3s" }} />
      <div style={{ position: "absolute", left: "50%", top: "-2px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: progressPercentage >= 50 ? "#ff4500" : "#555", boxShadow: progressPercentage >= 50 ? "0 0 8px #ff4500" : "none", transition: "background 0.3s" }} />
      <div style={{ position: "absolute", left: "75%", top: "-2px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: progressPercentage >= 75 ? "#ff4500" : "#555", boxShadow: progressPercentage >= 75 ? "0 0 8px #ff4500" : "none", transition: "background 0.3s" }} />
    </div>
  );
};

// React.memo prevents re-renders unless progressPercentage explicitly updates
export default React.memo(ViewerProgressBar);