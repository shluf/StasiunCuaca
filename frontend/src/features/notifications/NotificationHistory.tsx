import { BellIcon } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotificationItem {
    id: string;
    title: string;
    body: string;
    timestamp: Date;
    severity: 'info' | 'warning' | 'danger';
}

export function NotificationHistory() {
    const { language } = useLanguage();

    // Mock notifications for now, in a real app this would come from a service/context
    const notifications: NotificationItem[] = [
        {
            id: '1',
            title: language === 'id' ? 'Suhu Tinggi' : 'High Temperature',
            body: language === 'id' ? 'Suhu melebihi 35°C di area stasiun.' : 'Temperature exceeded 35°C in station area.',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
            severity: 'warning',
        },
        {
            id: '2',
            title: language === 'id' ? 'Koneksi Terputus' : 'Connection Lost',
            body: language === 'id' ? 'Gagal terhubung ke sensor utama.' : 'Failed to connect to primary sensor.',
            timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
            severity: 'danger',
        },
        {
            id: '3',
            title: language === 'id' ? 'Sistem Diperbarui' : 'System Updated',
            body: language === 'id' ? 'Perangkat lunak stasiun cuaca telah diperbarui.' : 'Weather station software has been updated.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            severity: 'info',
        },
    ];

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'danger':
                return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'warning':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800';
            case 'info':
            default:
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-sage-light dark:bg-gradient-forest-dark bg-mesh-light dark:bg-mesh-dark p-4 pt-8 pb-24">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold font-display text-forest-900 dark:text-forest-50 mb-2">
                        {language === 'id' ? 'Riwayat Notifikasi' : 'Notification History'}
                    </h1>
                    <p className="text-sage-700 dark:text-sage-300 font-body">
                        {language === 'id' ? 'Daftar peringatan dan informasi cuaca terbaru.' : 'List of recent weather alerts and information.'}
                    </p>
                </header>

                <div className="space-y-4 animate-slide-up">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="bg-white/70 dark:bg-forest-900/40 backdrop-blur-md rounded-2xl p-5 border border-sage-200/50 dark:border-forest-700/50 shadow-glass-light dark:shadow-glass-dark flex gap-4 transition-transform hover:scale-[1.01]"
                            >
                                <div className={`p-3 rounded-xl h-fit border ${getSeverityStyles(notification.severity)}`}>
                                    <BellIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-lg text-forest-900 dark:text-forest-50">
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-sage-500 dark:text-sage-400 whitespace-nowrap">
                                            {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sage-700 dark:text-sage-300 text-sm leading-relaxed">
                                        {notification.body}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/40 dark:bg-forest-900/20 rounded-3xl border border-dashed border-sage-300 dark:border-forest-700 mt-10">
                            <div className="text-5xl mb-4 opacity-30">🔔</div>
                            <p className="text-sage-600 dark:text-sage-400">
                                {language === 'id' ? 'Belum ada notifikasi.' : 'No notifications yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
