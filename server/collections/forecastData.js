/**
 * Created by bai on 2015/9/1.
 */


ForecastData.attachSchema(new SimpleSchema({
    timestamp: {
        type: Date
    },
    positionCode: {
        type: String
    },
    airQuality: {
        type: [Object]
    },
    'airQuality.$.timestamp': {
        type: Date
    },
    'airQuality.$.weatherCondition': {
        type: String
    },
    'airQuality.$.airQualityLevel': {
        type: String
    },
    'airQuality.$.primaryPollutant': {
        type: String
    },
}));