'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Copy, AlertTriangle, CheckCircle, XCircle, FileText, Search } from 'lucide-react';
import { BadgeCard } from '@/components/ui/badge-card';
import { Button } from '@/components/ui/button';
import { getAssetData } from '@/lib/mock-data';
import { getRiskConfig, formatTimestamp, copyToClipboard, truncateAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { OverallRisk } from '@/lib/types';

const getRiskIcon = (risk: OverallRisk) => {
  const icons = {
    safe: CheckCircle,
    warning: AlertTriangle,
    danger: XCircle,
  };
  return icons[risk];
};

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenId = searchParams.get('token');
  const notFound = searchParams.get('notFound');

  if (!tokenId) {
    router.push('/');
    return null;
  }

  if (notFound) {
    return <NotFoundView tokenId={tokenId} />;
  }

  const assetData = getAssetData(tokenId);

  if (!assetData) {
    return <NotFoundView tokenId={tokenId} />;
  }

  const { metadata, verification } = assetData;
  const riskConfig = getRiskConfig(verification.overallStatus);
  const RiskIcon = getRiskIcon(verification.overallStatus);

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`已複製 ${label}`);
    } else {
      toast.error('複製失敗');
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
        </motion.div>

        {/* Asset Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{metadata.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-mono">{tokenId}</span>
              <button
                onClick={() => handleCopy(tokenId, 'Token ID')}
                className="text-primary-600 hover:text-primary-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Overall Status */}
          <div
            className={cn(
              'p-6 rounded-2xl border-2',
              riskConfig.bgClass
            )}
          >
            <div className={cn('text-2xl font-bold flex items-center gap-3', riskConfig.textClass)}>
              <RiskIcon className="w-8 h-8" />
              <span>{verification.overallMessage}</span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              驗證時間：{formatTimestamp(verification.timestamp)}
            </div>
          </div>
        </motion.div>

        {/* Verification Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <BadgeCard
            status={verification.proofs.existence.status}
            title={verification.proofs.existence.title}
            subtitle={verification.proofs.existence.subtitle}
            delay={0}
          />
          <BadgeCard
            status={verification.proofs.legality.status}
            title={verification.proofs.legality.title}
            subtitle={verification.proofs.legality.subtitle}
            delay={0.1}
          />
          <BadgeCard
            status={verification.proofs.collateral.status}
            title={verification.proofs.collateral.title}
            subtitle={verification.proofs.collateral.subtitle}
            delay={0.2}
          />
        </motion.div>

        {/* Detailed Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-8"
        >
          {/* Asset Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              資產詳情
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailRow label="資產類型" value={getAssetTypeLabel(metadata.type)} />
              {metadata.location && <DetailRow label="位置" value={metadata.location} />}
              {metadata.value && <DetailRow label="估值" value={metadata.value} />}
              {metadata.issuer && <DetailRow label="發行方" value={metadata.issuer} />}
              {metadata.custodian && <DetailRow label="託管機構" value={metadata.custodian} />}
              {metadata.issuedDate && <DetailRow label="發行日期" value={metadata.issuedDate} />}
            </div>
            {metadata.description && (
              <p className="text-gray-600 mt-4 p-4 bg-gray-50 rounded-xl">
                {metadata.description}
              </p>
            )}
          </div>

          {/* Proof Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Search className="w-6 h-6" />
              驗證詳情
            </h2>

            {/* Existence Proof */}
            <ProofSection
              title="存在性驗證"
              proof={verification.proofs.existence}
            />

            {/* Legality Proof */}
            <ProofSection
              title="合法性驗證"
              proof={verification.proofs.legality}
            />

            {/* Collateral Proof */}
            <ProofSection
              title="抵押狀態"
              proof={verification.proofs.collateral}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper Components
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function ProofSection({ title, proof }: { title: string; proof: any }) {
  return (
    <div className="border-2 border-gray-200 rounded-2xl p-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailRow label="驗證來源" value={proof.details.source} />
        <DetailRow label="驗證方法" value={proof.details.method} />
        {proof.details.verifiedAt && (
          <DetailRow label="驗證時間" value={formatTimestamp(proof.details.verifiedAt)} />
        )}
        {proof.details.txHash && (
          <DetailRow label="交易哈希" value={truncateAddress(proof.details.txHash)} />
        )}
      </div>

      {/* Warnings */}
      {proof.details.warnings && proof.details.warnings.length > 0 && (
        <div className="bg-warning-50 border-2 border-warning-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5" />
            <div className="space-y-2">
              {proof.details.warnings.map((warning: string, index: number) => (
                <div key={index} className="text-sm text-warning-800">
                  {warning}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Evidence Links */}
      {proof.details.evidence && proof.details.evidence.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-700">驗證證據：</div>
          {proof.details.evidence.map((link: string, index: number) => (
            <a
              key={index}
              href={link.startsWith('http') ? link : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="break-all">{link}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function NotFoundView({ tokenId }: { tokenId: string }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6"
      >
        <div className="flex justify-center">
          <XCircle className="w-24 h-24 text-danger-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">資產未找到</h2>
        <p className="text-gray-600">
          無法找到 Token ID 對應的資產資訊：
        </p>
        <p className="text-sm font-mono text-gray-500 break-all bg-gray-100 p-3 rounded-lg">
          {tokenId}
        </p>
        <Button onClick={() => router.push('/')} size="lg" className="w-full">
          返回首頁
        </Button>
      </motion.div>
    </div>
  );
}

function getAssetTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    real_estate: '不動產',
    bond: '債券',
    commodity: '商品',
    art: '藝術品',
  };
  return labels[type] || type;
}
