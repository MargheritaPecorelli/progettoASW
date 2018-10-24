var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        surname:{
            type: String,
            required: true
        },
        admin:{
            type: Boolean,
            required: true
        }
    },
    {
        //versionKey: false,
        collection: 'users'
    });

var user = mongoose.model('users', userSchema);

module.exports = user;