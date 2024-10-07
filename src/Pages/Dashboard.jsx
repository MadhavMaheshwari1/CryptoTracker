import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import SearchInput from '../components/SearchInput';
import LayoutToggle from '../components/LayoutToogle';
import CryptoList from '../components/CryptoList';
import { WatchListContext } from '../context/WatchListContext';
import { FaSpinner } from "react-icons/fa6";
import axios from 'axios';

const Dashboard = ({ noOfCoinsPerPage = 10 }) => {

  const [cryptoData, setCryptoData] = useState([]);
  const [filteredCryptoData, setFilteredCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const [gridLayout, setGridLayout] = useState(true);
  const [error, setError] = useState({ error: false, errorMessage: null });
  const [start, setStart] = useState(1);

  useEffect(() => {
    fetchCryptoData();
  }, []);

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
      // setTimer(10);
      setError(() => {
        return ({ error: true, errorMessage: err.message })
      });
      setLoading(false);
    }
  };

  const retryHandler = () => {
    fetchCryptoData();
    setLoading(true);
  };

  const inputSearchHandler = (value) => {
    setFilteredCryptoData(value === '' ? cryptoData : cryptoData.filter(c => c.name.toLowerCase().startsWith(value.toLowerCase())));
  };

  if (loading) {
    return <div className='w-[90vw] h-[100vh] flex justify-center items-center animate-spin'><FaSpinner size={52} /></div>;
  }

  if (error.error) {
    return (
      <div className="error-screen">
        <p>Error: {error.errorMessage}</p>
        <button onClick={retryHandler}>Retry</button>
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
