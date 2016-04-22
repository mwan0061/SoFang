var 
  configRoutes,
  mongodb     = require( 'mongodb' ),
  
  mongoServer = new mongodb.Server(
    'localhost',
	mongodb.Connection.DEFAULT_PORT
  ),
  dbHandle    = new mongodb.Db( 
    'sf', mongoServer, { safe : true } 
  )
;

dbHandle.open( function () {
  console.log( '** Connected to MongoDB **' );
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