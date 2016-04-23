var
  loadSchema, checkSchema, configRoutes,
  mongodb     = require( 'mongodb' ),
  fsHandle    = require( 'fs'      ),
  JSV         = require( 'JSV'     ).JSV,
  mongoClient = mongodb.MongoClient,
  mongoDbUrl  = 'mongodb://localhost:27017/sf',
  dbHandle,
  validator   = JSV.createEnvironment(),
  makeMongoId = mongodb.ObjectID,
  objTypeMap  = { 'user': {} }
;

loadSchema = function ( schema_name, schema_path) {
  fsHandle.readFile( schema_path, 'utf8', function ( err, data ) {
    objTypeMap[ schema_name ] = JSON.parse( data );
  });
};

checkSchema = function ( obj_type, obj_map, call_back ) {
  var
    schema_map = objTypeMap[ obj_type ],
    report_map = validator.validate( obj_map, schema_map )
  ;
  call_back( report_map.errors );
};

configRoutes = function ( app, server ) {
  app.get( '/', function ( request, response ) {
    response.redirect( '/sf.html' );
  });

  app.all( '/api/:obj_type/*?', function ( request, response, next ) {
    response.contentType( 'json' );
    if ( objTypeMap[ request.params.obj_type ] ) {
      next();
    }
	  else {
      response.send({ error_msg : request.params.obj_type
        + ' is not a valid object type' });
    }
  });

  app.get( '/api/:obj_type/list', function ( request, response ) {
    dbHandle.collection(
      request.params.obj_type,
      function ( outer_error, collection ) {
        collection.find().toArray(
          function ( inner_error, map_list ) {
            response.send( map_list );
          }
        );
      }
    );
  });

  app.get( '/api/:obj_type/read/:id', function ( request, response) {
    var find_map = { _id: makeMongoId( request.params.id ) };
    dbHandle.collection(
      request.params.obj_type,
      function ( outer_error, collection ) {
        collection.findOne(
          find_map,
          function ( inner_error, result_map ) {
            response.send( result_map );
          }
        );
      }
    );
  });

  app.post( '/api/:obj_type/create', function ( request, response ) {
    var
      obj_type = request.params.obj_type,
      obj_map  = request.body
    ;

    checkSchema(
      obj_type, obj_map,
      function ( error_list ) {
        if ( error_list.length === 0 ) {
          dbHandle.collection(
            obj_type,
            function ( outer_error, collection ) {
              var options_map = { w: 1 };

              collection.insert(
                obj_map,
                options_map,
                function ( inner_error, result_map ) {
                  response.send(result_map);
                }
              );
            }
          )
        }
        else {
          response.send({
            error_msg  : 'Input document not valid',
            error_list : error_list
          });
        }
      }
    );
  });

  app.post( '/api/:obj_type/update/:id', function ( request, response ) {
    var
      find_map    = { _id: makeMongoId( request.params.id ) },
      obj_map     = request.body,
      obj_type    = request.params.obj_type
    ;

    checkSchema(
      obj_type, obj_map,
      function ( error_list ) {
        if ( error_list.length === 0 ) {
          dbHandle.collection(
            obj_type,
            function ( outer_error, collection ) {
              var
                sort_order  = [],
                options_map = { w: 1, upsert: false }
              ;
              collection.findAndModify(
                find_map,
                sort_order,
                obj_map,
                options_map,
                function ( inner_error, updated_map ) {
                  response.send( updated_map );
                }
              );
            }
          );
        }
        else {
          response.send({
            error_msg  : 'Input document not valid',
            error_list : error_list
          });
        }
      }
    );
  });

  app.get( '/api/:obj_type/delete/:id', function ( request, response) {
    var find_map = { _id: makeMongoId( request.params.id ) };

    dbHandle.collection(
      request.params.obj_type,
      function ( outer_error, collection ) {
        var options_map = { w: 1, single: true };

        collection.remove(
          find_map,
          options_map,
          function ( inner_error, delete_count ) {
            response.send( { delete_count: delete_count } );
          }
        );
      }
    );
  });
};

module.exports = { configRoutes : configRoutes };

mongoClient.connect(mongoDbUrl, function( err, db ) {
  if ( err ) {
    console.log( 'Unable to connect to database. Error: ', err );
  }
  else {
    console.log( 'Connected to database at: ', mongoDbUrl );
  }
  dbHandle = db;
});

(function () {
  var schema_name, schema_path;
  for ( schema_name in objTypeMap ) {
    if ( objTypeMap.hasOwnProperty( schema_name ) ) {
      schema_path = __dirname + '/' + schema_name + '.json';
      loadSchema( schema_name, schema_path );
    }
  }
}());
