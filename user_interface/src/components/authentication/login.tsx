import React from 'react';
import axios from 'axios';

const GoogleLogin = () => {
    const handleGoogleLogin = async (response) => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/auth/google/', {
                access_token: response.accessToken,
            });

            // Store the token in localStorage
            localStorage.setItem('token', res.data.key);

            // Configure axios defaults for future requests
            axios.defaults.headers.common['Authorization'] = `Token ${res.data.key}`;

            // Handle successful login (e.g., redirect)
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    return (
        <div>
            {/* Add your Google login button component here */}
            <button onClick={() => {
                window.location.href = 'http://127.0.0.1:8000/api/auth/google/login/';
            }}>
                Login with Google
            </button>
        </div>
    );
};

export default GoogleLogin;