import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { ForecastContent } from './ForecastContent';

interface ForecastDrawerProps {
  latitude?: number;
  longitude?: number;
}

export function ForecastDrawer({ latitude, longitude }: ForecastDrawerProps) {
  const { t } = useTranslation('common');

  const [isExpanded, setIsExpanded] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle touch/mouse drag
  const handleDragStart = (clientY: number) => {
    setDragStartY(clientY);
  };

  const handleDragMove = (clientY: number) => {
    const offset = dragStartY - clientY;
    setDragOffset(offset);

    // Auto-expand if dragged up enough
    if (offset > 50 && !isExpanded) {
      setIsExpanded(true);
      setDragOffset(0);
    } else if (offset < -50 && isExpanded) {
      setIsExpanded(false);
      setDragOffset(0);
    }
  };

  const handleDragEnd = () => {
    setDragOffset(0);
    setDragStartY(0);
  };

  // Global mouse move/up handlers for desktop drag
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (dragStartY !== 0) {
        handleDragMove(e.clientY);
      }
    };

    const handleWindowMouseUp = () => {
      if (dragStartY !== 0) {
        handleDragEnd();
      }
    };

    if (dragStartY !== 0) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [dragStartY]);

  return (
    <div
      ref={drawerRef}
      className={clsx(
        'md:hidden fixed left-0 right-0 z-40 transition-all duration-500 ease-out overflow-hidden',
        isExpanded ? 'bottom-[64px] top-0 rounded-none' : 'bottom-[64px] rounded-t-3xl',
        'bg-white/90 dark:bg-forest-950/95 backdrop-blur-md',
        'border-t border-sage-200/40 dark:border-forest-700/40',
        'shadow-glass-light dark:shadow-glass-dark'
      )}
      style={{
        transform: `translateY(${isExpanded ? 0 : `calc(100% - 60px + ${-dragOffset}px)`})`,
      }}
    >
      {/* Drag Handle */}
      <div
        className="sticky top-0 bg-white/95 dark:bg-forest-950/95 backdrop-blur-md border-b border-sage-200/40 dark:border-forest-700/40 z-10"
      >
        {/* Handle */}
        <div
          className="absolute top-0 left-0 right-0 h-6 flex justify-center py-2 cursor-grab active:cursor-grabbing touch-none z-[60]"
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
          data-tour="forecast-drawer"
        >
          <div className="w-12 h-1.5 bg-sage-300 dark:bg-forest-600 rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display text-forest-900 dark:text-forest-50">
                {t('forecast.title')}
              </h2>
              <p className="text-xs text-sage-600 dark:text-sage-400 font-body">
                {isExpanded ? t('forecast.swipeDown') : t('forecast.swipeUp')}
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-sage-100 dark:hover:bg-forest-800 transition-colors"
              data-tour="forecast-toggle"
            >
              <svg
                className={clsx(
                  'w-5 h-5 text-forest-700 dark:text-mint-400 transition-transform duration-300',
                  isExpanded ? 'rotate-180' : ''
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="overflow-y-auto h-full pb-32 px-4">
        <ForecastContent latitude={latitude} longitude={longitude} />
      </div>
    </div>
  );
}
