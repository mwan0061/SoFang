sf.model = (function () {
  'use strict';
  var
    configMap = {
	},
	
	stateMap = {
	  property_pid_map    : {},
	  property_db         : TAFFY(),
	  update_limit_max    : 3,
	  top_property_pid    : null,
	  bottom_property_pid : null
	},
	
	isFakeData = true,
	
	propertyProto, makeProperty,
	initModule, property
  ;
  
  propertyProto = {
  };
  
  makeProperty = function ( property_map ) {
    var 
      property,
      pid         = property_map.pid,
	  suburb      = property_map.suburb,
	  city        = property_map.city,
	  address     = property_map.address,
      description = property_map.description,
	  rent        = property_map.rent,
	  start_date  = property_map.start_date
    ;
	
	if ( pid === undefined || suburb === undefined || start_date === undefined) {
      throw 'Property id, suburb and start date are required.';
	}
	
	property             = Object.create( propertyProto );
	property.pid         = pid;
	property.suburb      = suburb;
	property.city        = city;
	property.address     = address;
    property.description = description;
	property.rent        = rent;
	property.start_date  = start_date;
	
	stateMap.property_pid_map[ pid ] = property;
	stateMap.property_db.insert( property );
	
	return property;
  };
  
  property = (function () {
    var 
	  sio = isFakeData ? sf.fake.mockSio : sf.data.makeSio(),
	  _update_property_list
	;
	
    if ( sio ) { 
	  sio.on( 'getnewpropertylist', _update_property_list );
	  sio.on( 'getnextpropertylist', _update_property_list );
	}
	
    _update_property_list = function ( arg_map ) {
      var 
        mode          = arg_map.mode,
        property_list = arg_map.property_list,
        i, property_map, first_pid, last_pid
	  ;
		
      for ( i = 0; i < property_list.length; i++ ) {
	    property_map = property_list[ i ];
		
		make_property_map = {
          pid         : property_map.pid,
	      suburb      : property_map.suburb,
	      city        : property_map.city,
	      address     : property_map.address,
          description : property_map.description,
	      rent        : property_map.rent,
	      start_date  : property_map.start_date
        };
		
		if ( i === 0 ) { first_pid = pid }		
		if ( i === property_list.length - 1 ) { last_pid = pid }
	  }

      if ( mode === 'top' ) {
	    stateMap.top_property_pid = first_pid;
      }
      else if ( mode === 'bottom' ) {
	    stateMap.bottom_property_pid = bottom_pid;
      }
    };
  }());
  
  initModule = function () {
  };
  
  return {
    initModule : initModule,
	property   : property
  };
}());