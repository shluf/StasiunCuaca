
import type { NewsItem } from '@/services/news';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import remarkBreaks from 'remark-breaks';

import { ChevronLeftIcon } from '@/components/icons';

interface NewsDetailProps {
    news: NewsItem;
    onBack: () => void;
}

export function NewsDetail({ news, onBack }: NewsDetailProps) {
    return (
        <div className="pb-24 animate-fade-in text-left">
            <button
                onClick={onBack}
                className="mb-6 group bg-white dark:bg-forest-900 rounded-xl p-3 shadow-sm border border-sage-100 dark:border-forest-700 hover:shadow-md hover:border-forest-300 dark:hover:border-forest-500 transition-all duration-300 flex items-center justify-center w-12 h-12"
                aria-label="Back to News"
            >
                <ChevronLeftIcon className="w-6 h-6 text-forest-600 dark:text-mint-400 group-hover:text-forest-800 dark:group-hover:text-mint-300 transition-colors" />
            </button>

            <article className="bg-white dark:bg-forest-900 rounded-2xl overflow-hidden shadow-sm border border-sage-100 dark:border-forest-700">
                {news.banner_photo && (
                    <div className="w-full h-64 md:h-80 overflow-hidden">
                        <img
                            src={news.banner_photo}
                            alt={news.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-6 md:p-8">
                    <header className="mb-6 border-b border-sage-100 dark:border-forest-700 pb-6">
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
                        prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8">
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                            {news.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>
        </div>
    );
}
