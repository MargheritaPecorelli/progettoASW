var mongoose = require('mongoose');
var debug = typeof v8debug === 'object';

mongoose.connect('mongodb://msc-asw:msc-asw1@ds125288.mlab.com:25288/msc-campus-asw', function(err) {
    if (err) throw err;
});

var con = mongoose.connection;

con.on('error', function (err){
    console.log('errore di connessione', err);
});

con.once('open', function (){
   console.log('connessione riuscita!');
});

module.exports = con;