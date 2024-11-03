import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login-lite';
import axios from 'axios';

const SocialLogin = () => {
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post('http://localhost:8000/api/auth/google/', {
                token: credentialResponse.credential
            });

            // Store the token
            localStorage.setItem('token', res.data.key);
            // You might want to use a proper state management solution like Redux or Context
            console.log('Google login successful');

        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    const handleGoogleError = () => {
        console.error('Google login failed');
    };

    const handleFacebookResponse = async (response) => {
        if (response.status === 'connected') {
            try {
                const res = await axios.post('http://localhost:8000/api/auth/facebook/', {
                    access_token: response.authResponse.accessToken,
                });

                localStorage.setItem('token', res.data.key);
                console.log('Facebook login successful');

            } catch (error) {
                console.error('Facebook login error:', error);
            }
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
            />

            <FacebookLogin
                appId="your-facebook-app-id"
                onResponse={handleFacebookResponse}
                className="fb-login-button"
            />
        </div>
    );
};

export default SocialLogin;