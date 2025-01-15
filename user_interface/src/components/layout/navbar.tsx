import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import {MagnifyingGlassIcon, ShoppingCartIcon, MoonIcon, UserIcon} from '@heroicons/react/24/solid'
import {Bars3Icon} from '@heroicons/react/24/solid';
import {NavbarComponentProps} from "./layout.tsx";
import {useAppSelector} from "@/core/store.ts";


export default function NavbarComponent({onToggleSidebar, isSidebarOpen, isLargeScreen}: NavbarComponentProps) {
    const [darkTheme, setDarkTheme] = useState(true)
    const token = useAppSelector((state) => state.auth.token);
    const isAuthenticated = useAppSelector((state) => state.auth.is_authenticated);
    useEffect(() => {
        document.querySelector('html')?.classList.remove("light", "dark")
        document.querySelector('html')?.classList.add(darkTheme ? "dark" : "light")
    }, [darkTheme])

    function themeToggle() {
        setDarkTheme(!darkTheme)
    }



    const [query, setQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    function onClick() {

        console.log(query);
    }


    return (<>
        <div
            className="navbar  py-1.5 border-b-2  rounded-b">
            <div className="first_row flex justify-between md:pt-3">
                <span className=" pl-2 flex items-center">
                    <Link key="logo" to="/" className="company_logo px-5">
                        <p className="text_logo"> horror</p>
                    </Link>





                </span>

                <div className="flex items-center dark:text-black mb-5 ">
                    <div className="relative">
                        <input type="text" value={query}
                               onChange={handleInputChange}
                               onKeyDown={(e) => {
                                   if (e.key === 'Enter') {
                                       onClick();
                                   }
                               }}
                               placeholder="Search..."
                               className='  w-80 p-1  focus:outline-0 rounded-lg border-2 border-r-2'/>
                        <div className="absolute inset-y-0 right-0 flex items-center pl-3">
                            <button
                                onClick={onClick}
                                className=" p-2  rounded-full hover:text-teal-500">
                                <MagnifyingGlassIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                </div>


                {/*right side of navbar*/}
                <span className="right flex items-center">

                <button
                    onClick={themeToggle}
                    className=" p-2   rounded-full hover:text-teal-500 ">
                                <MoonIcon className="w-5 h-5"/>
                               </button>

                    <button
                        onClick={themeToggle}
                        className=" p-2   rounded-full hover:text-teal-500 ">
                                <ShoppingCartIcon className="w-5 h-5"/>
                            </button>
                    {/*<button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2">*/}
                    {/*        <img*/}
                    {/*            className="h-8 w-8 rounded-full object-cover"*/}
                    {/*            src="https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg"*/}
                    {/*        />*/}
                    {/*</button>*/}
                    <button
                        onClick={onClick}
                        className=" p-2  rounded-full hover:text-teal-500 ">
                                <UserIcon className="w-5 h-5"/>
                            </button>


                </span>
            </div>
            <div className="secound_row px-5 flex justify-start">
                <button
                    // className="flex items-center justify-center w-10 h-10  hover:bg-gray-700 rounded-full transition"
                    className="bg_button"
                    onClick={onToggleSidebar}
                    aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                >
                    <Bars3Icon className="w-5 h-5 text-gray-300"/>
                </button>
                <button
                    className="bg_button">
                    Offer
                </button>

                <button
                    className="bg_button">
                    Free Delivery
                </button>

                <button
                    className="bg_button">
                    Popular Products
                </button>
                <button
                    className="bg_button">
                    {isAuthenticated? token.slice(0, 3):'false'}
                </button>

            </div>


        </div>


    </>)
}
