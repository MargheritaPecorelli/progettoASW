module.exports.getDatabaseURL = function() {

  var dbURI = 'mongodb://localhost:27017/ASWdb';

  if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MLAB_URI;
  }

  return dbURI;
}
