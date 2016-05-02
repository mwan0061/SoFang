'use strict';
var
  emitNewPropertyList, emitNextPropertyList,
  propertyObj,
  socket = require( 'socket.io' ),
  crud   = require( './crud'    ),

  makeMongoId = crud.makeMongoId
;

emitNewPropertyList = function( io, property_list ) {
  io
    .of  ( '/property' )
	.emit( 'updatenewpropertylist', property_list );
};

emitNextPropertyList = function( io, property_list ) {
  io
    .of  ( '/property' )
	.emit( 'updatenextpropertylist', property_list );
};

propertyObj = {
  connect : function ( server ) {
    var io = socket.listen( server );

    io
     // .set( 'blacklist' , [] )
      .of( '/property' )
      .on( 'connection', function ( socket ) {
        socket.on(
		  'getnewpropertylist',
		  function ( result_list ) {
		    crud.read(
		      'property',
			  {},
			  {},
			  function( result_list ) {
			    emitNewPropertyList( io, result_list );
			  }
		    );
		  }
		);

        socket.on(
		  'getnextpropertylist',
		  function ( result_list ) {
		    crud.read(
		      'property',
			  {},
			  {},
			  function( result_list ) {
			    emitNextPropertyList( io, result_list );
			  }
		    );
		  }
		);
      }
    );

    return io;
  }
};

module.exports = propertyObj;
