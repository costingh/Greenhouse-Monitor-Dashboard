import React, { useState, useEffect } from "react";

import { Chart, registerables } from "chart.js";
import "../styles/Chart.css";
import moment from "moment";
import "moment/locale/ro"; // without this line it didn't work
moment.locale("ro");

Chart.register(...registerables);

const SensorChart = ({ datasets, chartID, sensorName }) => {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (datasets && !chart) {
      drawChart(datasets);
    }

    if (datasets && chart) {
      let hum = [];
      let moist = [];
      let lumin = [];
      let timestamp = [];

      datasets.map((value) => {
        hum.push(value.humidity);
        moist.push(value.moisture);
        lumin.push(value.luminosity);
        timestamp.push(moment(value.timestamp).format("LT")); // 17:52
      });

      chart.config._config.data.labels = timestamp;
      chart.config._config.data.datasets[0].data =
        sensorName === "Humidity"
          ? hum.slice(-8)
          : sensorName === "Moisture"
          ? moist.slice(-8)
          : lumin.slice(-8);
      chart.update();
    }
  }, [datasets, chart]);

  const drawChart = (data) => {
    if (data) {
      const ctx = document.getElementById(chartID);
      /* let dataValues = [65, 59, 80, 81, 56, 55, 40];
      let labels = [1, 2, 3, 4, 5, 6, 7]; */

      let hum = [];
      let moist = [];
      let lumin = [];
      let timestamp = [];

      data.map((value) => {
        hum.push(value.humidity);
        moist.push(value.moisture);
        lumin.push(value.luminosity);
        timestamp.push(moment(value.timestamp).format("LT")); // 17:52
      });

      let axisColors = [];

      for (let i = 0; i <= hum.length; i++) {
        if (i == 0) axisColors.push("#464e6070");
        else axisColors.push("");
      }

      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: timestamp.slice(-8), // get last 8 results,
          datasets: [
            {
              backgroundColor: "transparent",
              label: "Humidity",
              data:
                sensorName === "Humidity"
                  ? hum.slice(-8)
                  : sensorName === "Moisture"
                  ? moist.slice(-8)
                  : lumin.slice(-8),
              borderColor: "#35588d",
              borderWidth: 2,
              fill: "start",
              lineTension: 0,
              pointBorderWidth: "0",
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                color: "#464e60",
                callback: function (value, index, ticks) {
                  if (sensorName === "Light") return value + " LUX";
                  else return value + "%";
                },
              },
              beginAtZero: false,
              grid: {
                display: true,
                color: axisColors,
              },
            },
            x: {
              color: "red",
              ticks: {
                color: "#464e60",
              },
              beginAtZero: false,
              grid: {
                display: true,
                color: axisColors,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });

      setChart(myChart);
    }
  };

  return (
    <div className="bordered-chart">
      <canvas id={chartID}></canvas>
    </div>
  );
};

export default SensorChart;
