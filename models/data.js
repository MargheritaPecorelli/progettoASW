var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var valueSchema = new Schema({
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
    {});


module.exports = valueSchema;