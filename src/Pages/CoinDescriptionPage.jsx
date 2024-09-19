import { useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { FaSpinner } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa6";
import { useContext } from 'react';

const CoinDescriptionPage = () => {

  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const { coinData } = location.state || {}; // Extract the coin data

  const percentageChange = coinData.price_change_percentage_24h.toFixed(2);
  const isPositive = percentageChange > 0;
  const changeText = isPositive ? `${percentageChange}%` : `${percentageChange}%`;

  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const changeBackground = isPositive ? 'bg-green-500' : 'bg-red-500';
  const changeBorder = isPositive ? 'border-green-500' : 'border-red-500';


  function formatNumber(value) {

    if (value >= 1000000000) {
      return Math.floor(value / 1000000000) + 'b';
    } else if (value >= 1000000) {
      return Math.floor(value / 1000000) + 'm';
    } else if (value >= 1000) {
      return Math.floor(value / 1000) + 'k';
    } else {
      return Math.floor(value);
    }
  }

  return (
    <div className='max-w-[1880px] min-h-[85vh] mx-auto py-6'>
      <div className="py-6 px-8 w-full">
        <div className={`flex w-full justify-between items-center ${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'} py-6 px-4 rounded-xl`}>
          <div className="flex gap-4 items-center">
            <div className="flex items-center">
              <img src={coinData.image} className='h-[30px] w-[30px] md:h-[60px] md:w-[60px]' alt={coinData.name} />
            </div>
            <div className="flex flex-col">
              <h1 className='lg:text-xl text-sm font-semibold'>{coinData.symbol.toUpperCase()}</h1>
              <h1 className='lg:text-md text-sm text-gray-600'>{coinData.name}</h1>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="group flex items-center lg:gap-4 gap-2 justify-start">
              <div className="group relative">
                <button className={`${changeColor} group-hover:bg-current text-center xl:w-[80px] lg:text-md text-sm w-[60px] py-1 border-2 ${changeBorder} rounded-3xl sm:block hidden`}>{changeText}</button>
                <button className={`${changeColor} top-0 left-0 absolute group-hover:opacity-100 group-hover:text-white text-center xl:w-[80px] lg:text-md text-sm w-[60px] py-1 border-2 ${changeBorder} rounded-3xl sm:block hidden transition-colors`}>{changeText}</button>
              </div>
            </div>
            <div className="group">
              <div className={`xl:flex hidden items-center border-2 rounded-full ${changeBorder} w-[40px] h-[40px] relative`}>
                <div className={`absolute w-full h-full top-0 left-0 ${changeBackground} opacity-0 group-hover:opacity-100 transition-all rounded-full`}></div>
                {isPositive && (<FaArrowTrendUp className={`group-hover:text-white absolute top-2 left-1 ${changeColor}`} size={22} />)}
                {!isPositive && (<FaArrowTrendDown className={`group-hover:text-white absolute top-2 left-1 ${changeColor}`} size={22} />)}
              </div>
            </div>
          </div>
          <div className="group relative">
            <button className={`${changeColor} text-lg`}>${formatNumber(coinData.current_price)}</button>
            <span
              className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 -left-5 w-max opacity-0 transition-opacity group-hover:opacity-100 `}>
              Current Price
            </span>
          </div>
          <div className="group relative">
            <button className={`lg:text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>${coinData.total_volume.toLocaleString()}</button>
            <span
              className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 left-2 w-max opacity-0 transition-opacity group-hover:opacity-100 `}>
              Total Volume
            </span>
          </div>
          <div className="group relative">
            <button className={`lg:text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>${coinData.market_cap.toLocaleString()}</button>
            <span
              className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 left-4 w-max opacity-0 transition-opacity group-hover:opacity-100 `}>
              Market Cap
            </span>
          </div>
          <div className={`flex items-center border-2 rounded-full ${changeBorder} lg:w-[40px] lg:h-[40px] h-[25px] w-[25px] group relative`}>
            <div className={`absolute w-full h-full top-0 left-0 ${changeBackground} opacity-0 group-hover:opacity-100 transition-all rounded-full`}></div>
            <div className={`flex justify-center items-center cursor-pointer w-[25px] lg:w-[40px] rounded-full`}>
              <FaRegStar className={`${changeColor} group-hover:text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all`} size={22} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDescriptionPage;
