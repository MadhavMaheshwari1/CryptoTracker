import { useState, React, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { FaBars } from "react-icons/fa6";
import Drawer from './Drawer';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';

const Navbar = () => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const toggleDrawer = () => {
        setIsDrawerOpen(prevState => !prevState);
    };

    return (
        <header className='flex justify-between max-w-[1920px] mx-auto py-6 items-center  px-8'>
            <Link to="/" className='font-bold lg:text-5xl text-4xl'>CryptoTracker<span className='font-bold text-blue-500 px-1'>.</span></Link>
            <div className="md:flex hidden text-gray-500 font-semibold lg:text-3xl text-2xl gap-6 px-10 items-center">
                <input type="checkbox" className="checkbox" id="checkbox" />
                <label htmlFor="checkbox" className="checkbox-label" onClick={toggleTheme}>
                    <span className="ball"></span>
                </label>
                <Link to="/" className={`transition-colors duration-300`} onMouseEnter={(e) => {
                    e.target.style.color = theme === 'dark' ? 'white' : 'black'
                }} onMouseLeave={(e) => {
                    e.target.style.color = theme === 'dark' ? 'gray' : 'gray'
                }}>Home</Link>
                <Link to="/Compare" className={`transition-colors duration-300`} onMouseEnter={(e) => {
                    e.target.style.color = theme === 'dark' ? 'white' : 'black'
                }} onMouseLeave={(e) => {
                    e.target.style.color = theme === 'dark' ? 'gray' : 'gray'
                }}>Compare</Link>
                <Link to="/WishList" className={`transition-colors duration-300`} onMouseEnter={(e) => {
                    e.target.style.color = theme === 'dark' ? 'white' : 'black'
                }} onMouseLeave={(e) => {
                    e.target.style.color = theme === 'dark' ? 'gray' : 'gray'
                }}>WishList</Link>
                <Link to="/Dashboard" className={`duration-300 py-3 px-6 bg-blue-500 text-white rounded-full transition-all hover:shadow-[0_0_10px_10px_rgba(59,130,246,0.5)]`}>Dashboard</Link>
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
        </header >
    )
}

export default Navbar