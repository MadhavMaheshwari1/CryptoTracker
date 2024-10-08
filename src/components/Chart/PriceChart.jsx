import { useState, useContext } from 'react';
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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend
);

import { ThemeContext } from '../../contexts/ThemeContext';

const PriceChart = ({ priceData, volumeData, marketCapData, labels }) => {
  const { theme } = useContext(ThemeContext);
  const [selectedData, setSelectedData] = useState('price'); // Track selected dataset

  // Define colors for datasets based on Tailwind CSS colors
  const datasetColors = {
    price: {
      borderColor: '#3B82F6', // Tailwind blue-500
    },
    volume: {
      borderColor: '#34D399', // Tailwind green-500
    },
    marketCap: {
      borderColor: '#F87171', // Tailwind red-500
    },
  };

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
        borderColor: datasetColors[selectedData].borderColor, // Set dynamic border color
        fill: false,  // No filling under the line
        tension: 0.5,  // Smoother curve
        borderWidth: 2,  // Thicker border for visibility
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
        display: true,
        labels: {
          // Customize legend color based on the selected dataset
          generateLabels: (chart) => {
            const originalLabels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
            return originalLabels.map((label) => {
              if (label.text === 'Price') {
                label.strokeStyle = datasetColors.price.borderColor; // Set border color
                label.fillStyle = 'transparent'; // Set fill to transparent (or omit this line)
              } else if (label.text === 'Volume') {
                label.strokeStyle = datasetColors.volume.borderColor; // Set border color
                label.fillStyle = 'transparent'; // Set fill to transparent (or omit this line)
              } else if (label.text === 'Market Cap') {
                label.strokeStyle = datasetColors.marketCap.borderColor; // Set border color
                label.fillStyle = 'transparent'; // Set fill to transparent (or omit this line)
              }
              return label;
            });
          },
        },
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
