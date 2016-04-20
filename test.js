'use strict';
var
  http = require( 'http' ),
  express = require( 'express' ),
  //routes = require( './routes' ),
  app = express(),
  server = http.createServer( app ),
  bodyParser = require( 'body-parser' ),
  methodOverride = require( 'method-override' ),
  staticServer = require( 'serve-static' ),
  logger = require( 'express-logger' ),
  errorHandler = require( 'errorhandler' )
;
server.listen( 3000 );
  app.use( bodyParser );
  app.use( methodOverride );
  app.use( staticServer( './' ) );
  app.use( logger );
  app.use( errorHandler({
    dumpExceptions : true,
    showStack : true
  }) );
  app.get( '/', function ( request, response ) {
response.redirect( '/spa.html' );
});
