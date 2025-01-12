import {GoogleLogin} from '@react-oauth/google';
// import { FacebookProvider, useLogin } from 'react-facebook';
// import {facebook_app_id} from "../../utilites/api.ts";
import {useState} from 'react';
import {zodResolver} from "@hookform/resolvers/zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod"
import {Input} from "postcss";

const schema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8,{
        message: "password should at lest 8 characters.",
    }),
});

type FormFields = z.infer<typeof schema>;
export default function LoginComponent() {
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<FormFields>({
        // defaultValues: {
        //     email: "test@email.com",
        // },
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(data);
            console.log(data['email']);

        } catch (error) {
            setError("root", {
                message: "This email is already taken",
            });
        }
    };

    const [isLoading, setIsLoading] = useState(false);


    // const responseFacebook = (response) => {
    //     console.log(response); // Contains user profile information and token
    //     if (response.accessToken) {
    //         // Use response.accessToken to authenticate with your server if necessary
    //         // Here, you can store the token or handle user data as needed
    //     } else {
    //         console.error("User failed to authenticate with Facebook.");
    //     }
    // };


    // async function handleLogin() {
    //     try {
    //         const response = await login({
    //             scope: 'email',
    //         });
    //
    //         console.log(response.status);
    //     } catch (error: any) {
    //         console.log(error.message);
    //     }
    // }


    return (
        <>

            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
                <div className="max-w-md w-full bg-white p-8 shadow-md rounded-lg">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Sign in to HORROR
                        </h2>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Field */}
                        <div className="space-y-1 ">
                            <input
                                {...register("email")}
                                type="text"
                                placeholder="Email"
                                className="input_field"
                            />

                            {errors.email && (
                                <div className="text-red-500 text-sm">{errors.email.message}</div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Password"
                                className="input_field"
                            />
                            {errors.password && (
                                <div className="text-red-500 text-sm">{errors.password.message}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                }`}
                            >
                                {isSubmitting ? "Loading..." : "Submit"}
                            </button>
                        </div>

                        {/* Root Error */}
                        {errors.root && (
                            <div className="text-red-500 text-sm mt-2">{errors.root.message}</div>
                        )}
                    </form>

                    {/*social auth*/}
                    <div className="flex justify-around mt-8">
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                console.log(credentialResponse);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />

                        {/*<button onClick={handleLogin} disabled={isLoading}>*/}
                        {/*    Login via Facebook*/}
                        {/*</button>*/}
                    </div>

                </div>
            </div>


        </>
    )
}