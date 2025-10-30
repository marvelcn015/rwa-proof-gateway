'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProofStatus } from '@/lib/types';
import { BADGE_CONFIG } from '@/lib/constants';

interface BadgeCardProps {
  status: ProofStatus;
  title: string;
  subtitle: string;
  description?: string;
  delay?: number;
}

const iconMap = {
  verified: CheckCircle,
  warning: AlertTriangle,
  failed: XCircle,
  pending: Clock,
};

export function BadgeCard({ status, title, subtitle, description, delay = 0 }: BadgeCardProps) {
  const config = BADGE_CONFIG[status];
  const Icon = iconMap[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        'flex flex-col items-center p-6 rounded-2xl border-2 shadow-sm hover:shadow-md transition-shadow',
        config.bgClass
      )}
    >
      <Icon className={cn('w-16 h-16 mb-4', config.textClass)} />
      <h3 className={cn('text-lg font-bold mb-1', config.textClass)}>{title}</h3>
      <p className={cn('text-sm font-medium', config.textClass)}>{subtitle}</p>
      {description && (
        <p className="text-xs text-gray-600 mt-2 text-center">{description}</p>
      )}
    </motion.div>
  );
}
