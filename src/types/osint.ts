export type NodeCategory = 'social' | 'breach' | 'network' | 'crypto' | 'darkweb' | 'metadata';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface OsintNode {
  id: string;
  label: string;
  platform: string;
  category: NodeCategory;
  url?: string;
  status: 'verified' | 'potential' | 'breached' | 'scanning';
  confidence: number; // 0 - 100
  riskLevel: RiskLevel;
  discoveredAt: string;
  petalTier: 'inner' | 'mid' | 'outer';
  angleDeg: number;
  radiusDist: number; // relative distance from center
  metadata: {
    username?: string;
    emailHint?: string;
    phoneHint?: string;
    ipAddress?: string;
    location?: string;
    lastActive?: string;
    breachCount?: number;
    breachSources?: string[];
    walletAddress?: string;
    pgpKeyId?: string;
    bio?: string;
    rawSnippet?: string;
  };
}

export interface DotConnection {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: 'identity_match' | 'credential_leak' | 'network_correlation' | 'crypto_transaction' | 'alias_fingerprint';
  strength: number; // 0.1 - 1.0
  activePulse: boolean;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'alert' | 'system';
  message: string;
  source?: string;
}

export interface BackendConfig {
  mode: 'standalone' | 'custom_api' | 'websocket';
  apiUrl: string;
  wsUrl: string;
  authToken: string;
  autoReconnect: boolean;
}

export interface ScanStats {
  targetHandle: string;
  totalNodes: number;
  verifiedCount: number;
  breachHits: number;
  threatScore: number; // 0 - 100
  durationMs: number;
  isScanning: boolean;
  activePhase: string;
}
