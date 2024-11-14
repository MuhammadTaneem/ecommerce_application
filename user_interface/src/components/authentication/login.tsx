import {GoogleLogin} from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import {facebook_app_id} from "../../utilites/api.ts";


export  default  function  LoginComponent(){

    const responseFacebook = (response) => {
        console.log(response); // Contains user profile information and token
        if (response.accessToken) {
            // Use response.accessToken to authenticate with your server if necessary
            // Here, you can store the token or handle user data as needed
        } else {
            console.error("User failed to authenticate with Facebook.");
        }
    };


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

                <FacebookLogin
                    appId={facebook_app_id()}  // Replace with your Facebook App ID
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    cssClass="facebook-login-button" // Custom class
                    icon="fa-facebook"
                />
            </div>

        </>
    )
}