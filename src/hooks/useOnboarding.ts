/**
 * useOnboarding Hook
 * Manage onboarding flow state
 */

import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/config/constants';


interface UseOnboardingReturn {
  hasCompletedOnboarding: boolean;
  markOnboardingComplete: () => void;
  resetOnboarding: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  totalSteps: number;
  isFirstVisit: boolean;
}

export function useOnboarding(totalSteps: number = 4): UseOnboardingReturn {
  const [storedOnboarding, setHasCompletedOnboarding] = useLocalStorage<boolean>(
    STORAGE_KEYS.ONBOARDING,
    false
  );

  const hasCompletedOnboarding = storedOnboarding ?? false;
  const [currentStep, setCurrentStep] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    setIsFirstVisit(!hasCompletedOnboarding);
  }, [hasCompletedOnboarding]);

  const markOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      markOnboardingComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    hasCompletedOnboarding,
    markOnboardingComplete,
    resetOnboarding,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    totalSteps,
    isFirstVisit,
  };
}
