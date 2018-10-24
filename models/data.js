var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataSchema = new Schema({
        idSensor: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        timestamp: {
            type: Date,
            required: true  
        }
    },
    {
        //versionKey: false,
        collection: 'data'
    });

var data = mongoose.model('data', dataSchema);

module.exports = data;