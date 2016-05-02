sf.model = (function () {
  'use strict';
  var
    configMap = {
	},

	stateMap = {
	  property_id_map    : {},
	  property_db         : TAFFY(),
	  update_limit_max    : 3,
	  top_property__id    : null,
	  bottom_property__id : null
	},

	isFakeData = false,

	propertyProto, makeProperty, makePropertyList,
	initModule, property
  ;

  propertyProto = {};

  makeProperty = function ( property_map ) {
    var
      property,
      _id         = property_map._id,
	  suburb      = property_map.suburb,
	  city        = property_map.city,
	  address     = property_map.address,
      description = property_map.description,
	  rent        = property_map.rent,
	  start_date  = property_map.start_date
    ;

	if ( _id === undefined || suburb === undefined || start_date === undefined) {
      throw 'Property id, suburb and start date are required.';
	}

	property             = Object.create( propertyProto );
	property._id         = _id;
	property.suburb      = suburb;
  	property.city        = city;
  	property.address     = address;
    property.description = description;
  	property.rent        = rent;
  	property.start_date  = start_date;

	stateMap.property_id_map[ _id ] = property;
  	stateMap.property_db.insert( property );

    return property;
  };

  makePropertyList = function ( data_list ) {
    var
      i, property_map, make_property_map,
      property_list = []
    ;

    for ( i = 0; i < data_list.length; i++ ) {
      property_map = data_list[ i ];

      make_property_map = {
        _id         : property_map._id,
        suburb      : property_map.suburb,
        city        : property_map.city,
        address     : property_map.address,
        description : property_map.description,
        rent        : property_map.rent,
        start_date  : property_map.start_date
      };

      property_list.push( makeProperty( make_property_map ) );
    }

    return property_list;
  }

  property = (function () {
    var
	  sio = isFakeData ? sf.fake.mockSio : sf.data.getSio(),
	  get_new_property_list, get_next_property_list,
      _publish_new_property_list_change, _publish_next_property_list_change
	;

    get_new_property_list = function () {
      if ( sio ) {
  	    sio.on(   'updatenewpropertylist',  _publish_new_property_list_change );
        sio.emit( 'getnewpropertylist' );
  	  }
    };

    get_next_property_list = function () {
      if ( sio ) {
  	    sio.on(   'updatenextpropertylist',  _publish_next_property_list_change );
        sio.emit( 'getnextpropertylist' );
  	  }
    };

    _publish_new_property_list_change = function ( arg_map ) {
      var property_list;

      property_list = makePropertyList ( arg_map[0] );
	    stateMap.top_property__id = property_list[ 0 ]._id;
      $.gevent.publish( 'sf-new-property-list-changed',  { property_list : property_list } );
    };

    _publish_next_property_list_change = function ( arg_map ) {
      var property_list;

      property_list = makePropertyList ( arg_map[0] );
	    stateMap.bottom_property__id = property_list[ property_list.length - 1 ]._id;
      $.gevent.publish( 'sf-next-property-list-changed', { property_list : property_list } );
    };

    return {
      get_new_property_list  : get_new_property_list,
      get_next_property_list : get_next_property_list
    };
  }());

  initModule = function () {};

  return {
    initModule : initModule,
  	property   : property
  };
}());
