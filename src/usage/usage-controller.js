const { getUsageCost } = require("./usage");

const getUsageCostController = (getReadings, req) => {
    const meter = req.params.smartMeterId;
    const usageCost = getUsageCost(getReadings(meter), meter, 7);
    return {
        usageCost: usageCost,
    };
};

module.exports = { getUsageCostController };