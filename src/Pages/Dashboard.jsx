import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridLayout, setGridLayout] = useState(true);

  useEffect(() => {
    // Fetch market data for 100 cryptocurrencies from CoinGecko
    const fetchCryptoData = async () => {
      // Check if data is in local storage
      const cachedData = localStorage.getItem('cryptoData');
      if (cachedData) {
        console.log(JSON.parse(cachedData));
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
        <div className="py-6 px-8 w-full"><input type="search" name="search" id="search" className='w-full md:py-3 py-2 md:px-6 px-4 bg-[#111111] rounded-full' placeholder='Search' /></div>
        <div className="flex w-full px-8">
          <button className={`w-1/2  border-b-2 ${gridLayout ? 'border-blue-500' : 'border-transparent '} transition-colors duration-300`} onClick={() => setGridLayout(true)}>Grid</button>
          <button className={`w-1/2 border-b-2 ${gridLayout ? ' border-transparent' : 'border-blue-500'} transition-colors duration-300`} onClick={() => setGridLayout(false)}>List</button>
        </div>
      </div>
      <div className={`${gridLayout ? 'grid lg:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] grid-cols-2' : 'flex flex-col'} py-6 px-8 gap-5`}>
        {cryptoData.map((coin) => (
          <div key={coin.id} className='bg-[#1B1B1B] py-4 px-6 rounded-xl flex-col h-[300px]'>
            <div className="flex">
              <img src={coin.image} className='w-[50px]' alt={coin.name} />
            </div>
            <h1>{coin.name}</h1>
            <h1>{coin.symbol.toUpperCase()}</h1>
            <h1>${coin.current_price.toLocaleString()}</h1>
            <h1>${coin.market_cap.toLocaleString()}</h1>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;
