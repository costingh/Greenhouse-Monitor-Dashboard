const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// constants
const DB_PATH = path.resolve("db.json");
const PORT = process.env.PORT || 8000;

// middlewares
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "./client/build")));

// routes
app.get("/retrieve-data", async (req, res) => {
  fs.readFile(DB_PATH, "utf-8", (err, jsonString) => {
    if (err) return console.log("Error in reading from db");
    let values = JSON.parse(jsonString);
    res.status(200).json({
      totalValues: values.length,
      values,
    });
  });
});

app.get("/add-measurements", async (req, res) => {
  fs.readFile(DB_PATH, "utf-8", (err, jsonString) => {
    if (err) return console.log("Error in reading from db");

    let { temperature, humidity, moisture, luminosity } = req.query;
    let valuesArr = JSON.parse(jsonString);
    let obj = {
      temperature: temperature,
      humidity: humidity,
      moisture: moisture,
      luminosity: luminosity,
      timestamp: new Date(),
    };

    valuesArr.push(obj);

    fs.writeFile(DB_PATH, JSON.stringify(valuesArr), (err) => {
      if (err) return console.log("Error in updating db");
      res.status(200).json({
        message: "Values saved",
        value: valuesArr[valuesArr.length - 1],
      });
    });
  });
});

app.post("/update", async (req, res) => {
  fs.readFile(DB_PATH, "utf-8", (err, jsonString) => {
    if (err) return console.log("Error in reading from db");

    let { temperature, humidity, moisture, luminosity } = req.body;
    let valuesArr = JSON.parse(jsonString);
    let obj = {
      temperature: temperature,
      humidity: humidity,
      moisture: moisture,
      luminosity: luminosity,
      timestamp: new Date(),
    };

    valuesArr.push(obj);

    fs.writeFile(DB_PATH, JSON.stringify(valuesArr), (err) => {
      if (err) return console.log("Error in updating db");
      res.status(200).json({
        message: "Values saved",
        value: valuesArr[valuesArr.length - 1],
      });
    });
  });
});

app.post("/add-data", async (req, res) => {
  fs.readFile(DB_PATH, "utf-8", (err, jsonString) => {
    if (err) return console.log("Error in reading from db");

    let body = req.body;
    let valuesArr = JSON.parse(jsonString);
    let obj = {
      temperature: body.temperature,
      humidity: body.humidity,
      moisture: body.moisture,
      luminosity: body.luminosity,
      timestamp: new Date(),
    };

    valuesArr.push(obj);

    fs.writeFile(DB_PATH, JSON.stringify(valuesArr), (err) => {
      if (err) return console.log("Error in updating db");
      res.status(200).json({
        message: "Values saved",
        value: valuesArr[valuesArr.length - 1],
      });
    });
  });
});

// listen to port with PORT value
app.listen(PORT, () => console.log("Listening on port", PORT));
