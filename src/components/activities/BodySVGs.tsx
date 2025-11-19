import { motion } from 'framer-motion';
import { CSSProperties } from 'react';

interface BodySVGProps {
  highlightedPart: string | null;
  className?: string;
}

const highlightStyle = {
  fill: "rgba(255, 255, 255, 0.6)",
  stroke: "rgba(255, 255, 255, 1)",
  strokeWidth: "2",
  filter: "url(#glow)",
  transition: { duration: 0.4 }
};

const baseStyle = {
  fill: "transparent",
  stroke: "rgba(255, 255, 255, 0.6)",
  strokeWidth: "1.5",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  transition: { duration: 0.3 }
};

const staticBaseStyle: CSSProperties = {
  fill: "transparent",
  stroke: "rgba(255, 255, 255, 0.6)",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

const GlowFilter = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export const FemaleBodyFront = ({ highlightedPart, className = "" }: BodySVGProps) => {
  return (
    <svg viewBox="0 0 200 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <GlowFilter />
      
      {/* Base Body Outline - Realistic Female */}
      <path
        d="M100,25 
           C112,25 120,35 120,50 C120,62 115,70 108,73 
           L108,85 
           Q130,88 145,95 
           C155,100 158,110 155,130 
           L150,190 
           C150,200 155,205 160,210 L162,215 L155,220 L145,215 C142,210 142,200 140,190 
           L135,150 
           Q132,180 135,200 
           C140,215 142,230 135,250 
           C130,270 125,300 122,330 
           L118,400 L120,450 
           C120,460 125,470 130,480 L110,480 L105,450 L102,350 
           L98,350 L95,450 L90,480 L70,480 
           C75,470 80,460 80,450 L82,400 
           C78,330 75,300 70,270 
           C60,240 58,215 65,200 
           Q68,180 65,150 
           L60,190 C58,200 58,210 55,215 L45,220 L38,215 L40,210 C45,205 50,200 50,190 
           L45,130 C42,110 45,100 55,95 
           Q70,88 92,85 
           L92,73 
           C85,70 80,62 80,50 C80,35 88,25 100,25 Z"
        style={staticBaseStyle}
      />

      {/* Detail Lines */}
      <path d="M85,125 Q100,135 115,125" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.5}} /> {/* Breasts */}
      <path d="M95,170 Q100,175 105,170" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.3}} /> {/* Navel */}
      <path d="M90,350 L90,400 M110,350 L110,400" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.3}} /> {/* Knees */}

      {/* Interactive Parts */}
      
      {/* Lips */}
      <motion.path
        d="M94,58 Q100,61 106,58 Q100,64 94,58 Z"
        initial={baseStyle}
        animate={highlightedPart === 'lips' ? highlightStyle : baseStyle}
      />

      {/* Neck */}
      <motion.path
        d="M92,73 L108,73 L108,85 Q100,88 92,85 Z"
        initial={baseStyle}
        animate={highlightedPart === 'neck' ? highlightStyle : baseStyle}
      />

      {/* Ears */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'ears' ? highlightStyle : baseStyle}>
        <path d="M80,48 Q76,45 76,55 Q80,60 80,58" />
        <path d="M120,48 Q124,45 124,55 Q120,60 120,58" />
      </motion.g>

      {/* Shoulders */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'shoulders' ? highlightStyle : baseStyle}>
        <path d="M92,85 Q70,88 55,95 L60,110 L92,95 Z" />
        <path d="M108,85 Q130,88 145,95 L140,110 L108,95 Z" />
      </motion.g>

      {/* Chest */}
      <motion.path
        d="M65,110 C60,130 70,145 100,145 C130,145 140,130 135,110 Q100,120 65,110 Z"
        initial={baseStyle}
        animate={highlightedPart === 'chest' ? highlightStyle : baseStyle}
      />

      {/* Arms */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'arms' ? highlightStyle : baseStyle}>
        <path d="M55,95 L45,130 L50,190 L60,190 L65,130 Z" />
        <path d="M145,95 L155,130 L150,190 L140,190 L135,130 Z" />
      </motion.g>

      {/* Hands */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'hands' ? highlightStyle : baseStyle}>
        <path d="M50,190 L40,210 L38,215 L45,220 L55,215 L60,190 Z" />
        <path d="M150,190 L160,210 L162,215 L155,220 L145,215 L140,190 Z" />
      </motion.g>

      {/* Waist */}
      <motion.path
        d="M70,150 Q100,160 130,150 L135,180 Q100,190 65,180 Z"
        initial={baseStyle}
        animate={highlightedPart === 'waist' ? highlightStyle : baseStyle}
      />

      {/* Hips */}
      <motion.path
        d="M65,180 Q100,190 135,180 C140,200 142,215 135,230 Q100,240 65,230 C58,215 60,200 65,180 Z"
        initial={baseStyle}
        animate={highlightedPart === 'hips' ? highlightStyle : baseStyle}
      />

      {/* Thighs */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'thighs' ? highlightStyle : baseStyle}>
        <path d="M65,230 C60,260 70,300 80,330 L98,330 L100,240 Z" />
        <path d="M135,230 C140,260 130,300 120,330 L102,330 L100,240 Z" />
      </motion.g>

      {/* Legs */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'legs' ? highlightStyle : baseStyle}>
        <path d="M80,330 L82,400 L80,450 L95,450 L98,330 Z" />
        <path d="M120,330 L118,400 L120,450 L105,450 L102,330 Z" />
      </motion.g>

      {/* Feet */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'feet' ? highlightStyle : baseStyle}>
        <path d="M80,450 L70,480 L90,480 L95,450 Z" />
        <path d="M120,450 L130,480 L110,480 L105,450 Z" />
      </motion.g>
    </svg>
  );
};

