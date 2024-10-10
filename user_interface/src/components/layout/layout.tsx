import NavbarComponent from "./navbar.tsx";
import {Outlet} from "react-router-dom";
import FooterComponent from "./footer.tsx";
import SidebarComponent from "./sidebar.tsx";


const isAuthenticated = true;

export default function LayoutComponent() {
    return (
        <>
            {isAuthenticated ? <NavbarComponent/> : <h2>Please log in.</h2>}
            <div className="main-container flex">
                <SidebarComponent/>
                <div className="content-area">
                    <Outlet/>
                </div>
            </div>
            <FooterComponent></FooterComponent>
        </>
    )
}