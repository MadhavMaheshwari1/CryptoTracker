import React from 'react'
import { Link } from 'react-router-dom'
import { FaBars } from "react-icons/fa6";

const Navbar = () => {
    return (
        <header className='flex md:flex-row flex-col md:justify-between justify-center max-w-[1920px] mx-auto py-6 md:items-center '>
            <h1 className='font-bold lg:text-5xl text-4xl px-8'>CryptoTracker<span className='font-bold text-blue-500 px-1'>.</span></h1>
            <div className="md:flex hidden text-gray-500 font-semibold lg:text-3xl text-2xl gap-6 px-10 items-center">
                <Link to="/">Home</Link>
                <Link to="/Compare">Compare</Link>
                <Link to="/WishList">WishList</Link>
                <Link to="/Dashboard">Dashboard</Link>
            </div>
            {/* <FaBars /> */}
        </header>
    )
}

export default Navbar