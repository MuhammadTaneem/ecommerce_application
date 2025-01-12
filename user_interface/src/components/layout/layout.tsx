import { useState} from "react";
import NavbarComponent from "./navbar.tsx";
import { Outlet } from "react-router-dom";
import FooterComponent from "./footer.tsx";
import SidebarComponent from "./sidebar.tsx";
import { useMediaQuery } from "react-responsive";
import AdminSidebarComponent from "./admin_sidebar.tsx";
const isAuthenticated:boolean = true;
const isAdminUser:boolean = false;


export interface NavbarComponentProps {
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
    isLargeScreen: boolean;
}


export default function LayoutComponent() {
    const isLargeScreen = useMediaQuery({query: "(min-width: 1200px)"});
    const [isSidebarOpen, setIsSidebarOpen] = useState(isLargeScreen);

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };


//
//     return (
//         <>
//
//             {isAuthenticated ? <NavbarComponent  onToggleSidebar={toggleSidebar}
//                                                  isSidebarOpen={isSidebarOpen}
//                                                  isLargeScreen={isLargeScreen}
//             /> : <h2>Please log in.</h2>}
//             <div className="main-container flex">
//                 {isAdminUser && <AdminSidebarComponent></AdminSidebarComponent>}
//                 {isSidebarOpen && !isAdminUser && <SidebarComponent  onToggleSidebar={toggleSidebar}
//                                                      isSidebarOpen={isSidebarOpen}
//                                                      isLargeScreen={isLargeScreen} />}
//                 <div className="clearfix">
//
//                 < Outlet />
//                 </div>
//             </div>
//             <FooterComponent />
//         </>
//     );
// }

    return (
        <>
            {/* Navbar: Show if authenticated */}
            {isAuthenticated ? (
                <NavbarComponent
                    onToggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    isLargeScreen={isLargeScreen}
                />
            ) : (
                <h2>Please log in.</h2>
            )}

            {/* Main container */}
            <div className="main-container flex">
                {/* Admin Sidebar: Show only for admin users */}
                {isAdminUser && <AdminSidebarComponent/>}

                {/* Regular Sidebar: Show for non-admin users when sidebar is open */}
                {!isAdminUser && isSidebarOpen && (
                    <SidebarComponent
                        onToggleSidebar={toggleSidebar}
                        isSidebarOpen={isSidebarOpen}
                        isLargeScreen={isLargeScreen}
                    />
                )}

                {/* Main content */}
                <div className="content flex-1">
                    <Outlet/>
                </div>
            </div>

            {/* Footer */}
            <FooterComponent/>
        </>
    );

}