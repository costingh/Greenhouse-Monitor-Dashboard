import React, { useState, useEffect } from "react";

import { Chart, registerables } from "chart.js";
import "../styles/Chart.css";

Chart.register(...registerables);

function PieChart({ datasets, chartID, primaryColor }) {
  const [temperatureValue, setTemperatureValue] = useState(0);
  const [highestTemperature, setHighestTemperature] = useState(0);
  const [lowestTemperature, setLowestTemperature] = useState(0);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (datasets && !chart) {
      drawChart(datasets);
    }

    if (datasets && chart) {
      /*chart.config.data.datasets[0].data = tmp.slice(-12);
      chart.update(); */

      let temperature = [];
      datasets.map((v) => temperature.push(v.temperature));
      setTemperatureValue(temperature[temperature.length - 1]);

      setHighestTemperature(
        (Math.round(Math.max(...temperature) * 100) / 100).toFixed(2)
      );
      setLowestTemperature(
        (Math.round(Math.min(...temperature) * 100) / 100).toFixed(2)
      );
    }
  }, [datasets, chart]);

  const drawChart = (data) => {
    if (data) {
      const ctx = document.getElementById(chartID);

      let temperature = [];
      data.map((v) => temperature.push(v.temperature));
      setTemperatureValue(temperature[temperature.length - 1]);

      setHighestTemperature(
        (Math.round(Math.max(...temperature) * 100) / 100).toFixed(2)
      );
      setLowestTemperature(
        (Math.round(Math.min(...temperature) * 100) / 100).toFixed(2)
      );

      /* let currentHour = new Date().getHours();
      let temperatureInCurrentDay = temperature.slice(-currentHour);
      let averageTemperature = 0;
      temperatureInCurrentDay.map((h) => (averageTemperature += parseInt(h)));
      averageTemperature /= temperatureInCurrentDay.length; */

      const data2 = {
        datasets: [
          {
            data: [60, 40],
            backgroundColor: [primaryColor, "#181b2b"],
            borderWidth: 0,
            cutout: "80%",
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
    <div className="piechart">
      <div className="canvas-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M11 6c-3.653 5.398-6 8.774-6 12.056 0 3.284 2.684 5.944 6 5.944s6-2.66 6-5.944c0-3.282-2.347-6.658-6-12.056zm-.021 3.839c.352.544.771 1.491.771 2.49 0 2.931-3 3.412-3 1.627 0-1.224 1.491-3.031 2.229-4.117zm-2.399-3.829c-.613-1.639-1.876-3.492-3.58-6.01-2.436 3.599-4 5.85-4 8.037 0 2.129 1.695 3.851 3.822 3.945.949-1.775 2.235-3.719 3.758-5.972zm-5.08-.705c0-.816.994-2.021 1.486-2.745.235.362.514.994.514 1.66 0 1.954-2 2.274-2 1.085zm15.5-2.305c-1.706 2.521-2.97 4.376-3.583 6.016 1.415 2.202 2.466 4.102 3.054 5.932 2.524.331 4.529-1.609 4.529-3.911 0-2.187-1.564-4.438-4-8.037zm-1.5 5.305c0-.816.994-2.021 1.486-2.745.235.362.514.994.514 1.66 0 1.954-2 2.274-2 1.085z" />
        </svg>
        <div>
          <canvas id={chartID}></canvas>
        </div>
      </div>
      <div className="text">
        <h1>{(Math.round(temperatureValue * 100) / 100).toFixed(2)} °C</h1>
        <p>Temperature</p>
        <div className="flex">
          <div className="left">
            <div className="icon up">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M23.677 18.52c.914 1.523-.183 3.472-1.967 3.472h-19.414c-1.784 0-2.881-1.949-1.967-3.472l9.709-16.18c.891-1.483 3.041-1.48 3.93 0l9.709 16.18z" />
              </svg>
            </div>
            <div>
              <h2>{highestTemperature} °C</h2>
              <p>Highest</p>
            </div>
          </div>
          <div className="right">
            <div className="icon down">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ transform: "rotate(180deg)" }}
              >
                <path d="M23.677 18.52c.914 1.523-.183 3.472-1.967 3.472h-19.414c-1.784 0-2.881-1.949-1.967-3.472l9.709-16.18c.891-1.483 3.041-1.48 3.93 0l9.709 16.18z" />
              </svg>
            </div>
            <div>
              <h2>{lowestTemperature} °C</h2>
              <p>Lowest</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PieChart;
