// Drawer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Drawer = ({ isOpen, onClose }) => {
    return (
        <div
            className={`fixed inset-0 w-full bg-gray-800 bg-opacity-75 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            onClick={onClose}
        >
            <div
                className="w-[20rem] bg-white min-h-[100vh] h-auto p-4 absolute right-0"
                onClick={(e) => e.stopPropagation()} // Prevent closing the drawer when clicking inside it
            >
                <div className="flex flex-col text-gray-500 font-semibold text-2xl gap-6 px-4 justify-center">
                    <Link to="/" className='hover:text-black transition-colors duration-300'>Home</Link>
                    <Link to="/Compare" className='hover:text-black transition-colors duration-300'>Compare</Link>
                    <Link to="/WishList" className='hover:text-black transition-colors duration-300'>WishList</Link>
                    <Link to="/Dashboard" className='hover:text-black transition-colors duration-300'>Dashboard</Link>
                </div>
            </div>
        </div>
    );
};

export default Drawer;
