import { OsintNode, DotConnection, TerminalLog, RiskLevel } from '../types/osint';

// Predefined platform templates for high-fidelity OSINT intelligence
export const PLATFORM_TEMPLATES = [
  // Outer Feather Tier 1 - Social & Code
  { platform: 'GitHub', category: 'social' as const, domain: 'github.com', tier: 'outer' as const, baseAngle: 25 },
  { platform: 'Twitter / X', category: 'social' as const, domain: 'x.com', tier: 'outer' as const, baseAngle: 55 },
  { platform: 'Telegram', category: 'social' as const, domain: 't.me', tier: 'outer' as const, baseAngle: 85 },
  { platform: 'Reddit', category: 'social' as const, domain: 'reddit.com', tier: 'outer' as const, baseAngle: 115 },
  { platform: 'Discord', category: 'social' as const, domain: 'discord.com', tier: 'outer' as const, baseAngle: 145 },
  { platform: 'Steam', category: 'social' as const, domain: 'steamcommunity.com', tier: 'outer' as const, baseAngle: 175 },
  { platform: 'Keybase / PGP', category: 'crypto' as const, domain: 'keybase.io', tier: 'outer' as const, baseAngle: 205 },
  { platform: 'GitLab', category: 'social' as const, domain: 'gitlab.com', tier: 'outer' as const, baseAngle: 235 },
  { platform: 'Mastodon', category: 'social' as const, domain: 'mastodon.social', tier: 'outer' as const, baseAngle: 265 },
  { platform: 'Instagram', category: 'social' as const, domain: 'instagram.com', tier: 'outer' as const, baseAngle: 295 },
  { platform: 'HackerNews', category: 'social' as const, domain: 'news.ycombinator.com', tier: 'outer' as const, baseAngle: 325 },
  { platform: 'LinkedIn Public', category: 'social' as const, domain: 'linkedin.com', tier: 'outer' as const, baseAngle: 355 },

  // Mid Feather Tier 2 - Threat Intelligence & Breaches
  { platform: 'HaveIBeenPwned', category: 'breach' as const, domain: 'haveibeenpwned.com', tier: 'mid' as const, baseAngle: 40 },
  { platform: 'DeHashed DB', category: 'breach' as const, domain: 'dehashed.com', tier: 'mid' as const, baseAngle: 100 },
  { platform: 'Leak-Lookup', category: 'breach' as const, domain: 'leak-lookup.com', tier: 'mid' as const, baseAngle: 160 },
  { platform: 'Pastebin Dump', category: 'breach' as const, domain: 'pastebin.com', tier: 'mid' as const, baseAngle: 220 },
  { platform: 'RaidForums Archive', category: 'darkweb' as const, domain: 'rf-archive.io', tier: 'mid' as const, baseAngle: 280 },
  { platform: 'BreachForums Dump', category: 'darkweb' as const, domain: 'darkforums.onion', tier: 'mid' as const, baseAngle: 340 },

  // Inner Core Tier 3 - Network, Crypto & Infrastructure
  { platform: 'ASN & GeoIP', category: 'network' as const, domain: 'bgp.he.net', tier: 'inner' as const, baseAngle: 30 },
  { platform: 'WHOIS & DNS', category: 'network' as const, domain: 'whois.iana.org', tier: 'inner' as const, baseAngle: 110 },
  { platform: 'BTC / ETH Ledger', category: 'crypto' as const, domain: 'blockchain.com', tier: 'inner' as const, baseAngle: 190 },
  { platform: 'Shodan / Censys', category: 'network' as const, domain: 'shodan.io', tier: 'inner' as const, baseAngle: 270 },
  { platform: 'Avatar Gravatar Hash', category: 'metadata' as const, domain: 'gravatar.com', tier: 'inner' as const, baseAngle: 350 },
];

/**
 * Generate an investigation dossier with connected nodes for any handle
 */
