// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Filter, Edit, Trash2, Eye, X } from 'lucide-react';
// import {
//   Button,
//   Input,
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '../../../components/ui';
// import DataTable from '../../../components/ui-components/DataTable.tsx';
// import { getAdminProducts } from '../../../services/productService';
// import { ProductType } from '../../../types';

// const ProductsPage = () => {
//   const [products, setProducts] = useState<ProductType[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const columns = [
//     {
//       id: 'product',
//       header: 'PRODUCT',
//       cell: (product: ProductType) => (
//         <div className="flex items-center">
//           <img
//             src={product.images[0].image}
//             alt={product.name}
//             className="h-10 w-10 rounded-full object-cover"
//           />
//           <div className="ml-4">
//             <div className="font-medium">{product.name}</div>
//             <div className="text-sm text-muted-foreground">
//               {product.short_description}
//             </div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       id: 'price',
//       header: 'BASE PRICE',
//       cell: (product: ProductType) => (
//         <div>
//           ${product.base_price}
//           {product.discount_price && (
//             <span className="ml-2 text-green-600 dark:text-green-400">
//               ${product.discount_price}
//             </span>
//           )}
//         </div>
//       ),
//     },
//     {
//       id: 'stock',
//       header: 'STOCK',
//       cell: (product: ProductType) => product.stock_quantity,
//     },
//     {
//       id: 'brand',
//       header: 'BRAND',
//       cell: (product: ProductType) => product.brand || 'N/A',
//     },
//     {
//       id: 'rating',
//       header: 'RATING',
//       cell: (product: ProductType) => (
//         <span>⭐ {product.average_rating.toFixed(1)} ({product.rating_count})</span>
//       ),
//     },
//     {
//       id: 'actions',
//       header: 'Actions',
//       cell: (product: ProductType) => (
//         <div className="flex items-center justify-end space-x-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => console.log('Edit:', product.id)}
//           >
//             <Edit className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => handleDeleteProduct(product)}
//             className="text-destructive hover:text-destructive/90"
//           >
//             <Trash2 className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon">
//             <Eye className="h-4 w-4" />
//           </Button>
//         </div>
//       ),
//       className: 'w-[150px]',
//     },
//   ];

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getAdminProducts();
//         setProducts(data);
//       } catch (error) {
//         console.error('Failed to fetch products:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleDeleteProduct = (product: ProductType) => {
//     setCurrentProduct(product);
//     setShowDeleteConfirm(true);
//   };

//   const confirmDelete = () => {
//     if (!currentProduct) return;
//     setProducts(products.filter(p => p.id !== currentProduct.id));
//     setShowDeleteConfirm(false);
//     setCurrentProduct(null);
//   };

//   return (
//     <div className="p-6">
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight">Products Management</h1>
//           <p className="text-sm text-muted-foreground mt-1">Manage your product catalog and inventory</p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-lg border">
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
//                 <Input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
//                   className="w-[300px] pl-9"
//                 />
//                 {searchTerm && (
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
//                     onClick={() => setSearchTerm('')}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 )}
//               </div>
//               <div className="flex gap-2">
//                 <Button variant="outline">
//                   <Filter className="h-4 w-4 mr-2" />
//                   Filters
//                 </Button>
//                 <Button>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Product
//                 </Button>
//               </div>
//             </div>

//             <DataTable
//               columns={columns}
//               data={products}
//               loading={isLoading}
//               emptyMessage="No products found"
//             />
//           </div>
//         </div>
//       </div>

//       <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the product
//               and remove it from our servers.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmDelete}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default ProductsPage; 