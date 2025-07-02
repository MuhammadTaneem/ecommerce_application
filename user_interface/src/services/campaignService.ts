import { CampaignType } from '../types';
import apiClient from '../config/api.config';

class CampaignService {
  private baseUrl = '/campaign/';

  async getCampaigns(): Promise<CampaignType[]> {
    try {
      const response = await apiClient.get<CampaignType[]>(this.baseUrl);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  async getDashboardCampaign(): Promise<CampaignType | null> {
    try {
      const response = await apiClient.get<CampaignType | null>(`${this.baseUrl}dashboard/`);
      // If the API returns null or a campaign object
      return response.data ? response.data : null;
    } catch (error) {
      console.error('Error fetching user campaign:', error);
      throw error;
    }
  }

  

  async getCampaignById(id: number): Promise<CampaignType> {
    try {
      const response = await apiClient.get<CampaignType>(`${this.baseUrl}${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  async createCampaign(data: FormData | Partial<CampaignType>): Promise<CampaignType> {
    try {
      const config = data instanceof FormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = await apiClient.post<CampaignType>(this.baseUrl, data, config);
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  async updateCampaign(id: number, data: FormData | Partial<CampaignType>): Promise<CampaignType> {

    console.log("updatting campain");
    console.log(data);
    try {
      const config = data instanceof FormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = await apiClient.put<CampaignType>(`${this.baseUrl}${id}/`, data, config);
      return response.data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  async deleteCampaign(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}${id}/`);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
}

const campaignService = new CampaignService();
export default campaignService;