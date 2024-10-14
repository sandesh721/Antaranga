import React, { useEffect, useRef } from 'react';
import { Chart, CategoryScale, BarElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
Chart.register(
  CategoryScale,
  BarElement,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data }) => {
  const chartRef = useRef(null); // Ref for the canvas
  const chartInstanceRef = useRef(null); // Ref for the Chart instance

  // Function to render the chart
  const renderChart = () => {
    // Destroy previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Create a new chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar', // You can change this to 'line', 'pie', etc.
      data: data, // Your chart data
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: 'Sentiment Analysis Results',
          },
        },
      },
    });
  };

  useEffect(() => {
    renderChart(); // Render the chart when the component is mounted or updated

    // Clean up chart instance when the component is unmounted
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]); // Re-render when 'data' changes

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <canvas ref={chartRef}></canvas> {/* The canvas element for Chart.js */}
    </div>
  );
};

export default ChartComponent;
