'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader, CheckCircle } from 'lucide-react';
import { ProgressBar } from '@/components/ui/progress-bar';
import { VERIFICATION_STEPS } from '@/lib/constants';
import { getAssetData } from '@/lib/mock-data';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenId = searchParams.get('token');

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!tokenId) {
      router.push('/');
      return;
    }

    // Check if asset exists
    const assetData = getAssetData(tokenId);
    if (!assetData) {
      router.push(`/results?token=${encodeURIComponent(tokenId)}&notFound=true`);
      return;
    }

    let stepIndex = 0;

    const runSteps = () => {
      if (stepIndex >= VERIFICATION_STEPS.length) {
        setTimeout(() => {
          router.push(`/results?token=${encodeURIComponent(tokenId)}`);
        }, 500);
        return;
      }

      setCurrentStep(stepIndex);

      const duration = VERIFICATION_STEPS[stepIndex].duration;
      const interval = 50;
      let elapsed = 0;

      const timer = setInterval(() => {
        elapsed += interval;
        const stepProgress = Math.min((elapsed / duration) * 100, 100);
        const totalProgress = (stepIndex * 100 + stepProgress) / VERIFICATION_STEPS.length;
        setProgress(totalProgress);

        if (elapsed >= duration) {
          clearInterval(timer);
          stepIndex++;
          setTimeout(runSteps, 200);
        }
      }, interval);
    };

    runSteps();
  }, [tokenId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            <Loader className="w-16 h-16 text-primary-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900">正在驗證資產</h2>
          <p className="text-gray-600 font-mono text-sm break-all">{tokenId}</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar progress={progress} />

        {/* Verification Steps */}
        <div className="space-y-4">
          {VERIFICATION_STEPS.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.3,
                x: 0,
              }}
              className={`flex items-start gap-4 p-5 rounded-2xl transition-colors ${
                index < currentStep
                  ? 'bg-success-50 border-2 border-success-200'
                  : index === currentStep
                  ? 'bg-primary-50 border-2 border-primary-200'
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div className="mt-1">
                {index < currentStep ? (
                  <CheckCircle className="w-6 h-6 text-success-600" />
                ) : index === currentStep ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader className="w-6 h-6 text-primary-600" />
                  </motion.div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{step.label}</div>
                <div className="text-sm text-gray-600 mt-1">{step.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex flex-col items-center gap-4">
        <Loader className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-gray-600 font-medium">載入中...</p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyContent />
    </Suspense>
  );
}
