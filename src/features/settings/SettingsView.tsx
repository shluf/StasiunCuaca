import { useTranslation } from '@/i18n';
import { ThemeToggle, LanguageSelector, FontSizeControl, NotificationToggle } from '@/components/settings';
import { UserIcon, PaletteIcon, GlobeIcon, AccessibilityIcon, BellIcon } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthService } from '@/services/auth';
import type { User } from '@/services/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '@/config/constants';

export function SettingsView() {
    const { t } = useTranslation('settings');
    const { language } = useLanguage();
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(AuthService.getCurrentUser());
    }, []);

    const handleLogout = () => {
        AuthService.logout();
    };

    return (
        <div className="min-h-screen p-4 pt-8 pb-24">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold font-display text-forest-900 dark:text-forest-50 mb-6 text-center">
                        {t('settingsTitle')}
                    </h1>
                    <p className="text-sage-700 dark:text-sage-300 font-body text-center">
                        {t('settingsDescription')}
                    </p>
                </header>

                <div className="space-y-6">
                    {/* User Profile Section */}
                    <section className="bg-white/70 dark:bg-forest-900/40 backdrop-blur-md rounded-2xl p-6 border border-sage-200/50 dark:border-forest-700/50 shadow-glass-light dark:shadow-glass-dark">
                        <h2 className="text-xl font-bold text-forest-900 dark:text-forest-50 mb-4 flex items-center gap-2">
                            <span className="text-forest-600 dark:text-forest-400"><UserIcon /></span> {t('userProfile')}
                        </h2>

                        {user ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-forest-900 dark:text-forest-50 font-bold text-lg">@{user.username}</p>
                                    <p className="text-sage-500 dark:text-sage-400 text-sm">{t('memberSince', { year: new Date(user.created_at).getFullYear() })}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    {t('logout')}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sage-600 dark:text-sage-300 mb-4">
                                    {t('loginToAccessFeatures')}
                                </p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-forest-600 hover:bg-forest-700 text-white px-6 py-2 rounded-lg font-bold transition-colors w-full sm:w-auto"
                                >
                                    {language === 'id' ? 'Masuk' : language === 'en' ? 'Login' : language === 'jv' ? 'Mlebu' : 'Login'}
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Appearance Section */}
                    <section className="bg-white/70 dark:bg-forest-900/40 backdrop-blur-md rounded-2xl p-6 border border-sage-200/50 dark:border-forest-700/50 shadow-glass-light dark:shadow-glass-dark">
                        <h2 className="text-xl font-bold text-forest-900 dark:text-forest-50 mb-4 flex items-center gap-2">
                            <span className="text-forest-600 dark:text-forest-400"><PaletteIcon /></span> {t('appearance')}
                        </h2>
                        <div className="space-y-4">
                            <ThemeToggle />
                        </div>
                    </section>

                    {/* Language Section */}
                    <section className="bg-white/70 dark:bg-forest-900/40 backdrop-blur-md rounded-2xl p-6 border border-sage-200/50 dark:border-forest-700/50 shadow-glass-light dark:shadow-glass-dark">
                        <h2 className="text-xl font-bold text-forest-900 dark:text-forest-50 mb-4 flex items-center gap-2">
                            <span className="text-forest-600 dark:text-forest-400"><GlobeIcon /></span> {t('languageSection')}
                        </h2>
                        <LanguageSelector />
                    </section>

                    {/* Accessibility Section */}
                    <section className="bg-white/70 dark:bg-forest-900/40 backdrop-blur-md rounded-2xl p-6 border border-sage-200/50 dark:border-forest-700/50 shadow-glass-light dark:shadow-glass-dark">
                        <h2 className="text-xl font-bold text-forest-900 dark:text-forest-50 mb-4 flex items-center gap-2">
                            <span className="text-forest-600 dark:text-forest-400"><AccessibilityIcon /></span> {t('accessibility')}
                        </h2>
                        <FontSizeControl />
                    </section>

                    {/* Notifications Section */}
                    <section className="bg-white/70 dark:bg-forest-900/40 backdrop-blur-md rounded-2xl p-6 border border-sage-200/50 dark:border-forest-700/50 shadow-glass-light dark:shadow-glass-dark">
                        <h2 className="text-xl font-bold text-forest-900 dark:text-forest-50 mb-4 flex items-center gap-2">
                            <span className="text-forest-600 dark:text-forest-400"><BellIcon /></span> {t('notificationsSection')}
                        </h2>
                        <NotificationToggle />
                    </section>

                    {/* App Info */}
                    <div className="text-center py-6 space-y-4">
                        <button
                            onClick={() => {
                                // Reset tour and redirect to home
                                window.localStorage.setItem(STORAGE_KEYS.FEATURE_TOUR_COMPLETE, 'false');
                                window.dispatchEvent(new Event('local-storage'));
                                navigate('/');
                            }}
                            className="text-sage-600 dark:text-sage-400 text-sm hover:underline hover:text-forest-600 dark:hover:text-mint-400 transition-colors"
                        >
                            {language === 'id' ? 'Mulai Ulang Tur Fitur' : language === 'en' ? 'Restart Feature Tour' : language === 'jv' ? 'Baleni Tour Fitur' : 'Restart Feature Tour'}
                        </button>

                        <div>
                            <p className="text-forest-900 dark:text-forest-50 font-bold mb-1">StasiunCuaca v1.0.0</p>
                            <p className="text-sage-500 dark:text-sage-400 text-sm">© 2025 All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
