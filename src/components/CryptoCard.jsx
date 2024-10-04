import React, { useRef, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegStar, FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { WatchListContext } from '../context/WatchListContext';
import { ToastContext } from '../context/ToastContext';

const CryptoCard = ({ coin, theme, gridLayout }) => {
  const { addItemToWatchList, removeItemFromWatchList, watchList } = useContext(WatchListContext);
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState('');
  const { addToast } = useContext(ToastContext);
  const cardRef = useRef(null); // Initialize ref for the card

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

  const watchListHandler = (coinData, e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event propagation

    const shouldAdd = watchList.every((item) => item.name !== coinData.name);
    if (shouldAdd) {
      addItemToWatchList(coinData);
      setAdded(true);
      addToast(`${coinData.name} has been added to the watchlist`);
    } else {
      removeItemFromWatchList(coinData);
      setAdded(false);
      addToast(`${coinData.name} has been removed from the watchlist`);
    }
  };

  const percentageChange = coin.price_change_percentage_24h.toFixed(2);
  const isPositive = percentageChange > 0;
  const changeText = `${percentageChange}%`;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const changeBorder = isPositive ? 'border-green-500' : 'border-red-500';
  const changeBackground = isPositive ? 'bg-green-500' : 'bg-red-500';

  const handleMouseCardEnter = () => {
    if (cardRef.current) {
      cardRef.current.style.borderColor = isPositive ? 'green' : 'red';
    }
  };

  const handleMouseCardLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.borderColor = 'transparent';
    }
  };

  return (
    <div className={`${gridLayout}?'custom-p':''`}>
      <Link
        to={`/Dashboard/${coin.name}`}
        state={{ coinData: coin }}
        key={coin.id}
        ref={cardRef}
        className={`${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'} md:py-5 md:px-6 py-2 rounded-xl flex ${gridLayout ? 'max-w-custom h-auto flex-col py-4 px-4' : 'grid  sm:grid-cols-[30%,20%,10%,40%] grid-cols-[55%,0%,15%,30%] justify-between items-center px-2'} border-2 border-transparent transition-colors duration-300`}
        onMouseEnter={handleMouseCardEnter}
        onMouseLeave={handleMouseCardLeave}
      >
        <div className={`flex justify-between ${gridLayout ? 'mb-6' : 'items-center'}`}>
          <div className="flex gap-4">
            <div className="flex items-center">
              <img src={coin.image} className='h-[30px] w-[30px] md:h-[60px] md:w-[60px]' alt={coin.name} />
            </div>
            <div className="flex flex-col">
              <h1 className='lg:text-xl text-sm font-semibold'>{coin.symbol.toUpperCase()}</h1>
              <h1 className='lg:text-md text-sm text-gray-600'>{coin.name}</h1>
            </div>
          </div>
          {gridLayout && (
            <div className="group relative cursor-pointer" onClick={(e) => watchListHandler(coin, e)}>
              <div className={`flex items-center border-2 rounded-full ${changeBorder} ${added && changeBackground} lg:w-[40px] lg:h-[40px] w-[35px] h-[35px] relative`}>
                <div className={`absolute w-full h-full top-0 left-0 ${changeBackground} opacity-0 group-hover:opacity-100 transition-all rounded-full`}></div>
                <div className={`flex justify-center items-center cursor-pointer w-[25px] lg:w-[40px] rounded-full`}>
                  <FaRegStar className={`${changeColor} group-hover:text-white ${added && 'text-white'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all lg:text-md text-[18px]`} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <div className="group flex items-center lg:gap-4 gap-2 justify-start">
            <div className="group relative">
              <button className={`${changeColor} group-hover:bg-current text-center xl:w-[80px] lg:text-md text-sm w-[60px] py-1 border-2 ${changeBorder} rounded-3xl ${!gridLayout && 'sm:block hidden'}`}>{changeText}</button>
              <button className={`${changeColor} top-0 left-0 absolute group-hover:opacity-100 group-hover:text-white text-center xl:w-[80px] lg:text-md text-sm w-[60px] py-1 border-2 ${changeBorder} rounded-3xl sm:block hidden transition-colors`}>{changeText}</button>
            </div>
          </div>
          <div className="group">
            <div className={`xl:flex hidden items-center border-2 rounded-full ${changeBorder} w-[40px] h-[40px] relative`}>
              <div className={`absolute w-full h-full top-0 left-0 ${changeBackground} opacity-0 group-hover:opacity-100 transition-all rounded-full`}></div>
              {isPositive ? (
                <FaArrowTrendUp className={`group-hover:text-white absolute top-2 left-1 ${changeColor}`} size={22} />
              ) : (
                <FaArrowTrendDown className={`group-hover:text-white absolute top-2 left-1 ${changeColor}`} size={22} />
              )}
            </div>
          </div>
        </div>
        {!gridLayout && (
          <div className="group relative">
            <h1 className={`${changeColor} lg:text-lg ${gridLayout ? 'text-lg' : 'text-sm'}`}>${formatNumber(coin.current_price)}</h1>
            <span className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 -left-5 w-max opacity-0 transition-opacity group-hover:opacity-100`}>
              Current Price
            </span>
          </div>
        )}
        <div className={`flex ${gridLayout ? 'flex-col mt-4' : 'flex-row lg:text-xl text-md w-auto items-center justify-end'} gap-3`}>
          {gridLayout && (
            <div className="group relative mt-4">
              <h1 className={`${changeColor} lg:text-lg ${gridLayout ? 'text-lg' : 'text-sm'}`}>${formatNumber(coin.current_price)}</h1>
              <span className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 -left-5 w-max opacity-0 transition-opacity group-hover:opacity-100`}>
                Current Price
              </span>
            </div>
          )}
          {gridLayout && <h1 className={`lg:text-lg ${gridLayout ? 'text-md' : 'text-sm'} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Total Volume: ${coin.total_volume.toLocaleString()}</h1>}
          {gridLayout && <h1 className={`lg:text-lg ${gridLayout ? 'text-md' : 'text-sm'} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Market Cap: ${coin.market_cap.toLocaleString()}</h1>}
          {!gridLayout && (
            <div className='group relative md:block hidden'>
              <h1 className={`lg:text-lg ${gridLayout ? 'text-lg' : 'text-sm'} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>${formatNumber(coin.total_volume)}</h1>
              <span className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 -left-5 w-max opacity-0 transition-opacity group-hover:opacity-100`}>
                Total Volume
              </span>
            </div>
          )}
          {!gridLayout && (
            <div className='group relative'>
              <h1 className={`lg:text-lg ${gridLayout ? 'text-lg' : 'text-sm'} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>${formatNumber(coin.market_cap)}</h1>
              <span className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 -left-5 w-max opacity-0 transition-opacity group-hover:opacity-100`}>
                Market Cap
              </span>
            </div>
          )}
          {!gridLayout && (
            <div className="group relative cursor-pointer" onClick={(e) => watchListHandler(coin, e)}>
              <div className={`flex items-center border-2 rounded-full ${changeBorder} ${added && changeBackground} lg:w-[40px] lg:h-[40px] w-[25px] h-[25px] relative`}>
                <div className={`absolute w-full h-full top-0 left-0 ${changeBackground} opacity-0 group-hover:opacity-100 transition-all rounded-full`}></div>
                <div className={`flex justify-center items-center cursor-pointer w-[25px] lg:w-[40px] rounded-full`}>
                  <FaRegStar className={`${changeColor} group-hover:text-white ${added && 'text-white'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all lg:text-md text-[12px] md:text-[18px]`} />
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default CryptoCard;
