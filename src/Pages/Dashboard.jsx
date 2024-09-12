import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch market data for 100 cryptocurrencies from CoinGecko
    const fetchCryptoData = async () => {
      // Check if data is in local storage
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
      <h1>Top 100 Cryptocurrencies by Market Cap</h1>
      <div className="grid grid-cols-5 py-2 px-4 gap-2">
        {cryptoData.map((coin, index) => (
          <div key={coin.id} className=' bg-gray-500 py-4 px-6'>
            <h1>{index + 1}</h1>
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
