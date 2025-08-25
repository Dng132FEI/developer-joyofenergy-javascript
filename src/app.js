const express = require("express");
const { readings } = require("./readings/readings");
const { readingsData } = require("./readings/readings.data");
const { read, store } = require("./readings/readings-controller");
const { recommend, compare } = require("./price-plans/price-plans-controller");
const { getUsageCostController } = require("./usage/usage-controller");


const app = express();
app.use(express.json());

const { getReadings, setReadings } = readings(readingsData);

app.get("/readings/read/:smartMeterId", (req, res) => {
    res.send(read(getReadings, req));
});

app.post("/readings/store", (req, res) => {
    res.send(store(setReadings, req));
});

app.get("/price-plans/recommend/:smartMeterId", (req, res) => {
    res.send(recommend(getReadings, req));
});

app.get("/price-plans/compare-all/:smartMeterId", (req, res) => {
    res.send(compare(getReadings, req));
});

app.get("/price-plans/usage-cost-prev-week/:smartMeterId", (req, res) => {
    try {
        res.send(getUsageCostController(getReadings, req));
    } catch {
        res.status(404).send("No valid readings over the past week")
    }
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log(`🚀 app listening on port ${port}`);
