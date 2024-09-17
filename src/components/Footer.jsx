import React from 'react';
import { FaLinkedin } from "react-icons/fa6";
import { FaBriefcase } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className='flex items-center max-w-[1880px] mx-auto py-6 px-8 h-auto'>
      <div className="flex items-center w-full h-full bg-blue-500 rounded-xl text-3xl py-6 px-4 justify-between">Crypto Tracker.
        <div className="flex gap-4">
          <a href="https://www.linkedin.com/in/madhav-maheshwari-231b9022b" target='_blank'><FaLinkedin /></a>
          <a href="https://madhav-builds.vercel.app/" target='_blank'><FaBriefcase /></a>
        </div>
      </div>
    </div>
  )
}

export default Footer