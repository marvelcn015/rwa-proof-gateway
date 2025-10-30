import { VerificationStep } from './types';

export const VERIFICATION_STEPS: VerificationStep[] = [
  {
    id: 'existence',
    label: '存在性驗證中...',
    detail: '查詢託管機構的資產登記紀錄',
    duration: 1200,
  },
  {
    id: 'legality',
    label: '合法性驗證中...',
    detail: '檢查發行方憑證與合規文件',
    duration: 1000,
  },
  {
    id: 'collateral',
    label: '抵押狀態掃描中...',
    detail: '掃描 Aave, Compound, Ondo 等借貸協議',
    duration: 1500,
  },
];

export const TOKEN_EXAMPLES = [
  {
    label: '優質資產範例',
    id: 'asset:1/0xABCD1234/001',
    description: '陶朱隱園收益權 Token',
    type: 'safe' as const,
  },
  {
    label: '中等風險資產範例',
    id: 'asset:1/0xABCD1234/333',
    description: '部分合規問題的 Token',
    type: 'warning' as const,
  },
  {
    label: '高風險資產範例',
    id: 'asset:1/0xABCD1234/666',
    description: '存在抵押風險的 Token',
    type: 'danger' as const,
  },
];

export const BADGE_CONFIG = {
  verified: {
    color: 'success',
    bgClass: 'bg-success-50 border-success-200',
    textClass: 'text-success-700',
    title: 'Verified',
    subtitle: '存在性',
  },
  warning: {
    color: 'warning',
    bgClass: 'bg-warning-50 border-warning-200',
    textClass: 'text-warning-700',
    title: 'Warning',
    subtitle: '需注意',
  },
  failed: {
    color: 'danger',
    bgClass: 'bg-danger-50 border-danger-200',
    textClass: 'text-danger-700',
    title: 'Failed',
    subtitle: '驗證失敗',
  },
  pending: {
    color: 'gray',
    bgClass: 'bg-gray-50 border-gray-200',
    textClass: 'text-gray-700',
    title: 'Pending',
    subtitle: '處理中',
  },
} as const;
