var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var positionSchema = new Schema({
//     latitude: {
//         type: String,
//         required: true
//     },
//     longitude: {
//         type: String,
//         required: true
//     },
//     elevation: {
//         type: String,
//         required: true
//     },
//     idLocation: {
//         type: String,
//         required: true
//     }
// });

var measurementsSchema = new Schema({
    "type": {
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
        //versionKey: false,
        collection: 'sensors'
    });

//var posSchema = mongoose.model('posSchema', positionSchema);
var sensor = mongoose.model('sensors', sensorSchema);

//module.exports = posSchema;
module.exports = sensor;