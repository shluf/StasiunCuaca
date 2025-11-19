import { useOnboarding } from '@/hooks/useOnboarding';
import { useLanguage } from '@/contexts/LanguageContext';
import clsx from 'clsx';
import { useEffect } from 'react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export function Onboarding() {
  const { hasCompletedOnboarding, currentStep, nextStep, prevStep, markOnboardingComplete, totalSteps } =
    useOnboarding(4);
  const { language } = useLanguage();

  // Define onboarding steps with translations
  const getSteps = (): OnboardingStep[] => {
    if (language === 'id') {
      return [
        {
          title: 'Selamat Datang!',
          description:
            'StasiunCuaca adalah aplikasi monitoring cuaca real-time dari sensor IoT. Pantau kondisi cuaca langsung dari perangkat Anda.',
          icon: '🌤️',
          color: 'from-blue-500 to-cyan-500',
        },
        {
          title: 'Data Real-Time',
          description:
            'Lihat data sensor langsung: suhu, kelembapan, tekanan udara, CO2, kecepatan angin, dan curah hujan. Data diperbarui setiap 5 detik.',
          icon: '📊',
          color: 'from-green-500 to-emerald-500',
        },
        {
          title: 'Peringatan Cuaca',
          description:
            'Dapatkan notifikasi otomatis saat kondisi cuaca ekstrem terdeteksi. Aktifkan notifikasi di pengaturan untuk tetap waspada.',
          icon: '🔔',
          color: 'from-orange-500 to-red-500',
        },
        {
          title: 'Sesuaikan Preferensi',
          description:
            'Ubah tema (gelap/terang), bahasa (Indonesia/English/Javanese), ukuran teks, dan pengaturan lainnya. Klik ikon ⚙️ untuk membuka pengaturan.',
          icon: '⚙️',
          color: 'from-purple-500 to-pink-500',
        },
      ];
    } else if (language === 'en') {
      return [
        {
          title: 'Welcome!',
          description:
            'StasiunCuaca is a real-time weather monitoring app from IoT sensors. Monitor weather conditions directly from your device.',
          icon: '🌤️',
          color: 'from-blue-500 to-cyan-500',
        },
        {
          title: 'Real-Time Data',
          description:
            'View live sensor data: temperature, humidity, pressure, CO2, wind speed, and rainfall. Data updates every 5 seconds.',
          icon: '📊',
          color: 'from-green-500 to-emerald-500',
        },
        {
          title: 'Weather Alerts',
          description:
            'Get automatic notifications when extreme weather conditions are detected. Enable notifications in settings to stay alert.',
          icon: '🔔',
          color: 'from-orange-500 to-red-500',
        },
        {
          title: 'Customize Preferences',
          description:
            'Change theme (dark/light), language (Indonesian/English/Javanese), font size, and other settings. Click ⚙️ icon to open settings.',
          icon: '⚙️',
          color: 'from-purple-500 to-pink-500',
        },
      ];
    } else {
      // Javanese
      return [
        {
          title: 'Sugeng Rawuh!',
          description:
            'StasiunCuaca yaiku aplikasi ngawasi cuaca real-time saka sensor IoT. Pantau kahanan cuaca langsung saka piranti sampeyan.',
          icon: '🌤️',
          color: 'from-blue-500 to-cyan-500',
        },
        {
          title: 'Data Real-Time',
          description:
            'Deleng data sensor langsung: suhu, kalemman, tekanan udara, CO2, kacepetan angin, lan udan. Data dianyari saben 5 detik.',
          icon: '📊',
          color: 'from-green-500 to-emerald-500',
        },
        {
          title: 'Peringatan Cuaca',
          description:
            'Nampa notifikasi otomatis nalika kahanan cuaca ekstrem terdeteksi. Aktifke notifikasi ing pangaturan supaya tetep waspada.',
          icon: '🔔',
          color: 'from-orange-500 to-red-500',
        },
        {
          title: 'Atur Preferensi',
          description:
            'Ganti tema (peteng/padhang), basa (Indonesia/English/Javanese), ukuran aksara, lan pangaturan liyane. Klik ikon ⚙️ kanggo mbukak pangaturan.',
          icon: '⚙️',
          color: 'from-purple-500 to-pink-500',
        },
      ];
    }
  };

  const steps = getSteps();

  // Don't show if already completed
  if (hasCompletedOnboarding) {
    return null;
  }

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSkip = () => {
    markOnboardingComplete();
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      markOnboardingComplete();
    } else {
      nextStep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Onboarding Card */}
        <div className="relative w-full max-w-2xl">
          {/* Background gradient */}
          <div
            className={clsx(
              'absolute inset-0 bg-gradient-to-br opacity-20 blur-3xl rounded-3xl',
              steps[currentStep].color
            )}
          />

          {/* Content */}
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'h-1.5 rounded-full transition-all',
                      index === currentStep
                        ? 'w-8 bg-blue-500'
                        : index < currentStep
                        ? 'w-6 bg-blue-300 dark:bg-blue-700'
                        : 'w-6 bg-gray-200 dark:bg-gray-700'
                    )}
                  />
                ))}
              </div>
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {language === 'id' ? 'Lewati' : language === 'en' ? 'Skip' : 'Langkahi'}
              </button>
            </div>

            {/* Step Content */}
            <div className="px-8 py-12 text-center">
              {/* Icon */}
              <div className="mb-6">
                <div
                  className={clsx(
                    'inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br text-6xl',
                    steps[currentStep].color
                  )}
                >
                  {steps[currentStep].icon}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {steps[currentStep].title}
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                {steps[currentStep].description}
              </p>

              {/* Step Counter */}
              <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                {currentStep + 1} / {steps.length}
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={clsx(
                  'px-6 py-2.5 rounded-lg font-medium transition-all',
                  currentStep === 0
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {language === 'id' ? 'Kembali' : language === 'en' ? 'Back' : 'Bali'}
              </button>

              <button
                onClick={handleNext}
                className="px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg shadow-blue-500/30"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
