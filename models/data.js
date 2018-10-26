var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var valueSchema = new Schema({
        // idSensor: {
        //     type: String,
        //     required: true
        // },
        value: {
            type: Number,
            required: true
        },
        measurementType: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            required: true  
        }
    },
    {
        //versionKey: false,
        //collection: 'data'
    });

//var value = mongoose.model('data', valueSchema);

module.exports = valueSchema;