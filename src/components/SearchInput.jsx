import React from 'react';
import { useState, useEffect } from 'react';

const SearchInput = ({ onSearch, theme }) => {
  const [value, setValue] = useState('');

  const inputChangeHandler = (e) => {
    setValue(e.target.value);
  }

  useEffect(() => {
    onSearch(value);
  }, [value])

  return (
    <div className="py-6 px-8 w-full">
      <input
        type="search"
        value={value}
        onChange={(e) => inputChangeHandler(e)}
        className={`w-full md:py-3 py-2 md:px-6 px-4 ${theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-gray-100'} rounded-full`}
        placeholder='Search'
      />
    </div>
  );
};

export default SearchInput;