export const FemaleBodyBack = ({ highlightedPart, className = "" }: BodySVGProps) => {
  return (
    <svg viewBox="0 0 200 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <GlowFilter />
      
      {/* Base Body Outline - Realistic Female Back */}
      <path
        d="M100,25 
           C112,25 120,35 120,50 C120,62 115,70 108,73 
           L108,85 
           Q130,88 145,95 
           C155,100 158,110 155,130 
           L150,190 
           C150,200 155,205 160,210 L162,215 L155,220 L145,215 C142,210 142,200 140,190 
           L135,150 
           Q132,180 135,200 
           C140,215 142,230 135,250 
           C130,270 125,300 122,330 
           L118,400 L120,450 
           C120,460 125,470 130,480 L110,480 L105,450 L102,350 
           L98,350 L95,450 L90,480 L70,480 
           C75,470 80,460 80,450 L82,400 
           C78,330 75,300 70,270 
           C60,240 58,215 65,200 
           Q68,180 65,150 
           L60,190 C58,200 58,210 55,215 L45,220 L38,215 L40,210 C45,205 50,200 50,190 
           L45,130 C42,110 45,100 55,95 
           Q70,88 92,85 
           L92,73 
           C85,70 80,62 80,50 C80,35 88,25 100,25 Z"
        style={staticBaseStyle}
      />

      {/* Detail Lines */}
      <path d="M90,100 L90,160 M110,100 L110,160" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.3}} /> {/* Shoulder blades */}
      <path d="M100,85 L100,200" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.3}} /> {/* Spine */}
      <path d="M80,230 Q100,250 120,230" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.3}} /> {/* Buttocks crease */}

      {/* Interactive Parts */}
      
      {/* Neck */}
      <motion.path
        d="M92,73 L108,73 L108,85 Q100,88 92,85 Z"
        initial={baseStyle}
        animate={highlightedPart === 'neck' ? highlightStyle : baseStyle}
      />

      {/* Shoulders */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'shoulders' ? highlightStyle : baseStyle}>
        <path d="M92,85 Q70,88 55,95 L60,110 L92,110 Z" />
        <path d="M108,85 Q130,88 145,95 L140,110 L108,110 Z" />
      </motion.g>

      {/* Back */}
      <motion.path
        d="M65,110 L135,110 L130,180 L70,180 Z"
        initial={baseStyle}
        animate={highlightedPart === 'back' ? highlightStyle : baseStyle}
      />

      {/* Arms */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'arms' ? highlightStyle : baseStyle}>
        <path d="M55,95 L45,130 L50,190 L60,190 L65,130 Z" />
        <path d="M145,95 L155,130 L150,190 L140,190 L135,130 Z" />
      </motion.g>

      {/* Hands */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'hands' ? highlightStyle : baseStyle}>
        <path d="M50,190 L40,210 L38,215 L45,220 L55,215 L60,190 Z" />
        <path d="M150,190 L160,210 L162,215 L155,220 L145,215 L140,190 Z" />
      </motion.g>

      {/* Waist */}
      <motion.path
        d="M70,180 L130,180 L135,200 L65,200 Z"
        initial={baseStyle}
        animate={highlightedPart === 'waist' ? highlightStyle : baseStyle}
      />

      {/* Hips (Buttocks) */}
      <motion.path
        d="M65,200 Q100,210 135,200 C140,220 135,240 100,240 C65,240 60,220 65,200 Z"
        initial={baseStyle}
        animate={highlightedPart === 'hips' ? highlightStyle : baseStyle}
      />

      {/* Thighs */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'thighs' ? highlightStyle : baseStyle}>
        <path d="M65,240 C60,270 70,300 80,330 L98,330 L100,240 Z" />
        <path d="M135,240 C140,270 130,300 120,330 L102,330 L100,240 Z" />
      </motion.g>

      {/* Legs */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'legs' ? highlightStyle : baseStyle}>
        <path d="M80,330 L82,400 L80,450 L95,450 L98,330 Z" />
        <path d="M120,330 L118,400 L120,450 L105,450 L102,330 Z" />
      </motion.g>

      {/* Feet */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'feet' ? highlightStyle : baseStyle}>
        <path d="M80,450 L70,480 L90,480 L95,450 Z" />
        <path d="M120,450 L130,480 L110,480 L105,450 Z" />
      </motion.g>
    </svg>
  );
};

