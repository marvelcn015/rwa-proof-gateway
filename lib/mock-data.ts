import { AssetVerification } from './types';

export const MOCK_ASSETS: Record<string, AssetVerification> = {
  // SUCCESS CASE: All verifications pass
  'asset:1/0xABCD1234/001': {
    tokenId: 'asset:1/0xABCD1234/001',
    metadata: {
      name: '陶朱隱園 #2025-001 收益權',
      type: 'real_estate',
      location: '台北市信義區松仁路 100 號',
      value: '10707.66 ETH (~$40,000,000 USD)',
      description: '陶朱隱園豪宅項目的收益權代幣，每季分紅',
      issuer: '富邦金控',
      custodian: '台灣土地銀行',
      issuedDate: '2025-01-15',
      did: 'did:web:fubon.com:assets:001',
    },
    verification: {
      overallStatus: 'safe',
      overallMessage: '低風險資產 (Safe to Invest)',
      timestamp: new Date().toISOString(),
      proofs: {
        existence: {
          status: 'verified',
          title: 'Verified',
          subtitle: '資產存在性已驗證',
          details: {
            source: '台灣土地銀行',
            method: 'VC Signature',
            verifiedAt: '2025-10-30T14:23:00Z',
            evidence: [
              'https://www.landbank.com.tw/',
            ],
            txHash: '0x1234567890abcdef...',
          },
        },
        legality: {
          status: 'verified',
          title: 'Compliant',
          subtitle: '資產屬合規發行',
          details: {
            source: '金融監督管理委員會',
            method: 'EIP-712 Signature',
            verifiedAt: '2025-01-15T09:00:00Z',
            evidence: [
              'https://www.fsc.gov.tw/ch/index.jsp',
            ],
          },
        },
        collateral: {
          status: 'verified',
          title: 'Clear',
          subtitle: '資產未有被抵押紀錄',
          details: {
            source: 'Multi-Protocol Oracle',
            method: 'On-chain Scan',
            verifiedAt: new Date().toISOString(),
            evidence: [
              'Aave: No collateral found',
              'Compound: No collateral found',
              'Ondo: No collateral found',
            ],
          },
        },
      },
    },
  },

  // DANGER CASE: Duplicate collateral detected
  'asset:1/0xABCD1234/666': {
    tokenId: 'asset:1/0xABCD1234/666',
    metadata: {
      name: '台北 101 辦公室 #666 收益權',
      type: 'real_estate',
      location: '台北市信義區信義路五段 7 號',
      value: '100 ETH (~$300,000 USD)',
      description: '台北 101 辦公室租金收益權',
      issuer: '未知發行方',
      custodian: '待確認',
      issuedDate: '2024-12-01',
    },
    verification: {
      overallStatus: 'danger',
      overallMessage: '高風險資產 (High Risk - Do Not Invest)',
      timestamp: new Date().toISOString(),
      proofs: {
        existence: {
          status: 'warning',
          title: 'Pending',
          subtitle: '待確認',
          details: {
            source: '資產存在性資料不完整',
            method: 'N/A',
            warnings: [
              '託管機構資訊缺失',
              '無法找到對應的不動產登記紀錄',
            ],
          },
        },
        legality: {
          status: 'verified',
          title: 'Compliant',
          subtitle: '資產屬合規發行',
          details: {
            source: '發行合約',
            method: 'On-chain Metadata',
            verifiedAt: '2024-12-01T10:00:00Z',
          },
        },
        collateral: {
          status: 'failed',
          title: 'Flagged',
          subtitle: '資產有重複抵押紀錄',
          details: {
            source: 'Multi-Protocol Oracle',
            method: 'Cross-Chain Scan',
            verifiedAt: new Date().toISOString(),
            warnings: [
              '在 Aave 協議發現質押紀錄 (tx: 0x1234...5678)',
              '在 Compound 協議發現質押紀錄 (tx: 0xabcd...ef01)',
              '可能存在重複抵押 (Rehypothecation) 風險',
            ],
            evidence: [
              'https://etherscan.io/tx/0x1234...5678',
              'https://etherscan.io/tx/0xabcd...ef01',
            ],
          },
        },
      },
    },
  },

  // WARNING CASE: Partial verification issues
  'asset:1/0xABCD1234/333': {
    tokenId: 'asset:1/0xABCD1234/333',
    metadata: {
      name: '南港軟體園區 #333 收益權',
      type: 'real_estate',
      location: '台北市南港區園區街 3 號',
      value: '30 ETH (~$90,000 USD)',
      description: '南港軟體園區辦公室租金收益',
      issuer: '某中小型房地產公司',
      custodian: '地區性銀行',
      issuedDate: '2025-02-10',
    },
    verification: {
      overallStatus: 'warning',
      overallMessage: '中等風險資產 (Medium Risk - Caution Advised)',
      timestamp: new Date().toISOString(),
      proofs: {
        existence: {
          status: 'verified',
          title: 'Verified',
          subtitle: '資產存在性已驗證',
          details: {
            source: '地區性銀行',
            method: 'VC Signature',
            verifiedAt: '2025-02-10T11:30:00Z',
            warnings: [
              '發證機構非主流金融機構，建議二次確認',
            ],
          },
        },
        legality: {
          status: 'warning',
          title: 'Partial Compliance',
          subtitle: '資產僅部分合規',
          details: {
            source: '發行合約',
            method: 'Smart Contract Analysis',
            verifiedAt: '2025-02-10T12:00:00Z',
            warnings: [
              '發行方未在金管會註冊',
              '缺少完整的 KYC/AML 授權文件',
            ],
          },
        },
        collateral: {
          status: 'verified',
          title: 'Clear',
          subtitle: '資產未有被抵押紀錄',
          details: {
            source: 'Multi-Protocol Oracle',
            method: 'On-chain Scan',
            verifiedAt: new Date().toISOString(),
            evidence: [
              'Aave: No collateral found',
              'Compound: No collateral found',
            ],
          },
        },
      },
    },
  },
};

// Helper function to get asset data
export function getAssetData(tokenId: string): AssetVerification | null {
  return MOCK_ASSETS[tokenId] || null;
}

// Helper function to validate token ID format
export function isValidTokenId(tokenId: string): boolean {
  // Format: asset:<chainId>/<contract>/<tokenId>
  const regex = /^asset:\d+\/0x[a-fA-F0-9]+\/\d+$/;
  return regex.test(tokenId);
}
