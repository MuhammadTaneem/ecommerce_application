import apiClient from '../config/api.config';
import { ContextDataType } from '../types';

class HomeService {
    getContextData = async (): Promise<ContextDataType> => {
        try {
            console.log('fetching context data');
            const response = await apiClient.get('/context');
            return response.data;
        } catch (error) {
            console.error('Error fetching context data:', error);
            throw error;
        }
    }
}


const homeService = new HomeService();
export default homeService;