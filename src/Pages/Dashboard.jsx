import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { WatchListContext } from '../context/WatchListContext';
import { FaSpinner } from "react-icons/fa6";
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaRegStar } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { FaCircleArrowRight } from "react-icons/fa6";

const PaginatedDashboard = ({ noOfCoinsPerPage }) => {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredCryptoData, setFilteredCryptoData] = useState([]);
  const [timer, setTimer] = useState(0);
  const { watchList, addItemToWatchList, removeItemFromWatchList } = useContext(WatchListContext);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const [itemAdded, setItemAdded] = useState([]);
  const [start, setStart] = useState(1);
  const [error, setError] = useState({ error: false, errorMessage: null });
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

  const startHandler = (index) => {
    setStart(index + 1);
  }

  const watchListHandler = (coinData, e, index) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents event propagation
    setItemAdded((prevState) => {
      const isAdded = prevState.includes(index);
      if (isAdded) {
        removeItemFromWatchList(coinData);
        return prevState.filter(i => i !== index);
      } else {
        addItemToWatchList(coinData);
        return [...prevState, index];
      }
    });
  };

  // const timerHandler = () => {
  //   setTimer(timer => (timer>timer - 1));
  // }

  const fetchCryptoData = async () => {
    const cachedData = localStorage.getItem('cryptoData');
    const cachedTimestamp = localStorage.getItem('cryptoDataTimestamp');
    const currentTime = new Date().getTime();

    // Check if cached data is not older than 30 minutes (30 minutes = 1800000 ms)
    if (cachedData && cachedTimestamp && (currentTime - parseInt(cachedTimestamp, 10)) < 180000) {
      setCryptoData(JSON.parse(cachedData));
      console.log(JSON.parse(cachedData));
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
      setError(() => {
        return ({ error: false })
      });
      console.log(cryptoData);
      setCryptoData(response.data);
      setFilteredCryptoData(response.data);
      localStorage.setItem('cryptoData', JSON.stringify(response.data));
      localStorage.setItem('cryptoDataTimestamp', currentTime.toString()); // Save the timestamp
      setLoading(false);
    } catch (err) {
      setTimer(10);
      setError(() => {
        return ({ error: true, errorMessage: err.message })
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const retryHandler = () => {
    fetchCryptoData();
    setLoading(true);
  }

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
    <>
      <div className='max-w-[1880px] min-h-[85vh] mx-auto py-6'>
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
          {filteredCryptoData.slice(start * noOfCoinsPerPage - noOfCoinsPerPage, start * noOfCoinsPerPage).map((coin, index) => {
            const percentageChange = coin.price_change_percentage_24h.toFixed(2);
            const isPositive = percentageChange > 0;
            const changeText = isPositive ? `${percentageChange}%` : `${percentageChange}%`;
            const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
            const changeBorder = isPositive ? 'border-green-500' : 'border-red-500';
            const changeBackground = isPositive ? 'bg-green-500' : 'bg-red-500';

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
                to={`/Dashboard/${coin.name}`}
                state={{ coinData: {coin} }} // Pass specific coin data here
                key={coin.id}
                ref={cardRef}
                className={`${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'} md:py-5 md:px-6 px-2 py-2 rounded-xl flex ${gridLayout ? 'h-[300px] flex-col py-4 px-4' : 'grid  sm:grid-cols-[30%,20%,10%,40%] grid-cols-[55%,0%,15%,30%] justify-between items-center'} border-2 border-transparent transition-colors duration-300`}
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
                    <div className="group relative cursor-pointer" onClick={(e) => watchListHandler(coin, e, index)}>
                      <div className={`flex items-center border-2 rounded-full ${changeBorder} lg:w-[40px] lg:h-[40px] w-[20px] h-[20px] relative ${itemAdded[index] && changeBackground}`}>
                        <div className={`absolute w-full h-full top-0 left-0 ${changeBackground} opacity-0 group-hover:opacity-100 transition-all rounded-full`}></div>
                        <div className={`flex justify-center items-center cursor-pointer w-[25px] lg:w-[40px] rounded-full`}>
                          <FaRegStar className={`${changeColor}  group-hover:text-white absolute ${itemAdded[index] && "text-white"} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all lg:text-md text-[12px] md:text-[18px]`} />
                        </div>
                      </div>
                    </div>
                  )
                  }
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
                {!gridLayout && (
                  <div className="group relative">
                    <h1 className={`${changeColor} lg:text-lg ${gridLayout ? 'text-lg' : 'text-sm'}`}>${formatNumber(coin.current_price)}</h1>
                    <span
                      className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 -left-5 w-max opacity-0 transition-opacity group-hover:opacity-100 `}>
                      Current Price
                    </span>
                  </div>
                )}
                <div className={`flex ${gridLayout ? 'flex-col mt-4 ' : 'flex-row lg:text-xl text-md w-auto items-center justify-end'} gap-3`}>
                  {gridLayout && (
                    <div className="group relative mt-4">
                      <h1 className={`${changeColor} lg:text-lg ${gridLayout ? 'text-lg' : 'text-sm'}`}>${formatNumber(coin.current_price)}</h1>
                      <span
                        className={`text-sm ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'} rounded-md px-2 pointer-events-none absolute -top-7 -left-5 w-max opacity-0 transition-opacity group-hover:opacity-100 `}>
                        Current Price
                      </span>
                    </div>
                  )}
                  {gridLayout && (<h1 className={`lg:text-lg ${gridLayout ? 'text-lg' : 'text-sm'} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Total Volume: ${coin.total_volume.toLocaleString()}</h1>)}
                  {gridLayout && (<h1 className={`lg:text-lg ${gridLayout ? 'text-lg' : 'text-sm'}  ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Market Cap: ${coin.market_cap.toLocaleString()}</h1>)}
                  {!gridLayout && (<h1 className={`lg:text-lg ${gridLayout ? 'text-lg' : 'text-sm'} ${theme === 'dark' ? 'text-white' : 'text-black'} md:block hidden`}>${formatNumber(coin.total_volume)}</h1>)}
                  {!gridLayout && (<h1 className={`lg:text-lg ${gridLayout ? 'text-lg' : 'text-sm'} first-line:${theme === 'dark' ? 'text-white' : 'text-black'}`}>${formatNumber(coin.market_cap)}</h1>)}
                  {!gridLayout && (
                    <div className="group relative cursor-pointer" onClick={(e) => watchListHandler(coin, e, index)}>
                      <div className={`flex items-center border-2 rounded-full ${changeBorder} lg:w-[40px] lg:h-[40px] w-[20px] h-[20px] relative ${itemAdded[index] && changeBackground}`}>
                        <div className={`absolute w-full h-full top-0 left-0 ${changeBackground} opacity-0 group-hover:opacity-100 transition-all rounded-full`}></div>
                        <div className={`flex justify-center items-center cursor-pointer w-[25px] lg:w-[40px] rounded-full`}>
                          <FaRegStar className={`${changeColor}  group-hover:text-white absolute ${itemAdded[index] && "text-white"} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all lg:text-md text-[12px] md:text-[18px]`} />
                        </div>
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
      {
        <div className="flex w-full items-center justify-center gap-4">
          <button disabled={start === 1} onClick={() => setStart(start - 1)} className={`${start === 1 ? 'disabled' : ''} md:text-4xl text-2xl`}><FaCircleArrowLeft /></button>
          {start !== 1 && <div className="dots">...</div>}
          {
            [...Array((Math.ceil(cryptoData.length / noOfCoinsPerPage)))].map((_, index) => (
              <button key={index} className={`${((index + 1 >= start && index + 1 <= (start + 4))) ? 'flex' : 'hidden'} ${((index + 1 >= start && index + 1 <= (start + 4))) ? 'flex' : 'hidden'} md:w-[40px] items-center justify-center md:h-[40px] w-[25px] h-[25px] border-2 ${theme === 'dark' ? 'border-white' : 'border-black'} rounded-full ${start === (index + 1) ? 'bg-blue-500' : ''}`} onClick={() => startHandler(index)}>{index + 1}</button>
            ))
          }
          {start !== (Math.ceil(cryptoData.length / noOfCoinsPerPage)) && <div className="dots">...</div>}
          <button disabled={start >= Math.max(Math.ceil(cryptoData.length / noOfCoinsPerPage) - 4, 1)} onClick={() => setStart(start + 1)} className={`${start >= Math.max(Math.ceil(cryptoData.length / noOfCoinsPerPage) - 4, 1) ? 'disabled' : ''} md:text-4xl text-2xl`}>< FaCircleArrowRight /></button>
        </div>
      }
    </>
  );
};

export default PaginatedDashboard;
