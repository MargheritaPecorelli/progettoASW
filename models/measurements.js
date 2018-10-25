var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var measurementSchema = new Schema({
    measurementType: {
            type: String,
            required: true
        },
        uom: {
            type: String,
            required: true
        }
    },
    {
        //versionKey: false,
        collection: 'measurements'
    });

var measurement = mongoose.model('measurements', measurementSchema);

module.exports = measurement;