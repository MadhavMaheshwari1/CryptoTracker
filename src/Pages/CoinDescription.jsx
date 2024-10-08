import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import PriceChart from '../components/Chart/PriceChart'; // Import the area chart component
import { FaSpinner } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Dashboard/Toast';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext';
import CryptoCard from '../components/CryptoInfo/CryptoCard';

const CoinDescriptionPage = () => {
  const { theme } = useContext(ThemeContext);
  const [retryCount, setRetryCount] = useState(0);

  function indexOfNthOccurrence(str, char, n) {
    let index = -1;

    for (let i = 0; i < n; i++) {
      index = str.indexOf(char, index + 1);  // Find the next occurrence
      if (index === -1) return -1; // If the character isn't found
    }

    return index + 1;
  }

  const { toasts, dismissToast } = useContext(ToastContext);

  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState({ error: false, errorMessage: null });
  const [desc, setDesc] = useState('');

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
      const desc = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinData.id}`);
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
      setTimer(30);
      setError(() => {
        return ({ error: true, errorMessage: err.message })
      });
      setLoading(false);
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
    setRetryCount(prev => prev + 1);
    setTimer(30);
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
  }, [error.error, retryCount]);


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
      <div className="ps-8 pe-10">
        <CryptoCard
          key={coinData.id}
          coin={coinData}
          theme={theme}
          gridLayout={false}
        />
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
        <div className="flex flex-col absolute top-28 md:right-10 right-13">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} onDismiss={() => dismissToast(toast.id)} duration={4000} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoinDescriptionPage;
