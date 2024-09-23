import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { FaArrowTrendUp, FaArrowTrendDown, FaRegStar } from 'react-icons/fa6';
import PriceChart from '../components/PriceChart'; // Import the area chart component
import { FaSpinner } from "react-icons/fa6";
import { WatchListContext } from '../context/WatchListContext';

const CoinDescriptionPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { addItemToWatchList } = useContext(WatchListContext);
  const { theme } = useContext(ThemeContext);
  const { coinData } = location.state || {}; // Extract the coin data

  const [priceData, setPriceData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [marketCapData, setMarketCapData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(7); // Default period in days

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinData.id}/market_chart?vs_currency=usd&days=${selectedPeriod}`);
        const result = await response.json();
        const prices = result.prices.map(price => price[1]); // Extract only the price values
        const volumes = result.total_volumes.map(volume => volume[1]); // Extract only the volume values
        const marketCaps = result.market_caps.map(marketCap => marketCap[1]); // Extract only the market cap values
        const dates = result.prices.map(price => new Date(price[0])); // Convert timestamp to Date

        setPriceData(prices);
        setVolumeData(volumes);
        setMarketCapData(marketCaps);
        setLabels(dates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchHistoricalData();
  }, [selectedPeriod, coinData.id]);

  const handlePeriodChange = (event) => {
    setSelectedPeriod(Number(event.target.value));
  };

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

  if (loading) {
    return <div className='w-[90vw] h-[100vh] flex justify-center items-center animate-spin'><FaSpinner size={102} /></div>;
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
                <button className={`${changeColor} top-0 left-0 absolute group-hover:opacity-100 group-hover:text-white text-center xl:w-[80px] sm:block hidden lg:text-md text-sm w-[60px] py-1 border-2 ${changeBorder} rounded-3xl transition-colors`}>{changeText}</button>
              </div>
            </div>
            <button className="group">
              <div className={`xl:flex hidden items-center border-2 rounded-full ${changeBorder} w-[40px] h-[40px] relative`}>
                <div className={`absolute w-full h-full top-0 left-0 ${changeBackground} opacity-0 group-hover:opacity-100 transition-all rounded-full`}></div>
                {isPositive && (<FaArrowTrendUp className={`group-hover:text-white absolute top-2 left-1 ${changeColor}`} size={22} />)}
                {!isPositive && (<FaArrowTrendDown className={`group-hover:text-white absolute top-2 left-1 ${changeColor}`} size={22} />)}
              </div>
            </button>
          </div>
          <div className="group relative">
            <button className={`${changeColor} text-lg`}>${formatNumber(coinData.current_price)}</button>
            <span
              className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 -left-5 w-max opacity-0 transition-opacity group-hover:opacity-100 `}>
              Current Price
            </span>
          </div>
          <div className="group relative">
            <button className={`lg:text-lg ${theme === 'dark' ? 'text-white' : 'text-black'} md:block hidden`}>${formatNumber(coinData.total_volume)}</button>
            <span
              className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 -left-4 w-max opacity-0 transition-opacity group-hover:opacity-100 `}>
              Total Volume
            </span>
          </div>
          <div className="group relative">
            <button className={`lg:text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>${formatNumber(coinData.market_cap)}</button>
            <span
              className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 left-2 w-max opacity-0 transition-opacity group-hover:opacity-100 `}>
              Market Cap
            </span>
          </div>
          <div className="group relative cursor-pointer" onClick={() => addItemToWatchList(coinData)}>
            <div className={`flex items-center border-2 rounded-full ${changeBorder} lg:w-[40px] lg:h-[40px] w-[20px] h-[20px] relative`}>
              <div className={`absolute w-full h-full top-0 left-0 ${changeBackground} opacity-0 group-hover:opacity-100 transition-all rounded-full`}></div>
              <div className={`flex justify-center items-center cursor-pointer w-[25px] lg:w-[40px] rounded-full`}>
                <FaRegStar className={`${changeColor} group-hover:text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all lg:text-md text-[12px] md:text-[18px]`} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 px-8">
        <div className="flex gap-4 items-center px-4">
          <label htmlFor="period" className="md:text-lg text-sm font-medium">Price Change in:</label>
          <select
            id="period"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            style={{ fontSize: 12 }}
            className={`${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'} border-2 px-4 py-2 rounded-lg cursor-pointer transition duration-200 hover:border-blue-500`}
          >
            <option value={7} className='md:text-md text-sm'>7 Days</option>
            <option value={30} className='md:text-md text-sm'>30 Days</option>
            <option value={60} className='md:text-md text-sm'>60 Days</option>
            <option value={90} className='md:text-md text-sm'>90 Days</option>
            <option value={120} className='md:text-md text-sm'>120 Days</option>
          </select>

        </div>
        <div className="py-6">
          <PriceChart priceData={priceData} volumeData={volumeData} marketCapData={marketCapData} labels={labels} />
        </div>
      </div>
    </div>
  );
};

export default CoinDescriptionPage;
