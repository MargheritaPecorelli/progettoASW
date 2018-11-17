var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

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
        }, 
        hash: String,
        salt: String
    },
    {
        collection: 'users'
    }
);

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.checkPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
    // TODO: Save Secret Key in a env. variable
};

var user = mongoose.model('users', userSchema);

module.exports = user;