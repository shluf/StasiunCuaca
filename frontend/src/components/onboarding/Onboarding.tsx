import { useOnboarding } from '@/hooks/useOnboarding';
import { useLanguage } from '@/contexts/LanguageContext';
import clsx from 'clsx';
import { useEffect, useState, useCallback } from 'react';
import { GlobeIcon } from '@/components/icons';

interface OnboardingStep {
  id: string; // Added ID for logic
  title: string;
  description: string;
  icon: string | React.ReactNode;
  color: string;
}

// Define onboarding steps with translations
const getSteps = (language: string): OnboardingStep[] => {
  const commonColor = 'from-forest-500 to-sage-400';

  const steps: OnboardingStep[] = [
    {
      id: 'language',
      title: 'Choose Language / Pilih Bahasa',
      description: 'Select your preferred language / Pilih bahasa pilihan Anda',
      icon: <GlobeIcon className="w-12 h-12 text-white" />,
      color: 'from-sage-500 to-forest-600',
    }
  ];

  if (language === 'id') {
    return [
      ...steps,
      {
        id: 'welcome',
        title: 'Selamat Datang!',
        description:
          'StasiunCuaca adalah aplikasi monitoring cuaca real-time dari sensor IoT. Pantau kondisi cuaca langsung dari perangkat Anda.',
        icon: '🌤️',
        color: 'from-forest-500 to-emerald-400',
      },
      {
        id: 'realtime',
        title: 'Data Real-Time',
        description:
          'Lihat data sensor langsung: suhu, kelembapan, tekanan udara, CO2, kecepatan angin, dan curah hujan. Data diperbarui setiap 5 detik.',
        icon: '📊',
        color: 'from-emerald-500 to-teal-400',
      },
      {
        id: 'alerts',
        title: 'Peringatan Cuaca',
        description:
          'Dapatkan notifikasi otomatis saat kondisi cuaca ekstrem terdeteksi. Aktifkan notifikasi di pengaturan untuk tetap waspada.',
        icon: '🔔',
        color: 'from-teal-500 to-cyan-400',
      },
      {
        id: 'preferences',
        title: 'Sesuaikan Preferensi',
        description:
          'Ubah tema (gelap/terang), bahasa, ukuran teks, dan pengaturan lainnya. Klik ikon ⚙️ untuk membuka pengaturan.',
        icon: '⚙️',
        color: 'from-cyan-500 to-sky-400',
      },
    ];
  } else if (language === 'en') {
    return [
      ...steps,
      {
        id: 'welcome',
        title: 'Welcome!',
        description:
          'StasiunCuaca is a real-time weather monitoring app from IoT sensors. Monitor weather conditions directly from your device.',
        icon: '🌤️',
        color: 'from-forest-500 to-emerald-400',
      },
      {
        id: 'realtime',
        title: 'Real-Time Data',
        description:
          'View live sensor data: temperature, humidity, pressure, CO2, wind speed, and rainfall. Data updates every 5 seconds.',
        icon: '📊',
        color: 'from-emerald-500 to-teal-400',
      },
      {
        id: 'alerts',
        title: 'Weather Alerts',
        description:
          'Get automatic notifications when extreme weather conditions are detected. Enable notifications in settings to stay alert.',
        icon: '🔔',
        color: 'from-teal-500 to-cyan-400',
      },
      {
        id: 'preferences',
        title: 'Customize Preferences',
        description:
          'Change theme (dark/light), language, font size, and other settings. Click ⚙️ icon to open settings.',
        icon: '⚙️',
        color: 'from-cyan-500 to-sky-400',
      },
    ];
  } else {
    // Javanese
    return [
      ...steps,
      {
        id: 'welcome',
        title: 'Sugeng Rawuh!',
        description:
          'StasiunCuaca yaiku aplikasi ngawasi cuaca real-time saka sensor IoT. Pantau kahanan cuaca langsung saka piranti sampeyan.',
        icon: '🌤️',
        color: 'from-forest-500 to-emerald-400',
      },
      {
        id: 'realtime',
        title: 'Data Real-Time',
        description:
          'Deleng data sensor langsung: suhu, kalemman, tekanan udara, CO2, kacepetan angin, lan udan. Data dianyari saben 5 detik.',
        icon: '📊',
        color: 'from-emerald-500 to-teal-400',
      },
      {
        id: 'alerts',
        title: 'Peringatan Cuaca',
        description:
          'Nampa notifikasi otomatis nalika kahanan cuaca ekstrem terdeteksi. Aktifke notifikasi ing pangaturan supaya tetep waspada.',
        icon: '🔔',
        color: 'from-teal-500 to-cyan-400',
      },
      {
        id: 'preferences',
        title: 'Atur Preferensi',
        description:
          'Ganti tema (peteng/padhang), basa, ukuran aksara, lan pangaturan liyane. Klik ikon ⚙️ kanggo mbukak pangaturan.',
        icon: '⚙️',
        color: 'from-cyan-500 to-sky-400',
      },
    ];
  }
};

