import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

const Drawer = ({ isOpen, onClose }) => {

    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div
            className={`fixed inset-0 w-full transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}
            onClick={onClose}
        >
            <div
                className="w-[18rem] z-40 min-h-[100vh] bg-gray-200 h-auto p-4 absolute right-0"
                onClick={(e) => e.stopPropagation()} // Prevent closing the drawer when clicking inside it
            >
                <div className="flex flex-col text-gray-500 font-semibold text-2xl gap-6 px-4 justify-center">
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
                    <Link to="/Dashboard" className={`transition-colors duration-300`} onMouseEnter={(e) => {
                        e.target.style.color = theme === 'dark' ? 'white' : 'black'
                    }} onMouseLeave={(e) => {
                        e.target.style.color = theme === 'dark' ? 'gray' : 'gray'
                    }}>Dashboard</Link>
                    <input type="checkbox" className="checkbox" id="Checkbox" />
                    <label htmlFor="Checkbox" className="checkbox-label w-[50px]" onClick={toggleTheme}>
                        <span className="ball"></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Drawer;
