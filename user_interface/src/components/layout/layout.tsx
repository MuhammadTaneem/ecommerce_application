import { useState} from "react";
import NavbarComponent from "./navbar.tsx";
import { Outlet } from "react-router-dom";
import FooterComponent from "./footer.tsx";
import SidebarComponent from "./sidebar.tsx";
import { useMediaQuery } from "react-responsive";
const isAuthenticated = true;


export interface NavbarComponentProps {
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
    isLargeScreen: boolean;
}


export default function LayoutComponent() {
    const isLargeScreen = useMediaQuery({ query: "(min-width: 1200px)" });
    const [isSidebarOpen, setIsSidebarOpen] = useState(isLargeScreen); // State to manage sidebar visibility

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };



    return (
        <>
            {isAuthenticated ? <NavbarComponent  onToggleSidebar={toggleSidebar}
                                                 isSidebarOpen={isSidebarOpen}
                                                 isLargeScreen={isLargeScreen}
            /> : <h2>Please log in.</h2>}
            <div className="main-container flex">
                {isSidebarOpen && <SidebarComponent  isLargeScreen={isLargeScreen} />}
                < Outlet />
            </div>
            <FooterComponent />
        </>
    );
}