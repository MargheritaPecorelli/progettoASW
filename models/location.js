var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
        idLocation: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        room: {
            type: String
        },
        block: {
            type: String
        },
        level: {
            type: String
        },
        campus: {
            type: String
        },
        city: {
            type: String
        },
        description: {
            type: String
        }
    },
    {
        //versionKey: false,
        collection: 'locations'
    });

var location = mongoose.model('locations', locationSchema);

module.exports = location;