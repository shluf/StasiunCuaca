/**
 * FeatureTour Component
 * Interactive tour guide for dashboard features
 */

import { useEffect, useRef } from 'react';
import { useFeatureTour } from '@/hooks/useFeatureTour';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import clsx from 'clsx';

interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export function FeatureTour() {
  const { hasCompletedOnboarding } = useOnboarding();
  const {
    hasCompletedTour,
    isTourActive,
    currentTourStep,
    nextTourStep,
    markTourComplete,
    startTour,
    totalTourSteps,
  } = useFeatureTour(7);
  const { language } = useLanguage();
  const highlightRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Auto-start tour after onboarding is complete
  useEffect(() => {
    if (hasCompletedOnboarding && !hasCompletedTour && !isTourActive && currentTourStep === -1) {
      // Wait a bit for dashboard to render
      const timer = setTimeout(() => {
        startTour();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding, hasCompletedTour, isTourActive, currentTourStep, startTour]);

  const getTourSteps = (): TourStep[] => {
    if (language === 'id') {
      return [
        {
          target: '[data-tour="nav-home"]',
          title: 'Dashboard Utama',
          description:
            'Kembali ke halaman utama untuk melihat ringkasan cuaca dan status sensor terkini.',
          position: 'top',
        },
        {
          target: '[data-tour="sensors-grid"]',
          title: 'Data Sensor',
          description:
            'Informasi rinci dari sensor IoT: Kelembaban, Tekanan, Angin, Curah Hujan, CO2, dan Ketinggian.',
          position: 'top',
        },
        {
          target: '[data-tour="forecast-drawer"]',
          title: 'Perkiraan Cuaca',
          description:
            'Tarik ke atas untuk melihat perkiraan cuaca 7 hari ke depan dari Open Meteo (Pihak Ketiga).',
          position: 'top',
        },
        {
          target: '[data-tour="nav-news"]',
          title: 'Berita',
          description:
            'Dapatkan informasi dan edukasi terbaru seputar cuaca dan lingkungan.',
          position: 'top',
        },
        {
          target: '[data-tour="nav-history"]',
          title: 'Riwayat',
          description:
            'Lihat data cuaca masa lampau untuk analisis tren.',
          position: 'top',
        },
        {
          target: '[data-tour="nav-insights"]',
          title: 'Analisis',
          description:
            'Pantau tren bulanan, indeks kenyamanan, dan peringatan dini cuaca ekstrem di sini.',
          position: 'top',
        },
        {
          target: '[data-tour="nav-settings"]',
          title: 'Pengaturan',
          description:
            'Sesuaikan tema, bahasa, dan preferensi aplikasi lainnya di menu ini.',
          position: 'top',
        },
      ];
    } else if (language === 'en') {
      return [
        {
          target: '[data-tour="nav-home"]',
          title: 'Main Dashboard',
          description:
            'Return to the main page to view weather summary and latest sensor status.',
          position: 'top',
        },
        {
          target: '[data-tour="sensors-grid"]',
          title: 'Sensor Data',
          description:
            'Detailed info from IoT sensors: Humidity, Pressure, Wind, Rainfall, CO2, and Altitude.',
          position: 'top',
        },
        {
          target: '[data-tour="forecast-drawer"]',
          title: 'Weather Forecast',
          description:
            'Pull up to see the 7-day weather forecast sourced from Open Meteo (Third Party).',
          position: 'top',
        },
        {
          target: '[data-tour="nav-news"]',
          title: 'News',
          description:
            'Get the latest information and education about weather and environment.',
          position: 'top',
        },
        {
          target: '[data-tour="nav-history"]',
          title: 'History',
          description:
            'View past weather data for trend analysis.',
          position: 'top',
        },
        {
          target: '[data-tour="nav-insights"]',
          title: 'Insights',
          description:
            'Monitor monthly trends, comfort index, and early extreme weather warnings here.',
          position: 'top',
        },
        {
          target: '[data-tour="nav-settings"]',
          title: 'Settings',
          description:
            'Customize theme, language, and other app preferences in this menu.',
          position: 'top',
        },
      ];
    } else {
      // Javanese
      return [
        {
          target: '[data-tour="nav-home"]',
          title: 'Dashboard Utama',
          description:
            'Bali menyang kaca utama kanggo ndeleng ringkesan cuaca lan status sensor paling anyar.',
          position: 'top',
        },
        {
          target: '[data-tour="sensors-grid"]',
          title: 'Data Sensor',
          description:
            'Informasi rinci saka sensor IoT: Kelembaban, Tekanan, Angin, Curah Udan, CO2, lan Ketinggian.',
          position: 'top',
        },
        {
          target: '[data-tour="forecast-drawer"]',
          title: 'Prakiraan Cuaca',
          description:
            'Tarik mendhuwur kanggo ndeleng prakiraan cuaca 7 dina sabanjure saka Open Meteo (Pihak Katelu).',
          position: 'top',
        },
        {
          target: '[data-tour="nav-news"]',
          title: 'Warta',
          description:
            'Entuk informasi lan edukasi paling anyar babagan cuaca lan lingkungan.',
          position: 'top',
        },
        {
          target: '[data-tour="nav-history"]',
          title: 'Riwayat',
          description:
            'Deleng data cuaca kepungkur kanggo analisis tren.',
          position: 'top',
        },
        {
          target: '[data-tour="nav-insights"]',
          title: 'Analisis',
          description:
            'Pantau tren wulanan, indeks kenyamanan, lan peringatan dini cuaca ekstrem ing kene.',
          position: 'top',
        },
        {
          target: '[data-tour="nav-settings"]',
          title: 'Pangaturan',
          description:
            'Setel tema, basa, lan preferensi aplikasi liyane ing menu iki.',
          position: 'top',
        },
      ];
    }
  };

  const steps = getTourSteps();

  // Update highlight and tooltip position
  useEffect(() => {
    if (!isTourActive || currentTourStep === -1) return;

    const currentStep = steps[currentTourStep];
    if (!currentStep) return;

    const targetElement = document.querySelector(currentStep.target);
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();

    // Position highlight
    if (highlightRef.current) {
      const computedStyle = window.getComputedStyle(targetElement);
      const borderRadius = computedStyle.borderRadius;

      highlightRef.current.style.top = `${rect.top - 4}px`;
      highlightRef.current.style.left = `${rect.left - 4}px`;
      highlightRef.current.style.width = `${rect.width + 8}px`;
      highlightRef.current.style.height = `${rect.height + 8}px`;
      highlightRef.current.style.borderRadius = borderRadius;

      // Also apply border radius to the inner pulse div
      const innerPulse = highlightRef.current.firstElementChild as HTMLElement;
      if (innerPulse) {
        innerPulse.style.borderRadius = borderRadius;
      }
    }

    // Position tooltip
    if (tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      const margin = 16;

      let top = 0;
      let left = 0;

      // Reset transformations
      tooltip.style.transform = 'none';

      switch (currentStep.position) {
        case 'top':
          top = rect.top - tooltipRect.height - margin;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + margin;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.left - tooltipRect.width - margin;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.right + margin;
          break;
      }

      // Keep within viewport logic (simplified)
      const padding = 16;
      const viewportWidth = window.innerWidth;

      // Horizontal constraint
      if (left < padding) left = padding;
      if (left + tooltipRect.width > viewportWidth - padding) {
        left = viewportWidth - tooltipRect.width - padding;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }
  }, [isTourActive, currentTourStep, steps, tooltipRef]);

  if (!isTourActive || currentTourStep === -1) return null;

  const currentStep = steps[currentTourStep];
  if (!currentStep) return null;

  const handleNext = () => {
    if (currentTourStep === totalTourSteps - 1) {
      markTourComplete();
    } else {
      nextTourStep();
    }
  };

  const handleSkip = () => {
    markTourComplete();
  };

  return (
    <>
      {/* Overlay - Transparent for click blocking only */}
      <div className="fixed inset-0 z-[60] bg-transparent pointer-events-auto" />

      {/* Highlight with Spotlight Effect */}
      <div
        ref={highlightRef}
        className="fixed z-[61] pointer-events-none transition-all duration-300 ease-out"
        style={{
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div className="absolute inset-0 border-4 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)] animate-pulse" />
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={clsx(
          'fixed z-[62] transition-all duration-300 ease-out', // Changed from flex centered to fixed with dynamic pos
          'pointer-events-auto max-w-xs w-full', // Slightly narrower max-width for better fit
          'bg-gradient-to-br from-forest-800 to-emerald-700',
          'rounded-2xl shadow-2xl p-6',
          'border border-mint-400/30',
          'animate-in fade-in zoom-in-95 duration-300'
        )}
      >
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={clsx(
                'h-2 rounded-full transition-all',
                index === currentTourStep
                  ? 'w-8 bg-white'
                  : index < currentTourStep
                    ? 'w-2 bg-white/60'
                    : 'w-2 bg-white/30'
              )}
            />
          ))}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold font-display text-white mb-2">
          {currentStep.title}
        </h3>
        <p className="text-emerald-50 mb-6 leading-relaxed font-body">
          {currentStep.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleSkip}
            className="px-4 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
          >
            {language === 'id' ? 'Lewati' : language === 'en' ? 'Skip' : 'Langkahi'}
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg bg-white text-forest-700 hover:bg-emerald-50 transition-colors font-bold shadow-lg shadow-black/20 font-display"
          >
            {currentTourStep === totalTourSteps - 1
              ? language === 'id'
                ? 'Selesai'
                : language === 'en'
                  ? 'Finish'
                  : 'Rampung'
              : language === 'id'
                ? 'Lanjut'
                : language === 'en'
                  ? 'Next'
                  : 'Terus'}
          </button>
        </div>

        {/* Step counter */}
        <div className="mt-4 text-center text-emerald-200/60 text-sm font-mono">
          {currentTourStep + 1} / {totalTourSteps}
        </div>
      </div>
    </>
  );
}
