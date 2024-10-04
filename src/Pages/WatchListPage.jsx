import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import SearchInput from '../components/SearchInput';
import LayoutToggle from '../components/LayoutToogle';
import { WatchListContext } from '../context/WatchListContext';
import CryptoList from '../components/CryptoList';
import { FaSpinner } from "react-icons/fa6";
import axios from 'axios';

const WatchListPage = ({ noOfCoinsPerPage = 10 }) => {

  const { watchList } = useContext(WatchListContext);
  const { theme } = useContext(ThemeContext);
  const [gridLayout, setGridLayout] = useState(true);
  const [start, setStart] = useState(1);

  return (
    <div className='max-w-[1880px] min-h-[85vh] mx-auto py-6'>
      <LayoutToggle gridLayout={gridLayout} setGridLayout={setGridLayout} />
      <CryptoList
        filteredCryptoData={watchList}
        length={watchList.length}
        noOfCoinsPerPage={noOfCoinsPerPage}
        start={start}
        theme={theme}
        gridLayout={gridLayout}
        setStart={setStart}
      />
    </div>
  );
};

export default WatchListPage;
