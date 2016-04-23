var
  configRoutes,
  mongoClient = require( 'mongodb' ).MongoClient,
  mongoDbUrl  = 'mongodb://localhost:27017/sf',
  dbHandle
;

mongoClient.connect(mongoDbUrl, function( err, db ) {
  if ( err ) {
    console.log( 'Unable to connect to database. Error: ', err );
  }
  else {
    console.log( 'Connected to database at: ', mongoDbUrl );
  }
  dbHandle = db;
});

configRoutes = function ( app, server ) {
  app.get( '/', function ( request, response ) {
    response.redirect( '/sf.html' );
  });

  app.all( '/api/*?', function ( request, response, next ) {
    response.contentType( 'json' );
	next();
  });

  app.get( '/api/list/:obj_type/:id([0-9]+)', function ( request, response ) {
    response.send({ title : request.params.obj_type + ' with id ' + request.params.id });
  });
};

module.exports = { configRoutes : configRoutes };
