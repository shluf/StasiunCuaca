import { useState, useEffect } from 'react';
import { AuthService } from '../../services/auth';
import { useTranslation } from '@/i18n';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, ChevronLeftIcon } from '@/components/icons';

export function AuthPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation('settings');

    useEffect(() => {
        if (AuthService.isAuthenticated()) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Helper to enforce timeout
        function withTimeout<T>(promise: Promise<T>, ms: number = 10000): Promise<T> {
            return Promise.race([
                promise,
                new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms))
            ]);
        }

        try {
            await withTimeout(AuthService.login(username, password));
            navigate('/');
        } catch (err: any) {
            console.error('AuthPage: Error caught', err);
            setError(err.response?.data?.error || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-sage-light dark:bg-gradient-forest-dark flex items-center justify-center p-4">
            <div className="bg-white/70 dark:bg-forest-900/40 backdrop-blur-md rounded-2xl p-8 border border-sage-200/50 dark:border-forest-700/50 shadow-glass-light dark:shadow-glass-dark w-full max-w-md animate-scale-in">
                <h1 className="text-3xl font-bold font-display text-forest-900 dark:text-forest-50 mb-6 text-center">
                    {t('login')}
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-forest-900 dark:text-forest-50 mb-1">
                            {t('username')}
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-forest-800/50 border border-sage-200 dark:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:text-white transition-all"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-forest-900 dark:text-forest-50 mb-1">
                            {t('password')}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 pr-10 rounded-lg bg-white/50 dark:bg-forest-800/50 border border-sage-200 dark:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:text-white transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-500 dark:text-sage-400 hover:text-forest-600 dark:hover:text-forest-300"
                                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                            >
                                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-forest-500 hover:bg-forest-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? t('processing') : t('signIn')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-sage-500 dark:text-sage-400">
                        {t('adminOnly')}
                    </p>
                </div>

                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-sage-600 dark:text-sage-300 font-medium bg-transparent hover:bg-sage-100 dark:hover:bg-forest-800 rounded-full transition-all duration-300"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        {t('backToDashboard')}
                    </button>
                </div>
            </div>
        </div>
    );
}
