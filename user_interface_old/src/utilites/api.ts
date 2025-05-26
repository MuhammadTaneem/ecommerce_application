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

export  type  ErrorDictType = {
    [key: string]: string;
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error);


        const error_dict: ErrorDictType= {};
        const server_errors = error.response?.data;
        if (server_errors && typeof server_errors === 'object') {
            for (const [key, value] of Object.entries(server_errors)) {
                if (Array.isArray(value)) {
                    error_dict[key] = value.join('\n');
                }
                else {
                    error_dict[key] = String(value);
                }
            }
        }

        console.log('Formatted Error Dictionary:', error_dict);
        const message:string =
            error.response?.data?.error?.message ||
            error.response?.data?.message ||
            error.message ||
            'Something went wrong.';
        return Promise.reject({ message, status: error.response?.status, error_dict } as NormalizedError);
    }
);

export interface NormalizedError {
    message: string;
    status?: number;
    error_dict?: ErrorDictType;
}



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