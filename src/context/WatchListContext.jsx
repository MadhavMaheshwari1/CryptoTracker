import { useEffect, useState, createContext } from "react";

// Create the context
const WatchListContext = createContext();

const WatchListProvider = ({ children }) => {
    const [watchList, setWatchList] = useState(() => {
        const storedList = localStorage.getItem('watchList');
        return storedList ? JSON.parse(storedList) : [];
    });

    const addItemToWatchList = (coinData) => {
        setWatchList((prevList) => {
            const updatedList = [...prevList, coinData]; // Append the new item
            localStorage.setItem('watchList', JSON.stringify(updatedList)); // Save to localStorage
            return updatedList; // Update state
        });
    };

    const removeItemFromWatchList = (coinData) => {
        const indexToRemove = watchList.findIndex(item => item.name === coinData.name);

        if (indexToRemove !== -1) {
            const updatedArray = [
                ...watchList.slice(0, indexToRemove),
                ...watchList.slice(indexToRemove + 1),
            ];
            localStorage.setItem('watchList', JSON.stringify(updatedArray)); // Save to localStorage
            setWatchList(updatedArray);
        };
    }

    return (
        <WatchListContext.Provider value={{ watchList, addItemToWatchList, removeItemFromWatchList }}>
            {children}
        </WatchListContext.Provider>
    );
};

// Export both the context and the provider
export { WatchListContext, WatchListProvider };
