import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register necessary ChartJS components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend
);
import { ThemeContext } from '../context/ThemeContext';
import {useContext } from 'react';

const PriceChart = ({ priceData, volumeData, marketCapData, labels}) => {
  const { theme } = useContext(ThemeContext);
  const [selectedData, setSelectedData] = useState('price'); // Track selected dataset

  // Function to handle dynamic dataset selection
  const handleDataSelection = (dataset) => {
    setSelectedData(dataset);
  };

  // Data for the chart based on selected dataset
  const data = {
    labels,  // X-axis labels (e.g., time)
    datasets: [
      selectedData === 'price' && {
        label: 'Price',
        data: priceData,
        borderColor: '#3B82F6',  // Blue glowing line
        backgroundColor: 'rgba(59, 130, 246, 0.2)',  // Light blue fill below the line
        fill: 'start',  // Fill below the line only
        tension: 0.4,  // Smoother curve
        borderWidth: 2,  // Thicker line for more visibility
      },
      selectedData === 'volume' && {
        label: 'Volume',
        data: volumeData,
        borderColor: '#22C55E',  // Green glowing line
        backgroundColor: 'rgba(34, 197, 94, 0.2)',  // Light green fill
        fill: 'start',
        tension: 0.4,
        borderWidth: 2,
      },
      selectedData === 'marketCap' && {
        label: 'Market Cap',
        data: marketCapData,
        borderColor: '#EF4444',  // Red glowing line
        backgroundColor: 'rgba(239, 68, 68, 0.2)',  // Light red fill
        fill: 'start',
        tension: 0.4,
        borderWidth: 2,
      },
    ].filter(Boolean),  // Remove any false datasets
  };

  // Determine axis color based on theme
  const axisColor = theme === 'dark' ? '#fff' : '#000'; 

  // Chart options
  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        grid: {
          color: '#333',  // Darker grid for better contrast
        },
        ticks: {
          color: axisColor,  // Conditionally apply color for x-axis ticks
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: '#333',  // Darker grid for Y axis
        },
        ticks: {
          color: axisColor,  // Conditionally apply color for y-axis ticks
        },
      },
    },
    plugins: {
      legend: {
        display: false,  // Hide legend if you want a clean look
      },
    },
  };

  return (
    <div>
      {/* Buttons to select different datasets */}
      <div className="button-group">
        <button onClick={() => handleDataSelection('price')} className="bg-blue-500 text-white p-2 m-2">Price</button>
        <button onClick={() => handleDataSelection('volume')} className="bg-green-500 text-white p-2 m-2">Volume</button>
        <button onClick={() => handleDataSelection('marketCap')} className="bg-red-500 text-white p-2 m-2">Market Cap</button>
      </div>
      {/* Render Line chart */}
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;
