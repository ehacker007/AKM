import React, { useState } from 'react';
import { BackendConfig } from '../types/osint';
import { soundFx } from '../utils/audioSynth';
import { Server, Wifi, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, X, Shield, Code } from 'lucide-react';

interface BackendConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BackendConfig;
  onSaveConfig: (cfg: BackendConfig) => void;
}

export const BackendConnectorModal: React.FC<BackendConnectorModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formConfig, setFormConfig] = useState<BackendConfig>(config);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [copiedSpec, setCopiedSpec] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    soundFx.playChirp(1100);
    setTestStatus('testing');
    setTestMessage('Pinging backend endpoint...');

    try {
      if (formConfig.mode === 'standalone') {
        setTimeout(() => {
          setTestStatus('connected');
          setTestMessage('Operating in High-Fidelity Standalone Mode (Neural OSINT Engine Active)');
          soundFx.playLock();
        }, 500);
        return;
      }

      const res = await fetch(formConfig.apiUrl, {
        method: 'GET',
        headers: formConfig.authToken ? { Authorization: `Bearer ${formConfig.authToken}` } : {},
      });

      if (res.ok) {
        setTestStatus('connected');
        setTestMessage(`Connection Verified! Status: ${res.status} OK`);
        soundFx.playLock();
      } else {
        setTestStatus('error');
        setTestMessage(`Backend replied with HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err: unknown) {
      setTestStatus('error');
      setTestMessage(
        `Could not reach backend at ${formConfig.apiUrl}. Ensure your Python/Node server is running with CORS enabled.`
      );
    }
  };

  const handleSave = () => {
    soundFx.playBloom();
    onSaveConfig(formConfig);
    onClose();
  };

  const API_SPEC_CODE = `{
  "POST /api/recon": {
    "request": {
      "username": "target_handle",
      "depth": "deep",
      "categories": ["social", "breach", "network", "crypto", "darkweb"]
    },
    "response": {
      "status": "success",
      "nodes": [
        {
          "id": "node-github-0",
          "platform": "GitHub",
          "category": "social",
          "url": "https://github.com/target_handle",
          "status": "verified",
          "confidence": 98,
          "riskLevel": "low",
          "petalTier": "outer",
          "angleDeg": 30,
          "radiusDist": 280,
          "metadata": {
            "username": "target_handle",
            "emailHint": "tar***e@gmail.com",
            "location": "Germany"
          }
        }
      ],
      "connections": [
        {
          "id": "conn-1",
          "sourceId": "node-github-0",
          "targetId": "node-dehashed-1",
          "relationType": "credential_leak",
          "strength": 0.85
        }
      ]
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-sky-400/40 rounded-xl shadow-2xl shadow-sky-950/90 flex flex-col max-h-[90vh] overflow-hidden font-mono text-sky-200">
        {/* Title Bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-sky-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-sm font-bold text-sky-100 flex items-center gap-2">
                CUSTOM BACKEND CONNECTOR
                <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950 border border-sky-500/40 text-cyan-300">
                  SEPARATE BACKEND BRIDGE
                </span>
              </div>
              <div className="text-[10px] text-sky-400/70">
                Connect your separate Python / Node.js backend to this Lotus frontend!
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-sky-400 font-bold">OPERATIONAL MODE:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormConfig({ ...formConfig, mode: 'standalone' })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  formConfig.mode === 'standalone'
                    ? 'bg-sky-950/70 border-cyan-400 text-white shadow-lg shadow-sky-950'
                    : 'bg-slate-950/50 border-sky-500/20 text-slate-400 hover:text-sky-300'
                }`}
              >
                <div className="font-bold text-cyan-300 text-xs">Standalone Neural OSINT</div>
                <div className="text-[10px] text-sky-400/70 mt-1">
                  Built-in reconnaissance simulation engine (Works immediately without running a backend)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormConfig({ ...formConfig, mode: 'custom_api' })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  formConfig.mode === 'custom_api'
                    ? 'bg-sky-950/70 border-cyan-400 text-white shadow-lg shadow-sky-950'
                    : 'bg-slate-950/50 border-sky-500/20 text-slate-400 hover:text-sky-300'
                }`}
              >
                <div className="font-bold text-cyan-300 text-xs">Custom REST / WS Backend</div>
                <div className="text-[10px] text-sky-400/70 mt-1">
                  Connect to your local or remote Python / Node.js backend server
                </div>
              </button>
            </div>
          </div>

          {formConfig.mode === 'custom_api' && (
            <div className="space-y-3 p-3.5 rounded-lg bg-slate-950/80 border border-sky-500/20">
              {/* REST API URL */}
              <div>
                <label className="text-[10px] text-sky-400 font-bold block mb-1">
                  BACKEND REST API URL:
                </label>
                <input
                  type="text"
                  value={formConfig.apiUrl}
                  onChange={(e) => setFormConfig({ ...formConfig, apiUrl: e.target.value })}
                  placeholder="http://localhost:5000/api/recon"
                  className="w-full px-3 py-1.5 rounded bg-black border border-sky-500/40 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* WebSocket URL */}
              <div>
                <label className="text-[10px] text-sky-400 font-bold block mb-1">
                  STREAMING WEBSOCKET URL (OPTIONAL):
                </label>
                <input
                  type="text"
                  value={formConfig.wsUrl}
                  onChange={(e) => setFormConfig({ ...formConfig, wsUrl: e.target.value })}
                  placeholder="ws://localhost:8080/stream"
                  className="w-full px-3 py-1.5 rounded bg-black border border-sky-500/40 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Auth Token Header */}
              <div>
                <label className="text-[10px] text-sky-400 font-bold block mb-1">
                  AUTH BEARER TOKEN / API KEY (IF REQUIRED):
                </label>
                <input
                  type="password"
                  value={formConfig.authToken}
                  onChange={(e) => setFormConfig({ ...formConfig, authToken: e.target.value })}
                  placeholder="Optional secret token..."
                  className="w-full px-3 py-1.5 rounded bg-black border border-sky-500/40 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Connection Test Output */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-sky-500/20">
            <div className="flex items-center gap-2">
              {testStatus === 'testing' && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
              {testStatus === 'connected' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {testStatus === 'idle' && <Wifi className="w-4 h-4 text-slate-400" />}
              <span
                className={`text-xs ${
                  testStatus === 'connected'
                    ? 'text-emerald-300'
                    : testStatus === 'error'
                    ? 'text-rose-300'
                    : 'text-slate-400'
                }`}
              >
                {testMessage || 'Status: Ready to test bridge'}
              </span>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-3 py-1.5 rounded bg-sky-950 border border-sky-500/40 text-cyan-300 hover:text-white hover:bg-sky-900 transition-colors text-xs font-bold"
            >
              Test Ping
            </button>
          </div>

          {/* Backend API JSON Specification */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sky-400 font-bold text-[11px] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                BACKEND JSON SPECIFICATION (FOR YOUR PYTHON/NODE BACKEND):
              </span>
              <button
                onClick={() => {
                  soundFx.playChirp(1200);
                  navigator.clipboard.writeText(API_SPEC_CODE);
                  setCopiedSpec(true);
                  setTimeout(() => setCopiedSpec(false), 2000);
                }}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                {copiedSpec ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSpec ? 'Copied' : 'Copy Spec'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-black border border-sky-500/20 text-[10px] text-sky-300 overflow-x-auto leading-relaxed max-h-36">
              {API_SPEC_CODE}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-sky-500/30 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-colors shadow-lg shadow-cyan-950"
          >
            Save &amp; Apply Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
