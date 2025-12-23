/**
 * useFeatureTour Hook
 * Manage feature tour state
 */

import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/config/constants';

interface UseFeatureTourReturn {
  hasCompletedTour: boolean;
  markTourComplete: () => void;
  resetTour: () => void;
  currentTourStep: number;
  setCurrentTourStep: (step: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  totalTourSteps: number;
  isTourActive: boolean;
  startTour: () => void;
}

export function useFeatureTour(totalSteps: number = 5): UseFeatureTourReturn {
  const [hasCompletedTour, setHasCompletedTour] = useLocalStorage<boolean>(
    STORAGE_KEYS.FEATURE_TOUR_COMPLETE,
    false
  );
  const [currentTourStep, setCurrentTourStep] = useState(-1); // -1 means tour not started
  const [isTourActive, setIsTourActive] = useState(false);

  const startTour = () => {
    setCurrentTourStep(0);
    setIsTourActive(true);
  };

  const markTourComplete = () => {
    setHasCompletedTour(true);
    setCurrentTourStep(-1);
    setIsTourActive(false);
  };

  const resetTour = () => {
    setHasCompletedTour(false);
    setCurrentTourStep(0);
    setIsTourActive(true);
  };

  const nextTourStep = () => {
    if (currentTourStep < totalSteps - 1) {
      setCurrentTourStep(currentTourStep + 1);
    } else {
      markTourComplete();
    }
  };

  const prevTourStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(currentTourStep - 1);
    }
  };

  return {
    hasCompletedTour,
    markTourComplete,
    resetTour,
    currentTourStep,
    setCurrentTourStep,
    nextTourStep,
    prevTourStep,
    totalTourSteps: totalSteps,
    isTourActive,
    startTour,
  };
}
