import {Link} from 'react-router-dom';

const FooterComponent = () => {
    const footerItemsList = [
        {
            name: 'Contact Us',
            link: '/contact',
        },
        {
            name: 'Privacy Policy',
            link: '/privacy',
        },
    ];

    return (
        <div
            className="footer flex justify-between
      border-t-2 rounded-t
      text-gray-700 dark:text-gray-300
      hover:text-gray-900 hover:dark:text-white
      bg-white dark:bg-gray-800
      px-2 py-6"
        >
      <span className="flex items-center">
        {footerItemsList.map((item, i) => (
            <Link key={i} to={item.link} className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2">
                {item.name}
            </Link>
        ))}
      </span>

            {/* right side of footer */}
            <span className="flex items-center">
        <span className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2">© 2024 Tech hub</span>
      </span>
        </div>
    );
};

export default FooterComponent;
