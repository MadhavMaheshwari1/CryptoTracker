import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import LayoutToggle from '../components/CryptoInfo/LayoutToogle';
import { WatchListContext } from '../contexts/WatchListContext';
import CryptoList from '../components/CryptoInfo/CryptoList';

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