export const MaleBodyFront = ({ highlightedPart, className = "" }: BodySVGProps) => {
  return (
    <svg viewBox="0 0 200 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <GlowFilter />
      
      {/* Base Body Outline - Realistic Male */}
      <path
        d="M100,25 
           C112,25 120,35 120,50 C120,62 115,70 108,73 
           L110,85 
           Q140,88 160,95 
           C165,100 165,115 160,135 
           L155,190 
           C155,200 160,205 165,210 L167,215 L160,220 L150,215 C147,210 147,200 145,190 
           L140,150 
           L135,200 
           C135,215 135,230 130,250 
           C128,270 125,300 122,330 
           L118,400 L120,450 
           C120,460 125,470 130,480 L110,480 L105,450 L102,350 
           L98,350 L95,450 L90,480 L70,480 
           C75,470 80,460 80,450 L82,400 
           C78,330 75,300 72,270 
           C70,250 65,230 65,200 
           L60,150 
           L55,190 C53,200 53,210 50,215 L40,220 L33,215 L35,210 C40,205 45,200 45,190 
           L40,135 C35,115 35,100 40,95 
           Q60,88 90,85 
           L92,73 
           C85,70 80,62 80,50 C80,35 88,25 100,25 Z"
        style={staticBaseStyle}
      />

      {/* Detail Lines */}
      <path d="M75,125 Q100,140 125,125" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.5}} /> {/* Pecs */}
      <path d="M100,125 L100,170" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.3}} /> {/* Abs line */}
      <path d="M90,350 L90,400 M110,350 L110,400" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.3}} /> {/* Knees */}

      {/* Interactive Parts */}
      
      {/* Lips */}
      <motion.path
        d="M94,58 Q100,61 106,58 Q100,64 94,58 Z"
        initial={baseStyle}
        animate={highlightedPart === 'lips' ? highlightStyle : baseStyle}
      />

      {/* Neck */}
      <motion.path
        d="M92,73 L108,73 L110,85 Q100,88 90,85 Z"
        initial={baseStyle}
        animate={highlightedPart === 'neck' ? highlightStyle : baseStyle}
      />

      {/* Ears */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'ears' ? highlightStyle : baseStyle}>
        <path d="M80,48 Q76,45 76,55 Q80,60 80,58" />
        <path d="M120,48 Q124,45 124,55 Q120,60 120,58" />
      </motion.g>

      {/* Shoulders */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'shoulders' ? highlightStyle : baseStyle}>
        <path d="M90,85 Q60,88 40,95 L45,115 L90,105 Z" />
        <path d="M110,85 Q140,88 160,95 L155,115 L110,105 Z" />
      </motion.g>

      {/* Chest */}
      <motion.path
        d="M60,105 C55,120 65,135 100,135 C135,135 145,120 140,105 Q100,115 60,105 Z"
        initial={baseStyle}
        animate={highlightedPart === 'chest' ? highlightStyle : baseStyle}
      />

      {/* Arms */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'arms' ? highlightStyle : baseStyle}>
        <path d="M40,95 L35,135 L45,190 L55,190 L60,135 Z" />
        <path d="M160,95 L165,135 L155,190 L145,190 L140,135 Z" />
      </motion.g>

      {/* Hands */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'hands' ? highlightStyle : baseStyle}>
        <path d="M45,190 L35,210 L33,215 L40,220 L50,215 L55,190 Z" />
        <path d="M155,190 L165,210 L167,215 L160,220 L150,215 L145,190 Z" />
      </motion.g>

      {/* Waist */}
      <motion.path
        d="M65,135 Q100,145 135,135 L135,170 Q100,180 65,170 Z"
        initial={baseStyle}
        animate={highlightedPart === 'waist' ? highlightStyle : baseStyle}
      />

      {/* Hips */}
      <motion.path
        d="M65,170 Q100,180 135,170 C135,190 135,200 130,220 Q100,230 70,220 C65,200 65,190 65,170 Z"
        initial={baseStyle}
        animate={highlightedPart === 'hips' ? highlightStyle : baseStyle}
      />

      {/* Thighs */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'thighs' ? highlightStyle : baseStyle}>
        <path d="M70,220 C68,250 72,300 80,330 L98,330 L100,230 Z" />
        <path d="M130,220 C132,250 128,300 120,330 L102,330 L100,230 Z" />
      </motion.g>

      {/* Legs */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'legs' ? highlightStyle : baseStyle}>
        <path d="M80,330 L82,400 L80,450 L95,450 L98,330 Z" />
        <path d="M120,330 L118,400 L120,450 L105,450 L102,330 Z" />
      </motion.g>

      {/* Feet */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'feet' ? highlightStyle : baseStyle}>
        <path d="M80,450 L70,480 L90,480 L95,450 Z" />
        <path d="M120,450 L130,480 L110,480 L105,450 Z" />
      </motion.g>
    </svg>
  );
};

