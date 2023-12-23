// docs: https://apexcharts.com/docs/react-charts/
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const LineChart = ({
  categories = null,
  // for single line
  seriesData = [],
  // for multiple lines
  seriesList = [],
  type = "line",
  width = "100%",
  height = "320",
  downloadTool = true,
  useMapping = false,
  mapping = {},
  dates = [], //  This array should provide corresponding dates for seriesData
  showYAxisLabel = true,
  showXAxisLabel = true,
  isDragging = false,
}) => {
  const xaxis = categories ? { categories: categories } : { type: "datetime" };

  const options = {
    chart: {
      id: "basic-line",
      type: type,
      toolbar: {
        show: true,
        tools: {
          download: downloadTool,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    colors: ["#3498DB", "#A5B1C2"],
    xaxis: {
      ...xaxis,
      labels: {
        show: showXAxisLabel,
      },
    },
    yaxis: {
      labels: {
        show: showYAxisLabel,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        formatter: function (val) {
          return useMapping
            ? mapping[categories[val - 1]] || categories[val]
            : categories[val];
        },
      },

      /*     y: {
        formatter: function (val) {
          return `${val + "k"}`;
        },
      },  */
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
  };

  const generateTimeSeriesData = () => {
    return seriesData.map((value, index) => {
      return {
        x: new Date(dates[index]).getTime(),
        y: value,
      };
    });
  };

  const series =
    seriesList.length > 0
      ? seriesList
      : [
          {
            name: "Default Series",
            data: categories ? seriesData : generateTimeSeriesData(), // Use time series data if no categories provided
          },
        ];

  if (isDragging) {
    // Render a placeholder or return null to render nothing
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="LineChart">
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

LineChart.propTypes = {
  categories: PropTypes.array.isRequired,
  seriesData: PropTypes.arrayOf(PropTypes.number),
  seriesList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
  ),
  type: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  downloadTool: PropTypes.bool,
  isDragging: PropTypes.bool,
  useMapping: PropTypes.bool,
  mapping: PropTypes.object,
  dates: PropTypes.arrayOf(PropTypes.string),
};

export default LineChart;