export function Onboarding() {
  const { hasCompletedOnboarding, currentStep, nextStep, prevStep, markOnboardingComplete } =
    useOnboarding(5); // Increased to 5 steps
  const { language, setLanguage } = useLanguage();

  const steps = getSteps(language);

  const [isExiting, setIsExiting] = useState(false);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSkip = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    // Small delay to allow UI to react if needed, but primarily to prevent race conditions
    requestAnimationFrame(() => {
      markOnboardingComplete();
    });
  }, [isExiting, markOnboardingComplete]);

  const handleNext = useCallback(() => {
    if (isExiting) return;

    if (currentStep === steps.length - 1) {
      setIsExiting(true);
      requestAnimationFrame(() => {
        markOnboardingComplete();
      });
    } else {
      nextStep();
    }
  }, [currentStep, steps.length, isExiting, markOnboardingComplete, nextStep]);

  // Handle language selection
  const handleLanguageSelect = (lang: 'en' | 'id' | 'jv') => {
    setLanguage(lang);
    setTimeout(() => {
      handleNext();
    }, 300); // Small delay to show selection effect
  };

  // Don't show if already completed
  if (hasCompletedOnboarding) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Onboarding Card */}
        <div className="relative w-full max-w-2xl">
          {/* Background gradient */}
          {steps[currentStep] && (
            <div
              className={clsx(
                'absolute inset-0 bg-gradient-to-br opacity-20 blur-3xl rounded-3xl',
                steps[currentStep].color
              )}
            />
          )}

          {/* Content */}
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-sage-200 dark:border-forest-700">
            {/* Header */}
            <div className="px-6 py-4 border-b border-sage-200 dark:border-forest-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'h-1.5 rounded-full transition-all',
                      index === currentStep
                        ? 'w-8 bg-forest-500'
                        : index < currentStep
                          ? 'w-6 bg-forest-300 dark:bg-forest-700'
                          : 'w-6 bg-sage-200 dark:bg-sage-800'
                    )}
                  />
                ))}
              </div>
              <button
                onClick={handleSkip}
                className="text-sm text-sage-500 dark:text-sage-400 hover:text-forest-700 dark:hover:text-mint-400 transition-colors"
                type="button"
              >
                {language === 'id' ? 'Lewati' : language === 'en' ? 'Skip' : 'Langkahi'}
              </button>
            </div>

            {/* Step Content */}
            <div className="px-8 py-12 text-center min-h-[400px] flex flex-col justify-center items-center">
              {steps[currentStep] ? (
                <>
                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className={clsx(
                        'inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br text-6xl shadow-lg',
                        steps[currentStep].color
                      )}
                    >
                      {steps[currentStep].icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold font-display text-forest-900 dark:text-forest-50 mb-4">
                    {steps[currentStep].title}
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-sage-600 dark:text-sage-300 max-w-md mx-auto leading-relaxed mb-8">
                    {steps[currentStep].description}
                  </p>

                  {/* Language Buttons - Only for Language Step */}
                  {steps[currentStep].id === 'language' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mt-4 animate-fade-in">
                      <button
                        onClick={() => handleLanguageSelect('id')}
                        className={clsx(
                          "p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 hover:scale-105",
                          language === 'id'
                            ? "bg-forest-50 dark:bg-forest-900/50 border-forest-500 ring-2 ring-forest-200 dark:ring-forest-800"
                            : "bg-white dark:bg-forest-950 border-sage-200 dark:border-forest-800 hover:border-forest-300 dark:hover:border-forest-600"
                        )}
                      >
                        <span className="text-2xl">🇮🇩</span>
                        <span className="font-semibold text-forest-900 dark:text-forest-50">Indonesia</span>
                      </button>
                      <button
                        onClick={() => handleLanguageSelect('en')}
                        className={clsx(
                          "p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 hover:scale-105",
                          language === 'en'
                            ? "bg-forest-50 dark:bg-forest-900/50 border-forest-500 ring-2 ring-forest-200 dark:ring-forest-800"
                            : "bg-white dark:bg-forest-950 border-sage-200 dark:border-forest-800 hover:border-forest-300 dark:hover:border-forest-600"
                        )}
                      >
                        <span className="text-2xl">🇺🇸</span>
                        <span className="font-semibold text-forest-900 dark:text-forest-50">English</span>
                      </button>
                      <button
                        onClick={() => handleLanguageSelect('jv')}
                        className={clsx(
                          "p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 hover:scale-105",
                          language === 'jv'
                            ? "bg-forest-50 dark:bg-forest-900/50 border-forest-500 ring-2 ring-forest-200 dark:ring-forest-800"
                            : "bg-white dark:bg-forest-950 border-sage-200 dark:border-forest-800 hover:border-forest-300 dark:hover:border-forest-600"
                        )}
                      >
                        <span className="text-2xl">🍵</span>
                        <span className="font-semibold text-forest-900 dark:text-forest-50">Basa Jawa</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <div className="animate-pulse text-sage-400">Loading...</div>
                </div>
              )}

              {/* Step Counter */}
              <p className="mt-8 text-sm text-sage-500 dark:text-sage-400">
                {currentStep + 1} / {steps.length}
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-sage-50 dark:bg-forest-900/30 border-t border-sage-200 dark:border-forest-700 flex items-center justify-between gap-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={clsx(
                  'px-6 py-2.5 rounded-lg font-medium transition-all font-display',
                  currentStep === 0
                    ? 'text-sage-400 dark:text-sage-600 cursor-not-allowed hidden' // Hide back button on first step
                    : 'text-sage-700 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-forest-800'
                )}
              >
                {language === 'id' ? 'Kembali' : language === 'en' ? 'Back' : 'Bali'}
              </button>

              {/* Hide Next button on Language step, forcing selection, or allow skip? Better specific logic: Show specific 'Next' only if language selected or just let user click language buttons to proceed. Let's keep Next button but maybe emphasize language selection buttons. Actually common pattern is language buttons act as 'next'. I will hide standard Next button on language step to force choice or clean UI. */}
              {steps[currentStep]?.id !== 'language' && (
                <button
                  onClick={handleNext}
                  className="px-8 py-2.5 rounded-lg bg-forest-600 hover:bg-forest-700 text-white font-medium transition-colors shadow-lg shadow-forest-500/30 font-display"
                >
                  {currentStep === steps.length - 1
                    ? language === 'id'
                      ? 'Mulai'
                      : language === 'en'
                        ? 'Get Started'
                        : 'Wiwiti'
                    : language === 'id'
                      ? 'Lanjut'
                      : language === 'en'
                        ? 'Next'
                        : 'Terus'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

