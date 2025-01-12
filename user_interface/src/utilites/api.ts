import axios from 'axios';
//
const baseURL =  'http://127.0.0.1:8000/api/';
//
// const instance = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api/',
//     // timeout: 1000,
// });
//
// export default instance;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export default api;
//
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Token ${token}`;
//     }
//     return config;
// });



export const google_client_id = ()=>{
    return '276749228751-v1uc9saefeu7n82m438n7iu4c47m7eck.apps.googleusercontent.com';
}

export const facebook_app_id = ()=>{
    return '2389510201391989';
}