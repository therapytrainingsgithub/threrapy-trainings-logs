'use client'

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom sizing
  };

  return (
    <div style={{ position: 'relative', width: '300px', height: '300px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
