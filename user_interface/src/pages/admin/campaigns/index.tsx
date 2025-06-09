import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Eye } from 'lucide-react';
import { toast } from '../../../hooks/use-toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { CampaignType } from '../../../types';
import campaignService from '../../../services/campaignService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/AlertDialog';

interface FormDataType extends Omit<CampaignType, 'id'> {
  image_1_file?: File | null;
  image_2_file?: File | null;
  image_3_file?: File | null;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
        name: '',
        description: '',
    image_1: '',
    image_2: '',
    image_3: '',
    image_1_file: null,
    image_2_file: null,
    image_3_file: null,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
        is_published: false
    });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await campaignService.getCampaigns();
      setCampaigns(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setCampaigns([]);
      setError('Failed to fetch campaigns');
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_1_file' | 'image_2_file' | 'image_3_file') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Store the file object
        setFormData(prev => ({
            ...prev,
        [field]: file,
        // Also store preview
        [field.replace('_file', '')]: URL.createObjectURL(file)
            }));
        }
    };

  const formatDateForInput = (dateString: string | Date | undefined): string => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date().toISOString().split('T')[0] : date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  const handleDateChange = (date: string, field: 'startDate' | 'endDate') => {
    setFormData(prev => ({
      ...prev,
      [field]: new Date(date).toISOString()
    }));
  };

  const handleEdit = (campaign: CampaignType) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      image_1: campaign.image_1,
      image_2: campaign.image_2,
      image_3: campaign.image_3,
      image_1_file: null,
      image_2_file: null,
      image_3_file: null,
      startDate: campaign.startDate || new Date().toISOString(),
      endDate: campaign.endDate || new Date().toISOString(),
      is_published: campaign.is_published
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("submitFormData");
        e.preventDefault();
    try {
      const submitFormData = new FormData();

      // Basic form fields
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      
      // Format dates properly
      submitFormData.append('start_date', formData.startDate);
      submitFormData.append('end_date', formData.endDate);
      submitFormData.append('is_published', String(formData.is_published));

      // Handle file uploads
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input: Element) => {
        const fileInput = input as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
          const fieldName = fileInput.getAttribute('name');
          if (fieldName) {
            submitFormData.append(fieldName, fileInput.files[0]);
        }
        }
      });


      // If editing and no new files are selected, append existing image URLs
      if (selectedCampaign) {
        if (!submitFormData.has('image_1') && selectedCampaign.image_1) {
          submitFormData.append('image_1', selectedCampaign.image_1);
        }
        if (!submitFormData.has('image_2') && selectedCampaign.image_2) {
          submitFormData.append('image_2', selectedCampaign.image_2);
        }
        if (!submitFormData.has('image_3') && selectedCampaign.image_3) {
          submitFormData.append('image_3', selectedCampaign.image_3);
        }
      }

      if (selectedCampaign) {
        await campaignService.updateCampaign(selectedCampaign.id, submitFormData);
        toast({
          title: "Success",
          description: "Campaign updated successfully",
        });
      } else {
        await campaignService.createCampaign(submitFormData);
        toast({
          title: "Success",
          description: "Campaign created successfully",
        });
      }

      setIsModalOpen(false);
      setSelectedCampaign(null);
      setFormData({
        name: '',
        description: '',
        image_1: '',
        image_2: '',
        image_3: '',
        image_1_file: null,
        image_2_file: null,
        image_3_file: null,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        is_published: false
      });
      fetchCampaigns();
    } catch (err) {
      console.error('Error saving campaign:', err);
      toast({
        title: "Error",
        description: "Failed to save campaign",
        variant: "destructive",
      });
    }
    };

  const handleDelete = async (id: number) => {
    setCampaignToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    
    try {
      await campaignService.deleteCampaign(campaignToDelete);
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
      fetchCampaigns();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const openModal = (campaign?: CampaignType) => {
    if (campaign) {
      setSelectedCampaign(campaign);
      setFormData({
        name: campaign.name,
        description: campaign.description,
        image_1: campaign.image_1,
        image_2: campaign.image_2,
        image_3: campaign.image_3,
        image_1_file: null,
        image_2_file: null,
        image_3_file: null,
        startDate: campaign.startDate || new Date().toISOString(),
        endDate: campaign.endDate || new Date().toISOString(),
        is_published: campaign.is_published
      });
        } else {
      setSelectedCampaign(null);
      setFormData({
        name: '',
        description: '',
        image_1: '',
        image_2: '',
        image_3: '',
        image_1_file: null,
        image_2_file: null,
        image_3_file: null,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        is_published: false
      });
    }
    setIsModalOpen(true);
  };

  const openViewModal = async (id: number) => {
    try {
      const campaign = await campaignService.getCampaignById(id);
      setSelectedCampaign(campaign);
      setIsViewModalOpen(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch campaign details",
        variant: "destructive",
      });
        }
  };

  if (isLoading) return <div className="p-4 text-gray-700 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create and manage your promotional campaigns
          </p>
        </div>
                <Button 
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm"
                    variant="primary"
                >
          <Plus className="h-4 w-4" />
                    Add Campaign
                </Button>
            </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Period
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                        {campaign.image_1 && (
                                                    <img
                            src={campaign.image_1} 
                            alt="" 
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                                                    />
                        )}
                        <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {campaign.name}
                                                    </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {campaign.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                                                campaign.is_published
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
                                            }`}>
                                                {campaign.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => openViewModal(campaign.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(campaign)}
                          className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                          title="Edit campaign"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(campaign.id)}
                          className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                          title="Delete campaign"
                                                >
                          <Trash2 className="h-4 w-4" />
                        </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {isLoading ? 'Loading campaigns...' : 'No campaigns found'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form id="campaignForm" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="overflow-y-auto flex-1 p-6">
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Campaign Name
                                </label>
                      <Input
                                    type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter campaign name"
                        className="w-full"
                                    required
                                />
                            </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter campaign description"
                        className="w-full px-4 py-2 min-h-[120px] resize-y rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                                </label>
                      <Input
                        type="date"
                        value={formatDateForInput(formData.startDate)}
                        onChange={(e) => handleDateChange(e.target.value, 'startDate')}
                        className="w-full"
                        required
                      />
                                            </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <Input
                        type="date"
                        value={formatDateForInput(formData.endDate)}
                        onChange={(e) => handleDateChange(e.target.value, 'endDate')}
                        className="w-full"
                        required
                                                />
                                            </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Campaign Images
                      </label>
                      <div className="grid gap-6 md:grid-cols-3">
                        {[1, 2, 3].map((num) => (
                          <div key={num}>
                            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                              <Input
                                                        type="file"
                                name={`image_${num}`}
                                onChange={(e) => handleImageChange(e, `image_${num}_file` as any)}
                                                        accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div className="text-center">
                                {formData[`image_${num}` as keyof typeof formData] ? (
                                  <img 
                                    src={formData[`image_${num}` as keyof typeof formData] as string} 
                                    alt={`Preview ${num}`} 
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex justify-center">
                                      <Plus className="h-8 w-8" />
                                            </div>
                                    <p>Upload Image {num}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                                </div>
                        ))}
                                </div>
                            </div>

                    <div className="col-span-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_published}
                          onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                                />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Publish campaign</span>
                                </label>
                            </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {selectedCampaign ? 'Update Campaign' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Campaign Details
              </h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedCampaign.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">{selectedCampaign.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Images</h3>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {selectedCampaign.image_1 && (
                    <img src={selectedCampaign.image_1} alt="Campaign 1" className="h-32 w-full object-cover rounded" />
                  )}
                  {selectedCampaign.image_2 && (
                    <img src={selectedCampaign.image_2} alt="Campaign 2" className="h-32 w-full object-cover rounded" />
                  )}
                  {selectedCampaign.image_3 && (
                    <img src={selectedCampaign.image_3} alt="Campaign 3" className="h-32 w-full object-cover rounded" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Period</h3>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {new Date(selectedCampaign.startDate).toLocaleDateString()} - {new Date(selectedCampaign.endDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <p className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedCampaign.is_published
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                  }`}>
                    {selectedCampaign.is_published ? 'Published' : 'Draft'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setCampaignToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </div>
    );
} 