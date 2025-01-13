import { useEffect } from 'react';
import {useAppDispatch} from "@/core/store.ts";
import {setUser} from "@/features/authSlice.ts";
import {fetchUserProfile} from "@/components/authentication/auth_context.tsx";

export default function ProfileComponent() {


    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token'); // Get the token from localStorage

    useEffect(() => {
        if (token) {
            fetchUserProfile(token) // Call the function to fetch the user profile
                .then((userData) => {
                    dispatch(setUser(userData)); // Dispatch the user data to Redux store
                })
                .catch((error) => {
                    console.error('Error fetching user profile:', error.message);
                    // Optionally handle logout if token is invalid
                });
        }
    }, [token, dispatch]);

    return(
        <>
        <p>profile Page</p>
        </>
    )

}


