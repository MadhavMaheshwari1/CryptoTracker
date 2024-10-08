import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Dashboard from './Pages/Dashboard';
import WatchListPage from './Pages/WatchListPage';
import { useEffect, useRef, useContext } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import CoinDescriptionPage from './Pages/CoinDescription';
import Footer from './components/Home/Footer';
import Navbar from './components/Home/Navbar';

function App() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const { theme } = useContext(ThemeContext);
  const cursorRef = useRef(null); // Reference to the custom cursor element

  useEffect(() => {
    const handleMouseMovement = (e) => {
      // Constrain the x position within the viewport
      const constrainedX = Math.min(e.clientX, window.innerWidth - 30);

      // Calculate the total y position considering the scroll position
      const totalY = e.clientY + window.scrollY;

      mousePosition.current.x = constrainedX;
      mousePosition.current.y = totalY;
    };

    // Update the cursor position smoothly using requestAnimationFrame
    const updateCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mousePosition.current.x}px`;
        cursorRef.current.style.top = `${mousePosition.current.y}px`;
      }
      requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', handleMouseMovement);
    requestAnimationFrame(updateCursor); // Start the update loop

    return () => {
      window.removeEventListener('mousemove', handleMouseMovement);
    };
  }, []);

  return (
    <>
      <div
        className="lg:block hidden cursor--custom"
        ref={cursorRef} // Set the ref for the custom cursor
        style={{
          position: 'absolute',
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          border: `2px solid ${theme === 'dark' ? 'white' : 'black'}`,
          pointerEvents: 'none', // So that it doesn’t block clicks
          transform: 'translate(-50%, -50%)', // Center the cursor on the mouse position
          zIndex: 1000, // Ensures it stays on top
        }}
      />

      {/* Main App Content */}
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/WatchList" element={<WatchListPage noOfCoinsPerPage={10} />} />
          <Route path="/Dashboard" element={<Dashboard noOfCoinsPerPage={10} />} />
          <Route path="/Dashboard/:CoinName" element={<CoinDescriptionPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
