import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PriceChart from '../components/PriceChart';
import { Link } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa6";
import { ThemeContext } from '../context/ThemeContext';

const ComparePage = () => {
  const { theme } = useContext(ThemeContext);
  const [coins1, setCoins1] = useState([]);
  const [coins2, setCoins2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coinOne, setCoinOne] = useState('bitcoin');
  const [coinTwo, setCoinTwo] = useState('ethereum');
  const [period, setPeriod] = useState(7);
  const [error, setError] = useState({ error: false, errorMessage: null });
  const [timer, setTimer] = useState(0);

  const fetchCoinsData = async () => {
    const cachedData = localStorage.getItem('cryptoData');
    const cachedTimestamp = localStorage.getItem('cryptoDataTimestamp');
    const currentTime = new Date().getTime();

    if (cachedData && cachedTimestamp && (currentTime - parseInt(cachedTimestamp, 10)) < 180000) {
      const coinsList = JSON.parse(cachedData);
      setCoins1(coinsList.filter(coins => coins.id !== coinTwo));
      setCoins2(coinsList.filter(coins => coins.id !== coinOne));
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
      const coinsList = response.data;
      setCoins1(coinsList.filter(coins => coins.id !== coinTwo));
      setCoins2(coinsList.filter(coins => coins.id !== coinOne));
      localStorage.setItem('cryptoData', JSON.stringify(coinsList));
      localStorage.setItem('cryptoDataTimestamp', currentTime.toString());
      setLoading(false);
    } catch (err) {
      setTimer(10);
      setError({ error: true, errorMessage: err.message });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoinsData();
  }, []);

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

  useEffect(() => {
    setCoins1(coinsList => coinsList.filter(coins => coins.id !== coinTwo));
    setCoins2(coinsList => coinsList.filter(coins => coins.id !== coinOne));
  }, [coins1, coins2]);

  useEffect(() => {
    fetchCoinsData();
  }, [period, coins1, coins2]);

  const retryHandler = () => {
    fetchCoinsData();
    setLoading(true);
  };

  const handlePeriodChange = (event) => {
    setPeriod(Number(event.target.value));
  };

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
            <Link to="/" className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring">Go Back Home</Link>
            {timer === 0 && (<button className="bg-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-700" onClick={() => retryHandler()}>Retry</button>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1880px] mx-auto min-h-[85vh]">
      <div className="mb-4 flex md:gap-4 items-center md:justify-start justify-between px-8">
        <div className="flex items-center md:gap-4">
          <h1 className='md:text-2xl text-lg md:block hidden'>Crypto1</h1>
          <select
            value={coinOne}
            onChange={(e) => setCoinOne(e.target.value)}
            className="p-2 border rounded bg-transparent cursor-pointer lg:w-40 w-[86px] lg:text-md text-sm hover:border-blue-500"
          >
            {coins1.map((coin) => (
              <option key={coin.id} value={coin.id} className={`${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'}`}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center md:gap-4">
          <h1 className='md:text-2xl text-lg md:block hidden'>Crypto2</h1>
          <select
            value={coinTwo}
            onChange={(e) => setCoinTwo(e.target.value)}
            className="p-2 border rounded bg-transparent cursor-pointer lg:w-40 w-[100px] hover:border-blue-500 lg:text-md text-sm"
          >
            {coins2.map((coin) => (
              <option key={coin.id} value={coin.id} className={`${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'}`}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center md:gap-4 mr-2">
          <select
            id="period"
            value={period}
            onChange={handlePeriodChange}
            className={`${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'} lg:w-40 w-[100px] border p-2 lg:text-md text-sm cursor-pointer transition duration-200 hover:border-blue-500`}
          >
            <option value={7} className='md:text-md text-sm'>7 Days</option>
            <option value={30} className='md:text-md text-sm'>30 Days</option>
            <option value={60} className='md:text-md text-sm'>60 Days</option>
            <option value={90} className='md:text-md text-sm'>90 Days</option>
            <option value={120} className='md:text-md text-sm'>120 Days</option>
          </select>
        </div>
      </div>
    </div >
  );
};

export default ComparePage;
