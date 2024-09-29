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
  const [desc1, setDesc1] = useState('');
  const [desc2, setDesc2] = useState('');
  const [isExpanded1, setIsExpanded1] = useState(false); // Track the "Read More/Less" state
  const [isExpanded2, setIsExpanded2] = useState(false); // Track the "Read More/Less" state

  const createMarkup = (htmlText) => {
    return { __html: htmlText };
  };

  const toggleReadMore2 = () => {
    setIsExpanded2(!isExpanded2);
  };

  const toggleReadMore1 = () => {
    setIsExpanded1(!isExpanded1);
  };


  const fetchHistoricalData = async () => {
    try {
      const [resultCoinOne, resultCoinTwo, desc1,desc2] = await Promise.all([
        axios.get(`https://api.coingecko.com/api/v3/coins/${coinOne}/market_chart?vs_currency=usd&days=${period}`),
        axios.get(`https://api.coingecko.com/api/v3/coins/${coinTwo}/market_chart?vs_currency=usd&days=${period}`),
        axios.get(`https://api.coingecko.com/api/v3/coins/${coinOne}`),
        axios.get(`https://api.coingecko.com/api/v3/coins/${coinTwo}`)
      ]);

      setDesc1(desc1.data.description.en);
      setDesc2(desc2.data.description.en);
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

  function indexOfNthOccurrence(str, char, n) {
    let index = -1;

    for (let i = 0; i < n; i++) {
      index = str.indexOf(char, index + 1);  // Find the next occurrence
      if (index === -1) return -1; // If the character isn't found
    }

    return index + 1;
  }

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

  const retryHandler = () => {
    fetchCoinsData();
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

  useEffect(() => {
    fetchCoinsData();
    fetchHistoricalData();
  }, [coinOne, coinTwo, period]);

  if (loading) {
    return <div className='w-[90vw] h-[100vh] flex justify-center items-center animate-spin'><FaSpinner size={52} /></div>;
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
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={60}>60 Days</option>
            <option value={90}>90 Days</option>
            <option value={120}>120 Days</option>
          </select>
        </div>
      </div>
      {/* Pass the array of coins data to PriceChart */}
      <div className="px-4">      <PriceChart
        coins={coinData}
        labels={labels}
        period={period}
      /></div>

      <List coinData={selectedCoin1} />
      <List coinData={selectedCoin2} />

      <div className={`mb-4 coin--description px-10 md:text-xl text-[12px] ${theme === 'dark' ? 'text-gray-300' : ''} rounded-xl py-8 mx-6 me-4 ${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'}`}>
        <p dangerouslySetInnerHTML={createMarkup(isExpanded1 ? desc1 : desc1.slice(0, indexOfNthOccurrence(desc1, '.', 2)))} />
        {desc1.length > (indexOfNthOccurrence(desc1, '.', 3)) && (
          <button
            onClick={toggleReadMore1}
            className="text-blue-500 hover:underline mt-2 block"
          >
            {isExpanded1 ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
      <div className={`coin--description px-10 md:text-xl text-[12px] ${theme === 'dark' ? 'text-gray-300' : ''} rounded-xl py-8 mx-6 me-4 ${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'}`}>
        <p dangerouslySetInnerHTML={createMarkup(isExpanded2 ? desc2 : desc2.slice(0, indexOfNthOccurrence(desc2, '.', 2)))} />
        {desc2.length > (indexOfNthOccurrence(desc2, '.', 3)) && (
          <button
            onClick={toggleReadMore2}
            className="text-blue-500 hover:underline mt-2 block"
          >
            {isExpanded2 ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
