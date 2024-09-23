import React, { useContext, useEffect, useState, useRef } from 'react';
import { WatchListContext } from '../context/WatchListContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaRegStar, FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const WatchListPage = () => {
  const { watchList } = useContext(WatchListContext);
  const { theme } = useContext(ThemeContext);
  const [filteredWatchList, setFilteredWatchList] = useState(watchList);
  const [start, setStart] = useState(1);
  const [gridLayout, setGridLayout] = useState(true);
  const cardRefs = useRef([]);

  // Filter the watch list (this can be extended for search/filter purposes)
  const filterWatchList = (val) => {
    if (val === '') {
      setFilteredWatchList(watchList);
      return;
    }
    setFilteredWatchList(
      watchList.filter(item => item.name.toLowerCase().startsWith(val.toLowerCase()))
    );
  };

  const startHandler = (index) => {
    setStart(index + 1);
  };

  const cardRef = (el, index) => {
    cardRefs.current[index] = el;
  };

  if (watchList.length === 0) {
    return <h1 className='md:text-6xl text-3xl text-white flex justify-center items-center min-h-[85vh]'>No Items in the Watch List yet.</h1>;
  }

  return (
    <div className='max-w-[1880px] min-h-[85vh] mx-auto py-12 px-8'>
      <div className="flex-col">
        <div className="py-6 px-8 w-full">
          <input
            type="search"
            name="search"
            onChange={(e) => filterWatchList(e.target.value)}
            id="search"
            className={`w-full md:py-3 py-2 md:px-6 px-4 ${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'} rounded-full`}
            placeholder='Search'
          />
        </div>
        <div className="flex w-full px-8">
          <button
            className={`w-1/2 border-b-2 ${gridLayout ? 'border-blue-500 text-blue-500' : 'border-transparent'} transition-colors duration-400`}
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
      
      {filteredWatchList.length === 0 && (
        <div className='flex flex-col w-full h-[300px] justify-center items-center'>
          <button className='flex justify-center items-center py-5 px-8 bg-blue-500 mb-4 rounded-xl'>No Item Found</button>
          <button className='flex justify-center items-center py-3 px-6 bg-blue-500 rounded-xl' onClick={() => filterWatchList("")}>Clear Search</button>
        </div>
      )}

      <div className={`${gridLayout ? 'grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))]' : 'flex flex-col'} py-6 px-8 gap-5`}>
        {filteredWatchList.slice(start * 10 - 10, start * 10).map((item, index) => {
          const isPositive = item.changePercentage > 0;
          const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
          const changeBorder = isPositive ? 'border-green-500' : 'border-red-500';
          const changeBackground = isPositive ? 'bg-green-500' : 'bg-red-500';

          return (
            <Link
              to={`/WatchList/${item.name}`}
              key={item.id}
              ref={(el) => cardRef(el, index)}
              className={`${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'} md:py-5 md:px-6 px-2 py-2 rounded-xl flex ${gridLayout ? 'h-[300px] flex-col py-4 px-4' : 'grid sm:grid-cols-[30%,20%,10%,40%] grid-cols-[55%,0%,15%,30%] justify-between items-center'} border-2 border-transparent transition-colors duration-300`}
            >
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <img src={item.image} className='h-[30px] w-[30px] md:h-[60px] md:w-[60px]' alt={item.name} />
                  </div>
                  <div className="flex flex-col">
                    <h1 className='lg:text-xl text-sm font-semibold'>{item.symbol.toUpperCase()}</h1>
                    <h1 className='lg:text-md text-sm text-gray-600'>{item.name}</h1>
                  </div>
                </div>
                {gridLayout && (
                  <div className={`cursor pointer flex items-center border-2 rounded-full ${changeBorder} lg:w-[40px] lg:h-[40px] h-[25px] w-[25px] group relative`}>
                    <div className={`absolute w-full h-full top-0 left-0 ${changeBackground} opacity-0 group-hover:opacity-100 transition-all rounded-full`}></div>
                    <div className={`flex justify-center items-center w-[25px] lg:w-[40px] rounded-full`}>
                      <FaRegStar className={`${changeColor} group-hover:text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all lg:text-md md:text-[18px] text-[12px]`} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <div className={`text-right ${changeColor}`}>
                  {item.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WatchListPage;
