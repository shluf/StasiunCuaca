import { useState, useEffect, useMemo } from 'react';
import { NewsList } from './components/NewsList';
import { NewsDetail } from './components/NewsDetail';
import { NewsForm } from './components/NewsForm';
import { NewsService, type NewsItem } from '@/services/news';
import { AuthService } from '@/services/auth';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export function NewsView() {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const location = useLocation();
    const { slug } = useParams();

    const [news, setNews] = useState<NewsItem[]>([]);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = AuthService.isAuthenticated();

    // Enhancements: Search, Sort, Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 7; // 1 headline + 6 grid items

    const filteredAndSortedNews = useMemo(() => {
        let result = [...news];

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query)
            );
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [news, searchQuery, sortOrder]);

    const totalPages = Math.ceil(filteredAndSortedNews.length / ITEMS_PER_PAGE);
    const paginatedNews = filteredAndSortedNews.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page when search/sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortOrder]);

    // Determine view state from URL
    const isCreate = location.pathname === '/article/create';
    const isEdit = location.pathname.startsWith('/article/edit/');
    const isDetail = !!slug && !isEdit;
    const isList = !isCreate && !isEdit && !isDetail;

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (isDetail && slug) {
                    const item = await NewsService.getBySlug(slug);
                    setSelectedNews(item);
                } else if (isEdit && slug) {
                    const item = await NewsService.getBySlug(slug);
                    setSelectedNews(item);
                } else if (isList) {
                    const data = await NewsService.getAll();
                    setNews(data);
                }
            } catch (error) {
                console.error('Failed to load news', error);
                if (isDetail || isEdit) {
                    navigate('/article');
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [isDetail, isEdit, isList, slug, navigate]);

    const refreshList = async () => {
        const data = await NewsService.getAll();
        setNews(data);
    };

    const handleCreate = async (formData: FormData) => {
        await NewsService.create(formData);
        navigate('/article');
    };

    const handleUpdate = async (formData: FormData) => {
        if (selectedNews) {
            await NewsService.update(selectedNews.id, formData);
            navigate(`/article/${selectedNews.slug}`);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t('news.deleteConfirm'))) {
            await NewsService.delete(id);
            if (isDetail) {
                navigate('/article');
            } else {
                refreshList();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-sage-light dark:bg-gradient-forest-dark bg-mesh-light dark:bg-mesh-dark pb-24">
            {isList && (
                <div className="pt-6 px-4 max-w-5xl mx-auto animate-fade-in">
                    {/* Header & Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold font-display text-forest-900 dark:text-forest-50">
                                {t('news.title')}
                            </h1>
                            <p className="text-sm text-sage-600 dark:text-sage-400 mt-1">
                                {t('news.subtitle')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder={t('news.search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-sage-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-sm focus:ring-2 focus:ring-forest-500 outline-none w-full sm:w-64"
                            />

                            {/* Sort */}
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                className="px-4 py-2 rounded-lg border border-sage-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-sm focus:ring-2 focus:ring-forest-500 outline-none"
                            >
                                <option value="newest">{t('news.newest')}</option>
                                <option value="oldest">{t('news.oldest')}</option>
                            </select>

                            {isLoggedIn && (
                                <button
                                    onClick={() => navigate('/article/create')}
                                    className="bg-forest-600 hover:bg-forest-700 text-white text-sm font-bold py-2 px-4 rounded-lg shadow-sm transition-all whitespace-nowrap"
                                >
                                    + {t('news.add')}
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-sage-500">{t('common.loading')}</div>
                    ) : (
                        <NewsList
                            news={paginatedNews}
                            onSelectNews={(item) => navigate(`/article/${item.slug}`)}
                            isFirstPage={currentPage === 1 && !searchQuery}
                        />
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8 animate-fade-in">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border border-sage-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-sm disabled:opacity-50 hover:bg-sage-50 dark:hover:bg-forest-700 transition-colors"
                            >
                                ←
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-forest-600 text-white shadow-md'
                                        : 'bg-white dark:bg-forest-800 border border-sage-200 dark:border-forest-700 hover:bg-sage-50 dark:hover:bg-forest-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border border-sage-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-sm disabled:opacity-50 hover:bg-sage-50 dark:hover:bg-forest-700 transition-colors"
                            >
                                →
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isDetail && selectedNews && (
                <div className="pt-6 px-4 max-w-5xl mx-auto pb-24">
                    {isLoggedIn && (
                        <div className="flex justify-end gap-3 mb-4">
                            <button
                                onClick={() => navigate(`/article/edit/${selectedNews.slug}`)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-forest-700 bg-forest-50 hover:bg-forest-100 dark:text-forest-100 dark:bg-forest-800 dark:hover:bg-forest-700 rounded-lg transition-colors border border-forest-200 dark:border-forest-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                {t('common.edit')}
                            </button>
                            <button
                                onClick={() => handleDelete(selectedNews.id)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {t('common.delete')}
                            </button>
                        </div>
                    )}
                    <NewsDetail
                        news={selectedNews}
                        onBack={() => navigate('/article')}
                    />
                </div>
            )}

            {isCreate && (
                <NewsForm
                    onSubmit={handleCreate}
                    onCancel={() => navigate('/article')}
                />
            )}

            {isEdit && selectedNews && (
                <NewsForm
                    initialData={{
                        title: selectedNews.title,
                        content: selectedNews.content,
                        banner_photo: selectedNews.banner_photo
                    }}
                    onSubmit={handleUpdate}
                    onCancel={() => navigate(`/article/${selectedNews.slug}`)}
                />
            )}
        </div>
    );
}
