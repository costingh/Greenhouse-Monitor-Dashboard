import React, { useState, useEffect } from "react";

import { Chart, registerables } from "chart.js";
import "../styles/Chart.css";

Chart.register(...registerables);

function BarChart({ datasets, chartID, primaryColor, measurementName }) {
  const [percent, setPercent] = useState(0);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (datasets && !chart) {
      drawChart(datasets);
    }

    if (datasets && chart) {
      chart.data.datasets[0].data = computeDatasetValue(datasets);
      chart.update();
    }
  }, [datasets, chart]);

  const computeDatasetValue = (datasets) => {
    let datasetVal = [];

    if (measurementName === "Humidity") {
      let humidity = [];
      datasets.map((v) => humidity.push(v.humidity));
      let currentHour = new Date().getHours();
      let humidityInCurrentDay = humidity.slice(-currentHour);
      let averageHumidity = 0;
      humidityInCurrentDay.map((h) => (averageHumidity += parseFloat(h)));
      averageHumidity /= humidityInCurrentDay.length;
      datasetVal.push(averageHumidity);
      datasetVal.push(100 - averageHumidity);
      setPercent(averageHumidity);
    } else if (measurementName === "Moisture") {
      let moisture = [];
      datasets.map((v) => moisture.push(v.moisture));
      let currentHour = new Date().getHours();
      let moistureInCurrentDay = moisture.slice(-currentHour);
      let averageMoisture = 0;
      moistureInCurrentDay.map((h) => (averageMoisture += h));
      averageMoisture /= moisture.length;
      datasetVal.push(averageMoisture);
      datasetVal.push(100 - averageMoisture);
      setPercent(averageMoisture);
    } else if (measurementName === "Light") {
      let luminosity = [];
      datasets.map((v) => luminosity.push(v.luminosity));
      let currentHour = new Date().getHours();
      let luminosityInCurrentDay = luminosity.slice(-currentHour);
      let averageLuminosity = 0;
      luminosityInCurrentDay.map((h) => (averageLuminosity += h));
      averageLuminosity /= luminosity.length;
      datasetVal.push(averageLuminosity);
      datasetVal.push(2500 - averageLuminosity);
      setPercent(averageLuminosity);
    } else {
      datasetVal.push(30);
      datasetVal.push(70);
    }

    return datasetVal;
  };

  const drawChart = (data) => {
    if (data) {
      const ctx = document.getElementById(chartID);
      const data2 = {
        datasets: [
          {
            data: computeDatasetValue(data),
            backgroundColor: [primaryColor, "#181b2b"],
            borderWidth: 0,
            cutout: "75%",
          },
        ],
      };

      const myChart = new Chart(ctx, {
        type: "doughnut",
        data: data2,
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              display: false,
            },
          },
        },
      });

      setChart(myChart);
    }
  };

  return (
    <div className="barchart">
      <div className="canvas-wrapper">
        {" "}
        <canvas id={chartID}></canvas>
      </div>
      <div>
        <h1>
          {(Math.round(percent * 100) / 100).toFixed(2)} <span></span>
        </h1>
        <p>{measurementName}</p>
      </div>
      <div
        style={{
          marginBottom: "auto",
          marginLeft: "auto",
          color: "#2c6d6b",
          fontSize: "18px",
        }}
      >
        {measurementName === "Humidity"
          ? "30% - 40%"
          : measurementName === "Moisture"
          ? "10% - 18%"
          : "	1000 - 2500 LUX"}
      </div>
    </div>
  );
}

export default BarChart;
