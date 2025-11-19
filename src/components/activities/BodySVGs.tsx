import { motion } from 'framer-motion';
import { CSSProperties } from 'react';

interface BodySVGProps {
  highlightedPart: string | null;
  className?: string;
}

// Highlight: Game-style glow effect
const highlightStyle = {
  fill: "rgba(255, 255, 255, 0.2)",
  stroke: "rgba(255, 255, 255, 1)",
  strokeWidth: "2",
  filter: "url(#glow)",
  opacity: 1,
  transition: { duration: 0.3 }
};

// Normal: Invisible (no internal outline)
const normalPartStyle = {
  fill: "transparent",
  stroke: "transparent",
  strokeWidth: "0",
  opacity: 0,
  transition: { duration: 0.3 }
};

// Silhouette: Clean, professional medical illustration style outline
const silhouetteStyle: CSSProperties = {
  fill: "rgba(0, 0, 0, 0.2)",
  stroke: "rgba(255, 255, 255, 0.9)",
  strokeWidth: "2.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

// Facial details
const detailStyle: CSSProperties = {
  fill: "transparent",
  stroke: "rgba(255, 255, 255, 0.5)",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

const GlowFilter = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

const PartPath = ({ d, id, highlightedPart }: { d: string, id: string, highlightedPart: string | null }) => {
  const isHighlighted = highlightedPart === id;
  return (
    <motion.path
      d={d}
      initial={false}
      animate={isHighlighted ? highlightStyle : normalPartStyle}
    />
  );
};

export const FemaleBodyFront = ({ highlightedPart, className = "" }: BodySVGProps) => {
  return (
    <svg viewBox="0 0 200 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <GlowFilter />
      
      {/* Base Silhouette - Female */}
      <path
        d="M100,20 
           C118,20 128,32 128,55 C128,72 118,82 100,82 C82,82 72,72 72,55 C72,32 82,20 100,20 Z
           M118,78 L118,92 
           Q145,95 165,105 
           Q170,115 165,145 
           L160,200 
           L165,245 
           L172,255 L175,260 L170,265 L165,260 L162,265 L158,260 L155,265 L150,260 L145,210 
           L140,150 
           Q142,170 135,190 
           Q130,210 148,235 
           Q152,260 145,300 
           L140,380 
           L142,440 
           L145,485 L125,485 L120,440 L120,380 L115,300 
           L105,270 
           L95,270 
           L85,300 L80,380 L80,440 L75,485 L55,485 L58,440 L60,380 L55,300 
           Q48,260 52,235 
           Q70,210 65,190 
           Q58,170 60,150 
           L55,210 L50,260 L45,265 L42,260 L38,265 L35,260 L30,265 L28,255 L35,245 L40,200 
           L35,145 
           Q30,115 35,105 
           Q55,95 82,92 
           L82,78"
        style={silhouetteStyle}
      />

      {/* Facial Features */}
      <path d="M88,50 Q94,46 100,50" style={detailStyle} /> {/* Left Eye */}
      <path d="M100,50 Q106,46 112,50" style={detailStyle} /> {/* Right Eye */}
      <path d="M100,55 L98,65 L102,65" style={detailStyle} /> {/* Nose */}
      <path d="M95,72 Q100,75 105,72" style={detailStyle} /> {/* Mouth */}

      {/* Interactive Parts - Overlay Shapes */}
      
      {/* Lips */}
      <PartPath id="lips" highlightedPart={highlightedPart} d="M95,72 Q100,75 105,72 Q100,69 95,72 Z" />

      {/* Neck */}
      <PartPath id="neck" highlightedPart={highlightedPart} d="M82,78 L118,78 L118,92 L82,92 Z" />

      {/* Ears */}
      <PartPath id="ears" highlightedPart={highlightedPart} d="M72,50 L78,50 L78,65 L72,65 Z M122,50 L128,50 L128,65 L122,65 Z" />

      {/* Shoulders */}
      <PartPath id="shoulders" highlightedPart={highlightedPart} d="M82,92 L118,92 L145,95 L165,105 L160,125 L140,115 L118,110 L82,110 L60,115 L40,125 L35,105 L55,95 Z" />

      {/* Chest */}
      <PartPath id="chest" highlightedPart={highlightedPart} d="M60,115 L140,115 L135,160 L65,160 Z" />

      {/* Arms */}
      <PartPath id="arms" highlightedPart={highlightedPart} d="M35,105 L60,115 L55,210 L35,145 Z M165,105 L140,115 L145,210 L165,145 Z" />

      {/* Hands */}
      <PartPath id="hands" highlightedPart={highlightedPart} d="M55,210 L50,260 L28,255 L35,245 L40,200 Z M145,210 L150,260 L172,255 L165,245 L160,200 Z" />

      {/* Waist */}
      <PartPath id="waist" highlightedPart={highlightedPart} d="M65,160 L135,160 L135,190 L65,190 Z" />

      {/* Hips */}
      <PartPath id="hips" highlightedPart={highlightedPart} d="M65,190 L135,190 L148,235 L105,270 L95,270 L52,235 Z" />

      {/* Thighs */}
      <PartPath id="thighs" highlightedPart={highlightedPart} d="M52,235 L95,270 L85,300 L55,300 Z M148,235 L105,270 L115,300 L145,300 Z" />

      {/* Legs */}
      <PartPath id="legs" highlightedPart={highlightedPart} d="M55,300 L85,300 L80,440 L58,440 Z M145,300 L115,300 L120,440 L142,440 Z" />

      {/* Feet */}
      <PartPath id="feet" highlightedPart={highlightedPart} d="M58,440 L80,440 L75,485 L55,485 Z M142,440 L120,440 L125,485 L145,485 Z" />
    </svg>
  );
};

export const FemaleBodyBack = ({ highlightedPart, className = "" }: BodySVGProps) => {
  return (
    <svg viewBox="0 0 200 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <GlowFilter />
      
      {/* Base Silhouette - Female Back */}
      <path
        d="M100,20 
           C118,20 128,32 128,55 C128,72 118,82 100,82 C82,82 72,72 72,55 C72,32 82,20 100,20 Z
           M118,78 L118,92 
           Q145,95 165,105 
           Q170,115 165,145 
           L160,200 
           L165,245 
           L172,255 L175,260 L170,265 L165,260 L162,265 L158,260 L155,265 L150,260 L145,210 
           L140,150 
           Q142,170 135,190 
           Q130,210 148,235 
           Q152,260 145,300 
           L140,380 
           L142,440 
           L145,485 L125,485 L120,440 L120,380 L115,300 
           L105,270 
           L95,270 
           L85,300 L80,380 L80,440 L75,485 L55,485 L58,440 L60,380 L55,300 
           Q48,260 52,235 
           Q70,210 65,190 
           Q58,170 60,150 
           L55,210 L50,260 L45,265 L42,260 L38,265 L35,260 L30,265 L28,255 L35,245 L40,200 
           L35,145 
           Q30,115 35,105 
           Q55,95 82,92 
           L82,78"
        style={silhouetteStyle}
      />

      {/* Interactive Parts */}
      
      {/* Neck */}
      <PartPath id="neck" highlightedPart={highlightedPart} d="M82,78 L118,78 L118,92 L82,92 Z" />

      {/* Shoulders */}
      <PartPath id="shoulders" highlightedPart={highlightedPart} d="M82,92 L118,92 L145,95 L165,105 L160,125 L140,115 L118,110 L82,110 L60,115 L40,125 L35,105 L55,95 Z" />

      {/* Back */}
      <PartPath id="back" highlightedPart={highlightedPart} d="M60,115 L140,115 L135,180 L65,180 Z" />

      {/* Arms */}
      <PartPath id="arms" highlightedPart={highlightedPart} d="M35,105 L60,115 L55,210 L35,145 Z M165,105 L140,115 L145,210 L165,145 Z" />

      {/* Hands */}
      <PartPath id="hands" highlightedPart={highlightedPart} d="M55,210 L50,260 L28,255 L35,245 L40,200 Z M145,210 L150,260 L172,255 L165,245 L160,200 Z" />

      {/* Waist */}
      <PartPath id="waist" highlightedPart={highlightedPart} d="M65,180 L135,180 L135,210 L65,210 Z" />

      {/* Hips */}
      <PartPath id="hips" highlightedPart={highlightedPart} d="M65,210 L135,210 L148,235 L105,270 L95,270 L52,235 Z" />

      {/* Thighs */}
      <PartPath id="thighs" highlightedPart={highlightedPart} d="M52,235 L95,270 L85,300 L55,300 Z M148,235 L105,270 L115,300 L145,300 Z" />

      {/* Legs */}
      <PartPath id="legs" highlightedPart={highlightedPart} d="M55,300 L85,300 L80,440 L58,440 Z M145,300 L115,300 L120,440 L142,440 Z" />

      {/* Feet */}
      <PartPath id="feet" highlightedPart={highlightedPart} d="M58,440 L80,440 L75,485 L55,485 Z M142,440 L120,440 L125,485 L145,485 Z" />
    </svg>
  );
};

export const MaleBodyFront = ({ highlightedPart, className = "" }: BodySVGProps) => {
  return (
    <svg viewBox="0 0 200 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <GlowFilter />
      
      {/* Base Silhouette - Male */}
      <path
        d="M100,20 
           C118,20 128,32 128,55 C128,72 118,82 100,82 C82,82 72,72 72,55 C72,32 82,20 100,20 Z
           M118,78 L118,95 
           Q150,95 175,105 
           Q180,115 175,145 
           L170,200 
           L175,245 
           L182,255 L185,260 L180,265 L175,260 L172,265 L168,260 L165,265 L160,260 L155,210 
           L150,150 
           L150,190 
           L145,220 
           L140,280 
           L135,360 
           L138,420 
           L140,485 L120,485 L115,420 L115,360 L110,280 
           L105,250 
           L95,250 
           L90,280 L85,360 L85,420 L80,485 L60,485 L62,420 L65,360 L60,280 
           L55,220 
           L50,190 
           L50,150 
           L45,210 L40,260 L35,265 L32,260 L28,265 L25,260 L20,265 L18,255 L25,245 L30,200 
           L25,145 
           Q20,115 25,105 
           Q50,95 82,95 
           L82,78"
        style={silhouetteStyle}
      />

      {/* Facial Features */}
      <path d="M88,50 Q94,46 100,50" style={detailStyle} /> {/* Left Eye */}
      <path d="M100,50 Q106,46 112,50" style={detailStyle} /> {/* Right Eye */}
      <path d="M100,55 L98,65 L102,65" style={detailStyle} /> {/* Nose */}
      <path d="M95,72 Q100,75 105,72" style={detailStyle} /> {/* Mouth */}

      {/* Interactive Parts */}
      
      {/* Lips */}
      <PartPath id="lips" highlightedPart={highlightedPart} d="M95,72 Q100,75 105,72 Q100,69 95,72 Z" />

      {/* Neck */}
      <PartPath id="neck" highlightedPart={highlightedPart} d="M82,78 L118,78 L118,95 L82,95 Z" />

      {/* Ears */}
      <PartPath id="ears" highlightedPart={highlightedPart} d="M72,50 L78,50 L78,65 L72,65 Z M122,50 L128,50 L128,65 L122,65 Z" />

      {/* Shoulders */}
      <PartPath id="shoulders" highlightedPart={highlightedPart} d="M82,95 L118,95 L150,95 L175,105 L170,125 L150,115 L118,110 L82,110 L50,115 L30,125 L25,105 L50,95 Z" />

      {/* Chest */}
      <PartPath id="chest" highlightedPart={highlightedPart} d="M50,115 L150,115 L145,155 L55,155 Z" />

      {/* Arms */}
      <PartPath id="arms" highlightedPart={highlightedPart} d="M25,105 L50,115 L45,210 L25,145 Z M175,105 L150,115 L155,210 L175,145 Z" />

      {/* Hands */}
      <PartPath id="hands" highlightedPart={highlightedPart} d="M45,210 L40,260 L18,255 L25,245 L30,200 Z M155,210 L160,260 L182,255 L175,245 L170,200 Z" />

      {/* Waist */}
      <PartPath id="waist" highlightedPart={highlightedPart} d="M55,155 L145,155 L145,190 L55,190 Z" />

      {/* Hips */}
      <PartPath id="hips" highlightedPart={highlightedPart} d="M55,190 L145,190 L140,220 L105,250 L95,250 L60,220 Z" />

      {/* Thighs */}
      <PartPath id="thighs" highlightedPart={highlightedPart} d="M60,220 L95,250 L90,280 L60,280 Z M140,220 L105,250 L110,280 L140,280 Z" />

      {/* Legs */}
      <PartPath id="legs" highlightedPart={highlightedPart} d="M60,280 L90,280 L85,420 L62,420 Z M140,280 L110,280 L115,420 L138,420 Z" />

      {/* Feet */}
      <PartPath id="feet" highlightedPart={highlightedPart} d="M62,420 L85,420 L80,485 L60,485 Z M138,420 L115,420 L120,485 L140,485 Z" />
    </svg>
  );
};

export const MaleBodyBack = ({ highlightedPart, className = "" }: BodySVGProps) => {
  return (
    <svg viewBox="0 0 200 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <GlowFilter />
      
      {/* Base Silhouette - Male Back */}
      <path
        d="M100,20 
           C118,20 128,32 128,55 C128,72 118,82 100,82 C82,82 72,72 72,55 C72,32 82,20 100,20 Z
           M118,78 L118,95 
           Q150,95 175,105 
           Q180,115 175,145 
           L170,200 
           L175,245 
           L182,255 L185,260 L180,265 L175,260 L172,265 L168,260 L165,265 L160,260 L155,210 
           L150,150 
           L150,190 
           L145,220 
           L140,280 
           L135,360 
           L138,420 
           L140,485 L120,485 L115,420 L115,360 L110,280 
           L105,250 
           L95,250 
           L90,280 L85,360 L85,420 L80,485 L60,485 L62,420 L65,360 L60,280 
           L55,220 
           L50,190 
           L50,150 
           L45,210 L40,260 L35,265 L32,260 L28,265 L25,260 L20,265 L18,255 L25,245 L30,200 
           L25,145 
           Q20,115 25,105 
           Q50,95 82,95 
           L82,78"
        style={silhouetteStyle}
      />

      {/* Interactive Parts */}
      
      {/* Neck */}
      <PartPath id="neck" highlightedPart={highlightedPart} d="M82,78 L118,78 L118,95 L82,95 Z" />

      {/* Shoulders */}
      <PartPath id="shoulders" highlightedPart={highlightedPart} d="M82,95 L118,95 L150,95 L175,105 L170,125 L150,115 L118,110 L82,110 L50,115 L30,125 L25,105 L50,95 Z" />

      {/* Back */}
      <PartPath id="back" highlightedPart={highlightedPart} d="M50,115 L150,115 L145,190 L55,190 Z" />

      {/* Arms */}
      <PartPath id="arms" highlightedPart={highlightedPart} d="M25,105 L50,115 L45,210 L25,145 Z M175,105 L150,115 L155,210 L175,145 Z" />

      {/* Hands */}
      <PartPath id="hands" highlightedPart={highlightedPart} d="M45,210 L40,260 L18,255 L25,245 L30,200 Z M155,210 L160,260 L182,255 L175,245 L170,200 Z" />

      {/* Waist */}
      <PartPath id="waist" highlightedPart={highlightedPart} d="M55,190 L145,190 L140,220 L60,220 Z" />

      {/* Hips */}
      <PartPath id="hips" highlightedPart={highlightedPart} d="M60,220 L140,220 L105,250 L95,250 Z" />

      {/* Thighs */}
      <PartPath id="thighs" highlightedPart={highlightedPart} d="M60,220 L95,250 L90,280 L60,280 Z M140,220 L105,250 L110,280 L140,280 Z" />

      {/* Legs */}
      <PartPath id="legs" highlightedPart={highlightedPart} d="M60,280 L90,280 L85,420 L62,420 Z M140,280 L110,280 L115,420 L138,420 Z" />

      {/* Feet */}
      <PartPath id="feet" highlightedPart={highlightedPart} d="M62,420 L85,420 L80,485 L60,485 Z M138,420 L115,420 L120,485 L140,485 Z" />
    </svg>
  );
};


