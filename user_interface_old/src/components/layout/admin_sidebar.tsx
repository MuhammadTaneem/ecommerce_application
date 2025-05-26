import {Link} from "react-router-dom";


export default function AdminSidebarComponent() {
    return (
        <div className="h-screen border">
            <div className="items-center justify-center h-16 ">
                <h1 className="text-xl font-bold  text-center px-4 py-2">Admin Dashboard</h1>
            </div>
            <nav className="p-4">
                <ul>
                    <li className="mb-2">
                        <Link to="/admin/products"
                              className="flex items-center p-2  rounded">
                            {/*<span className="material-icons">Products</span>*/}
                            <span className="ml-2">Products</span>
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/admin/products/add"
                              className="flex items-center p-2  rounded ">
                            {/*<span className="material-icons">Add Product</span>*/}
                            <span className="ml-2">Add Products</span>
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/admin/products/add"
                              className="flex items-center p-2 rounded ">
                            {/*<span className="material-icons">Add Product</span>*/}
                            <span className="ml-2">Category</span>
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/admin/products/add"
                              className="flex items-center p-2  rounded ">
                            {/*<span className="material-icons">Add Product</span>*/}
                            <span className="ml-2">Category Add</span>
                        </Link>
                    </li>

                </ul>
            </nav>
        </div>
    );
}