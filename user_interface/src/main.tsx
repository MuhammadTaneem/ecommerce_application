import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter, createRoutesFromElements, Navigate, Route,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import LayoutComponent from "./components/layout/layout.tsx";
import HomepageComponent from "./components/Homepage/homepage.tsx";
import AboutComponent from "./components/About/about.tsx";
import {Provider} from 'react-redux'
import {store} from "./core/store.ts";
// import SidebarComponent from "./components/layout/sidebar.tsx";
import ProductListComponent from "./components/product/products.tsx";
import ProductDetailsComponent from "./components/product/product_details.tsx";
import LoginComponent from "./components/authentication/login.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {google_client_id} from "./utilites/api.ts";
import AdminProductComponent from "./components/admin_panel/products.tsx";
import AdminAddProductComponent from "./components/admin_panel/add_product.tsx";


const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path='/' element={<LayoutComponent/>}>
                <Route path='/' element={<Navigate to='/products' replace/>}/>
                <Route path='/login' element={<LoginComponent/>}></Route>
                <Route path='/admin/products' element={<AdminProductComponent/>}></Route>
                <Route path='/admin/products/add' element={<AdminAddProductComponent/>}></Route>
                <Route path='/home' element={<HomepageComponent/>}></Route>
                <Route path='/products/:fragment?' element={<ProductListComponent/>}></Route>
                <Route path='/product/:id' element={<ProductDetailsComponent/>}></Route>
                <Route path='/about' element={<AboutComponent/>}></Route>
            </Route>
            {/*<Route path="/admin" element={<SidebarComponent/>}>*/}
            {/*    <Route path="/admin/dashboard" element={<HomepageComponent/>}/>*/}
            {/*    /!*<Route path="/admin/users" element={<AdminUsersComponent />} />*!/*/}
            {/*</Route>*/}

        </>
    )
)
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <GoogleOAuthProvider  clientId={google_client_id()}> <RouterProvider router={router}/></GoogleOAuthProvider>;
        </Provider>,
    </React.StrictMode>
)




