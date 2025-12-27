
import type { NewsItem } from '@/services/news';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import remarkBreaks from 'remark-breaks';
import { useTranslation } from 'react-i18next';

import { ChevronLeftIcon } from '@/components/icons';

interface NewsDetailProps {
    news: NewsItem;
    onBack: () => void;
    isLoggedIn?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function NewsDetail({ news, onBack, isLoggedIn, onEdit, onDelete }: NewsDetailProps) {
    const { t } = useTranslation('common');

    return (
        <div className="pb-24 animate-fade-in text-left">
            {/* Navigation Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="group bg-white dark:bg-forest-900 rounded-xl p-3 shadow-sm border border-sage-100 dark:border-forest-700 hover:shadow-md hover:border-forest-300 dark:hover:border-forest-500 transition-all duration-300 flex items-center justify-center w-12 h-12"
                        aria-label="Back to News"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-forest-600 dark:text-mint-400 group-hover:text-forest-800 dark:group-hover:text-mint-300 transition-colors" />
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <button
                            onClick={onBack}
                            className="text-sage-500 dark:text-sage-400 hover:text-forest-600 dark:hover:text-mint-400 transition-colors"
                        >
                            {t('news.title')}
                        </button>
                        <span className="text-sage-300 dark:text-forest-700">/</span>
                        <span className="text-forest-900 dark:text-forest-50 truncate max-w-[200px] md:max-w-md">
                            {news.title}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                {isLoggedIn && (
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-forest-700 bg-forest-50 hover:bg-forest-100 dark:text-forest-100 dark:bg-forest-800 dark:hover:bg-forest-700 rounded-xl transition-all border border-forest-200 dark:border-forest-600 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            {t('common.edit')}
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-xl transition-all border border-red-200 dark:border-red-800 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {t('common.delete')}
                        </button>
                    </div>
                )}
            </div>

            <article className="bg-white dark:bg-forest-900 rounded-t-2xl rounded-b-none overflow-hidden shadow-sm border-x border-t border-b-0 border-sage-100 dark:border-forest-700 [mask-image:linear-gradient(to_bottom,black_calc(100%-140px),transparent)] pb-12">
                {news.banner_photo && (
                    <div className="w-full h-64 md:h-96 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                        <img
                            src={news.banner_photo}
                            alt={news.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        </div>
                    </div>
                )}

                <div className="p-6 md:p-8 relative">
                    {/* Decorative Top Line */}
                    <div className="w-16 h-1 bg-forest-500 dark:bg-mint-500 mb-6 rounded-none" />

                    <header className="mb-8 border-b border-sage-100 dark:border-forest-700 pb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-forest-900 dark:text-forest-50 mb-4">
                            {news.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-sage-500 dark:text-sage-400">
                            <span className="font-medium text-forest-700 dark:text-mint-400">
                                {news.Author?.full_name || 'Admin'}
                            </span>
                            <span>•</span>
                            <span>{format(new Date(news.created_at), 'MMMM dd, yyyy')}</span>
                        </div>
                    </header>

                    {/* Custom Markdown Styling */}
                    <div className="prose prose-lg max-w-none break-words dark:prose-invert
                        prose-headings:font-display prose-headings:text-forest-900 dark:prose-headings:text-forest-50
                        prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4
                        prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                        prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6
                        prose-p:text-sage-800 dark:prose-p:text-sage-200 prose-p:leading-relaxed prose-p:mb-4
                        prose-strong:text-forest-900 dark:prose-strong:text-white prose-strong:font-bold
                        prose-em:text-forest-800 dark:prose-em:text-mint-200 prose-em:italic
                        prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                        prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                        prose-li:text-sage-800 dark:prose-li:text-sage-200 prose-li:my-2
                        prose-li:marker:text-forest-600 dark:prose-li:marker:text-mint-500
                        prose-a:text-forest-600 dark:prose-a:text-mint-400 
                        prose-a:font-medium prose-a:underline prose-a:decoration-forest-300 dark:prose-a:decoration-forest-600
                        prose-a:underline-offset-2 hover:prose-a:text-forest-800 dark:hover:prose-a:text-mint-300
                        prose-blockquote:border-l-4 prose-blockquote:border-forest-500 
                        prose-blockquote:bg-forest-50/50 dark:prose-blockquote:bg-forest-900/30
                        prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-lg
                        prose-blockquote:text-forest-800 dark:prose-blockquote:text-sage-200
                        prose-blockquote:italic prose-blockquote:my-6
                        prose-code:text-forest-700 dark:prose-code:text-mint-300
                        prose-code:bg-forest-100 dark:prose-code:bg-forest-800/50
                        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                        prose-code:font-mono prose-code:text-sm
                        prose-pre:bg-forest-900 prose-pre:text-sage-100 prose-pre:p-4 prose-pre:rounded-xl
                        prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8 relative z-10 pb-4">
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                            {news.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>
        </div>
    );
}
