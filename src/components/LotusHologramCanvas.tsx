import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { OsintNode, DotConnection } from '../types/osint';
import { soundFx } from '../utils/audioSynth';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface LotusHologramCanvasProps {
  nodes: OsintNode[];
  connections: DotConnection[];
  selectedNode: OsintNode | null;
  onSelectNode: (node: OsintNode | null) => void;
  isScanning: boolean;
  activeHandle: string;
}

export const LotusHologramCanvas: React.FC<LotusHologramCanvasProps> = ({
  nodes,
  connections,
  selectedNode,
  onSelectNode,
  isScanning,
  activeHandle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Transform State (Pan & Zoom)
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<OsintNode | null>(null);
  const [randomGlitchActive, setRandomGlitchActive] = useState<boolean>(false);

  // Center coordinates of SVG viewport
  const CX = 700;
  const CY = 700;

  // Sound and bloom on scan
  useEffect(() => {
    if (isScanning) {
      soundFx.playBloom();
    }
  }, [isScanning]);

  // Periodic random holographic flare
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.45) {
        setRandomGlitchActive(true);
        soundFx.playGlitch();
        setTimeout(() => setRandomGlitchActive(false), 260);
      }
    }, 4000);
    return () => clearInterval(glitchInterval);
  }, []);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((prev) => Math.min(Math.max(prev * factor, 0.4), 4.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    soundFx.playChirp(900);
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    soundFx.playChirp(1300);
    setZoom((z) => Math.min(z * 1.25, 4.5));
  };

  const zoomOut = () => {
    soundFx.playChirp(750);
    setZoom((z) => Math.max(z * 0.8, 0.4));
  };

  // Convert polar coordinates to Cartesian
  const getCoordinates = useCallback((angleDeg: number, radius: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: CX + radius * Math.cos(rad),
      y: CY + radius * Math.sin(rad),
    };
  }, []);

  // Compute node positions
  const nodePositionMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    if (!Array.isArray(nodes)) return map;
    nodes.forEach((node) => {
      if (!node || typeof node.angleDeg !== 'number' || typeof node.radiusDist !== 'number') return;
      const pos = getCoordinates(node.angleDeg, node.radiusDist * 1.15);
      map.set(node.id, pos);
    });
    return map;
  }, [nodes, getCoordinates]);

  // Petal Feathers geometry with multiple tiers
  // Tier 1: 16 Outer Feather Plumes
  const outerPetals = useMemo(() => {
    const count = 16;
    return Array.from({ length: count }, (_, i) => ({
      id: `outer-petal-${i}`,
      angle: (i * 360) / count,
      length: 420,
      width: 58,
    }));
  }, []);

  // Tier 2: 12 Mid Feather Plumes
  const midPetals = useMemo(() => {
    const count = 12;
    return Array.from({ length: count }, (_, i) => ({
      id: `mid-petal-${i}`,
      angle: (i * 360) / count + 15,
      length: 290,
      width: 48,
    }));
  }, []);

  // Tier 3: 8 Inner Corona Petals
  const innerPetals = useMemo(() => {
    const count = 8;
    return Array.from({ length: count }, (_, i) => ({
      id: `inner-petal-${i}`,
      angle: (i * 360) / count,
      length: 175,
      width: 36,
    }));
  }, []);

  // Generate SVG path for high-detail feather
  const generatePetalPath = (angle: number, length: number, width: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    const perpRad = rad + Math.PI / 2;

    const tipX = CX + length * Math.cos(rad);
    const tipY = CY + length * Math.sin(rad);

    const midRadius = length * 0.65;
    const midX = CX + midRadius * Math.cos(rad);
    const midY = CY + midRadius * Math.sin(rad);

    const leftX = midX + width * Math.cos(perpRad);
    const leftY = midY + width * Math.sin(perpRad);

    const rightX = midX - width * Math.cos(perpRad);
    const rightY = midY - width * Math.sin(perpRad);

    return `M ${CX} ${CY} Q ${leftX} ${leftY} ${tipX} ${tipY} Q ${rightX} ${rightY} ${CX} ${CY} Z`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#000000] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Deep Obsidian Background with Subtle Cyber Starfield */}
      <div className="absolute inset-0 pointer-events-none opacity-20 cyber-grid" />

      {/* Floating Minimal Zoom HUD in Corner */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-black/70 border border-sky-500/30 backdrop-blur-md shadow-2xl">
        <button
          onClick={zoomIn}
          title="Zoom In"
          className="p-2 rounded-full text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="p-2 rounded-full text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-4 w-[1px] bg-sky-500/30" />
        <button
          onClick={resetView}
          title="Reset Zoom"
          className="px-2.5 py-1 rounded-full text-xs font-mono text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{(zoom * 100).toFixed(0)}%</span>
        </button>
      </div>

      {/* Main Vector SVG Hologram */}
      <svg
        className={`w-full h-full transition-transform duration-75 will-change-transform ${
          randomGlitchActive ? 'glitch-glow' : 'holo-glow'
        }`}
        viewBox="0 0 1400 1400"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <defs>
          {/* Intense Burning Sun Core Radial Gradient */}
          <radialGradient id="burningSunCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#e0f2fe" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#0284c7" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
          </radialGradient>

          {/* Burning Corona Solar Flare Gradient */}
          <radialGradient id="solarCorona" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
          </radialGradient>

          {/* Holographic Feather Gradients */}
          <linearGradient id="featherPlumeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.38" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.01" />
          </linearGradient>

          <linearGradient id="midFeatherGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="innerFeatherGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.05" />
          </linearGradient>

          {/* Sun Glow Filter */}
          <filter id="sunIntenseGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="16" result="blur1" />
            <feGaussianBlur stdDeviation="35" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Feather Glow Filter */}
          <filter id="featherGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. INTRICATE BACKGROUND RADIAL HUD LINES & GEOMETRY */}
        <g opacity="0.35">
          {/* Dense concentric orbital rings */}
          {[120, 180, 240, 300, 360, 420, 480, 540].map((r) => (
            <circle
              key={`ring-${r}`}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={r % 240 === 0 ? '1.2' : '0.6'}
              strokeDasharray={r % 180 === 0 ? '4 8' : '2 6'}
            />
          ))}

          {/* Fine 36-spoke radial coordinate guide lines */}
          {Array.from({ length: 36 }).map((_, i) => {
            const deg = i * 10;
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={`radial-${deg}`}
                x1={CX + 90 * Math.cos(rad)}
                y1={CY + 90 * Math.sin(rad)}
                x2={CX + 560 * Math.cos(rad)}
                y2={CY + 560 * Math.sin(rad)}
                stroke="#0284c7"
                strokeWidth="0.5"
                strokeDasharray="3 9"
                opacity={deg % 30 === 0 ? '0.7' : '0.3'}
              />
            );
          })}
        </g>

        {/* 2. DYNAMIC ROTATING CORONA & RADAR SPOKES */}
        <g className="radar-rotate origin-center" style={{ transformOrigin: `${CX}px ${CY}px` }}>
          <circle cx={CX} cy={CY} r="460" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="140 60 20 60" opacity="0.3" />
          <circle cx={CX} cy={CY} r="320" fill="none" stroke="#00f0ff" strokeWidth="1.2" strokeDasharray="80 120" opacity="0.35" />
        </g>
        <g className="radar-rotate-reverse origin-center" style={{ transformOrigin: `${CX}px ${CY}px` }}>
          <circle cx={CX} cy={CY} r="220" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="30 60" opacity="0.4" />
        </g>

        {/* 3. MULTI-LAYERED LOTUS FEATHERS (INTRICATE VEIN AND BARB LINES) */}
        {/* Tier 1: Outer Feather Plumes (16 Plumes) */}
        <g>
          {outerPetals.map((petal) => {
            const pathData = generatePetalPath(petal.angle, petal.length, petal.width);
            const tip = getCoordinates(petal.angle, petal.length);
            return (
              <g key={petal.id} className="transition-opacity duration-300">
                {/* Petal Outer Shell */}
                <path
                  d={pathData}
                  fill="url(#featherPlumeGrad)"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeOpacity="0.5"
                  filter="url(#featherGlow)"
                />

                {/* Feather Spine (Central Rachis) */}
                <line
                  x1={CX}
                  y1={CY}
                  x2={tip.x}
                  y2={tip.y}
                  stroke="#7dd3fc"
                  strokeWidth="1"
                  strokeOpacity="0.75"
                />

                {/* DENSE FEATHER BARB LINES (visible when zooming!) */}
                {[0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85].map((ratio, bIdx) => {
                  const bRad = ((petal.angle - 90) * Math.PI) / 180;
                  const perp = bRad + Math.PI / 2;
                  const bx = CX + petal.length * ratio * Math.cos(bRad);
                  const by = CY + petal.length * ratio * Math.sin(bRad);
                  const barbWidth = petal.width * (0.8 - bIdx * 0.08);

                  return (
                    <g key={`barb-${bIdx}`}>
                      <line
                        x1={bx}
                        y1={by}
                        x2={bx + barbWidth * Math.cos(perp)}
                        y2={by + barbWidth * Math.sin(perp)}
                        stroke="#38bdf8"
                        strokeWidth="0.75"
                        strokeOpacity="0.4"
                      />
                      <line
                        x1={bx}
                        y1={by}
                        x2={bx - barbWidth * Math.cos(perp)}
                        y2={by - barbWidth * Math.sin(perp)}
                        stroke="#38bdf8"
                        strokeWidth="0.75"
                        strokeOpacity="0.4"
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* Tier 2: Mid Feather Blades (12 Plumes) */}
        <g>
          {midPetals.map((petal) => {
            const pathData = generatePetalPath(petal.angle, petal.length, petal.width);
            const tip = getCoordinates(petal.angle, petal.length);
            return (
              <g key={petal.id}>
                <path
                  d={pathData}
                  fill="url(#midFeatherGrad)"
                  stroke="#00f0ff"
                  strokeWidth="1.4"
                  strokeOpacity="0.7"
                  filter="url(#featherGlow)"
                />
                <line
                  x1={CX}
                  y1={CY}
                  x2={tip.x}
                  y2={tip.y}
                  stroke="#00f0ff"
                  strokeWidth="1.2"
                  strokeOpacity="0.8"
                />

                {/* Mid Feather Barbs */}
                {[0.3, 0.5, 0.7, 0.85].map((ratio, bIdx) => {
                  const bRad = ((petal.angle - 90) * Math.PI) / 180;
                  const perp = bRad + Math.PI / 2;
                  const bx = CX + petal.length * ratio * Math.cos(bRad);
                  const by = CY + petal.length * ratio * Math.sin(bRad);
                  const barbWidth = petal.width * (0.75 - bIdx * 0.1);

                  return (
                    <g key={`mid-barb-${bIdx}`}>
                      <line
                        x1={bx}
                        y1={by}
                        x2={bx + barbWidth * Math.cos(perp)}
                        y2={by + barbWidth * Math.sin(perp)}
                        stroke="#00f0ff"
                        strokeWidth="0.8"
                        strokeOpacity="0.5"
                      />
                      <line
                        x1={bx}
                        y1={by}
                        x2={bx - barbWidth * Math.cos(perp)}
                        y2={by - barbWidth * Math.sin(perp)}
                        stroke="#00f0ff"
                        strokeWidth="0.8"
                        strokeOpacity="0.5"
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* Tier 3: Inner Corona Petals (8 Blades) */}
        <g>
          {innerPetals.map((petal) => {
            const pathData = generatePetalPath(petal.angle, petal.length, petal.width);
            return (
              <path
                key={petal.id}
                d={pathData}
                fill="url(#innerFeatherGrad)"
                stroke="#e0f2fe"
                strokeWidth="1.6"
                strokeOpacity="0.85"
                filter="url(#featherGlow)"
              />
            );
          })}
        </g>

        {/* 4. DYNAMIC DOT-CONNECTION ARCS */}
        <g>
          {connections && connections.map((conn) => {
            if (!conn || !conn.sourceId || !conn.targetId) return null;
            const srcPos = nodePositionMap.get(conn.sourceId);
            const tgtPos = nodePositionMap.get(conn.targetId);
            if (!srcPos || !tgtPos) return null;

            const isSelected = selectedNode?.id === conn.sourceId || selectedNode?.id === conn.targetId;
            const midX = (srcPos.x + tgtPos.x) / 2 + (CX - (srcPos.x + tgtPos.x) / 2) * 0.2;
            const midY = (srcPos.y + tgtPos.y) / 2 + (CY - (srcPos.y + tgtPos.y) / 2) * 0.2;
            const pathD = `M ${srcPos.x} ${srcPos.y} Q ${midX} ${midY} ${tgtPos.x} ${tgtPos.y}`;

            const isBreach = conn.relationType === 'credential_leak';

            return (
              <g key={conn.id}>
                {/* Arc Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isBreach ? '#f43f5e' : isSelected ? '#00f0ff' : '#38bdf8'}
                  strokeWidth={isSelected ? 3.5 : 1.4}
                  strokeOpacity={isSelected ? 0.95 : 0.45}
                  filter="url(#featherGlow)"
                />

                {/* Traveling Photon Pulse on Connection Arc */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isBreach ? '#fda4af' : '#ffffff'}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                  strokeDasharray="6 48"
                  className="animate-[pulse_1.5s_linear_infinite]"
                  opacity="0.85"
                />
              </g>
            );
          })}
        </g>

        {/* 5. OSINT NODES ON FEATHER TIPS */}
        <g>
          {nodes && nodes.map((node) => {
            if (!node || !node.id) return null;
            const pos = nodePositionMap.get(node.id);
            if (!pos) return null;

            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode?.id === node.id;
            const isBreach = node.status === 'breached';

            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playLock();
                  onSelectNode(node);
                }}
                onMouseEnter={() => {
                  soundFx.playChirp(1300);
                  setHoveredNode(node);
                }}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Reticle Pulse */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 20 : 15}
                    fill="none"
                    stroke={isBreach ? '#f43f5e' : '#00f0ff'}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="animate-spin origin-center"
                    style={{ transformOrigin: `${pos.x}px ${pos.y}px`, animationDuration: '5s' }}
                  />
                )}

                {/* Node Outer Halo */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 12 : 7}
                  fill={isBreach ? '#f43f5e' : '#38bdf8'}
                  opacity={isSelected ? 0.7 : 0.3}
                  className="filter blur-[3px]"
                />

                {/* Core Dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 6 : 4}
                  fill={isBreach ? '#f43f5e' : isSelected ? '#ffffff' : '#38bdf8'}
                  stroke={isBreach ? '#ffe4e6' : '#e0f2fe'}
                  strokeWidth="1.5"
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* Platform Label */}
                <g
                  transform={`translate(${pos.x + 10}, ${pos.y - 8})`}
                  className={`pointer-events-none transition-opacity duration-200 ${
                    isSelected || isHovered || zoom > 1.3 ? 'opacity-100' : 'opacity-70'
                  }`}
                >
                  <rect
                    x="0"
                    y="-11"
                    width={node.platform.length * 7 + 14}
                    height="16"
                    rx="3"
                    fill="#000000"
                    fillOpacity="0.85"
                    stroke={isBreach ? '#f43f5e' : '#38bdf8'}
                    strokeWidth="0.75"
                  />
                  <text
                    x="7"
                    y="0"
                    fill={isBreach ? '#fda4af' : '#e0f2fe'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {node.platform}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* 6. THE BURNING MINI SUN IN THE CENTER OF THE LOTUS */}
        <g
          className="cursor-pointer"
          onClick={() => {
            soundFx.playBloom();
            resetView();
          }}
        >
          {/* Outermost Blazing Radiant Solar Corona */}
          <circle
            cx={CX}
            cy={CY}
            r="110"
            fill="url(#solarCorona)"
            className="animate-pulse"
            filter="url(#sunIntenseGlow)"
            opacity="0.85"
          />

          {/* Radiating Solar Flare Rays (36 dynamic corona flares) */}
          <g className="radar-rotate origin-center" style={{ transformOrigin: `${CX}px ${CY}px` }}>
            {Array.from({ length: 36 }).map((_, i) => {
              const deg = i * 10;
              const rad = (deg * Math.PI) / 180;
              const flareLen = 65 + ((i * 7) % 35);
              return (
                <line
                  key={`sun-flare-${i}`}
                  x1={CX + 28 * Math.cos(rad)}
                  y1={CY + 28 * Math.sin(rad)}
                  x2={CX + flareLen * Math.cos(rad)}
                  y2={CY + flareLen * Math.sin(rad)}
                  stroke="#38bdf8"
                  strokeWidth={i % 2 === 0 ? '1.5' : '0.8'}
                  strokeOpacity={0.6 + ((i % 4) * 0.1)}
                />
              );
            })}
          </g>

          {/* Inner Counter-Rotating Solar Plasma Flares */}
          <g className="radar-rotate-reverse origin-center" style={{ transformOrigin: `${CX}px ${CY}px` }}>
            {Array.from({ length: 18 }).map((_, i) => {
              const deg = i * 20;
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={`sun-flare-rev-${i}`}
                  x1={CX + 22 * Math.cos(rad)}
                  y1={CY + 22 * Math.sin(rad)}
                  x2={CX + 52 * Math.cos(rad)}
                  y2={CY + 52 * Math.sin(rad)}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                />
              );
            })}
          </g>

          {/* Glowing Magnetic Fusion Rings */}
          <circle cx={CX} cy={CY} r="54" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.9" />
          <circle cx={CX} cy={CY} r="42" fill="none" stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
          <circle cx={CX} cy={CY} r="32" fill="none" stroke="#ffffff" strokeWidth="1.8" opacity="0.9" />

          {/* Ultra White-Hot Blazing Solar Sun Core */}
          <circle
            cx={CX}
            cy={CY}
            r="28"
            fill="url(#burningSunCore)"
            filter="url(#sunIntenseGlow)"
          />
          <circle
            cx={CX}
            cy={CY}
            r="16"
            fill="#ffffff"
            className="filter drop-shadow-[0_0_15px_#ffffff]"
          />
        </g>
      </svg>
    </div>
  );
};
