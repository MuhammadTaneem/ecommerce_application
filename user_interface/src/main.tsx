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
import GoogleLogin from "./components/authentication/login.tsx";


const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path='/' element={<LayoutComponent/>}>
                <Route path='/' element={<Navigate to='/products' replace/>}/>
                <Route path='/login' element={<GoogleLogin/>}></Route>
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
            <RouterProvider router={router}/>
        </Provider>,
    </React.StrictMode>
)
