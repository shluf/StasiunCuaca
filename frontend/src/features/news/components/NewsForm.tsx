
import { useState, useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { useTranslation } from 'react-i18next';

interface NewsFormProps {
    initialData?: {
        title: string;
        content: string;
        banner_photo?: string;
    };
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
}

export function NewsForm({ initialData, onSubmit, onCancel }: NewsFormProps) {
    const { t } = useTranslation('common');
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [banner, setBanner] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (banner) {
                formData.append('banner_photo', banner);
            }

            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || t('news.saveError'));
        } finally {
            setLoading(false);
        }
    };

    const mdeOptions = useMemo(() => {
        return {
            autofocus: true,
            spellChecker: false,
            placeholder: t('news.form.placeholder'),
            status: false,
        };
    }, [t]);

    return (
        <div className="bg-white dark:bg-forest-900 rounded-xl p-6 shadow-sm border border-sage-100 dark:border-forest-700 animate-fade-in mb-24">
            <h2 className="text-xl font-bold mb-6 text-forest-900 dark:text-forest-50">
                {initialData ? t('news.edit') : t('news.create')}
            </h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-forest-700 dark:text-forest-200 mb-1">
                        {t('news.form.title')}
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-forest-800 border border-sage-200 dark:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-forest-700 dark:text-forest-200 mb-1">
                        {t('news.form.banner')}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBanner(e.target.files?.[0] || null)}
                        className="w-full text-sm text-sage-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-forest-50 file:text-forest-700 hover:file:bg-forest-100 dark:file:bg-forest-800 dark:file:text-mint-400"
                    />
                </div>

                <div className="prose-editor">
                    <label className="block text-sm font-medium text-forest-700 dark:text-forest-200 mb-1">
                        {t('news.form.content')}
                    </label>
                    <SimpleMDE
                        value={content}
                        onChange={setContent}
                        options={mdeOptions}
                        className="dark:bg-white rounded-lg" // SimpleMDE themes are usually light
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 border border-sage-300 dark:border-forest-600 rounded-lg text-sage-600 dark:text-sage-300 hover:bg-sage-50 dark:hover:bg-forest-800 transition-colors"
                        disabled={loading}
                    >
                        {t('news.cancel')}
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-2 px-4 bg-forest-600 hover:bg-forest-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? t('news.saving') : t('news.save')}
                    </button>
                </div>
            </form>
        </div>
    );
}
