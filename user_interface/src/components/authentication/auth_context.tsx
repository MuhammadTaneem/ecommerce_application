import api from "@/utilites/api.ts"; // Import your api instance

export const fetchUserProfile = async (token: string) => {
    try {
        const response = await api.get('auth/profile/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Return the user data
    } catch (error) {
        throw new Error(error?.message || 'Failed to fetch user profile');
    }
};
