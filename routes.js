var
  configRoutes,
  mongodb     = require( 'mongodb' ),
  mongoClient = mongodb.MongoClient,
  mongoDbUrl  = 'mongodb://localhost:27017/sf',
  dbHandle,
  makeMongoId = mongodb.ObjectID,
  objTypeMap  = { 'user': {} }
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
    dbHandle.collection(
      request.params.obj_type,
      function ( outer_error, collection ) {
        var
          options_map = { w : 1 },
          obj_map     = request.body
        ;

        collection.insert(
          obj_map,
          options_map,
          function ( inner_error, result_map ) {
            response.send(result_map);
          }
        );
      }
    );
  });

  app.post( '/api/:obj_type/update/:id', function ( request, response ) {
    dbHandle.collection(
      request.params.obj_type,
      function ( outer_error, collection ) {
        var
          find_map    = { _id: makeMongoId( request.params.id ) },
          sort_order  = [],
          options_map = { w: 1, upsert: false },
          obj_map     = request.body
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
