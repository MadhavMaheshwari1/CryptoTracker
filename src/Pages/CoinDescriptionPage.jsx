import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { FaArrowTrendUp, FaArrowTrendDown, FaRegStar } from 'react-icons/fa6';
import PriceChart from '../components/PriceChart'; // Import the area chart component
import { FaSpinner } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { WatchListContext } from '../context/WatchListContext';

const CoinDescriptionPage = () => {

  function indexOfNthOccurrence(str, char, n) {
    let index = -1;

    for (let i = 0; i < n; i++) {
      index = str.indexOf(char, index + 1);  // Find the next occurrence
      if (index === -1) return -1; // If the character isn't found
    }

    return index + 1;
  }

  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { watchList, addItemToWatchList, removeItemFromWatchList } = useContext(WatchListContext);
  const { theme } = useContext(ThemeContext);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState({ error: false, errorMessage: null });
  const [desc, setDesc] = useState('');
  const [itemAdded, setItemAdded] = useState(false);
  const { coinData } = location.state || {}; // Extract the coin data

  const [priceData, setPriceData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [marketCapData, setMarketCapData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); // Track the "Read More/Less" state
  const [selectedPeriod, setSelectedPeriod] = useState(7); // Default period in days

  const createMarkup = (htmlText) => {
    return { __html: htmlText };
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const fetchHistoricalData = async () => {
    try {
      const result = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinData.id}/market_chart?vs_currency=usd&days=${selectedPeriod}`);
      const desc = await axios.get(`https://api.coingecko.com/api/v3/coin/${coinData.id}`);
      const prices = result.data.prices.map(price => price[1]); // Extract only the price values
      const volumes = result.data.total_volumes.map(volume => volume[1]); // Extract only the volume values
      const marketCaps = result.data.market_caps.map(marketCap => marketCap[1]); // Extract only the market cap values
      const dates = result.data.prices.map(price => new Date(price[0])); // Convert timestamp to Date

      setError(() => {
        return ({ error: false })
      });

      setDesc(desc.data.description.en);
      setPriceData(prices);
      setVolumeData(volumes);
      setMarketCapData(marketCaps);
      setLabels(dates);
      setLoading(false);
    } catch (err) {
      setTimer(10);
      setError(() => {
        return ({ error: true, errorMessage: err.message })
      });
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [selectedPeriod, coinData.id]);

  const handlePeriodChange = (event) => {
    setSelectedPeriod(Number(event.target.value));
  };

  const retryHandler = () => {
    fetchHistoricalData();
    setLoading(true);
  }

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

  // useEffect(() => {
  //   const isItemInWatchList = watchList.some(item => item.name === coinData.name);
  //   setItemAdded(isItemInWatchList);
  // }, []);

  const watchListHandler = (coinData) => {
    // Use a callback function to access the latest state
    setItemAdded(prevItemAdded => {
      const newItemAdded = !prevItemAdded; // Toggle the state

      if (newItemAdded) {
        addItemToWatchList(coinData);
      } else {
        removeItemFromWatchList(coinData);
      }

      return newItemAdded; // Return the new state
    });
  };

  useEffect(() => {
    if (error.error) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer >= 1) {
            return prevTimer - 1; // Decrease timer
          } else {
            clearInterval(interval);
            setTimer(0); // Reset timer to 0
            return 0; // Ensure timer stays at 0
          }
        });
      }, 1000);
      return () => clearInterval(interval); // Clean up interval on component unmount
    }
  }, [error]);


  if (loading) {
    return <div className='w-[90vw] h-[100vh] flex justify-center items-center animate-spin'><FaSpinner size={102} /></div>;
  }

  if (error.error) {
    return (
      <div className="grid h-screen place-content-center px-4">
        <div className="text-center">
          <p className="text-3xl font-bold tracking-tight text-gray-600 sm:text-7xl">Uh-oh!</p>
          <p className="mt-4 text-xl text-gray-500">{error.errorMessage}</p>
          <p className="mt-4 text-gray-500 text-xl">Retry after: {timer} seconds</p>
          <div className="flex flex-col gap-4 text-xl">
            <Link
              to="/"
              className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring"
            >
              Go Back Home
            </Link>
            {timer === 0 && (<button className="bg-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-700" onClick={() => retryHandler()}>Retry</button>)}</div>
        </div>
      </div>
    );
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
          <div className="group relative cursor-pointer" onClick={() => watchListHandler(coinData)}>
            <div className={`flex items-center border-2 rounded-full ${changeBorder} lg:w-[40px] lg:h-[40px] w-[20px] h-[20px] relative ${itemAdded && changeBackground}`}>
              <div className={`absolute w-full h-full top-0 left-0 ${changeBackground} opacity-0 group-hover:opacity-100 transition-all rounded-full`}></div>
              <div className={`flex justify-center items-center cursor-pointer w-[25px] lg:w-[40px] rounded-full`}>
                <FaRegStar className={`${changeColor}  group-hover:text-white absolute ${itemAdded && "text-white"} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all lg:text-md text-[12px] md:text-[18px]`} />
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
        <div className={`coin--description px-10 md:text-xl text-[12px] ${theme === 'dark' ? 'text-gray-300' : ''} rounded-xl py-8 mx-6 me-4 ${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'}`}>
          <p dangerouslySetInnerHTML={createMarkup(isExpanded ? desc : desc.slice(0, indexOfNthOccurrence(desc, '.', 2)))} />
          {desc.length > (indexOfNthOccurrence(desc, '.', 3)) && (
            <button
              onClick={toggleReadMore}
              className="text-blue-500 hover:underline mt-2 block"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default CoinDescriptionPage;
