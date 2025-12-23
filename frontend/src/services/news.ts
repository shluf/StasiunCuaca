import axios from 'axios';
import { AuthService } from './auth';

export interface NewsItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    banner_photo?: string;
    author_id: number;
    created_at: string;
    updated_at: string;
    Author?: {
        id: number;
        username: string;
        full_name: string;
    };
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const NewsService = {
    getAll: async (): Promise<NewsItem[]> => {
        const response = await axios.get(`${API_URL}/api/news`);
        return response.data;
    },

    getBySlug: async (slug: string): Promise<NewsItem> => {
        const response = await axios.get(`${API_URL}/api/news/${slug}`);
        return response.data;
    },

    create: async (formData: FormData): Promise<NewsItem> => {
        const token = AuthService.getToken();
        const response = await axios.post(`${API_URL}/api/news`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async (id: number, formData: FormData): Promise<NewsItem> => {
        console.log('NewsService.update called with ID:', id); // Debug log
        if (!id) throw new Error('Invalid ID for update');

        const token = AuthService.getToken();
        const response = await axios.put(`${API_URL}/api/news/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        const token = AuthService.getToken();
        await axios.delete(`${API_URL}/api/news/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};
