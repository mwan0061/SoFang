'use strict';
var
  loadSchema, checkSchema,
  checkType,  constructObj, readObj,
  updateObj,  destroyObj,

  mongodb     = require( 'mongodb' ),
  fsHandle    = require( 'fs'      ),
  JSV         = require( 'JSV'     ).JSV,

  mongoClient = mongodb.MongoClient,
  mongoDbUrl  = 'mongodb://localhost:27017/sf',
  dbHandle,
  validator   = JSV.createEnvironment(),
  objTypeMap  = { 'user' : {} }
;

loadSchema = function ( schema_name, schema_path ) {
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

checkType = function ( obj_type ) {
  if ( ! objTypeMap[ obj_type ] ) {
    return ({ error_msg : 'Object type "' + obj_type
      + '" is not supported.'
    });
  }
  return null;
};

constructObj = function ( obj_type, obj_map, call_back ) {
  var type_check_map = checkType ( obj_type );
  if ( type_check_map ) {
    call_back( type_check_map );
    return;
  }

  checkSchema(
    obj_type, obj_map,
    function ( error_list ) {
      if ( error_list.length === 0 ) {
        dbHandle.collection(
          obj_type,
          function ( outer_error, collection ) {
            var options_map = { w : 1 };
            collection.insert (
              obj_map,
              options_map,
              function ( inner_error, result_map ) {
                call_back( result_map );
              }
            );
          }
        );
      }
      else {
        call_back({
          error_msg  : 'INput document not valid',
          error_list : error_list
        });
      }
    }
  );
};

readObj = function ( obj_type, find_map, fields_map, call_back ) {
  var type_check_map = checkType( obj_type );
  if ( type_check_map ) {
    call_back( type_check_map );
    return;
  }

  dbHandle.collection(
    obj_type,
    function ( outer_error, collection ) {
      collection.find( find_map, fields_map ).toArray(
        function ( inner_error, map_list ) {
          call_back( map_list );
        }
      );
    }
  );
};

updateObj = function ( obj_type, find_map, set_map, call_back ) {
  var type_check_map = checkType( obj_type );
  if ( type_check_map ) {
    call_back ( type_check_map );
    return;
  }

  checkSchema(
    obj_type, set_map,
    function ( error_list ) {
      if ( error_list.length === 0 ) {
        dbHandle.collection(
          obj_type,
          function ( outer_error, collection ) {
            collection.update(
              find_map,
              { $set : set_map },
              { w : 1, multi : true, upsert : false },
              function ( inner_error, update_count ) {
                call_back({ update_count : update_count });
              }
            );
          }
        );
      }
      else {
        call_back({
          error_msg  : 'INput document not valid',
          error_list : error_list
        });
      }
    }
  );
};

destroyObj = function ( obj_type, find_map, call_back ) {
  var type_check_map = checkType( obj_type );
  if ( type_check_map ) {
    call_back( type_check_map );
    return;
  }

  dbHandle.collection(
    obj_type,
    function ( outer_error, collection ) {
      var options_map = { w: 1, single: true };

      collection.remove( find_map, options_map,
        function ( inner_error, delete_count ) {
          call_back({ delete_count : delete_count });
        }
      );
    }
  );
};

module.exports = {
  makeMongoId : mongodb.ObjectID,
  checkType   : checkType,
  construct   : constructObj,
  read        : readObj,
  update      : updateObj,
  destroy     : destroyObj
};

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
