import React, { useState, useContext } from 'react';
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
  Filler,
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
  Legend,
  Filler // Needed for the fill effect under the line
);

import { ThemeContext } from '../context/ThemeContext';

const PriceChart = ({ priceData, volumeData, marketCapData, labels }) => {
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
        backgroundColor: 'rgba(59, 130, 246, 0.2)',  // Light blue with 20% opacity
        fill: true,  // Fill below the line
        tension: 0.5,  // Smoother curve
        borderWidth: 1,
        pointRadius: 0,  // No visible points on the line
        pointHoverRadius: 5,  // Points visible when hovered
      },
      selectedData === 'volume' && {
        label: 'Volume',
        data: volumeData,
        borderColor: '#22C55E',  // Green glowing line
        backgroundColor: 'rgba(34, 197, 94, 0.2)',  // Light green with 20% opacity
        fill: true,
        tension: 0.5,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      selectedData === 'marketCap' && {
        label: 'Market Cap',
        data: marketCapData,
        borderColor: '#EF4444',  // Red glowing line
        backgroundColor: 'rgba(239, 68, 68, 0.2)',  // Light red with 20% opacity
        fill: true,
        tension: 0.5,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ].filter(Boolean),  // Remove any false datasets
  };

  // Determine axis color based on theme
  const axisColor = theme === 'dark' ? '#fff' : '#000';

  // Chart options with background color change
  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        grid: {
          color: theme === 'dark' ? '#000' : '#e0e0e0',
        },
        ticks: {
          color: axisColor,
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: theme === 'dark' ? '#000' : '#e0e0e0',
        },
        ticks: {
          color: axisColor,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        pointHoverRadius: 5, // Radius of the point when hovered
        pointHitRadius: 10,  // Larger hit area for points
      },
    },
    interaction: {
      mode: 'nearest',  // Trigger the nearest point when hovering
      intersect: false,  // Do not require direct intersection with a point to trigger hover
    },
    hover: {
      mode: 'nearest',
      intersect: false,  // Allows hovering over filled area to show points
    },
  };




  return (
    <div className='px-4'>
      {/* Buttons to select different datasets */}
      <div className="button-group mt-2 mb-8">
        <button onClick={() => handleDataSelection('price')} className="bg-blue-500 text-white md:p-2 py-1 mr-2 px-2 rounded-xl md:text-md text-sm">Price</button>
        <button onClick={() => handleDataSelection('volume')} className="bg-green-500 text-white md:p-2 py-1 px-2 m-2 rounded-xl md:text-md text-sm">Volume</button>
        <button onClick={() => handleDataSelection('marketCap')} className="bg-red-500 text-white md:p-2 py-1 px-2 m-2 rounded-xl md:text-md text-sm">Market Cap</button>
      </div>
      {/* Render Line chart */}
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;
