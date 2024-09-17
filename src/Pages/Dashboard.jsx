import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaRegStar } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import Footer from '../components/Footer';

const Dashboard = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredCryptoData, setFilteredCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const [error, setError] = useState(null);
  const [gridLayout, setGridLayout] = useState(true);
  const [inpValue, setInpValue] = useState("");
  const cardRefs = useRef([]);

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



  useEffect(() => {
    const fetchCryptoData = async () => {
      const cachedData = localStorage.getItem('cryptoData');
      const cachedTimestamp = localStorage.getItem('cryptoDataTimestamp');
      const currentTime = new Date().getTime();

      // Check if cached data is not older than 30 minutes (30 minutes = 1800000 ms)
      if (cachedData && cachedTimestamp && (currentTime - parseInt(cachedTimestamp, 10)) < 1800000) {
        setCryptoData(JSON.parse(cachedData));
        setFilteredCryptoData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets`,
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCryptoData(response.data);
        setFilteredCryptoData(response.data);
        localStorage.setItem('cryptoData', JSON.stringify(response.data));
        localStorage.setItem('cryptoDataTimestamp', currentTime.toString()); // Save the timestamp
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  const inputSearchHandler = (inpValue) => {
    const val = inpValue;
    setInpValue(val);
    console.log(val);
    if (val === '') {
      setFilteredCryptoData(cryptoData);
      return;
    }
    setFilteredCryptoData(cryptoData.filter(cdata => cdata.name.toLowerCase().startsWith(val.toLowerCase())));
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className='max-w-[1880px] min-h-[85vh] mx-auto py-6'>
        <Navbar />
        <div className="flex-col">
          <div className="py-6 px-8 w-full">
            <input
              type="search"
              name="search"
              value={inpValue}
              onChange={(e) => inputSearchHandler(e.target.value)}
              id="search"
              className={`w-full md:py-3 py-2 md:px-6 px-4 ${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'} rounded-full`}
              placeholder='Search'
            />
          </div>
          <div className="flex w-full px-8">
            <button
              className={`w-1/2 border-b-2 ${gridLayout ? 'border-blue-500 text-blue-500' : 'border-transparent '} transition-colors duration-400`}
              onClick={() => setGridLayout(true)}
            >
              Grid
            </button>
            <button
              className={`w-1/2 border-b-2 ${gridLayout ? ' border-transparent' : 'border-blue-500 text-blue-500'} transition-colors duration-400`}
              onClick={() => setGridLayout(false)}
            >
              List
            </button>
          </div>
        </div>
        {filteredCryptoData.length === 0 && (<div className='flex flex-col w-full h-[300px] justify-center items-center'>
          <button className='flex justify-center items-center py-5 px-8 bg-blue-500 mb-4 rounded-xl'>No Item Found</button>
          <button className='flex justify-center items-center py-3 px-6 bg-blue-500 rounded-xl' onClick={() => inputSearchHandler("")}>Clear Search</button>
        </div>)}
        <div className={`${gridLayout ? 'grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))]' : 'flex flex-col'} py-6 px-8 gap-5`}>
          {filteredCryptoData.map((coin, index) => {
            const price24hAgo = coin.current_price - coin.price_change_24h;
            const percentageChange = ((coin.price_change_24h / price24hAgo) * 100).toFixed(2);
            const isPositive = percentageChange > 0;
            const changeText = isPositive ? `${percentageChange}%` : `${percentageChange}%`;
            const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
            const changeBorder = isPositive ? 'border-green-500' : 'border-red-500';

            // Add ref to the array
            const cardRef = (el) => {
              cardRefs.current[index] = el;
            };

            // Handle hover effect
            const handleMouseCardEnter = () => {
              if (cardRefs.current[index]) {
                cardRefs.current[index].style.borderColor = isPositive ? 'green' : 'red';
              }
            };

            const handleMouseCardLeave = () => {
              if (cardRefs.current[index]) {
                cardRefs.current[index].style.borderColor = 'transparent';
              }
            };

            return (
              <Link
                to="/"
                key={coin.id}
                ref={cardRef}
                className={`${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'} md:py-5 md:px-6 px-2 py-3 rounded-xl flex ${gridLayout ? 'h-[300px] flex-col' : 'grid  sm:grid-cols-[30%,20%,10%,40%] grid-cols-[55%,0%,15%,30%] justify-between items-center'} border-2 border-transparent transition-colors duration-300`}
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
                    <div className={`flex items-center border-2 rounded-full ${changeBorder} w-[40px] h-[40px]`}>
                      <div className={`flex justify-center items-center cursor-pointer w-[40px] rounded-full ${changeColor} `}>
                        <FaRegStar size={22} />
                      </div>
                    </div>
                  )
                  }
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
                {!gridLayout && (<h1 className={`${changeColor} lg:text-lg text-sm`}>${formatNumber(coin.current_price)}</h1>)}
                <div className={`flex ${gridLayout ? 'flex-col mt-4 ' : 'flex-row lg:text-xl text-md w-auto items-center justify-end'} gap-3`}>
                  {gridLayout && (<h1 className={`${changeColor} md:text-lg text-sm`}>${formatNumber(coin.current_price)}</h1>)}
                  {gridLayout && (<h1 className={`md:text-lg text-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Total Volume: ${formatNumber(coin.total_volume)}</h1>)}
                  {gridLayout && (<h1 className={`md:text-lg text-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Market Cap: ${formatNumber(coin.market_cap)}</h1>)}
                  {!gridLayout && (<h1 className={`md:text-lg text-sm ${theme === 'dark' ? 'text-white' : 'text-black'} md:block hidden`}>${formatNumber(coin.total_volume)}</h1>)}
                  {!gridLayout && (<h1 className={`md:text-lg text-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`}>${formatNumber(coin.market_cap)}</h1>)}
                  {!gridLayout && (
                    <div className={`flex items-center border-2 rounded-full ${changeBorder} lg:w-[40px] lg:h-[40px] h-[25px] w-[25px]`}>
                      <div className={`flex justify-center items-center cursor-pointer w-[25px] lg:w-[40px] rounded-full ${changeColor} `}>
                        <FaRegStar />
                      </div>
                    </div>
                  )
                  }
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
