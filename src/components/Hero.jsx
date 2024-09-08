import React from 'react'
import IPhone from "../assets/Iphone.png"
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <div className="max-w-[1820px] mx-auto py-6 px-8 2xl:flex-row flex flex-col mt-4">
            <div className="2xl:w-[50%] w-full 2xl:text-start text-center h-[450px] flex flex-col 2xl:items-start items-center justify-center gap-4 ">
                <div>
                    <h1 className='font-bold 2xl:text-8xl text-6xl mb-4'>Track Crypto</h1>
                    <h1 className='text-blue-500 font-bold 2xl:text-5xl text-4xl mb-4'>Real Time.</h1>
                </div>
                <p className='text-gray-500 lg:text-3xl text-xl mb-4'>Track crypto through a public api in real time. Visit the dashboard to do so!</p>
                <div className='flex gap-4'>
                    <Link to="/Dashboard" className={`duration-300 py-3 px-6 bg-blue-500 text-white rounded-full transition-all hover:shadow-[0_0_10px_10px_rgba(59,130,246,0.5)] text-xl`}>Dashboard</Link>
                    <Link to="/" className={`text-xl duration-300 py-3 px-6 hover:bg-blue-500 border-2 border-blue-500 rounded-full transition-all`}>Share App</Link>
                </div>
            </div>
            <div className='2xl:w-[50%] w-full flex justify-center h-[85vh]'>
                {/* <div className="absolute flex justify-center w-full h-full items-center"> */}
                <div className='h-[700px] relative'>
                    <div className='absolute w-[90%] h-[550px] bg-gradient-to-b from-blue-300 to-blue-400  rounded-[45px] left-[5rem] top-[7rem]' alt="" ></div>
                    <img src={IPhone} className='h-[650px] animate rounded-[45px]' style={{ boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0.5)' }} alt="" />
                </div>

                {/* </div> */}
            </div>
        </div>
    )
}

export default Hero