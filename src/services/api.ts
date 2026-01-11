import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://naxtwave-hackthon-backend.vercel.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the toke
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const api = {
    // Expose axios methods
    get: axiosInstance.get,
    post: axiosInstance.post,
    put: axiosInstance.put,
    delete: axiosInstance.delete,
    patch: axiosInstance.patch,

    // Custom Service Methods
    getMoodHistory: async (userId?: string) => {
        const url = userId ? `/mood/history/${userId}` : '/mood/history';
        const response = await axiosInstance.get(url);
        return response.data;
    },

    logMood: async (moodData: { mood: string; note?: string }) => {
        const response = await axiosInstance.post('/mood/log', moodData);
        return response.data;
    },

    bookAppointment: async (appointmentData: any) => {
        const response = await axiosInstance.post('/therapists/book', appointmentData);
        return response.data;
    },

    getAppointments: async () => {
        const response = await axiosInstance.get('/therapists/appointments');
        return response.data;
    },

    verifyPayment: async (data: any) => {
        const response = await axiosInstance.post('/payments/razorpay/verify', data);
        return response.data;
    },

    getNews: async () => {
        const response = await axiosInstance.get('/news');
        return response.data;
    }
};

export default api;
