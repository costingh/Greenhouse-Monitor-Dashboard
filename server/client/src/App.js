import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import Sensor from "./components/Sensor";
import moment from "moment";
moment.locale("ro");

function App() {
  const [sensorValues, setSensorValues] = useState([]);

  useEffect(() => {
    getSensorsData();
  }, []);

  const getSensorsData = async () => {
    const resp = await axios.get("/retrieve-data");
    setSensorValues(resp.data.values);
    console.log(resp);
    setTimeout(getSensorsData, 5000);
  };

  return (
    <div className="main">
      <div className="container">
        <div className="wrapper">
          <div className="row">
            <div className="chart-container" style={{ width: "70%" }}>
              <LineChart datasets={sensorValues} />
            </div>
            <div
              className="chart-container"
              style={{ width: "30%", padding: "20px 50px" }}
            >
              <div className="header">
                <h2>TOTAL AVERAGES</h2>
                <p>
                  {moment().format("LL")}, {moment().format("LT")}
                </p>
              </div>
              <div className="charts-flex-column">
                <BarChart
                  datasets={sensorValues}
                  chartID={"bar-chart1"}
                  primaryColor="#14e1c0"
                  measurementName="Humidity"
                />
                <BarChart
                  datasets={sensorValues}
                  chartID={"bar-chart2"}
                  primaryColor="#ecdc63"
                  measurementName="Moisture"
                />
                <BarChart
                  datasets={sensorValues}
                  chartID={"bar-chart3"}
                  primaryColor="#ec0970"
                  measurementName="Light"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="chart-container"
              style={{ width: "30%", padding: "20px 50px" }}
            >
              <div className="charts-flex-column">
                <PieChart
                  datasets={sensorValues}
                  chartID={"pie-chart1"}
                  primaryColor="#865ee1"
                />
              </div>
            </div>
            <div className="chart-container" style={{ width: "70%" }}>
              <div className="buttons-container">
                <div className="button active">Online Sensors</div>
                <div className="button">Offline Sensors</div>
              </div>
              <div className="three-charts-container">
                <Sensor
                  chartID="sensor-chart1"
                  datasets={sensorValues}
                  sensorName="Humidity"
                  sensorNumber="1"
                />
                <Sensor
                  chartID="sensor-chart2"
                  datasets={sensorValues}
                  sensorName="Moisture"
                  sensorNumber="2"
                />
                <Sensor
                  chartID="sensor-chart3"
                  datasets={sensorValues}
                  sensorName="Light"
                  sensorNumber="3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
