
import type { NewsItem } from '@/services/news';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface NewsListProps {
    news: NewsItem[];
    onSelectNews: (news: NewsItem) => void;
    isFirstPage?: boolean;
}

export function NewsList({ news, onSelectNews, isFirstPage = false }: NewsListProps) {
    const { t } = useTranslation('common');

    if (news.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-sage-500 dark:text-sage-400 animate-fade-in">
                <p>{t('news.noNews')}</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 pb-4 md:grid-cols-2 animate-slide-up">
            {news.map((item, index) => {
                const isFeatured = isFirstPage && index === 0;

                return (
                    <div
                        key={item.id}
                        onClick={() => onSelectNews(item)}
                        className={`bg-white/70 dark:bg-forest-900/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-glass-light dark:shadow-glass-dark border border-sage-200/50 dark:border-forest-700/50 hover:scale-[1.01] transition-all duration-300 cursor-pointer animate-scale-in ${isFeatured ? 'md:col-span-2' : ''}`}
                    >
                        {item.banner_photo && (
                            <div className={`${isFeatured ? 'h-64 md:h-80' : 'h-48'} overflow-hidden relative`}>
                                <img
                                    src={item.banner_photo}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500 [mask-image:linear-gradient(to_bottom,black,transparent)]"
                                />
                            </div>
                        )}
                        <div className="p-4 relative">
                            <h3 className={`font-bold text-forest-900 dark:text-forest-50 mb-2 ${isFeatured ? 'text-xl md:text-2xl' : 'text-lg line-clamp-2'}`}>
                                {item.title}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-sage-500 dark:text-sage-400 mb-3">
                                <span>{item.Author?.full_name || 'Admin'}</span>
                                <span>{format(new Date(item.created_at), 'dd MMM yyyy')}</span>
                            </div>
                            <p className="text-sage-700 dark:text-sage-300 text-sm line-clamp-3">
                                {(() => {
                                    const plainText = item.content
                                        .replace(/!\[.*?\]\(.*?\)/g, ' ')
                                        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1 ')
                                        .replace(/#{1,6}\s?/g, ' ')
                                        .replace(/(\*\*|__)(.*?)\1/g, '$2')
                                        .replace(/(\*|_)(.*?)\1/g, '$2')
                                        .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
                                        .replace(/^\s*[-+*]\s+/gm, ' ')
                                        .replace(/^\s*\d+\.\s+/gm, ' ')
                                        .replace(/^\s*>\s+/gm, ' ')
                                        .replace(/\s+/g, ' ')
                                        .trim();

                                    // Show more text for featured item
                                    const maxLength = isFeatured ? 300 : 150;
                                    return plainText.length > maxLength
                                        ? plainText.substring(0, maxLength) + '...'
                                        : plainText;
                                })()}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
