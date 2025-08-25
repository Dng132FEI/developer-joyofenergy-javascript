const { meterPricePlanMap } = require("../meters/meters");

const average = (readings) => {
    return (
        readings.reduce((prev, next) => prev + next.reading, 0) /
        readings.length
    );
};

const getTimeElapsedInHours = (readings) => {
    readings.sort((a, b) => a.time - b.time);
    const seconds = readings[readings.length - 1].time - readings[0].time;
    const hours = Math.floor(seconds / 3600);
    return hours;
};

const usage = (readings) => {
    return average(readings) / getTimeElapsedInHours(readings);
};

const usageCost = (readings, rate) => {
    return usage(readings) * rate;
};

const usageForAllPricePlans = (pricePlans, readings) => {
    return Object.entries(pricePlans).map(([key, value]) => {
        return {
            [key]: usageCost(readings, value.rate),
        };
    });
};

const getCostForPricePlan = (targetPricePlan, energy) => {
    return targetPricePlan.rate * energy;
}

const getEnergyConsumed = (averageReading, timeElapsedInHours) => {
    return averageReading * timeElapsedInHours;
};

const getUsageCost = (readings, smartMeterId, prevDays) => {
    if (!readings || readings?.length === 0) {
      throw Error("No valid readings")
    };
    var currentTime = Date.now();
    var prevWeekTimestamp = currentTime - 86400 * prevDays; // Minus seconds per week
    var readingsWithinRange = readings.filter((reading)=>{
        return reading.time <= currentTime && reading.time >= prevWeekTimestamp
    });
    var timeElapsedInHours = getTimeElapsedInHours(readingsWithinRange);
    var averageReading = average(readingsWithinRange);
    var energyConsumed = getEnergyConsumed(averageReading, timeElapsedInHours);
    var cost = getCostForPricePlan(meterPricePlanMap[smartMeterId], energyConsumed);
    return {
        usageCost: cost.toFixed(1)
    };
};

module.exports = {
    average,
    getTimeElapsedInHours,
    usage,
    usageCost,
    usageForAllPricePlans,
    getUsageCost,
};
