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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
  Filler
);

import { ThemeContext } from '../context/ThemeContext';

const PriceChart = ({ priceData, volumeData, marketCapData, labels }) => {
  const { theme } = useContext(ThemeContext);
  const [selectedData, setSelectedData] = useState('price'); // Track selected dataset

  // Function to handle dynamic dataset selection
  const handleDataSelection = (dataset) => {
    setSelectedData(dataset);
  };

  // Generate the dataset based on the selected type
  const getData = () => {
    switch (selectedData) {
      case 'price':
        return priceData;
      case 'volume':
        return volumeData;
      case 'marketCap':
        return marketCapData;
      default:
        return [];
    }
  };

  // Data for the chart based on the selected dataset
  const data = {
    labels,  // X-axis labels (e.g., time)
    datasets: [
      {
        label: `${selectedData.charAt(0).toUpperCase() + selectedData.slice(1)}`,  // Capitalize label
        data: getData(),
        borderColor: '#3B82F6', // Customize line color (blue)
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // Light blue background
        tension: 0.5,  // Smoother curve
        borderWidth: 1,
        pointRadius: 0,  // No visible points on the line
        pointHoverRadius: 5,  // Points visible when hovered
      },
    ],
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
        display: true,  // Enable legend
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
      mode: 'nearest',
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
