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
          <div className="flex items-center lg:gap-4 gap-2 justify-start">
            <button className={`${changeColor} text-center xl:w-[80px] lg:text-md text-sm w-[60px] py-1 border-2 ${changeBorder} rounded-3xl sm:block hidden`}>{changeText}</button>
            <div className={`xl:flex hidden items-center border-2 rounded-full ${changeBorder} w-[40px] h-[40px]`}>
              <div className={`lg:flex hidden justify-center items-center cursor-pointer w-[40px] rounded-full ${changeColor} `}>
                {isPositive && (<FaArrowTrendUp size={22} />)}
                {!isPositive && (<FaArrowTrendDown size={22} />)}
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
          <h1 className={`lg:text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>${coinData.total_volume.toLocaleString()}</h1>
          <h1 className={`lg:text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>${coinData.market_cap.toLocaleString()}</h1>
          <div className={`flex items-center border-2 rounded-full ${changeBorder} w-[40px] h-[40px]`}>
            <div className={`flex justify-center items-center cursor-pointer w-[40px] rounded-full`}>
              <div className="group relative">
                <FaRegStar className={`${changeColor}`} size={22} />
                <span
                            className={`text-sm ${theme==='dark'?'bg-gray-400':'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-10 -left-12 w-max opacity-0 transition-opacity group-hover:opacity-100 `}>
                  Add to Watchlist
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDescriptionPage;
