import {Link} from "react-router-dom";

export default function AdminSidebarComponent() {
    return (
        <div className="flex flex-col w-64 h-screen bg-gray-800 text-white">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <nav className="flex-1 p-4">
                <ul>
                    <li className="mb-2">
                        <Link to="/admin/products" className="flex items-center p-2 text-gray-300 rounded hover:bg-gray-700">
                            <span className="material-icons">Products</span>
                            <span className="ml-2">Products</span>
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/admin/products/add"
                              className="flex items-center p-2 text-gray-300 rounded hover:bg-gray-700">
                            <span className="material-icons">Add Product</span>
                            <span className="ml-2">Products</span>
                        </Link>
                    </li>

                </ul>
            </nav>
        </div>
    );
}