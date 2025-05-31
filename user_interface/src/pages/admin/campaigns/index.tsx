import { useState, useRef, useCallback } from 'react';
import { Search, Filter, Eye, X, Plus, Edit, Trash, Upload, Image as ImageIcon } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Campaign } from '../../../types/Campaign';

// Sample campaigns data
const sampleCampaigns = [
    {
        id: 'CAM-001',
        name: "Summer Special Flash Sale",
        description: "Get up to 50% off on selected items. Limited time offer!",
        image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg",
        startDate: new Date('2024-03-20T00:00:00'),
        endDate: new Date('2024-03-25T23:59:59'),
        is_published: true
    },
    {
        id: 'CAM-002',
        name: "Back to School Campaign",
        description: "Special discounts on school supplies and accessories",
        image: "https://example.com/back-to-school.jpg",
        startDate: new Date('2024-08-15T00:00:00'),
        endDate: new Date('2024-09-05T23:59:59'),
        is_published: false
    }
];

const CampaignsPage = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>(sampleCampaigns);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
    const [formData, setFormData] = useState<Campaign>({
        name: '',
        description: '',
        image: '',
        startDate: new Date(),
        endDate: new Date(),
        is_published: false
    });
    const [dragActive, setDragActive] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter campaigns based on search term
    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddEdit = (campaign?: Campaign) => {
        if (campaign) {
            setCurrentCampaign(campaign);
            setFormData({ ...campaign });
            setPreviewImage(campaign.image);
        } else {
            setCurrentCampaign(null);
            setFormData({
                name: '',
                description: '',
                image: '',
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 7 days later
                is_published: false
            });
            setPreviewImage(null);
        }
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        // In a real app, this would call an API
        setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    };

    const handleTogglePublish = (id: string) => {
        // In a real app, this would call an API
        setCampaigns(campaigns.map(campaign =>
            campaign.id === id ? { ...campaign, is_published: !campaign.is_published } : campaign
        ));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (field: 'startDate' | 'endDate') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        if (!isNaN(date.getTime())) {
            setFormData(prev => ({
                ...prev,
                [field]: date
            }));
        }
    };

    // File upload handlers
    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Check if file is an image
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }

        // In a real app, you would upload the file to a server here
        // For now, we'll just create a local URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setPreviewImage(result);
            setFormData(prev => ({
                ...prev,
                image: result
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setFormData(prev => ({
            ...prev,
            image: ''
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate image
        if (!formData.image) {
            alert('Please upload an image for the campaign');
            return;
        }
        
        if (currentCampaign) {
            // Update existing campaign
            setCampaigns(campaigns.map(campaign => 
                campaign.id === currentCampaign.id ? { ...formData, id: campaign.id } : campaign
            ));
        } else {
            // Add new campaign
            const newId = `CAM-${String(campaigns.length + 1).padStart(3, '0')}`;
            setCampaigns([...campaigns, { ...formData, id: newId }]);
        }
        
        setShowForm(false);
    };

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Campaigns</h1>
                <Button 
                    variant="primary"
                    className="mt-4 sm:mt-0"
                    onClick={() => handleAddEdit()}
                >
                    <Plus size={16} className="mr-2" />
                    Add Campaign
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="input pr-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setSearchTerm('')}
                        >
                            <X size={16} />
                        </button>
                    )}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={18} />
                    </div>
                </div>
            </div>

            {/* Campaigns List */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Campaign
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredCampaigns.length > 0 ? (
                                filteredCampaigns.map((campaign) => (
                                    <tr key={campaign.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img
                                                        className="h-10 w-10 rounded-lg object-cover"
                                                        src={campaign.image}
                                                        alt={campaign.name}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Campaign';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {campaign.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {campaign.description.length > 50
                                                            ? `${campaign.description.substring(0, 50)}...`
                                                            : campaign.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                campaign.is_published
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            }`}>
                                                {campaign.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleTogglePublish(campaign.id!)}
                                                >
                                                    {campaign.is_published ? 'Unpublish' : 'Publish'}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleAddEdit(campaign)}
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(campaign.id!)}
                                                >
                                                    <Trash size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No campaigns found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Campaign Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {currentCampaign ? 'Edit Campaign' : 'Add Campaign'}
                            </h2>
                            <button 
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                onClick={() => setShowForm(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Campaign Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="mt-1 input w-full"
                                    placeholder="Enter campaign name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    className="mt-1 input w-full"
                                    rows={4}
                                    placeholder="Enter campaign description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Campaign Image
                                </label>
                                
                                {/* Image upload area */}
                                <div 
                                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                                        dragActive 
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    {previewImage ? (
                                        <div className="w-full text-center">
                                            <div className="relative inline-block">
                                                <img 
                                                    src={previewImage} 
                                                    alt="Campaign preview" 
                                                    className="max-h-48 rounded-md mx-auto"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-center">
                                            <div className="flex justify-center">
                                                <ImageIcon 
                                                    className="mx-auto h-12 w-12 text-gray-400" 
                                                    strokeWidth={1}
                                                />
                                            </div>
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 focus-within:outline-none"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        ref={fileInputRef}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Start Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        className="mt-1 input w-full"
                                        value={formData.startDate.toISOString().slice(0, 16)}
                                        onChange={handleDateChange('startDate')}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        End Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        className="mt-1 input w-full"
                                        value={formData.endDate.toISOString().slice(0, 16)}
                                        onChange={handleDateChange('endDate')}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex items-center mt-4">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    name="is_published"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                                />
                                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Publish immediately
                                </label>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                >
                                    {currentCampaign ? 'Update' : 'Create'} Campaign
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignsPage; 