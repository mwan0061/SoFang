'use strict'
var
  http     = require( 'http' ),
  express  = require( 'express' ),
  routes   = require( './lib/routes' ),

  app      = express(),
  server   = http.createServer( app ),
  env      = process.env.NODE_ENV || 'development',

  morgan          = require( 'morgan' ),
  body_parser     = require( 'body-parser' ),
  method_override = require( 'method-override' ),
  //basic_auth      = require( 'basic-auth' ),
  error_handler   = require( 'errorhandler' ),
  serve_static    = require( 'serve-static' )
;

app.use( body_parser.urlencoded({ extended : true }));
app.use( body_parser.json() );
app.use( method_override( 'X-HTTP-Method-Override' ) );
//app.use( basic_auth( 'user', 'sf' ) );
app.use( serve_static( __dirname + '/public' ) );

if ( env === 'development' ) {
  app.use( morgan( 'combined' ) );
  app.use( error_handler({
    dumpExceptions : true,
	showStack      : true
  }) );
}

if ( env === 'production' ) {
  app.use( error_handler() );
}

routes.configRoutes( app, server );

server.listen( 3000 );
console.log( 'Express server listening on port %d in %s mode',
             server.address().port, app.settings.env
 );
