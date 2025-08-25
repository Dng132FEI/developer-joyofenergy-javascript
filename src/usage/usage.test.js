const { meters, meterPricePlanMap } = require("../meters/meters");
const { pricePlanNames, pricePlans } = require("../price-plans/price-plans");
const { readings } = require("../readings/readings");
const {
    average,
    getTimeElapsedInHours,
    usage,
    usageCost,
    usageForAllPricePlans,
    getUsageCostForPrevWeek,
} = require("./usage");

describe("usage", () => {
    it("should average all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 923874692387, reading: 0.26785 },
                { time: 923874692387, reading: 0.26785 },
                { time: 923874692387, reading: 0.26785 },
            ],
        });

        const averageMeter0 = average(getReadings(meters.METER0));

        expect(averageMeter0).toBe(0.26785);
    });

    it("should get time elapsed in hours for all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 1607686135, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607512024, reading: 0.26785 },
            ],
        });

        const timeElapsedMeter0 = getTimeElapsedInHours(
            getReadings(meters.METER0)
        );

        expect(timeElapsedMeter0).toBe(48);
    });

    it("should get usage for all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const usageMeter0 = usage(getReadings(meters.METER0));

        expect(usageMeter0).toBe(0.26785 / 48);
    });

    it("should get usage cost for all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER2]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const rate = meterPricePlanMap[meters.METER2].rate;
        const usageCostForMeter = usageCost(getReadings(meters.METER2), rate);

        expect(usageCostForMeter).toBe(0.26785 / 48 * 1);
    });

    it("should get usage cost for all readings for all price plans", () => {
        const { getReadings } = readings({
            [meters.METER2]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const expected = [
            {
                [pricePlanNames.PRICEPLAN0]: 0.26785 / 48 * 10,
            },
            {
                [pricePlanNames.PRICEPLAN1]: 0.26785 / 48 * 2,
            },
            {
                [pricePlanNames.PRICEPLAN2]: 0.26785 / 48 * 1,
            },
        ];

        const usageForAllPricePlansArray = usageForAllPricePlans(
            pricePlans,
            getReadings(meters.METER2)
        );

        expect(usageForAllPricePlansArray).toEqual(expected);
    });

    it("should get usage cost for the user over the last week", () => {
        const { getReadings } = readings({
            [meters.METER2]: [
                { time: Date.now(), reading: 0.3 },
                { time: Date.now()-10000, reading: 0.4 },
                { time: Date.now()-432000, reading: 0.5 },
                { time: 1755268000, reading: 0.26785 },
            ],
        });

        const req = {
            params: {
                smartMeterId: meters.METER2,
            }
        };

        const expected = (0.4 * 120 * 1).toFixed(1);

        const usageForAllPricePlansArray = getUsageCostForPrevWeek(
            getReadings(meters.METER2),
            req,
        );

        expect(usageForAllPricePlansArray).toEqual(expected);
    });
});
