import React, { useState, useEffect } from "react";

import { Chart, registerables } from "chart.js";
import "../styles/Chart.css";
import moment from "moment";

Chart.register(...registerables);

const LineChart = ({ datasets }) => {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    let arrayOfMonths = [1, 2, 3, 4, 5, 6];

    if (datasets && !chart) {
      drawChart(arrayOfMonths, datasets);
    }

    if (datasets && chart) {
      let tmp = [];

      let timestamp = [];

      datasets.map((value) => {
        tmp.push(value.temperature);
        timestamp.push(moment(value.timestamp).format("LT")); // 17:52
      });

      chart.config.data.datasets[0].data = tmp.slice(-12);
      chart.update();
    }
  }, [datasets, chart]);

  const drawChart = (labels, data) => {
    let hoursArray = [
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
      "24:00",
    ];

    let d = new Date();
    let currentHour = hoursArray[d.getHours() - 1];

    if (labels && labels.length > 0 && data && data.length > 0) {
      const ctx = document.getElementById("line-chart");
      let length = 400,
        angle = 270;

      let gradient1 = ctx
        .getContext("2d")
        .createLinearGradient(
          700,
          500,
          300 + Math.cos(angle) * length,
          300 + Math.sin(angle) * length
        );

      gradient1.addColorStop(1, "rgba(206, 106, 211, 0.03)");
      gradient1.addColorStop(0, "rgba(206, 106, 211, 0.1)");

      let gradient2 = ctx
        .getContext("2d")
        .createLinearGradient(
          700,
          500,
          300 + Math.cos(angle) * length,
          300 + Math.sin(angle) * length
        );

      gradient2.addColorStop(1, "#229a4819");
      gradient2.addColorStop(0, "#229a4819");

      let tmp = [];
      let hum = [];
      let moist = [];
      let lumin = [];
      let timestamp = [];

      datasets.map((value) => {
        tmp.push(value.temperature);
        hum.push(value.humidity);
        moist.push(value.moisture);
        lumin.push(value.luminosity);
        timestamp.push(moment(value.timestamp).format("LT")); // 17:52
      });

      let axisColors = [];

      let xyAxisColor = "#464e6070";
      for (let i = 0; i <= tmp.length; i++) {
        if (i == 0) axisColors.push(xyAxisColor);
        else axisColors.push("");
      }

      const options = {
        type: "line",
        data: {
          labels: timestamp.slice(-12), // get last 12 results
          datasets: [
            {
              backgroundColor: "transparent",
              label: "Temperature",
              data: tmp.slice(-12),
              borderColor: "#cd6ad3",
              borderWidth: 2,
              fill: "start",
              lineTension: 0,
            },
            /* {
              backgroundColor: "transparent",
              label: "Humidity",
              data: hum,
              borderColor: "#229a48",
              borderWidth: 2,
              fill: "start",
              lineTension: 0,
              pointBorderWidth: "0",
            }, */
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                callback: function (value, index, ticks) {
                  return value + " °C";
                },
              },
              beginAtZero: false,
              grid: {
                display: true,
                color: axisColors,
              },
            },
            x: {
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
      };

      const myChart = new Chart(ctx, options);

      setChart(myChart);
    }
  };

  return (
    <div className="line-chart-container">
      <p
        style={{
          color: "#a5acb9",
          textTransform: "uppercase",
          fontWeight: "400",
          fontSize: "16px",
          paddingTop: "20px",
        }}
      >
        Historical temperature data
      </p>
      <div style={{ height: "calc(100% - 20px)", paddingBottom: "10px" }}>
        <canvas id="line-chart"></canvas>
      </div>
    </div>
  );
};

export default LineChart;
