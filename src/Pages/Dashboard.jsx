import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaRegStar } from "react-icons/fa6";

const Dashboard = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [error, setError] = useState(null);
  const [gridLayout, setGridLayout] = useState(true);

  useEffect(() => {
    const fetchCryptoData = async () => {
      const cachedData = localStorage.getItem('cryptoData');
      if (cachedData) {
        setCryptoData(JSON.parse(cachedData));
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
        localStorage.setItem('cryptoData', JSON.stringify(response.data));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='max-w-[1880px] mx-auto py-6 px-8'>
      <Navbar />
      <div className="flex-col">
        <div className="py-6 px-8 w-full">
          <input
            type="search"
            name="search"
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
      <div className={`${gridLayout ? 'grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))]' : 'flex flex-col'} py-6 px-8 gap-5`}>
        {cryptoData.map((coin) => {
          const price24hAgo = coin.current_price - coin.price_change_24h;
          const percentageChange = ((coin.price_change_24h / price24hAgo) * 100).toFixed(2);
          const isPositive = percentageChange > 0;
          const changeText = isPositive ? `+${percentageChange}%` : `${percentageChange}%`;
          const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
          const borderColor = isPositive ? 'border-green-400' : 'border-red-400';

          return (
            <Link
              to="/"
              key={coin.id}
              className={`${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'} py-5 px-6 rounded-xl flex-col ${gridLayout ? 'h-[300px]' : ''} border-2 ${borderColor} transition-colors duration-300`}
            >
              <div className="flex justify-between">
                <div className="flex w-[150px] gap-4">
                  <div className="flex items-center">
                    <img src={coin.image} className='w-[50px] h-[50px]' alt={coin.name} />
                  </div>
                  <div className="flex-col">
                    <h1 className='text-xl font-semibold'>{coin.symbol.toUpperCase()}</h1>
                    <h1 className='text-md text-gray-400'>{coin.name}</h1>
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className={`flex justify-center items-center cursor-pointer w-[40px] h-[40px] rounded-full ${changeColor} border-2 ${isPositive ? 'border-2 border-green-500' : 'border-2 border-red-500'}`}>
                    <FaRegStar size={22} />
                  </div>
                </div>
              </div>
              <div className="flex">
                <button className={changeColor}>{changeText}</button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
