// docs: https://apexcharts.com/docs/react-charts/
import React, { useState } from "react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const PieChart = ({ labels, seriesData, width = "290" }) => {
  const options = {
    labels: labels,
    legend: {
      fontSize: "14",
    },
    colors: [
      "#3498DB",
      "#A5B1C2",
      "#7F8C8D",
      "#F4F4F4",
      "#E67E22",
      "#2ECC71",
      "#BCBDBE",
      "#34495E",
      "#F1C40F",
      "#E74C3C",
      "#9B59B6",
      "#1ABC9C",
      "#E67E22",
      "#2ECC71",
    ],
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "16px",
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -15, // how centered the labels are
        },
        customScale: 1,
        offsetY: 0, // You can also adjust the vertical position if needed
        offsetX: 0, // Adjust the horizontal position if needed
      },
    },
  };

  return (
    <div className="pie-chart">
      <Chart options={options} series={seriesData} type={"pie"} width={width} />
    </div>
  );
};

PieChart.propTypes = {
  labels: PropTypes.array.isRequired,
  seriesData: PropTypes.array.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PieChart;
