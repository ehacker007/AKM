import React, { useState } from 'react';
import { OsintNode, DotConnection } from '../types/osint';
import { soundFx } from '../utils/audioSynth';
import { 
  X, ExternalLink, ShieldAlert, CheckCircle2, AlertTriangle, 
  Copy, Check, Share2, Globe, Database, Network, Key, User, FileCode
} from 'lucide-react';

interface NodeDossierModalProps {
  node: OsintNode | null;
  connections: DotConnection[];
  allNodes: OsintNode[];
  onClose: () => void;
  onSelectNode: (node: OsintNode) => void;
}

export const NodeDossierModal: React.FC<NodeDossierModalProps> = ({
  node,
  connections,
  allNodes,
  onClose,
  onSelectNode,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'intel' | 'raw' | 'graph'>('intel');

  if (!node) return null;

  // Find all directly connected nodes
  const linkedNodeIds = connections
    .filter((c) => c.sourceId === node.id || c.targetId === node.id)
    .map((c) => (c.sourceId === node.id ? c.targetId : c.sourceId));

  const linkedNodes = allNodes.filter((n) => linkedNodeIds.includes(n.id));

  const handleCopy = (text: string) => {
    soundFx.playChirp(1200);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (cat: OsintNode['category']) => {
    switch (cat) {
      case 'breach':
      case 'darkweb':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'network':
        return <Network className="w-4 h-4 text-cyan-400" />;
      case 'crypto':
        return <Key className="w-4 h-4 text-amber-400" />;
      case 'metadata':
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      case 'social':
      default:
        return <Globe className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-sky-400/40 rounded-xl shadow-2xl shadow-sky-950/80 flex flex-col overflow-hidden font-mono text-sky-200">
        {/* Holographic Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-sky-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {getCategoryIcon(node.category)}
            <div>
              <div className="text-sm font-bold text-sky-100 flex items-center gap-2">
                {node.platform}
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-950 border border-sky-500/40 text-cyan-300">
                  {node.petalTier.toUpperCase()} PETAL
                </span>
              </div>
              <div className="text-[10px] text-sky-400/70">NODE_ID: {node.id}</div>
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

        {/* Tab Navigation */}
        <div className="px-5 py-2 bg-slate-950/40 border-b border-sky-500/20 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('intel')}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'intel' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-sky-300'
            }`}
          >
            INTELLIGENCE DOSSIER
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'graph' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-sky-300'
            }`}
          >
            CONNECTED DOTS ({linkedNodes.length})
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'raw' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-sky-300'
            }`}
          >
            RAW JSON ARTIFACT
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4 text-xs">
          {activeTab === 'intel' && (
            <>
              {/* Status and Risk Banner */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-sky-500/20 space-y-1">
                  <div className="text-[10px] text-sky-400/70">CORRELATION STATUS</div>
                  <div className="text-sm font-bold flex items-center gap-1.5 text-cyan-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    {node.status.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-sky-500">Confidence: {node.confidence}%</div>
                </div>

                <div
                  className={`p-3 rounded-lg border space-y-1 ${
                    node.riskLevel === 'critical'
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                      : node.riskLevel === 'high'
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      : 'bg-slate-950/60 border-sky-500/20 text-sky-200'
                  }`}
                >
                  <div className="text-[10px] opacity-70">THREAT / RISK EVALUATION</div>
                  <div className="text-sm font-bold flex items-center gap-1.5 uppercase">
                    <ShieldAlert className="w-4 h-4" />
                    {node.riskLevel} RISK
                  </div>
                  <div className="text-[10px] opacity-80">Impact: High identity footprint exposure</div>
                </div>
              </div>

              {/* Target Details Grid */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-sky-500/20 space-y-2">
                <div className="text-sky-400 font-bold text-[11px] pb-1 border-b border-sky-500/20">
                  RECONNAISSANCE ATTRIBUTES
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-sky-500/70">TARGET HANDLE: </span>
                    <span className="text-white font-semibold">@{node.metadata.username}</span>
                  </div>
                  {node.metadata.emailHint && (
                    <div>
                      <span className="text-sky-500/70">EMAIL MASK: </span>
                      <span className="text-cyan-300 font-semibold">{node.metadata.emailHint}</span>
                    </div>
                  )}
                  {node.metadata.phoneHint && (
                    <div>
                      <span className="text-sky-500/70">PHONE MASK: </span>
                      <span className="text-slate-300">{node.metadata.phoneHint}</span>
                    </div>
                  )}
                  {node.metadata.ipAddress && (
                    <div>
                      <span className="text-sky-500/70">NETWORK IP: </span>
                      <span className="text-amber-300">{node.metadata.ipAddress}</span>
                    </div>
                  )}
                  {node.metadata.location && (
                    <div>
                      <span className="text-sky-500/70">GEO LOCATION: </span>
                      <span className="text-slate-300">{node.metadata.location}</span>
                    </div>
                  )}
                  {node.metadata.walletAddress && (
                    <div>
                      <span className="text-sky-500/70">LEDGER WALLET: </span>
                      <span className="text-amber-400">{node.metadata.walletAddress}</span>
                    </div>
                  )}
                  {node.metadata.pgpKeyId && (
                    <div>
                      <span className="text-sky-500/70">PGP KEY ID: </span>
                      <span className="text-purple-300">{node.metadata.pgpKeyId}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-sky-500/70">LAST ACTIVITY: </span>
                    <span className="text-slate-300">{node.metadata.lastActive || 'Recent'}</span>
                  </div>
                </div>
              </div>

              {/* Breach Data Section if available */}
              {node.metadata.breachSources && (
                <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <div className="text-rose-400 font-bold text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    EXPOSED IN CREDENTIAL COMPROMISE
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {node.metadata.breachSources.map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded text-[10px] bg-rose-950/60 border border-rose-500/40 text-rose-300"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Snippet preview */}
              {node.metadata.rawSnippet && (
                <div className="p-2.5 rounded bg-black/60 border border-sky-500/20 text-[10px] text-sky-300/80 font-mono">
                  <code>{node.metadata.rawSnippet}</code>
                </div>
              )}
            </>
          )}

          {activeTab === 'graph' && (
            <div className="space-y-2">
              <div className="text-[11px] text-sky-400 font-bold">
                OSINT CORRELATION LINKS FOR THIS PETAL:
              </div>
              {linkedNodes.length === 0 ? (
                <div className="text-slate-400 italic py-4 text-center">
                  No direct vector links mapped yet for this node.
                </div>
              ) : (
                linkedNodes.map((lNode) => (
                  <div
                    key={lNode.id}
                    onClick={() => {
                      soundFx.playChirp(1300);
                      onSelectNode(lNode);
                    }}
                    className="p-2.5 rounded-lg bg-slate-950/80 border border-sky-500/20 hover:border-cyan-400 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                        {getCategoryIcon(lNode.category)}
                        {lNode.platform}
                      </div>
                      <div className="text-[10px] text-sky-400/60">@{lNode.metadata.username}</div>
                    </div>
                    <span className="text-[10px] text-cyan-400 group-hover:underline">
                      Focus Dot &rarr;
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="relative">
              <pre className="p-3 rounded-lg bg-black border border-sky-500/20 text-[10px] text-sky-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(node, null, 2)}
              </pre>
              <button
                onClick={() => handleCopy(JSON.stringify(node, null, 2))}
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 text-sky-300 hover:text-white flex items-center gap-1 text-[10px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3 bg-slate-950/90 border-t border-sky-500/30 flex items-center justify-between text-xs">
          <button
            onClick={() => handleCopy(JSON.stringify(node, null, 2))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Artifact'}</span>
          </button>

          {node.url && (
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-colors"
            >
              <span>Visit Target URL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
