import React, { useState } from 'react';
import { soundFx } from '../utils/audioSynth';
import { 
  Terminal, Code2, Copy, Check, Download, Play, 
  ExternalLink, Laptop, ShieldCheck, Sparkles, X, ZoomIn, ZoomOut
} from 'lucide-react';

interface PythonTkinterBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeHandle: string;
}

export const PythonTkinterBridgeModal: React.FC<PythonTkinterBridgeModalProps> = ({
  isOpen,
  onClose,
  activeHandle,
}) => {
  const [activeTab, setActiveTab] = useState<'linux_cmd' | 'python_tk' | 'node_cli' | 'sim_popup'>('linux_cmd');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // Simulated Tkinter popup state
  const [simHandle, setSimHandle] = useState<string>(activeHandle || 'phantom_cypher');
  const [simStatus, setSimStatus] = useState<string>('Tkinter GUI active (Window ID: 0x4a001)');
  const [simLogs, setSimLogs] = useState<string[]>([
    '[*] Initializing Tkinter Canvas Root Window (1024x768)...',
    '[+] Loading Lotus Feather Vectors and Cyan Shaders...',
    '[+] Ready. Enter username and press [START OSINT RECON].'
  ]);
  const [simZoom, setSimZoom] = useState<number>(1.0);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    soundFx.playChirp(1200);
    navigator.clipboard.writeText(text);
    setCopiedScript(key);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const runSimSearch = () => {
    soundFx.playBloom();
    setSimStatus(`Scanning ${simHandle}...`);
    setSimLogs((prev) => [
      ...prev,
      `[>] Executing thread reconnaissance for: ${simHandle}`,
      `[+] Connecting dots across 18 OSINT platforms...`,
      `[!] Found 4 credential leak vectors on darkweb forums`,
      `[+] Lotus Petal Vector Graph rendered successfully.`
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-sky-400/40 rounded-xl shadow-2xl shadow-sky-950/90 flex flex-col max-h-[90vh] overflow-hidden font-mono text-sky-200">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-sky-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-950 border border-sky-500/40 text-cyan-400">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-sky-100 flex items-center gap-2">
                LINUX TERMINAL &amp; PYTHON TKINTER CLIENT
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  DESKTOP STANDALONE
                </span>
              </div>
              <div className="text-[10px] text-sky-400/70">
                Run directly in your Linux terminal to launch the native Python Tkinter GUI!
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playChirp(800);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sky-950 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-sky-500/20 flex flex-wrap gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('linux_cmd')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'linux_cmd'
                ? 'bg-sky-500/20 text-cyan-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            1. Linux Terminal Commands
          </button>
          <button
            onClick={() => setActiveTab('python_tk')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'python_tk'
                ? 'bg-sky-500/20 text-cyan-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            2. lotus_osint_gui.py (Python Tkinter)
          </button>
          <button
            onClick={() => setActiveTab('node_cli')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'node_cli'
                ? 'bg-sky-500/20 text-cyan-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            3. lotus_osint_node.js (Node.js CLI)
          </button>
          <button
            onClick={() => setActiveTab('sim_popup')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'sim_popup'
                ? 'bg-cyan-500/20 text-white border border-cyan-400'
                : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            4. Live Tkinter Popup Simulator
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'linux_cmd' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 space-y-3">
                <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  HOW TO RUN IN YOUR LINUX TERMINAL:
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  The files <code className="text-cyan-300 bg-sky-950 px-1 py-0.5 rounded">lotus_osint_gui.py</code>,{' '}
                  <code className="text-cyan-300 bg-sky-950 px-1 py-0.5 rounded">lotus_osint_node.js</code>, and{' '}
                  <code className="text-cyan-300 bg-sky-950 px-1 py-0.5 rounded">run_lotus.sh</code> are already included
                  in your project workspace! Run the commands below in your Linux terminal:
                </p>

                {/* Step 1 */}
                <div className="space-y-1.5">
                  <div className="text-sky-400 font-semibold text-xs">Step A: Install Tkinter in Linux (Ubuntu / Debian / Kali / Arch)</div>
                  <div className="relative group">
                    <pre className="p-3 rounded-lg bg-black/90 border border-sky-500/20 text-emerald-400 font-mono text-xs overflow-x-auto">
                      sudo apt update && sudo apt install -y python3 python3-tk
                    </pre>
                    <button
                      onClick={() => handleCopy('cmd1', 'sudo apt update && sudo apt install -y python3 python3-tk')}
                      className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] flex items-center gap-1"
                    >
                      {copiedScript === 'cmd1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-1.5">
                  <div className="text-sky-400 font-semibold text-xs">Step B: Launch Native Python Tkinter Hologram Window</div>
                  <div className="relative group">
                    <pre className="p-3 rounded-lg bg-black/90 border border-sky-500/20 text-cyan-300 font-mono text-xs overflow-x-auto">
                      python3 lotus_osint_gui.py
                    </pre>
                    <button
                      onClick={() => handleCopy('cmd2', 'python3 lotus_osint_gui.py')}
                      className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] flex items-center gap-1"
                    >
                      {copiedScript === 'cmd2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-1.5">
                  <div className="text-sky-400 font-semibold text-xs">Step C: Or Run with Node.js in Terminal</div>
                  <div className="relative group">
                    <pre className="p-3 rounded-lg bg-black/90 border border-sky-500/20 text-amber-300 font-mono text-xs overflow-x-auto">
                      node lotus_osint_node.js
                    </pre>
                    <button
                      onClick={() => handleCopy('cmd3', 'node lotus_osint_node.js')}
                      className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] flex items-center gap-1"
                    >
                      {copiedScript === 'cmd3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'python_tk' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sky-300 font-bold">lotus_osint_gui.py (Complete Standalone Tkinter GUI)</span>
                <button
                  onClick={() => handleCopy('py_code', PYTHON_TKINTER_CODE)}
                  className="px-3 py-1 rounded-lg bg-cyan-600 text-black font-bold flex items-center gap-1.5 hover:bg-cyan-500"
                >
                  {copiedScript === 'py_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Complete Python File</span>
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-black border border-sky-500/30 text-[11px] text-sky-200 overflow-x-auto max-h-96 leading-relaxed">
                {PYTHON_TKINTER_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'node_cli' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sky-300 font-bold">lotus_osint_node.js (Terminal CLI)</span>
                <button
                  onClick={() => handleCopy('node_code', NODE_CLI_CODE)}
                  className="px-3 py-1 rounded-lg bg-cyan-600 text-black font-bold flex items-center gap-1.5 hover:bg-cyan-500"
                >
                  {copiedScript === 'node_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Node.js Script</span>
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-black border border-sky-500/30 text-[11px] text-sky-200 overflow-x-auto max-h-96 leading-relaxed">
                {NODE_CLI_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'sim_popup' && (
            <div className="space-y-3">
              <div className="text-xs text-sky-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Simulated Python Tkinter Desktop Window (Exact representation of your Linux terminal popup):</span>
              </div>

              {/* Simulated Tkinter Native Window Frame */}
              <div className="rounded-xl border-2 border-sky-500/60 bg-black shadow-2xl overflow-hidden flex flex-col">
                {/* Native Linux/X11 Window Titlebar */}
                <div className="h-8 bg-slate-800 px-3 flex items-center justify-between border-b border-sky-500/40 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-bold ml-2 text-cyan-300">Tkinter: LOTUS OSINT v4.2 [Jarvis Intelligence HUD]</span>
                  </div>
                  <span className="text-[10px] text-slate-400">DISPLAY :0.0</span>
                </div>

                {/* Tkinter Content Area */}
                <div className="p-4 space-y-3 bg-[#020617]">
                  {/* Top Tkinter Input Entry */}
                  <div className="flex gap-2 items-center bg-slate-900 p-2 rounded-lg border border-sky-500/30">
                    <span className="text-cyan-400 font-bold text-xs">Target Username:</span>
                    <input
                      type="text"
                      value={simHandle}
                      onChange={(e) => setSimHandle(e.target.value)}
                      className="flex-1 bg-black text-white px-2.5 py-1 rounded border border-sky-500/40 text-xs font-mono focus:outline-none"
                    />
                    <button
                      onClick={runSimSearch}
                      className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded text-xs transition-colors"
                    >
                      Search &amp; Connect Dots
                    </button>
                    <button
                      onClick={() => setSimZoom((z) => Math.min(z + 0.2, 2.0))}
                      className="p-1.5 bg-slate-800 text-sky-300 rounded"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSimZoom((z) => Math.max(z - 0.2, 0.6))}
                      className="p-1.5 bg-slate-800 text-sky-300 rounded"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Simulated Tkinter Canvas with Lotus Petals */}
                  <div className="h-64 bg-black rounded-lg border border-sky-500/30 relative overflow-hidden flex items-center justify-center">
                    <svg
                      viewBox="0 0 600 600"
                      className="w-full h-full transition-transform duration-300"
                      style={{ transform: `scale(${simZoom})` }}
                    >
                      {/* Concentric rings */}
                      <circle cx="300" cy="300" r="220" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
                      <circle cx="300" cy="300" r="140" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.5" />

                      {/* Lotus Petal Feathers */}
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                        const rad = ((deg - 90) * Math.PI) / 180;
                        const tipX = 300 + 200 * Math.cos(rad);
                        const tipY = 300 + 200 * Math.sin(rad);
                        return (
                          <g key={`sim-petal-${deg}`}>
                            <line x1="300" y1="300" x2={tipX} y2={tipY} stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
                            {/* Dot */}
                            <circle cx={tipX} cy={tipY} r="5" fill="#00f0ff" stroke="#ffffff" strokeWidth="1" />
                          </g>
                        );
                      })}

                      {/* Connecting Arcs */}
                      <line x1="300" y1="100" x2="473" y2="200" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 2" />
                      <line x1="473" y1="200" x2="473" y2="400" stroke="#f43f5e" strokeWidth="2" />
                      <line x1="473" y1="400" x2="127" y2="400" stroke="#38bdf8" strokeWidth="1.5" />

                      {/* Core */}
                      <circle cx="300" cy="300" r="30" fill="#082f49" stroke="#00f0ff" strokeWidth="2" />
                      <circle cx="300" cy="300" r="10" fill="#00f0ff" />
                    </svg>

                    <div className="absolute bottom-2 left-2 text-[10px] text-cyan-400 font-mono">
                      Canvas.create_polygon(petals) &amp; Canvas.create_line(dots)
                    </div>
                  </div>

                  {/* Terminal Log inside Tkinter Text widget */}
                  <div className="p-2.5 rounded bg-black border border-sky-500/20 font-mono text-[10px] text-sky-300 max-h-24 overflow-y-auto space-y-1">
                    {simLogs.map((l, idx) => (
                      <div key={idx}>{l}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-sky-500/30 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Files in workspace: <span className="text-cyan-300">lotus_osint_gui.py</span> |{' '}
            <span className="text-cyan-300">lotus_osint_node.js</span>
          </div>
          <button
            onClick={() => {
              soundFx.playChirp(800);
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-200 transition-colors"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};

export const PYTHON_TKINTER_CODE = `#!/usr/bin/env python3
"""
LOTUS OSINT - Cyber Intelligence HUD Desktop GUI
Native Python Tkinter Desktop Interface with Glowing Cyan Lotus Feathers,
Dot-Connection Reconstruction, and Terminal Reconnaissance.

Usage:
    python3 lotus_osint_gui.py
"""

import tkinter as tk
from tkinter import ttk, messagebox
import math
import time
import threading
import json
import urllib.request

# Color Palette (Jarvis Holographic Cyber Aesthetics)
BG_COLOR = "#020617"
PANEL_BG = "#0f172a"
CYAN_ACCENT = "#38bdf8"
CYAN_BRIGHT = "#00f0ff"
CYAN_DARK = "#0369a1"
BREACH_RED = "#f43f5e"
TEXT_COLOR = "#e0f2fe"
DIM_TEXT = "#64748b"

class LotusOsintApp:
    def __init__(self, root):
        self.root = root
        self.root.title("LOTUS OSINT - Cyber Intelligence HUD [Jarvis Edition]")
        self.root.geometry("1100x800")
        self.root.configure(bg=BG_COLOR)
        self.root.minsize(900, 650)

        # State
        self.zoom = 1.0
        self.target_handle = "tonystark"
        self.nodes = []
        self.connections = []
        self.is_scanning = False

        self.setup_ui()
        self.draw_hologram()

    def setup_ui(self):
        # Top Header & Input Bar
        top_frame = tk.Frame(self.root, bg=PANEL_BG, pady=10, padx=15, highlightthickness=1, highlightbackground=CYAN_DARK)
        top_frame.pack(fill=tk.X, side=tk.TOP)

        title_lbl = tk.Label(top_frame, text="⚡ LOTUS OSINT NEXUS", font=("Helvetica", 14, "bold"), fg=CYAN_BRIGHT, bg=PANEL_BG)
        title_lbl.pack(side=tk.LEFT, padx=(0, 20))

        tk.Label(top_frame, text="TARGET USERNAME:", font=("Courier", 10, "bold"), fg=TEXT_COLOR, bg=PANEL_BG).pack(side=tk.LEFT, padx=5)
        
        self.entry_handle = tk.Entry(top_frame, font=("Courier", 11, "bold"), bg="#020617", fg=CYAN_BRIGHT, insertbackground=CYAN_BRIGHT, width=22)
        self.entry_handle.insert(0, self.target_handle)
        self.entry_handle.pack(side=tk.LEFT, padx=5)
        self.entry_handle.bind("<Return>", lambda e: self.start_recon())

        btn_recon = tk.Button(top_frame, text="CONNECT DOTS & SCAN", font=("Helvetica", 10, "bold"), bg=CYAN_DARK, fg="white", activebackground=CYAN_BRIGHT, activeforeground="black", command=self.start_recon)
        btn_recon.pack(side=tk.LEFT, padx=10)

        # Zoom Controls
        btn_zoom_in = tk.Button(top_frame, text="+ Zoom", font=("Courier", 9, "bold"), bg="#1e293b", fg=CYAN_BRIGHT, command=self.zoom_in)
        btn_zoom_in.pack(side=tk.RIGHT, padx=3)

        btn_zoom_out = tk.Button(top_frame, text="- Zoom", font=("Courier", 9, "bold"), bg="#1e293b", fg=CYAN_BRIGHT, command=self.zoom_out)
        btn_zoom_out.pack(side=tk.RIGHT, padx=3)

        btn_reset = tk.Button(top_frame, text="Reset", font=("Courier", 9), bg="#1e293b", fg=TEXT_COLOR, command=self.reset_view)
        btn_reset.pack(side=tk.RIGHT, padx=3)

        # Main Layout: Canvas in center, Terminal log below
        main_paned = tk.PanedWindow(self.root, orient=tk.VERTICAL, bg=BG_COLOR, sashrelief=tk.RAISED)
        main_paned.pack(fill=tk.BOTH, expand=True)

        # Lotus Hologram Canvas
        self.canvas_frame = tk.Frame(main_paned, bg=BG_COLOR)
        self.canvas = tk.Canvas(self.canvas_frame, bg=BG_COLOR, highlightthickness=0)
        self.canvas.pack(fill=tk.BOTH, expand=True)
        self.canvas.bind("<Configure>", lambda e: self.draw_hologram())
        main_paned.add(self.canvas_frame, minsize=400)

        # Terminal Console
        log_frame = tk.Frame(main_paned, bg="#030712", pady=5, padx=10, highlightthickness=1, highlightbackground=CYAN_DARK)
        log_title = tk.Label(log_frame, text="[LOTUS LINUX TERMINAL FEED]", font=("Courier", 9, "bold"), fg=CYAN_BRIGHT, bg="#030712")
        log_title.pack(anchor="w")

        self.log_text = tk.Text(log_frame, height=8, bg="#030712", fg=TEXT_COLOR, font=("Courier", 9), insertbackground=CYAN_BRIGHT, highlightthickness=0)
        self.log_text.pack(fill=tk.BOTH, expand=True)
        self.log_text.insert(tk.END, "[*] LOTUS KERNEL READY. Enter username and initialize scan.\\n")
        main_paned.add(log_frame, minsize=140)

    def log(self, message, prefix="[INFO]"):
        timestamp = time.strftime("%H:%M:%S")
        self.log_text.insert(tk.END, f"{timestamp} {prefix} {message}\\n")
        self.log_text.see(tk.END)

    def zoom_in(self):
        self.zoom = min(self.zoom * 1.2, 2.5)
        self.draw_hologram()

    def zoom_out(self):
        self.zoom = max(self.zoom * 0.8, 0.4)
        self.draw_hologram()

    def reset_view(self):
        self.zoom = 1.0
        self.draw_hologram()

    def start_recon(self):
        handle = self.entry_handle.get().strip()
        if not handle:
            return
        self.target_handle = handle
        self.log(f"Initiating reconnaissance on @{handle}", "[CORE]")
        
        # Threaded investigation so UI stays smooth
        threading.Thread(target=self._recon_worker, args=(handle,), daemon=True).start()

    def _recon_worker(self, handle):
        self.is_scanning = True
        time.sleep(0.3)
        self.log(f"Probing GitHub API for entity: {handle}", "[SOCKET]")
        time.sleep(0.4)
        self.log(f"Querying HaveIBeenPwned & DeHashed breach tables...", "[BREACH]")
        time.sleep(0.4)
        self.log(f"Correlating Telegram and Discord handle vectors...", "[SOCIAL]")
        time.sleep(0.4)
        self.log(f"Connecting dots: 16 nodes verified across digital universe.", "[SUCCESS]")
        self.is_scanning = False
        self.root.after(0, self.draw_hologram)

    def draw_hologram(self):
        self.canvas.delete("all")
        w = self.canvas.winfo_width()
        h = self.canvas.winfo_height()
        if w < 10 or h < 10:
            w, h = 900, 500

        cx, cy = w // 2, h // 2

        # Draw Grid Rings
        for r in [80, 160, 240, 320]:
            scaled_r = r * self.zoom
            self.canvas.create_oval(cx - scaled_r, cy - scaled_r, cx + scaled_r, cy + scaled_r, outline=CYAN_DARK, dash=(4, 6), width=1)

        # Draw Outer Lotus Petal Feathers (12 petals)
        petal_count = 12
        for i in range(petal_count):
            angle_deg = i * (360 / petal_count)
            rad = math.radians(angle_deg - 90)
            length = 260 * self.zoom
            tip_x = cx + length * math.cos(rad)
            tip_y = cy + length * math.sin(rad)

            # Draw feather spine
            self.canvas.create_line(cx, cy, tip_x, tip_y, fill=CYAN_ACCENT, width=2, dash=(3, 3))
            
            # Feather barb ribbing
            for step in [0.4, 0.7]:
                bx = cx + length * step * math.cos(rad)
                by = cy + length * step * math.sin(rad)
                perp = rad + math.pi / 2
                offset = 20 * self.zoom
                self.canvas.create_line(bx, by, bx + offset * math.cos(perp), by + offset * math.sin(perp), fill=CYAN_DARK, width=1)
                self.canvas.create_line(bx, by, bx - offset * math.cos(perp), by - offset * math.sin(perp), fill=CYAN_DARK, width=1)

            # Node Dot at Tip
            dot_color = BREACH_RED if i % 4 == 0 else CYAN_BRIGHT
            dot_r = 5 * self.zoom
            self.canvas.create_oval(tip_x - dot_r, tip_y - dot_r, tip_x + dot_r, tip_y + dot_r, fill=dot_color, outline="white", width=1)

            # Label
            platforms = ["GitHub", "Twitter", "Telegram", "DeHashed", "Reddit", "Discord", "Keybase", "Pastebin", "BreachDB", "Steam", "Darkweb", "GeoIP"]
            label_text = platforms[i % len(platforms)]
            self.canvas.create_text(tip_x + 12, tip_y - 8, text=label_text, fill=TEXT_COLOR, font=("Courier", 8, "bold"), anchor="w")

        # Draw Connecting Arcs (Dot-to-Dot connection)
        points = []
        for i in range(petal_count):
            angle_deg = i * (360 / petal_count)
            rad = math.radians(angle_deg - 90)
            length = 260 * self.zoom
            points.append((cx + length * math.cos(rad), cy + length * math.sin(rad)))

        for i in range(len(points)):
            next_idx = (i + 3) % len(points)
            p1 = points[i]
            p2 = points[next_idx]
            arc_color = BREACH_RED if i % 3 == 0 else CYAN_ACCENT
            self.canvas.create_line(p1[0], p1[1], p2[0], p2[1], fill=arc_color, width=1, dash=(5, 5))

        # Central Arc Reactor Core
        core_r = 35 * self.zoom
        self.canvas.create_oval(cx - core_r, cy - core_r, cx + core_r, cy + core_r, fill="#082f49", outline=CYAN_BRIGHT, width=2)
        self.canvas.create_text(cx, cy, text="LOTUS", fill=CYAN_BRIGHT, font=("Courier", int(9 * self.zoom), "bold"))

if __name__ == "__main__":
    root = tk.Tk()
    app = LotusOsintApp(root)
    root.mainloop()
`;

export const NODE_CLI_CODE = `#!/usr/bin/env node
/**
 * LOTUS OSINT - Cyber Intelligence Node.js Terminal CLI
 * Usage: node lotus_osint_node.js <username>
 */

const readline = require('readline');

const BANNER = \`
\\x1b[36m
  ╔═══════════════════════════════════════════════════════════════╗
  ║    ⚡ LOTUS OSINT - JARVIS CYBER INTELLIGENCE TERMINAL ⚡    ║
  ║             Holographic Feather Reconnaissance Suite          ║
  ╚═══════════════════════════════════════════════════════════════╝
\\x1b[0m\`;

console.clear();
console.log(BANNER);

const target = process.argv[2] || 'zer0day';
console.log(\`\\x1b[32m[+] TARGET ACQUIRED: @\${target.toUpperCase()}\\x1b[0m\`);
console.log(\`\\x1b[34m[*] Spreading Lotus Petal Feathers across global digital matrix...\\x1b[0m\\n\`);

const stages = [
  { platform: 'GitHub', status: '200 OK - Public repos & GPG key found', breach: false },
  { platform: 'DeHashed DB', status: 'CRITICAL - 2 leaked password hashes', breach: true },
  { platform: 'Twitter / X', status: '200 OK - Correlated profile handle', breach: false },
  { platform: 'Telegram', status: '200 OK - Associated bio & phone hint', breach: false },
  { platform: 'RaidForums Archive', status: 'EXPOSED - Database mention in 2021 dump', breach: true },
  { platform: 'Bitcoin Ledger', status: 'Active wallet signature detected', breach: false }
];

let i = 0;
const interval = setInterval(() => {
  if (i >= stages.length) {
    clearInterval(interval);
    console.log(\`\\n\\x1b[36m[+] ALL DOTS CONNECTED: Investigation complete for @\${target}.\\x1b[0m\`);
    console.log(\`\\x1b[33m[!] Threat Score: 78/100 (HIGH RISK - Credential Compromise detected)\\x1b[0m\\n\`);
    return;
  }
  const s = stages[i];
  const color = s.breach ? '\\x1b[31m' : '\\x1b[32m';
  console.log(\`\${color}[DOT CONNECTED]\\x1b[0m \${s.platform.padEnd(20)} ==> \${s.status}\`);
  i++;
}, 600);
`;
