import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ProofStatus, OverallRisk } from './types';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format timestamp
export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Get status color
export function getStatusColor(status: ProofStatus): string {
  const colors = {
    verified: 'success',
    warning: 'warning',
    failed: 'danger',
    pending: 'gray',
  };
  return colors[status];
}

// Get overall risk badge config
export function getRiskConfig(risk: OverallRisk) {
  const configs = {
    safe: {
      bgClass: 'bg-success-100 border-success-300',
      textClass: 'text-success-800',
    },
    warning: {
      bgClass: 'bg-warning-100 border-warning-300',
      textClass: 'text-warning-800',
    },
    danger: {
      bgClass: 'bg-danger-100 border-danger-300',
      textClass: 'text-danger-800',
    },
  };
  return configs[risk];
}

// Truncate address
export function truncateAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
