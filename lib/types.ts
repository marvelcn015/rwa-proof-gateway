export type ProofStatus = 'verified' | 'warning' | 'failed' | 'pending';
export type OverallRisk = 'safe' | 'warning' | 'danger';
export type AssetType = 'real_estate' | 'bond' | 'commodity' | 'art';

export interface ProofDetail {
  source: string;          // "台灣土地銀行"
  method: string;          // "VC Signature" | "EIP-712" | "Oracle"
  verifiedAt?: string;     // ISO 8601 timestamp
  evidence?: string[];     // URL links to proof documents
  warnings?: string[];     // Warning messages
  txHash?: string;         // Blockchain transaction hash
}

export interface ProofResult {
  status: ProofStatus;
  title: string;
  subtitle: string;
  details: ProofDetail;
}

export interface AssetMetadata {
  name: string;
  type: AssetType;
  location?: string;
  value?: string;
  description?: string;
  issuer?: string;
  custodian?: string;
  issuedDate?: string;
  did?: string;            // Decentralized Identifier
}

export interface AssetVerification {
  tokenId: string;
  metadata: AssetMetadata;
  verification: {
    overallStatus: OverallRisk;
    overallMessage: string;
    timestamp: string;
    proofs: {
      existence: ProofResult;
      legality: ProofResult;
      collateral: ProofResult;
    };
  };
}

export interface VerificationStep {
  id: 'existence' | 'legality' | 'collateral';
  label: string;
  detail: string;
  duration: number;  // milliseconds
}
