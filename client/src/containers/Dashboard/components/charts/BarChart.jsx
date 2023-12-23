// docs: https://apexcharts.com/docs/react-charts/
import React, { useState } from "react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const BarChart = ({
  categories,
  // for single set of bars
  seriesData = [],
  //   for multiple sets of bars
  seriesList = [],
  type = "bar",
  width = "100%",
  height = "320",
  stacked = false,
  stackType = "",
  horizontal = false,
}) => {
  const options = {
    chart: {
      id: "basic-bar",
      type: type,
      stacked: stacked,
      stackType: stackType,
    },
    colors: ["#3498DB", "#A5B1C2"],
    xaxis: {
      categories: categories,
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: horizontal,
        columnWidth: "60%",
      },
    },
  };

  const series =
    seriesList.length > 0
      ? seriesList
      : [
          {
            name: "sales",
            data: seriesData,
          },
        ];

  return (
    <div className="BarChart">
      <Chart
        options={options}
        series={series}
        type={type}
        width={width}
        height={height}
      />
    </div>
  );
};

BarChart.propTypes = {
  categories: PropTypes.array.isRequired,
  seriesData: PropTypes.array,
  seriesList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
  ),
  type: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stacked: PropTypes.bool,
  horizontal: PropTypes.bool,
  stackType: PropTypes.string,
};

export default BarChart;
