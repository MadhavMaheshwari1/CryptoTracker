import { useState, React } from 'react';
import { Link } from 'react-router-dom'
import { FaBars } from "react-icons/fa6";
import Drawer from './Drawer';

const Navbar = () => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(prevState => !prevState);
    };

    return (
        <header className='flex justify-between max-w-[1920px] mx-auto py-6 items-center '>
            <Link to="/" className='font-bold lg:text-5xl text-4xl px-8'>CryptoTracker<span className='font-bold text-blue-500 px-1'>.</span></Link>
            <div className="md:flex hidden text-gray-500 font-semibold lg:text-3xl text-2xl gap-6 px-10 items-center">
                <input type="checkbox" className="checkbox" id="checkbox" />
                <label htmlFor="checkbox" className="checkbox-label">
                    <span className="ball"></span>
                </label>
                <Link to="/" className='hover:text-black transition-colors duration-300'>Home</Link>
                <Link to="/Compare" className='hover:text-black transition-colors duration-300'>Compare</Link>
                <Link to="/WishList" className='hover:text-black transition-colors duration-300'>WishList</Link>
                <Link to="/Dashboard" className='hover:text-black transition-colors duration-300'>Dashboard</Link>
            </div>
            <button
                onClick={toggleDrawer}
                className="md:hidden p-4 text-2xl text-gray-800"
            >
                <FaBars />
            </button>
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </header>
    )
}

export default Navbar