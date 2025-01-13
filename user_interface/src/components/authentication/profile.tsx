import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/core/store.ts";
import { fetchUserProfile } from '@/features/authSlice.ts';

export default function ProfileComponent() {
    // const user = useAppSelector((state) => state.auth.user);
    const { user, is_authenticated, isLoading, error } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (is_authenticated) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, is_authenticated]);

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error: {error}</div>;


    return (
        <>
            <p>profile Page</p>
            <p>{user?.email}</p>
        </>
    )

}