export function generateInvestigationData(handle: string): {
  nodes: OsintNode[];
  connections: DotConnection[];
  logs: TerminalLog[];
} {
  const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'target';
  const now = new Date();

  // Pseudo-random seed derived from username string
  const hash = cleanHandle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const count = 12 + (hash % 8); // 12 to 19 nodes

  const nodes: OsintNode[] = [];
  const logs: TerminalLog[] = [];

  // Initial system logs
  logs.push({
    id: `log-init-${Date.now()}`,
    timestamp: now.toISOString().slice(11, 19),
    level: 'system',
    message: `LOTUS NEURAL ENGINE INITIALIZED FOR TARGET: [${cleanHandle.toUpperCase()}]`,
    source: 'CORE_KERNEL'
  });

  const selectedTemplates = [...PLATFORM_TEMPLATES].sort(() => 0.5 - ((hash % 10) / 10)).slice(0, count);

  selectedTemplates.forEach((tmpl, i) => {
    const isBreach = tmpl.category === 'breach' || tmpl.category === 'darkweb';
    const isCrypto = tmpl.category === 'crypto';
    const isNetwork = tmpl.category === 'network';
    
    let risk: RiskLevel = 'low';
    let status: 'verified' | 'potential' | 'breached' | 'scanning' = 'verified';
    let confidence = 75 + ((hash + i * 7) % 25);

    if (isBreach) {
      risk = i % 2 === 0 ? 'critical' : 'high';
      status = 'breached';
      confidence = 90 + ((hash + i) % 10);
    } else if (isCrypto || isNetwork) {
      risk = i % 3 === 0 ? 'medium' : 'low';
      status = 'potential';
    }

    const radiusBase = tmpl.tier === 'inner' ? 120 : tmpl.tier === 'mid' ? 210 : 300;
    const jitter = ((hash * (i + 1)) % 30) - 15;

    const emailPrefix = `${cleanHandle.slice(0, 3)}***${cleanHandle.slice(-1)}@${i % 2 === 0 ? 'proton.me' : 'gmail.com'}`;
    const ipAddress = `194.26.${(hash + i * 13) % 250}.${(hash * 3 + i * 7) % 254}`;

    const node: OsintNode = {
      id: `node-${tmpl.platform.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}`,
      label: `${tmpl.platform}: @${cleanHandle}`,
      platform: tmpl.platform,
      category: tmpl.category,
      url: `https://${tmpl.domain}/${cleanHandle}`,
      status,
      confidence,
      riskLevel: risk,
      discoveredAt: new Date(now.getTime() - i * 400).toISOString().slice(11, 19),
      petalTier: tmpl.tier,
      angleDeg: tmpl.baseAngle + (jitter * 0.4),
      radiusDist: radiusBase + jitter,
      metadata: {
        username: cleanHandle,
        emailHint: emailPrefix,
        phoneHint: `+1 (***) ***-${1000 + (hash % 8999)}`,
        ipAddress: isNetwork ? ipAddress : undefined,
        location: ['Frankfurt, Germany', 'Reykjavik, Iceland', 'Stockholm, Sweden', 'Zurich, Switzerland', 'Montreal, Canada'][i % 5],
        lastActive: `${((hash + i) % 14) + 1} hours ago`,
        breachCount: isBreach ? 2 + (i % 4) : undefined,
        breachSources: isBreach ? ['Exploit.in (2022)', 'RedLine Stealer Logs', 'Naz.API Dump'] : undefined,
        walletAddress: isCrypto ? `0x71C...${(hash * 13).toString(16).slice(0, 6)}bF9` : undefined,
        pgpKeyId: isCrypto ? `4A9F ${(hash * 7).toString(16).toUpperCase()} 88E1` : undefined,
        bio: `Digital footprint node correlated through cryptographic & handle heuristics.`,
        rawSnippet: `HTTP/2 200 OK | Entity: ${cleanHandle} | Correlation-Score: ${confidence}%`
      }
    };

    nodes.push(node);

    // Generate terminal log entry
    if (status === 'breached') {
      logs.push({
        id: `log-${i}-${Date.now()}`,
        timestamp: node.discoveredAt,
        level: 'alert',
        message: `[BREACH HIT] ${tmpl.platform} leaked credentials for "${cleanHandle}" (${node.metadata.breachSources?.join(', ')})`,
        source: 'BREACH_RADAR'
      });
    } else if (status === 'verified') {
      logs.push({
        id: `log-${i}-${Date.now()}`,
        timestamp: node.discoveredAt,
        level: 'success',
        message: `[VERIFIED] Correlated active identity on ${tmpl.platform} (Confidence: ${confidence}%)`,
        source: 'SOCIAL_MATRIX'
      });
    } else {
      logs.push({
        id: `log-${i}-${Date.now()}`,
        timestamp: node.discoveredAt,
        level: 'info',
        message: `[TELEMETRY] Probing ${tmpl.platform} endpoint: 200 OK signature`,
        source: 'INFRA_SENSOR'
      });
    }
  });

  // Generate dynamic dot-connecting arcs
  const connections: DotConnection[] = [];
  
  // Connect inner core nodes to mid and outer petal nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];

      // Connect if they share category, or if one is breach and one is social
      const isBreachSocialPair = (nodeA.category === 'breach' && nodeB.category === 'social') ||
                                  (nodeB.category === 'breach' && nodeA.category === 'social');
      const isCryptoSocialPair = (nodeA.category === 'crypto' && nodeB.category === 'social');
      const isSameCategory = nodeA.category === nodeB.category && (i % 2 === 0);
      const isTierBridge = (nodeA.petalTier === 'inner' && nodeB.petalTier === 'mid') || 
                           (nodeA.petalTier === 'mid' && nodeB.petalTier === 'outer');

      if (isBreachSocialPair || isCryptoSocialPair || (isSameCategory && isTierBridge) || (i === 0 && j < 5)) {
        let relType: DotConnection['relationType'] = 'identity_match';
        if (isBreachSocialPair) relType = 'credential_leak';
        else if (nodeA.category === 'network' || nodeB.category === 'network') relType = 'network_correlation';
        else if (isCryptoSocialPair) relType = 'crypto_transaction';

        connections.push({
          id: `conn-${nodeA.id}-${nodeB.id}`,
          sourceId: nodeA.id,
          targetId: nodeB.id,
          relationType: relType,
          strength: 0.5 + ((i + j) % 5) * 0.1,
          activePulse: (i + j) % 3 === 0
        });

        // Add connecting terminal log
        if (connections.length <= 6) {
          logs.push({
            id: `log-conn-${connections.length}-${Date.now()}`,
            timestamp: nodeB.discoveredAt,
            level: 'warning',
            message: `[DOT CONNECTED] Link established: ${nodeA.platform} <==> ${nodeB.platform} [${relType.toUpperCase()}]`,
            source: 'NEURAL_LINK'
          });
        }
      }
    }
  }

  // Final summary log
  logs.push({
    id: `log-sum-${Date.now()}`,
    timestamp: now.toISOString().slice(11, 19),
    level: 'system',
    message: `LOTUS INVESTIGATION COMPLETE: ${nodes.length} nodes locked, ${connections.length} vector links mapped.`,
    source: 'GRAPH_SYNTH'
  });

  return { nodes, connections, logs };
}
