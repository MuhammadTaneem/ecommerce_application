import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Plus, X} from 'lucide-react';
import {z} from 'zod';
import Button from '../../../components/ui/Button';
import {useToast} from '../../../hooks/use-toast';
import {adminStyles} from '../../../styles/admin';
import {useTheme} from '../../../hooks/useTheme';
import {fetchContextData} from '../../../store/slices/contextSlice';
import {RootState} from '../../../store';
import productService from '../../../services/productService';

type Step = 'basic' | 'skus';

const steps: { id: Step; name: string }[] = [
    {id: 'basic', name: 'Basic Info'},
    {id: 'skus', name: 'SKUs'},
];

// Zod Schema for Key-Value Pair
const KeyValuePairSchema = z.object({
    key: z.string(),
    value: z.string(),
});

// Zod Schema for Product Form
const ProductFormSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    base_price: z.string().min(1, 'Base price is required').refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
        'Base price must be greater than 0'
    ),
    stock_quantity: z.number().nullable().refine(
        (val) => val !== null && val >= 0,
        'Stock quantity is required and must be 0 or greater'
    ).default(null),
    has_variants: z.boolean(),
    short_description: z.string().optional(),
    discount_price: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    brand: z.string().optional(),
    key_features: z.array(KeyValuePairSchema).refine(
        (pairs) => {
            return pairs.every(pair => 
                (pair.key.trim() === '' && pair.value.trim() === '') || 
                (pair.key.trim() !== '' && pair.value.trim() !== '')
            );
        },
        {
            message: 'Both key and value must be provided together',
            path: ['key_features']
        }
    ),
    description: z.array(KeyValuePairSchema).refine(
        (pairs) => {
            return pairs.every(pair => 
                (pair.key.trim() === '' && pair.value.trim() === '') || 
                (pair.key.trim() !== '' && pair.value.trim() !== '')
            );
        },
        {
            message: 'Both key and value must be provided together',
            path: ['description']
        }
    ),
    additional_info: z.array(KeyValuePairSchema).refine(
        (pairs) => {
            return pairs.every(pair => 
                (pair.key.trim() === '' && pair.value.trim() === '') || 
                (pair.key.trim() !== '' && pair.value.trim() !== '')
            );
        },
        {
            message: 'Both key and value must be provided together',
            path: ['additional_info']
        }
    ),
});

type ProductFormData = z.infer<typeof ProductFormSchema>;

const initialForm: ProductFormData = {
    name: '',
    base_price: '',
    stock_quantity: null,
    has_variants: true,
    short_description: '',
    discount_price: '',
    category: '',
    key_features: [{key: '', value: ''}],
    description: [{key: '', value: ''}],
    additional_info: [{key: '', value: ''}],
    brand: '',
};

// Custom Hook for Form Validation
const useFormValidation = (initialData: ProductFormData) => {
    const [formData, setFormData] = useState<ProductFormData>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isValid, setIsValid] = useState(false);

    const validateForm = () => {
        try {
            ProductFormSchema.parse(formData);
            setErrors({});
            setIsValid(true);
            return true;
        } catch (error) {
            console.log(error);
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    newErrors[path] = err.message;
                });
                
                setErrors(newErrors);
                setIsValid(false);
            }
            return false;
        }
    };

    const updateField = (field: keyof ProductFormData, value: any) => {
        setFormData(prev => ({...prev, [field]: value}));
        
        // Clear error for this field
        if (errors[field as string]) {
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const updateKeyValueField = (field: 'key_features' | 'description' | 'additional_info', data: Array<{key: string, value: string}>) => {
        setFormData(prev => ({...prev, [field]: data}));
        
        // Clear errors for this field
        const fieldErrors = Object.keys(errors).filter(key => key.startsWith(field));
        if (fieldErrors.length > 0) {
            const newErrors = {...errors};
            fieldErrors.forEach(key => delete newErrors[key]);
            setErrors(newErrors);
        }
    };

    const getFieldError = (field: string) => {
        return errors[field] || '';
    };

    const getKeyValueFieldError = (field: string, index: number) => {
        return errors[`${field}.${index}`] || errors[field] || '';
    };

    return {
        formData,
        errors,
        isValid,
        validateForm,
        updateField,
        updateKeyValueField,
        getFieldError,
        getKeyValueFieldError,
        setFormData,
    };
};

// Key-Value Pair Component
const KeyValuePairs = ({ 
    data, 
    onChange, 
    title,
    errors,
    fieldName,
    getFieldError
}: { 
    data: Array<{ key: string, value: string }>;
    onChange: (data: Array<{ key: string, value: string }>) => void; 
    title: string;
    errors: Record<string, string>;
    fieldName: string;
    getFieldError: (field: string, index: number) => string;
}) => {
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');

    const addPair = () => {
        if (newKey.trim() && newValue.trim()) {
            const updatedData = [...data, {key: '', value: ''}];
            onChange(updatedData);
            setNewKey('');
            setNewValue('');
        }
    };

    const removePair = (index: number) => {
        const updatedData = data.filter((_, i) => i !== index);
        onChange(updatedData);
    };

    const updatePair = (index: number, field: 'key' | 'value', value: string) => {
        const updatedData = [...data];
        updatedData[index] = {...updatedData[index], [field]: value.trim()};
        onChange(updatedData);
    };

    // const handleKeyPress = (e: React.KeyboardEvent) => {
    //     if (e.key === 'Enter') {
    //         e.preventDefault();
    //         addPair();
    //     }
    // };

    const addEmptyPair = () => {
        const updatedData = [...data, {key: '', value: ''}];
        onChange(updatedData);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEmptyPair}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400"
                >
                    <Plus className="h-4 w-4"/>
                    Add {title}
                </Button>
            </div>
            
            {/* Existing pairs */}
            {data.map((pair, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Key</label>
                                <input
                                    type="text"
                                    value={pair.key}
                                    onChange={(e) => updatePair(index, 'key', e.target.value)}
                                    placeholder="Enter key"
                                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        getFieldError(fieldName, index)
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Value</label>
                                <input
                                    type="text"
                                    value={pair.value}
                                    onChange={(e) => updatePair(index, 'value', e.target.value)}
                                    placeholder="Enter value"
                                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        getFieldError(fieldName, index)
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                />
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePair(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                    {getFieldError(fieldName, index) && (
                        <p className="text-sm text-red-600 dark:text-red-400 px-4">{getFieldError(fieldName, index)}</p>
                    )}
                </div>
            ))}


            {/* Empty state */}
            {data.length === 0 && !newKey && !newValue && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No {title.toLowerCase()} added yet</p>
                    <p className="text-xs mt-1">Click "Add {title}" to get started</p>
                </div>
            )}
        </div>
    );
};

