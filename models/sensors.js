var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var measurementsSchema = new Schema({
    measurementType: {
        type: String,
        required: true
    },
    uom: {
        type: String,
        required: true
    }
});

var sensorSchema = new Schema({
        idSensor: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        measurements:{
            type: Array,
            items:{
                type: measurementsSchema
            }
        },
        position: {
            type: Object,
            properties: {
                latitude: {
                    type: Number,
                    required: true
                },
                longitude: {
                    type: Number,
                    required: true
                },
                elevation: {
                    type: Number,
                    required: true
                },
                idLocation: {
                    type: String,
                    required: true
                }
            }
        }
    },
    {
        collection: 'sensors'
    });


var sensor = mongoose.model('sensors', sensorSchema);

module.exports = sensor;