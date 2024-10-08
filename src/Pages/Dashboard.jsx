import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import SearchInput from '../components/Dashboard/SearchInput';
import LayoutToggle from '../components/CryptoInfo/LayoutToogle';
import CryptoList from '../components/CryptoInfo/CryptoList';
import { FaSpinner } from "react-icons/fa6";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = ({ noOfCoinsPerPage = 10 }) => {

  const [cryptoData, setCryptoData] = useState([]);
  const [filteredCryptoData, setFilteredCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { theme } = useContext(ThemeContext);
  const [gridLayout, setGridLayout] = useState(true);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState({ error: false, errorMessage: null });
  const [start, setStart] = useState(1);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  useEffect(() => {
    if (error.error) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer >= 1) {
            return prevTimer - 1; // Decrease timer
          } else {
            clearInterval(interval);
            return 0; // Ensure timer stays at 0
          }
        });
      }, 1000);
      return () => clearInterval(interval); // Clean up interval on component unmount
    }
  }, [error.error, retryCount]);

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
      setTimer(30);
      setError(() => {
        return ({ error: true, errorMessage: err.message })
      });
      setLoading(false);
    }
  };

  const retryHandler = () => {
    fetchCryptoData();
    setLoading(true);
    setRetryCount(prev => prev + 1);
    setTimer(30);
  };

  const inputSearchHandler = (value) => {
    setFilteredCryptoData(value === '' ? cryptoData : cryptoData.filter(c => c.name.toLowerCase().startsWith(value.toLowerCase())));
  };

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
      <SearchInput onSearch={inputSearchHandler} theme={theme} />
      <LayoutToggle gridLayout={gridLayout} setGridLayout={setGridLayout} />
      <CryptoList
        filteredCryptoData={filteredCryptoData}
        length={cryptoData.length}
        noOfCoinsPerPage={noOfCoinsPerPage}
        start={start}
        theme={theme}
        gridLayout={gridLayout}
        setStart={setStart}
      />
    </div>
  );
};

export default Dashboard;
