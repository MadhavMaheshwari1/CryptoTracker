import React from 'react';
import CryptoCard from './CryptoCard';
import { FaCircleArrowLeft } from "react-icons/fa6";
import { FaCircleArrowRight } from "react-icons/fa6";
import { ToastContext } from '../context/ToastContext';
import { useContext } from 'react';
import Toast from './Toast'

const CryptoList = ({ filteredCryptoData, noOfCoinsPerPage, start, theme, gridLayout, length, setStart }) => {

  const { toasts, dismissToast} = useContext(ToastContext);

  return (
    <>
      <div className={`${gridLayout ? 'grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))]' : 'flex flex-col'} py-6 px-8 gap-5 w-full`}>
        {filteredCryptoData.slice(start * noOfCoinsPerPage - noOfCoinsPerPage, start * noOfCoinsPerPage).map((coin) => (
          <CryptoCard
            key={coin.id}
            coin={coin}
            theme={theme}
            gridLayout={gridLayout}
          />
        ))}
      </div>
      {filteredCryptoData.length === 0 && (<div className='flex flex-col w-full h-[300px] justify-center items-center'>
        <button className='flex justify-center items-center py-5 px-8 bg-blue-500 mb-4 rounded-xl'>No Item Found</button>
      </div>)}
      {
        filteredCryptoData.length > 0 && (
          <div className="flex w-full items-center justify-center gap-4" >
            <button disabled={start === 1} onClick={() => setStart(start - 1)} className={`${start === 1 ? 'disabled' : ''} md:text-4xl text-2xl`}><FaCircleArrowLeft /></button>
            {start !== 1 && <div className="dots">...</div>}
            {
              [...Array((Math.ceil(filteredCryptoData.length / noOfCoinsPerPage)))].map((_, index) => (
                <button key={index} className={`${((index + 1 >= start && index + 1 <= (start + 4))) ? 'flex' : 'hidden'} ${((index + 1 >= start && index + 1 <= (start + 4))) ? 'flex' : 'hidden'} md:w-[40px] items-center justify-center md:h-[40px] w-[25px] h-[25px] border-2 ${theme === 'dark' ? 'border-white' : 'border-black'} rounded-full ${start === (index + 1) ? 'bg-blue-500' : ''}`} onClick={() => setStart(index + 1)}>{index + 1}</button>
              ))
            }
            {start !== (Math.ceil(filteredCryptoData.length / noOfCoinsPerPage)) && <div className="dots">...</div>}
            <button disabled={start >= Math.max(Math.ceil(length / noOfCoinsPerPage) - 4, 1)} onClick={() => setStart(start + 1)} className={`${start >= Math.max(Math.ceil(length / noOfCoinsPerPage) - 4, 1) ? 'disabled' : ''} md:text-4xl text-2xl`}>< FaCircleArrowRight /></button>
          </div>
        )
      }
      <div className="flex flex-col absolute top-28 md:right-10 right-13">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} onDismiss={() => dismissToast(toast.id)} duration={4000} />
        ))}
      </div>
    </>
  );
};

export default CryptoList;
