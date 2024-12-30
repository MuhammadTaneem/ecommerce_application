import {GoogleLogin} from '@react-oauth/google';
import { FacebookProvider, useLogin } from 'react-facebook';
import {facebook_app_id} from "../../utilites/api.ts";


export  default  function  LoginComponent(){
    const { login, status, isLoading, error} = useLogin();

    const responseFacebook = (response) => {
        console.log(response); // Contains user profile information and token
        if (response.accessToken) {
            // Use response.accessToken to authenticate with your server if necessary
            // Here, you can store the token or handle user data as needed
        } else {
            console.error("User failed to authenticate with Facebook.");
        }
    };


    async function handleLogin() {
        try {
            const response = await login({
                scope: 'email',
            });

            console.log(response.status);
        } catch (error: any) {
            console.log(error.message);
        }
    }


    return(
        <>

            <div className="flex justify-around">
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        console.log(credentialResponse);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />

                <button onClick={handleLogin} disabled={isLoading}>
                    Login via Facebook
                </button>
            </div>

        </>
    )
}