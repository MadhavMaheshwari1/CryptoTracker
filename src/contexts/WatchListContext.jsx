import { useState, createContext } from "react";

// Create the context
const WatchListContext = createContext();

const WatchListProvider = ({ children }) => {
    const [watchList, setWatchList] = useState(() => {
        const storedList = localStorage.getItem('watchList');
        return storedList ? JSON.parse(storedList) : [];
    });

    const addItemToWatchList = (coinData) => {
        setWatchList((prevList) => {
            // Filter out existing items to ensure uniqueness by name
            const updatedList = [...prevList.filter(item => item.name !== coinData.name), coinData];

            // Save the updated list to localStorage
            localStorage.setItem('watchList', JSON.stringify(updatedList));
            return updatedList; // Update the state
        });
    };

    const removeItemFromWatchList = (coinData) => {
        const updatedArray = watchList.filter(item => item.name !== coinData.name);

        // Only update if there's a change
        if (updatedArray.length !== watchList.length) {
            localStorage.setItem('watchList', JSON.stringify(updatedArray)); // Save to localStorage
            setWatchList(updatedArray);
        }
    };

    return (
        <WatchListContext.Provider value={{ watchList, addItemToWatchList, removeItemFromWatchList }}>
            {children}
        </WatchListContext.Provider>
    );
};

// Export both the context and the provider
export { WatchListContext, WatchListProvider };
