import React from 'react';
import { motion } from 'motion/react';

export const HeroBlueprintAnimation = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.5 }
    }
  };

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { 
      pathLength: 1, 
      opacity: 0.4,
      transition: { duration: 2, ease: "easeInOut" as const } 
    }
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    show: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 } 
    }
  };

  // Using a 1000x500 viewBox. We shift everything to the right half (X > 500)
  const startPoints = [
    { y: 150, label: "01. CORE INTENT" },
    { y: 250, label: "02. SYSTEMS" },
    { y: 350, label: "03. BALANCE" }
  ];

  const endNodes = [
    { x: 650, y: 100, label: "META_GAME" },
    { x: 850, y: 180, label: "COMBAT_LOOP" },
    { x: 700, y: 250, label: "ECONOMY" },
    { x: 900, y: 320, label: "USER_EXP" },
    { x: 750, y: 400, label: "RETENTION" }
  ];

  const connections = [
    { start: 0, end: 0 },
    { start: 0, end: 1 },
    { start: 1, end: 1 },
    { start: 1, end: 2 },
    { start: 1, end: 3 },
    { start: 2, end: 2 },
    { start: 2, end: 4 },
    { start: 0, end: 4 }
  ];

  return (
    <div className="absolute inset-0 bg-transparent overflow-hidden font-mono selection:bg-transparent">
      {/* Blueprint Grid - Light Theme */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,71,187,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,71,187,0.05)_1px,transparent_1px)] bg-size-[32px_32px]"></div>
      
      {/* Scanning Line Animation */}
      <motion.div 
        animate={{ y: ["-10%", "110%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-1 bg-linear-to-b from-transparent via-[#0047BB]/10 to-transparent w-full z-0"
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
      >
        {/* We use preserveAspectRatio="xMidYMid slice" to make it act like object-cover */}
        <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" className="w-full h-full overflow-visible">
          
          {/* Subtle tech circle on the right */}
          <motion.circle 
             cx="800" cy="250" r="180" 
             fill="none" stroke="rgba(0,71,187,0.03)" strokeWidth="1" strokeDasharray="4 4"
             animate={{ rotate: 360 }}
             transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
             style={{ transformOrigin: "800px 250px" }}
          />

          {/* Connections */}
          {connections.map((conn, i) => {
            const start = startPoints[conn.start];
            const end = endNodes[conn.end];
            const startX = 450; // Start lines near the middle-left
            const pathData = `M ${startX} ${start.y} C ${startX + 100} ${start.y}, ${end.x - 100} ${end.y}, ${end.x} ${end.y}`;
            return (
              <motion.path 
                key={`path-${i}`}
                d={pathData}
                fill="none"
                stroke="#0047BB"
                strokeWidth="1.5"
                variants={lineVariants}
              />
            );
          })}

          {/* Start Points */}
          {startPoints.map((pt, i) => (
            <motion.g key={`start-${i}`} variants={nodeVariants}>
              <rect x="290" y={pt.y - 14} width="140" height="28" rx="6" fill="#FDFDFB" stroke="rgba(0,71,187,0.2)" strokeWidth="1" />
              <text x="305" y={pt.y + 4} fill="#0047BB" fontSize="12" fontWeight="bold" letterSpacing="1" fontFamily="monospace">{pt.label}</text>
              <circle cx="450" cy={pt.y} r="4" fill="#0047BB" />
              <circle cx="450" cy={pt.y} r="10" fill="rgba(0,71,187,0.15)" />
            </motion.g>
          ))}

          {/* End Nodes */}
          {endNodes.map((node, i) => (
            <motion.g key={`node-${i}`} variants={nodeVariants}>
              <circle cx={node.x} cy={node.y} r="4" fill="#0047BB" />
              <circle cx={node.x} cy={node.y} r="12" fill="none" stroke="rgba(0,71,187,0.1)" strokeWidth="1" />
              <text x={node.x + 16} y={node.y + 4} fill="#2C2C2C" fontSize="11" letterSpacing="1" fontFamily="monospace" fontWeight="bold">{node.label}</text>
            </motion.g>
          ))}
          
          {/* Animated Pulses on Nodes */}
          {endNodes.map((node, i) => (
            <motion.circle
              key={`pulse-${i}`}
              cx={node.x} cy={node.y} r="4" fill="none" stroke="#0047BB" strokeWidth="1"
              animate={{ r: [4, 20, 4], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
};