export default function ProductFormPage() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(!!id);
    const [step, setStep] = useState<Step>('basic');
    const [productId, setProductId] = useState<number | null>(id ? Number(id) : null);
    const [loading, setLoading] = useState(false);
    const {toast} = useToast();
    const {isDark} = useTheme();
    const dispatch = useDispatch();
    const contextData = useSelector((state: RootState) => state.context.contextData);

    const {
        formData: form,
        errors,
        validateForm,
        updateField,
        updateKeyValueField,
        getFieldError,
        getKeyValueFieldError,
        setFormData,
    } = useFormValidation(initialForm);

    useEffect(() => {
        if (!contextData) dispatch(fetchContextData() as any);
    }, [contextData, dispatch]);

    useEffect(() => {
        if (id) {
            setEditMode(true);
        } else {
            setEditMode(false);
        }
    }, [id]);

    useEffect(() => {
        if (editMode && id) {
            setLoading(true);
            productService.getAdminProductById(Number(id)).then(product => {
                setFormData({
                    ...initialForm,
                    ...product,
                    category: product.category ? String(product.category) : '',
                    brand: product.brand ? String(product.brand) : '',
                    discount_price: product.discount_price ? String(product.discount_price) : '',
                    key_features: Array.isArray(product.key_features)
                        ? product.key_features.map((item: any) =>
                            typeof item === 'object' && item !== null && 'key' in item && 'value' in item
                                ? item
                                : { key: String(item), value: '' }
                        )
                        : (product.key_features && typeof product.key_features === 'object'
                            ? Object.entries(product.key_features).map(([key, value]) => ({ key, value: String(value) }))
                            : [{ key: '', value: '' }]),
                    description: Array.isArray(product.description)
                        ? product.description.map((item: any) =>
                            typeof item === 'object' && item !== null && 'key' in item && 'value' in item
                                ? item
                                : { key: String(item), value: '' }
                        )
                        : (product.description && typeof product.description === 'object'
                            ? Object.entries(product.description).map(([key, value]) => ({ key, value: String(value) }))
                            : [{ key: '', value: '' }]),
                    additional_info: Array.isArray(product.additional_info)
                        ? product.additional_info.map((item: any) =>
                            typeof item === 'object' && item !== null && 'key' in item && 'value' in item
                                ? item
                                : { key: String(item), value: '' }
                        )
                        : (product.additional_info && typeof product.additional_info === 'object'
                            ? Object.entries(product.additional_info).map(([key, value]) => ({ key, value: String(value) }))
                            : [{ key: '', value: '' }]),
                });
                setProductId(product.id);
            }).finally(() => setLoading(false));
        }
        // eslint-disable-next-line
    }, [editMode, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        
        // Handle stock_quantity as string in form, convert to number for validation
        if (name === 'stock_quantity') {
            const numValue = value === '' ? null : parseInt(value);
            updateField(name as keyof ProductFormData, numValue);
        } else {
            updateField(name as keyof ProductFormData, value);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {

            toast({ 
                title: 'Validation Error', 
                description: 'Please fix the errors before proceeding', 
                variant: 'destructive' 
            });
            return;
        }


        setLoading(true);
        try {
            // Convert form data to API format
            const apiData = {
                name: form.name,
                base_price: form.base_price,
                stock_quantity: form.stock_quantity || 0,
                has_variants: form.has_variants,
                short_description: form.short_description,
                discount_price: form.discount_price,
                category: form.category ? parseInt(form.category) : undefined,
                brand: form.brand || undefined,
                key_features: form.key_features.filter(pair => pair.key.trim() && pair.value.trim()),
                description: form.description.filter(pair => pair.key.trim() && pair.value.trim()),
                additional_info: form.additional_info.filter(pair => pair.key.trim() && pair.value.trim()),
            };
            let res;
            if (editMode && productId) {
                res = await productService.updateProduct(productId, apiData);
                toast({title: 'Product updated'});
            } else {
                res = await productService.createProduct(apiData);
                toast({title: 'Product created'});
                setProductId(res.id);
                setEditMode(true);
                navigate(`/admin/products/${res.id}/edit`);
            }
            setStep('skus');
        } catch (err: any) {
            toast({title: 'Error', description: err?.message || 'Failed', variant: 'destructive'});
        } finally {
            setLoading(false);
        }
    };

    // Stepper UI
    const renderStepper = () => (
        <div className="flex mb-6">
            {steps.map((s, idx) => (
                <div key={s.id} className="flex items-center">
                    <button
                        className={`px-4 py-2 rounded ${step === s.id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
                        disabled={s.id === 'skus' && !productId}
                        onClick={() => s.id === 'basic' || productId ? setStep(s.id) : null}
                    >
                        {s.name}
                    </button>
                    {idx < steps.length - 1 && <span className="mx-2">→</span>}
                </div>
            ))}
        </div>
    );

    // Step 1: Basic Info Form
    const renderBasicForm = () => (
        <form className="space-y-6" onSubmit={e => {
            e.preventDefault();
            handleSubmit();
        }}>
            {/* Basic product information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                    <input 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            getFieldError('name')
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600'
                        }`} 
                    />
                    {getFieldError('name') && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('name')}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Base
                        Price</label>
                    <input 
                        name="base_price" 
                        value={form.base_price} 
                        onChange={handleChange} 
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            getFieldError('base_price')
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600'
                        }`} 
                        type="number" 
                        step="0.01"
                    />
                    {getFieldError('base_price') && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('base_price')}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stock
                        Quantity</label>
                    <input 
                        name="stock_quantity" 
                        value={form.stock_quantity === null ? '' : form.stock_quantity} 
                        onChange={handleChange} 
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            getFieldError('stock_quantity')
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600'
                        }`}
                        type="number" 
                    />
                    {getFieldError('stock_quantity') && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('stock_quantity')}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discount
                        Price</label>
                    <input 
                        name="discount_price" 
                        value={form.discount_price} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        type="number" 
                        step="0.01"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select 
                        name="category" 
                        value={form.category} 
                        onChange={handleChange} 
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            getFieldError('category')
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600'
                        }`}
                    >
                        <option value="">Select Category</option>
                        {contextData?.categories?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.label || cat.name}</option>
                        ))}
                    </select>
                    {getFieldError('category') && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('category')}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand</label>
                    <select 
                        name="brand" 
                        value={form.brand} 
                        onChange={handleChange} 
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            getFieldError('brand')
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600'
                        }`}
                    >
                        <option value="">Select Brand</option>
                        {contextData?.brands?.map((brand: any) => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                    {getFieldError('brand') && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('brand')}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Short
                    Description</label>
                <textarea 
                    name="short_description" 
                    value={form.short_description} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    rows={3}
                />
            </div>

            {/* Key-Value Pair Fields */}
            <div className="space-y-8">
                <KeyValuePairs
                    data={form.key_features}
                    onChange={(data) => updateKeyValueField('key_features', data)}
                    title="Key Features"
                    errors={errors}
                    fieldName="key_features"
                    getFieldError={getKeyValueFieldError}
                />

                <KeyValuePairs
                    data={form.description}
                    onChange={(data) => updateKeyValueField('description', data)}
                    title="Description"
                    errors={errors}
                    fieldName="description"
                    getFieldError={getKeyValueFieldError}
                />

                <KeyValuePairs
                    data={form.additional_info}
                    onChange={(data) => updateKeyValueField('additional_info', data)}
                    title="Additional Information"
                    errors={errors}
                    fieldName="additional_info"
                    getFieldError={getKeyValueFieldError}
                />
            </div>

            <div className="flex justify-end pt-6">
                <Button type="submit" disabled={loading} className="px-6 py-2">
                    {loading ? 'Saving...' : (editMode ? 'Update' : 'Create')} & Next
                </Button>
            </div>
        </form>
    );

    // Step 2: Blank SKUs
    const renderSKUs = () => (
        <div>
            <h2>SKUs Step (Coming Soon)</h2>
            <Button onClick={() => setStep('basic')}>Back</Button>
        </div>
    );

    return (
        <div className={adminStyles.pageContainer}>
            <div className={adminStyles.headerContainer}>
                <h1 className={adminStyles.headerTitle}>{editMode ? 'Edit Product' : 'Add Product'}</h1>
            </div>
            <div className={adminStyles.mainContainer}>
                {renderStepper()}
                <div className={adminStyles.contentContainer}>
                    {loading ? <div>Loading...</div> : step === 'basic' ? renderBasicForm() : renderSKUs()}
                </div>
            </div>
        </div>
    );
} 