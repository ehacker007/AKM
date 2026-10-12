import React, { useState, useRef, useEffect } from 'react';
import { TerminalLog } from '../types/osint';
import { soundFx } from '../utils/audioSynth';
import { Terminal, Maximize2, Minimize2, Trash2, ArrowRight, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface TerminalHudProps {
  logs: TerminalLog[];
  onClearLogs: () => void;
  onRunCommand: (command: string) => void;
  isScanning: boolean;
  activeHandle: string;
}

export const TerminalHud: React.FC<TerminalHudProps> = ({
  logs,
  onClearLogs,
  onRunCommand,
  isScanning,
  activeHandle,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of logs on new message
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isMinimized]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = inputVal.trim();
      if (!trimmed) return;

      soundFx.playChirp(1100);
      onRunCommand(trimmed);
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(historyIndex - 1, 0);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    }
  };

  const getLevelStyle = (level: TerminalLog['level']) => {
    switch (level) {
      case 'alert':
        return 'text-rose-400 font-semibold bg-rose-950/30 px-1 rounded';
      case 'warning':
        return 'text-amber-300';
      case 'success':
        return 'text-emerald-300';
      case 'system':
        return 'text-cyan-300 font-bold';
      case 'info':
      default:
        return 'text-sky-300/80';
    }
  };

  return (
    <div
      className={`transition-all duration-300 border-t border-sky-500/30 bg-slate-950/95 backdrop-blur-md flex flex-col z-20 ${
        isMinimized ? 'h-9' : isExpanded ? 'h-96' : 'h-48'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-sky-500/20 bg-slate-900/60 font-mono text-xs select-none">
        <div className="flex items-center gap-2 text-sky-400">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold tracking-wider">LOTUS OSINT LINUX SHELL</span>
          <span className="text-[10px] text-sky-500/60 font-normal">
            [target: {activeHandle ? `@${activeHandle}` : 'NONE'} | logs: {logs.length}]
          </span>
          {isScanning && (
            <span className="inline-flex items-center gap-1 text-[10px] text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              PROBING SOCKETS
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => {
              soundFx.playChirp(800);
              onClearLogs();
            }}
            title="Clear Terminal Logs"
            className="p-1 hover:text-sky-300 hover:bg-sky-950/50 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              soundFx.playChirp(1000);
              setIsExpanded(!isExpanded);
              setIsMinimized(false);
            }}
            title={isExpanded ? 'Restore Size' : 'Maximize'}
            className="p-1 hover:text-sky-300 hover:bg-sky-950/50 rounded transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              soundFx.playChirp(900);
              setIsMinimized(!isMinimized);
            }}
            title={isMinimized ? 'Expand' : 'Collapse'}
            className="p-1 hover:text-sky-300 hover:bg-sky-950/50 rounded transition-colors"
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Logs Viewport */}
      {!isMinimized && (
        <>
          <div
            ref={scrollRef}
            className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 select-text scroll-smooth"
          >
            {logs.length === 0 ? (
              <div className="text-sky-500/50 italic py-2">
                Lotus kernel ready. Enter a target username above or type &apos;scan &lt;username&gt;&apos; in the prompt below.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 group hover:bg-sky-950/20 py-0.5 rounded px-1">
                  <span className="text-sky-600 select-none text-[10px] min-w-[55px]">{log.timestamp}</span>
                  {log.source && (
                    <span className="text-sky-400/60 font-semibold select-none text-[10px] min-w-[90px]">
                      [{log.source}]
                    </span>
                  )}
                  <span className={`flex-1 break-all ${getLevelStyle(log.level)}`}>{log.message}</span>
                </div>
              ))
            )}
          </div>

          {/* Interactive Shell Input Line */}
          <div className="p-2 border-t border-sky-500/20 bg-slate-950 flex items-center gap-2 font-mono text-xs">
            <span className="text-cyan-400 font-bold flex items-center gap-1 select-none">
              <span>osint@lotus:~$</span>
              <ArrowRight className="w-3 h-3 text-sky-400" />
            </span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Commands: scan <user> | python | clear | breach | help"
              className="flex-1 bg-transparent border-none text-sky-100 placeholder:text-sky-700/70 focus:outline-none font-mono text-xs"
            />
            <span className="text-[10px] text-sky-500/50 select-none hidden sm:inline">
              [Press ENTER to execute]
            </span>
          </div>
        </>
      )}
    </div>
  );
};