export const MaleBodyBack = ({ highlightedPart, className = "" }: BodySVGProps) => {
  return (
    <svg viewBox="0 0 200 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <GlowFilter />
      
      {/* Base Body Outline - Realistic Male Back */}
      <path
        d="M100,25 
           C112,25 120,35 120,50 C120,62 115,70 108,73 
           L110,85 
           Q140,88 160,95 
           C165,100 165,115 160,135 
           L155,190 
           C155,200 160,205 165,210 L167,215 L160,220 L150,215 C147,210 147,200 145,190 
           L140,150 
           L135,200 
           C135,215 135,230 130,250 
           C128,270 125,300 122,330 
           L118,400 L120,450 
           C120,460 125,470 130,480 L110,480 L105,450 L102,350 
           L98,350 L95,450 L90,480 L70,480 
           C75,470 80,460 80,450 L82,400 
           C78,330 75,300 72,270 
           C70,250 65,230 65,200 
           L60,150 
           L55,190 C53,200 53,210 50,215 L40,220 L33,215 L35,210 C40,205 45,200 45,190 
           L40,135 C35,115 35,100 40,95 
           Q60,88 90,85 
           L92,73 
           C85,70 80,62 80,50 C80,35 88,25 100,25 Z"
        style={staticBaseStyle}
      />

      {/* Detail Lines */}
      <path d="M90,100 L90,150 M110,100 L110,150" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.3}} /> {/* Shoulder blades */}
      <path d="M100,85 L100,200" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.3}} /> {/* Spine */}
      <path d="M85,220 Q100,230 115,220" style={{...staticBaseStyle, strokeWidth: "0.5", opacity: 0.3}} /> {/* Buttocks crease */}

      {/* Interactive Parts */}
      
      {/* Neck */}
      <motion.path
        d="M92,73 L108,73 L110,85 Q100,88 90,85 Z"
        initial={baseStyle}
        animate={highlightedPart === 'neck' ? highlightStyle : baseStyle}
      />

      {/* Shoulders */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'shoulders' ? highlightStyle : baseStyle}>
        <path d="M90,85 Q60,88 40,95 L45,115 L90,105 Z" />
        <path d="M110,85 Q140,88 160,95 L155,115 L110,105 Z" />
      </motion.g>

      {/* Back */}
      <motion.path
        d="M60,105 L140,105 L135,170 L65,170 Z"
        initial={baseStyle}
        animate={highlightedPart === 'back' ? highlightStyle : baseStyle}
      />

      {/* Arms */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'arms' ? highlightStyle : baseStyle}>
        <path d="M40,95 L35,135 L45,190 L55,190 L60,135 Z" />
        <path d="M160,95 L165,135 L155,190 L145,190 L140,135 Z" />
      </motion.g>

      {/* Hands */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'hands' ? highlightStyle : baseStyle}>
        <path d="M45,190 L35,210 L33,215 L40,220 L50,215 L55,190 Z" />
        <path d="M155,190 L165,210 L167,215 L160,220 L150,215 L145,190 Z" />
      </motion.g>

      {/* Waist */}
      <motion.path
        d="M65,170 L135,170 L135,190 L65,190 Z"
        initial={baseStyle}
        animate={highlightedPart === 'waist' ? highlightStyle : baseStyle}
      />

      {/* Hips (Buttocks) */}
      <motion.path
        d="M65,190 Q100,200 135,190 C135,210 130,230 100,230 C70,230 65,210 65,190 Z"
        initial={baseStyle}
        animate={highlightedPart === 'hips' ? highlightStyle : baseStyle}
      />

      {/* Thighs */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'thighs' ? highlightStyle : baseStyle}>
        <path d="M70,230 C68,260 72,300 80,330 L98,330 L100,230 Z" />
        <path d="M130,230 C132,260 128,300 120,330 L102,330 L100,230 Z" />
      </motion.g>

      {/* Legs */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'legs' ? highlightStyle : baseStyle}>
        <path d="M80,330 L82,400 L80,450 L95,450 L98,330 Z" />
        <path d="M120,330 L118,400 L120,450 L105,450 L102,330 Z" />
      </motion.g>

      {/* Feet */}
      <motion.g initial={baseStyle} animate={highlightedPart === 'feet' ? highlightStyle : baseStyle}>
        <path d="M80,450 L70,480 L90,480 L95,450 Z" />
        <path d="M120,450 L130,480 L110,480 L105,450 Z" />
      </motion.g>
    </svg>
  );
};
