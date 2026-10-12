/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { OsintNode, DotConnection } from './types/osint';
import { generateInvestigationData } from './utils/osintEngine';
import { soundFx } from './utils/audioSynth';
import { LotusHologramCanvas } from './components/LotusHologramCanvas';
import { NodeDossierModal } from './components/NodeDossierModal';
import { PythonTkinterBridgeModal } from './components/PythonTkinterBridgeModal';
import { Search, Sparkles, Volume2, VolumeX, Terminal, RefreshCw } from 'lucide-react';

export default function App() {
  const [targetInput, setTargetInput] = useState<string>('tonystark');
  const [activeHandle, setActiveHandle] = useState<string>('tonystark');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // OSINT Graph Data
  const [nodes, setNodes] = useState<OsintNode[]>([]);
  const [connections, setConnections] = useState<DotConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<OsintNode | null>(null);

  // Interval reference to avoid duplicate concurrent streaming
  const scanIntervalRef = React.useRef<number | null>(null);

  // Python & JS App Modal
  const [showAppModal, setShowAppModal] = useState<boolean>(false);

  // Execute Investigation & Connect Dots
  const executeInvestigation = useCallback((handleToScan: string) => {
    if (scanIntervalRef.current !== null) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    const clean = handleToScan.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'target';
    setActiveHandle(clean);
    setIsScanning(true);
    setSelectedNode(null);

    soundFx.playBloom();

    const data = generateInvestigationData(clean);
    const validNodes = (data.nodes || []).filter((n): n is OsintNode => !!n && typeof n.angleDeg === 'number');
    const validConnections = (data.connections || []).filter((c): c is DotConnection => !!c && !!c.sourceId && !!c.targetId);

    setNodes([]);
    setConnections([]);

    let currentIdx = 0;

    const interval = window.setInterval(() => {
      if (currentIdx < validNodes.length) {
        const nextNode = validNodes[currentIdx];
        if (nextNode) {
          setNodes((prev) => [...prev.filter(Boolean), nextNode]);
          if (currentIdx % 3 === 0) {
            soundFx.playChirp(1200 + currentIdx * 30);
          }
        }
        currentIdx++;
      } else {
        if (scanIntervalRef.current !== null) {
          clearInterval(scanIntervalRef.current);
          scanIntervalRef.current = null;
        }
        setNodes(validNodes);
        setConnections(validConnections);
        setIsScanning(false);
        soundFx.playLock();
      }
    }, 60);

    scanIntervalRef.current = interval;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current !== null) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  // Initial Bootup
  useEffect(() => {
    const timer = setTimeout(() => {
      executeInvestigation('tonystark');
    }, 400);
    return () => clearTimeout(timer);
  }, [executeInvestigation]);

  const toggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    soundFx.setMuted(nextMuted);
    if (!nextMuted) {
      soundFx.playChirp(1200);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#000000] text-[#e0f2fe] flex flex-col overflow-hidden select-none">
      {/* 1. ULTRA-MINIMAL FLOATING SMALL USERNAME BOX */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 pointer-events-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (targetInput.trim()) {
              executeInvestigation(targetInput.trim());
            }
          }}
          className="relative flex items-center bg-black/85 border border-sky-400/40 rounded-full px-3 py-1.5 backdrop-blur-md shadow-2xl shadow-sky-950/80 group focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all"
        >
          <span className="text-cyan-400 font-mono text-sm font-bold pl-1.5 pr-1 select-none">
            @
          </span>
          <input
            type="text"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            placeholder="Enter username to connect dots..."
            className="flex-1 bg-transparent border-none text-cyan-100 placeholder:text-sky-700 font-mono text-xs focus:outline-none"
          />
          <button
            type="submit"
            disabled={isScanning}
            className="px-3.5 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center gap-1 transition-all shadow-md shadow-cyan-950 disabled:opacity-50"
          >
            {isScanning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Connect</span>
          </button>
        </form>

        {/* Quick Sample Target Chips */}
        <div className="flex items-center justify-center gap-2 mt-1.5 text-[10px] font-mono text-sky-400/60">
          {['tonystark', 'zer0day', 'cypher99', 'phantom'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setTargetInput(sample);
                executeInvestigation(sample);
              }}
              className="hover:text-cyan-300 transition-colors"
            >
              @{sample}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MINIMAL FLOATING ACTION PILLS */}
      <div className="absolute top-5 right-5 z-40 flex items-center gap-2">
        {/* Python & JS Desktop App launcher modal */}
        <button
          onClick={() => {
            soundFx.playChirp(1200);
            setShowAppModal(true);
          }}
          title="Python & Node.js Standalone Code"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-sky-500/40 text-cyan-300 hover:text-white hover:bg-sky-950 transition-all font-mono text-xs backdrop-blur-md shadow-lg"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Python &amp; JS App</span>
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={toggleSound}
          title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 rounded-full bg-black/80 border border-sky-500/40 text-sky-300 hover:text-white hover:bg-sky-950 transition-all backdrop-blur-md shadow-lg"
        >
          {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
        </button>
      </div>

      {/* 3. PURE 100% FOCUS: THE HOLOGRAPHIC LOTUS WITH BURNING SUN CORE */}
      <main className="w-full h-full relative">
        <LotusHologramCanvas
          nodes={nodes}
          connections={connections}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          isScanning={isScanning}
          activeHandle={activeHandle}
        />
      </main>

      {/* 4. MODALS */}
      {selectedNode && (
        <NodeDossierModal
          node={selectedNode}
          connections={connections}
          allNodes={nodes}
          onClose={() => setSelectedNode(null)}
          onSelectNode={(node) => setSelectedNode(node)}
        />
      )}

      <PythonTkinterBridgeModal
        isOpen={showAppModal}
        onClose={() => setShowAppModal(false)}
        activeHandle={activeHandle}
      />
    </div>
  );
}
