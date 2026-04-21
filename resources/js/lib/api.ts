import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Since we are using Laravel SANCTUM or standard session auth, 
// Axios will automatically include the CSRF token if it's in the XSRF-TOKEN cookie.
// Laravel does this out of the box with the standard axios configuration.

export default api;
