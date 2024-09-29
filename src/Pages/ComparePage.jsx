import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PriceChart from '../components/PriceChart';
import List from '../components/List'; // Import the List component
import { Link } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa6";
import { ThemeContext } from '../context/ThemeContext';

const ComparePage = () => {
  const { theme } = useContext(ThemeContext);
  const [coins1, setCoins1] = useState([]);
  const [coins2, setCoins2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin1, setSelectedCoin1] = useState([]);
  const [selectedCoin2, setSelectedCoin2] = useState([]);
  const [coinOne, setCoinOne] = useState('bitcoin');
  const [coinTwo, setCoinTwo] = useState('ethereum');
  const [coinData, setCoinData] = useState([]); // Array to hold both coinOne and coinTwo data
  const [labels, setLabels] = useState([]);
  const [period, setPeriod] = useState(7);
  const [error, setError] = useState({ error: false, errorMessage: null });
  const [timer, setTimer] = useState(0);

  const fetchHistoricalData = async () => {
    try {
      const [resultCoinOne, resultCoinTwo] = await Promise.all([
        axios.get(`https://api.coingecko.com/api/v3/coins/${coinOne}/market_chart?vs_currency=usd&days=${period}`),
        axios.get(`https://api.coingecko.com/api/v3/coins/${coinTwo}/market_chart?vs_currency=usd&days=${period}`)
      ]);

      // Process CoinOne data
      const pricesCoinOne = resultCoinOne.data.prices.map(price => price[1]);
      const volumesCoinOne = resultCoinOne.data.total_volumes.map(volume => volume[1]);
      const marketCapsCoinOne = resultCoinOne.data.market_caps.map(marketCap => marketCap[1]);

      // Process CoinTwo data
      const pricesCoinTwo = resultCoinTwo.data.prices.map(price => price[1]);
      const volumesCoinTwo = resultCoinTwo.data.total_volumes.map(volume => volume[1]);
      const marketCapsCoinTwo = resultCoinTwo.data.market_caps.map(marketCap => marketCap[1]);

      // Dates (can be taken from any of the coin data as they have the same timestamps)
      const dates = resultCoinOne.data.prices.map(price => new Date(price[0]));

      // Set coin data as an array of objects
      setCoinData([
        {
          name: coinOne,
          priceData: pricesCoinOne,
          volumeData: volumesCoinOne,
          marketCapData: marketCapsCoinOne,
        },
        {
          name: coinTwo,
          priceData: pricesCoinTwo,
          volumeData: volumesCoinTwo,
          marketCapData: marketCapsCoinTwo,
        }
      ]);

      setLabels(dates);
      setLoading(false);
    } catch (err) {
      setTimer(10);
      setError(() => ({ error: true, errorMessage: err.message }));
      setLoading(false);
    }
  };

  const fetchCoinsData = async () => {
    const cachedData = localStorage.getItem('cryptoData');
    const cachedTimestamp = localStorage.getItem('cryptoDataTimestamp');
    const currentTime = new Date().getTime();

    if (cachedData && cachedTimestamp && (currentTime - parseInt(cachedTimestamp, 10)) < 180000) {
      const coinsList = JSON.parse(cachedData);
      setCoins1(coinsList.filter(coin => coin.id !== coinTwo));
      setCoins2(coinsList.filter(coin => coin.id !== coinOne));
      setSelectedCoin1(coinsList.find(coin => coin.id === coinOne) || null);
      setSelectedCoin2(coinsList.find(coin => coin.id === coinTwo) || null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      });

      const coinsList = response.data;
      setCoins1(coinsList.filter(coin => coin.id !== coinTwo));
      setCoins2(coinsList.filter(coin => coin.id !== coinOne));
      setSelectedCoin1(coinsList.find(coin => coin.id === coinOne) || null);
      setSelectedCoin2(coinsList.find(coin => coin.id === coinTwo) || null);
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
    fetchHistoricalData();
  }, [coinOne, coinTwo, period]);

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
            {timer === 0 && (<button className="bg-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-700" onClick={retryHandler}>Retry</button>)}
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
            onChange={(e) => setPeriod(parseInt(e.target.value))}
            className="p-2 border rounded bg-transparent lg:w-40 w-[86px] cursor-pointer hover:border-blue-500"
          >
            <option value={7}>1 Week</option>
            <option value={14}>2 Weeks</option>
            <option value={30}>1 Month</option>
            <option value={180}>6 Months</option>
            <option value={365}>1 Year</option>
          </select>
        </div>
      </div>
      {/* Pass the array of coins data to PriceChart */}
      <PriceChart
        coins={coinData}
        labels={labels}
        period={period}
      />
      <List coinData={selectedCoin1}/>
      <List coinData={selectedCoin2}/>
    </div>
  );
};

export default ComparePage;
