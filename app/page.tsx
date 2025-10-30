'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, CheckCircle2, Lock, AlertTriangle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TOKEN_EXAMPLES } from '@/lib/constants';
import { isValidTokenId } from '@/lib/mock-data';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [tokenId, setTokenId] = useState('');
  const router = useRouter();

  const handleVerify = () => {
    if (!tokenId.trim()) {
      toast.error('請輸入 Token ID');
      return;
    }

    if (!isValidTokenId(tokenId)) {
      toast.error('Token ID 格式不正確\n範例: asset:1/0xABCD1234/001');
      return;
    }

    router.push(`/verify?token=${encodeURIComponent(tokenId)}`);
  };

  const handleExampleClick = (exampleId: string) => {
    setTokenId(exampleId);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl w-full space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="inline-block"
          >
            <ShieldCheck className="w-20 h-20 sm:w-24 sm:h-24 text-primary-600 mx-auto" />
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 text-balance">
            RWA Proof Gateway
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto text-balance">
            驗證任何 RWA 資產的真實性，3 秒內見證
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 space-y-6"
        >
          <div className="relative">
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="輸入 Token ID，例如：asset:1/0xABCD1234/001"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-primary-500 focus:outline-none transition-colors pr-12"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>

          <Button
            onClick={handleVerify}
            disabled={!tokenId.trim()}
            size="lg"
            className="w-full"
          >
            立即驗證資產真實性
          </Button>

          {/* Example Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TOKEN_EXAMPLES.map((example, index) => {
              const iconMap = {
                safe: { Icon: CheckCircle2, color: 'text-success-600', glowColor: 'rgb(16, 185, 129)' },
                warning: { Icon: AlertTriangle, color: 'text-warning-600', glowColor: 'rgb(245, 158, 11)' },
                danger: { Icon: XCircle, color: 'text-danger-600', glowColor: 'rgb(239, 68, 68)' },
              };
              const { Icon, color, glowColor } = iconMap[example.type];

              return (
                <div key={example.id} className="relative rounded-xl">
                  {/* Rotating glow effect container */}
                  <div className="absolute -inset-1 rounded-xl overflow-hidden opacity-90">
                    <motion.div
                      className="absolute inset-0"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        background: `conic-gradient(from 0deg, transparent 0deg, ${glowColor} 50deg, transparent 120deg)`,
                        filter: 'blur(4px)',
                      }}
                    />
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => handleExampleClick(example.id)}
                    className="relative w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-left group bg-white z-10"
                  >
                    <div className="flex items-center gap-2 font-semibold text-gray-900 group-hover:text-primary-700">
                      <Icon className={`w-5 h-5 ${color}`} />
                      {example.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{example.description}</div>
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <FeatureCard
            icon={<CheckCircle2 className="w-8 h-8" />}
            title="存在性驗證"
            description="確認真實資產存在並與 Token 綁定"
          />
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8" />}
            title="合法性驗證"
            description="檢查發行方資格與合規性"
          />
          <FeatureCard
            icon={<Lock className="w-8 h-8" />}
            title="抵押狀態"
            description="掃描重複質押風險"
          />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-primary-600 mb-3">{icon}</div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
