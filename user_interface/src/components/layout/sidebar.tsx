import {useEffect, useState} from "react";
import axiosInstance from "../../utilites/api.ts";
import {addCategory} from "../../features/categoriesSlice.ts";
import {useAppDispatch, useAppSelector} from "../../core/store.ts";
import {ChevronRightIcon, ChevronDownIcon, XMarkIcon, Bars3Icon} from '@heroicons/react/24/solid'
import {CategoryType} from "../../features/categories_type.ts";
import {useNavigate} from "react-router-dom";


export default function SidebarComponent({isLargeScreen }:{ isLargeScreen: boolean }) {
    const categories: CategoryType[] = useAppSelector(state => state.categories.categories)
    const [isSidebarContent, setIsSidebarContent] = useState(true);

    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/products/categories/');
                console.log(response.data);
                dispatch(addCategory(response.data));
            } catch (error) {
                console.error('There was an error!', error);
            }
        };
        fetchData();
    }, []);

    function toggleSidebarContent(){
        setIsSidebarContent(!isSidebarContent);
    }



    return (<>
        <div className="sidebar p-4  bg-gray-100 dark:bg-gray-100 w-auto">
            <div className="button-line mb-4 grid justify-items-end">
                {isLargeScreen &&<button
                    className="flex items-center justify-center w-10 h-10  text-gray-900 hover:bg-gray-600 hover:text-gray-300 rounded-full transition"
                    onClick={toggleSidebarContent}
                    aria-label={isSidebarContent ? "Close Sidebar" : "Open Sidebar"}
                >
                    {isSidebarContent ? (
                        <XMarkIcon className="w-5 h-5 "/>
                    ) : (
                        <Bars3Icon className="w-5 h-5"/>
                    )}
                </button>}
            </div>

            {isSidebarContent && (
                categories.map((category) => (
                    <CategoryDropdown key={category.id} category={category}/>
                ))
            )}
        </div>
    </>)
}


function CategoryDropdown({category}: { category: CategoryType }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const navigate = useNavigate();

    const navigateToProducts = (categorySlug: string) => {
        navigate(`/products/#${categorySlug}`);
    };

    return (


        <div>

            <div
                className="cursor-pointer flex justify-between items-center "
            >
                <span
                    className="hover:text-blue-600"
                    onClick={() => navigateToProducts(category.slug)}> {category.label}</span>
                {category.subcategories.length > 0 && (
                    <span onClick={toggleDropdown} className="pl-10 hover:text-blue-600">{isOpen ?
                        <ChevronDownIcon className='w-5 h-5'/> :
                        <ChevronRightIcon className="w-5 h-5"/>}</span>
                )}
            </div>
            {isOpen && category.subcategories.length > 0 && (
                <div className="ml-4">

                    {category.subcategories.map((subcategory: CategoryType) => (
                        <span key={subcategory.id} onClick={(e) => {
                            e.stopPropagation();
                        }}>
                            <CategoryDropdown key={subcategory.id} category={subcategory}/>
                        </span>

                    ))}
                </div>
            )}
        </div>


    );
}
