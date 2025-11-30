"use client";

import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyChartProps {
  data: Array<{
    month: string;
    type: string;
    total: number;
  }>;
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  const months = [...new Set(data.map((d) => d.month))];

  const incomeData = months.map((month) => {
    const item = data.find((d) => d.month === month && d.type === "INCOME");
    return item ? Number(item.total) : 0;
  });

  const expenseData = months.map((month) => {
    const item = data.find((d) => d.month === month && d.type === "EXPENSE");
    return item ? Number(item.total) : 0;
  });

  const chartData = {
    labels: months.map((m) =>
      new Date(m).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    ),
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Expense",
        data: expenseData,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Trend",
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

interface CategoryChartProps {
  data: Array<{
    category: { name: string; color: string };
    total: number;
  }>;
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.category?.name || "Unknown"),
    datasets: [
      {
        data: data.map((d) => Number(d.total)),
        backgroundColor: data.map((d) => d.category?.color || "#3B82F6"),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Category Breakdown",
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}
