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

type Step = 'basic' | 'skus' | 'tags' | 'image';

const steps: { id: Step; name: string }[] = [
    {id: 'basic', name: 'Basic Info'},
    {id: 'skus', name: 'SKUs'},
    {id: 'tags', name: 'Tags'},
    {id: 'image', name: 'Image'},
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
    const [skus, setSkus] = useState<any[]>([]);
    const [activeSkuIndex, setActiveSkuIndex] = useState(0);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [tagsSaved, setTagsSaved] = useState(false);

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
                setSkus(product.skus && Array.isArray(product.skus)
                    ? product.skus.map((sku: any) => ({
                        ...sku,
                        variants: sku.variants_dict
                            ? Object.entries(sku.variants_dict).map(([key, value]) => ({ [key]: value }))
                            : [],
                    }))
                    : []
                );
                setSelectedTags(product.tags ? product.tags.map((t: any) => t.id) : []);
            }).finally(() => setLoading(false));
        }
        // eslint-disable-next-line
    }, [editMode, id]);

    // Helper: get all variant keys used in all SKUs
    const getAllVariantKeys = (): string[] => {
        const allKeys: string[] = skus.flatMap((sku) =>
            sku.variants ? sku.variants.map((v: any) => Object.keys(v)[0]) : []
        );
        return Array.from(new Set(allKeys));
    };

    // Helper: validate all SKUs have the same variant keys and at least one variant
    const validateSkus = () => {
        if (skus.length === 0) return true;
        const allKeys = getAllVariantKeys();
        if (allKeys.length === 0) return false;
        return skus.every(sku => {
            const skuKeys: string[] = sku.variants ? sku.variants.map((v: any) => Object.keys(v)[0]) : [];
            return skuKeys.length === allKeys.length && allKeys.every(key => skuKeys.includes(key));
        });
    };

    // Handler: Add new SKU
    const handleAddSku = () => {
        setSkus(prev => [...prev, { price: '', discount_price: '', stock_quantity: '', variants: [] }]);
        setActiveSkuIndex(skus.length);
    };

    // Handler: Remove SKU
    const handleRemoveSku = async (index: number) => {
        const sku = skus[index];
        if (sku && sku.id && productId) {
            try {
                await productService.deleteProductSkus(productId, sku.id);
                setSkus(prev => prev.filter((_, i) => i !== index));
                setActiveSkuIndex(0);
                toast({ title: 'SKU deleted' });
            } catch (err: any) {
                toast({ title: 'Error', description: err?.message || 'Failed to delete SKU', variant: 'destructive' });
            }
        } else {
            setSkus(prev => prev.filter((_, i) => i !== index));
            setActiveSkuIndex(0);
        }
    };

    // Handler: Update SKU field
    const handleSkuFieldChange = (field: string, value: any) => {
        setSkus(prev => prev.map((sku, idx) => idx === activeSkuIndex ? { ...sku, [field]: value } : sku));
    };

    // New: Update SKU variant (type and value)
    const handleSkuVariantTypeChange = (index: number, newTypeId: string) => {
        setSkus(prev => prev.map((sku, idx) => {
            if (idx !== activeSkuIndex) return sku;
            let variants = [...(sku.variants || [])];
            // If changing an existing type, update the key
            if (variants[index]) {
                variants[index] = { [newTypeId]: '' };
            } else {
                variants.push({ [newTypeId]: '' });
            }
            // Remove duplicate types
            const seen = new Set();
            variants = variants.filter(v => {
                const key = Object.keys(v)[0];
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
            return { ...sku, variants };
        }));
    };

    const handleSkuVariantValueChange = (index: number, valueId: string) => {
        setSkus(prev => prev.map((sku, idx) => {
            if (idx !== activeSkuIndex) return sku;
            let variants = [...(sku.variants || [])];
            const key = Object.keys(variants[index])[0];
            variants[index] = { [key]: valueId };
            return { ...sku, variants };
        }));
    };

    // Remove a variant row
    const handleRemoveVariant = (index: number) => {
        setSkus(prev => prev.map((sku, idx) => {
            if (idx !== activeSkuIndex) return sku;
            let variants = [...(sku.variants || [])];
            variants.splice(index, 1);
            return { ...sku, variants };
        }));
    };

    // Validate only the current SKU for Save SKU button
    const validateCurrentSku = () => {
        const sku = skus[activeSkuIndex];
        if (!sku) return false;
        // Must have at least one variant
        if (!sku.variants || sku.variants.length === 0) return false;
        // All variant types must be selected and unique
        const keys = sku.variants.map((v: any) => Object.keys(v)[0]);
        if (keys.length !== new Set(keys).size) return false;
        if (keys.some((k: string) => !k)) return false;
        // All values must be selected
        if (sku.variants.some((v: any) => !v[Object.keys(v)[0]])) return false;
        // Price and stock_quantity must be filled
        if (!sku.price || !sku.stock_quantity) return false;
        return true;
    };

    // Handler: Save SKU (add or update)
    const handleSaveSku = async () => {
        const sku = skus[activeSkuIndex];
        if (!productId) return;
        try {
            if (sku.id) {
                await productService.updateProductSkus(productId, sku.id, sku);
                toast({ title: 'SKU updated' });
            } else {
                const res = await productService.addProductSkus(productId, sku);
                setSkus(prev => prev.map((s, idx) => idx === activeSkuIndex ? { ...s, id: res.id ?? res.sku_id ?? res.skuId } : s));
                toast({ title: 'SKU created' });
            }
        } catch (err: any) {
            toast({ title: 'Error', description: err?.message || 'Failed', variant: 'destructive' });
        }
    };

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

    // Tabbed UI
    const renderTabs = () => (
        <div className="flex border-b mb-6">
            {steps.map((s) => (
                    <button
                    key={s.id}
                    className={`px-6 py-2 -mb-px border-b-2 font-medium transition-colors duration-200 focus:outline-none ${
                        step === s.id
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-500'
                    }`}
                    disabled={s.id !== 'basic' && !productId}
                    onClick={() => (s.id === 'basic' || productId) ? setStep(s.id) : null}
                    >
                        {s.name}
                    </button>
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

    // Step 2: SKUs
    const renderSKUs = () => {
        const sku = skus[activeSkuIndex] || { price: '', discount_price: '', stock_quantity: '', variants: [] };
        // Theme classes
        const tabActive = 'bg-blue-500 text-white';
        const tabInactive = 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300 text-gray-500';
        const cardBg = 'bg-white dark:bg-gray-800';
        const border = 'border border-gray-200 dark:border-gray-700';
        return (
            <div>
                <div className="flex gap-2 mb-4">
                    {skus.map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-4 py-2 rounded ${activeSkuIndex === idx ? tabActive : tabInactive}`}
                            onClick={() => setActiveSkuIndex(idx)}
                        >
                            SKU {idx + 1}
                        </button>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={handleAddSku} className="ml-2">+ Add SKU</Button>
                </div>
                {skus.length > 0 && (
                    <div className={`${cardBg} ${border} p-4 rounded-lg mb-4`}>
                        <div className="flex justify-between mb-2">
                            <div className="font-semibold">SKU #{activeSkuIndex + 1}</div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveSku(activeSkuIndex)} className="text-red-500">Remove</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium mb-1">Price</label>
                                <input type="number" value={sku.price} onChange={e => handleSkuFieldChange('price', e.target.value)} className={`w-full px-3 py-2 border rounded-md ${border} ${cardBg}`} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Discount Price</label>
                                <input type="number" value={sku.discount_price} onChange={e => handleSkuFieldChange('discount_price', e.target.value)} className={`w-full px-3 py-2 border rounded-md ${border} ${cardBg}`} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Stock Quantity</label>
                                <input type="number" value={sku.stock_quantity} onChange={e => handleSkuFieldChange('stock_quantity', e.target.value)} className={`w-full px-3 py-2 border rounded-md ${border} ${cardBg}`} />
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="font-semibold mb-2">Variants</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(() => {
                                    const variantsArr = sku.variants && sku.variants.length > 0 ? sku.variants : [{}];
                                    return variantsArr.map((variantObj: any, idx: number) => {
                                        const variantKey = Object.keys(variantObj)[0] || '';
                                        const variantValue = variantObj[variantKey] || '';
                                        // Get available types for this row (exclude already used except current)
                                        const usedTypes = (sku.variants || []).map((v: any, i: number) => i !== idx ? Object.keys(v)[0] : null).filter(Boolean);
                                        const availableTypes = contextData?.variants?.filter((v: any) => !usedTypes.includes(v.id.toString())) || [];
                                        const selectedType = contextData?.variants?.find((v: any) => v.id.toString() === variantKey);
                                        return (
                                            <div key={idx} className="flex gap-2 items-end">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium mb-1">Variant Type</label>
                                                    <select
                                                        value={variantKey}
                                                        onChange={e => handleSkuVariantTypeChange(idx, e.target.value)}
                                                        className={`w-full px-3 py-2 border rounded-md ${border} ${cardBg}`}
                                                    >
                                                        <option value="">Select Variant Type</option>
                                                        {availableTypes.map((variant: any) => (
                                                            <option key={variant.id} value={variant.id}>{variant.name}</option>
                                                        ))}
                                                        {selectedType && !availableTypes.some((v: any) => v.id === selectedType.id) && (
                                                            <option value={selectedType.id}>{selectedType.name}</option>
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium mb-1">Value</label>
                                                    <select
                                                        value={variantValue}
                                                        onChange={e => handleSkuVariantValueChange(idx, e.target.value)}
                                                        className={`w-full px-3 py-2 border rounded-md ${border} ${cardBg}`}
                                                        disabled={!variantKey}
                                                    >
                                                        <option value="">Select Value</option>
                                                        {selectedType?.values.map((val: any) => (
                                                            <option key={val.id} value={val.id}>{val.value}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {sku.variants && sku.variants.length > 1 && (
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveVariant(idx)} className="text-red-500">Remove</Button>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
                                {/* Always show one empty variant selector for adding new */}
                                {sku.variants && contextData?.variants && sku.variants.length < contextData.variants.length && (
                                    <div key="new-variant" className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium mb-1">Variant Type</label>
                                            <select
                                                value=""
                                                onChange={e => {
                                                    const variantId = e.target.value;
                                                    if (!variantId) return;
                                                    handleSkuVariantTypeChange(sku.variants.length, variantId);
                                                }}
                                                className={`w-full px-3 py-2 border rounded-md ${border} ${cardBg}`}
                                            >
                                                <option value="">Select Variant Type</option>
                                                {contextData.variants.filter((v: any) =>
                                                    !(sku.variants || []).some((variantObj: any) => Object.keys(variantObj)[0] === v.id.toString())
                                                ).map((variant: any) => (
                                                    <option key={variant.id} value={variant.id}>{variant.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" onClick={handleSaveSku} disabled={!validateCurrentSku()}>Save SKU</Button>
                        </div>
                    </div>
                )}
                <div className="flex justify-between mt-6">
                    <Button onClick={() => setStep('basic')}>Back</Button>
                    <Button onClick={() => setStep('tags')} disabled={!validateSkus()}>Next: Tags</Button>
                </div>
            </div>
        );
    };

    // Step 3: Tags
    const renderTags = () => {
        const tagList = contextData?.tags || [];
        return (
            <div>
                <h2 className="text-lg font-semibold mb-4">Select Tags</h2>
                <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">Selected: {selectedTags.length}</div>
                <div className="flex flex-wrap gap-2 mb-6">
                    {tagList.map((tag: any) => {
                        const selected = selectedTags.includes(tag.id);
                        return (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => handleTagToggle(tag.id)}
                                className={`px-4 py-2 rounded border transition-colors duration-150 focus:outline-none text-sm
                                    ${selected
                                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300'}
                                `}
                                aria-pressed={selected}
                            >
                                {tag.name}
                            </button>
                        );
                    })}
                </div>
                <div className="flex gap-2 items-center justify-between">
                    <Button onClick={() => setStep('skus')}>Back</Button>
                    <div className="flex gap-2">
                        <Button onClick={handleSaveTags} disabled={selectedTags.length === 0 || tagsSaved}>Save Tags</Button>
                        <Button variant="outline" onClick={() => setStep('image')}>Skip</Button>
                    </div>
                </div>
            </div>
        );
    };

    // Step 4: Blank Image
    const renderImage = () => (
        <div>
            <h2>Image Step (Coming Soon)</h2>
            <Button onClick={() => setStep('tags')}>Back</Button>
        </div>
    );

    // Handler for tag selection
    const handleTagToggle = (tagId: number) => {
        setSelectedTags(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]);
        setTagsSaved(false);
    };

    // Handler for saving tags
    const handleSaveTags = async () => {
        if (!productId) return;
        try {
            await productService.addProductTags(productId, { tag_ids: selectedTags });
            setTagsSaved(true);
            toast({ title: 'Tags saved' });
            setStep('image');
        } catch (err: any) {
            toast({ title: 'Error', description: err?.message || 'Failed to save tags', variant: 'destructive' });
        }
    };

    return (
        <div className={adminStyles.pageContainer}>
            <div className={adminStyles.headerContainer}>
                <h1 className={adminStyles.headerTitle}>{editMode ? 'Edit Product' : 'Add Product'}</h1>
            </div>
            <div className={adminStyles.mainContainer}>
                {renderTabs()}
                <div className={adminStyles.contentContainer}>
                    {loading ? (
                        <div>Loading...</div>
                    ) : step === 'basic' ? (
                        renderBasicForm()
                    ) : step === 'skus' ? (
                        renderSKUs()
                    ) : step === 'tags' ? (
                        renderTags()
                    ) : step === 'image' ? (
                        renderImage()
                    ) : null}
                </div>
            </div>
        </div>
    );
} 