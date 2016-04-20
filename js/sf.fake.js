sf.fake = (function () {
  'use strict';
  var
    new_property_list = [
	    { pid         : 'new01',
	      suburb      : 'Burwood',
		    city        : 'Sydney',
	      address     : '1 Burwood Street',
        description : 'New apartment.',
	      rent        : '250',
	      start_date  : '01/08/2016'
      },
	    { pid         : 'new02',
	      suburb      : 'Belmore',
		    city        : 'Sydney',
	      address     : '1 Belmore Street',
        description : 'New House.',
	      rent        : '200',
	      start_date  : '01/05/2016'
      },
	    { pid         : 'new03',
	      suburb      : 'Box Hill',
		    city        : 'Melbourne',
	      address     : '1 Box Street',
        description : 'Big apartment.',
	      rent        : '150',
	      start_date  : '01/04/2016'
      },
	  ],

	  next_property_list = [
	    { pid         : 'next01',
	      suburb      : 'Strathfield',
	  	  city        : 'Sydney',
	      address     : '1 Strathfield Street',
        description : 'New apartment.',
	      rent        : '550',
	      start_date  : '01/07/2016'
      },
	    { pid         : 'next02',
	      suburb      : 'Lakemba',
		    city        : 'Sydney',
	      address     : '1 Lakemba Street',
        description : 'Old House.',
	      rent        : '100',
	      start_date  : '01/06/2016'
      },
	    { pid         : 'next03',
	      suburb      : 'Dockland',
		    city        : 'Melbourne',
	      address     : '1 Dockland Street',
        description : 'New apartment.',
	      rent        : '350',
	      start_date  : '01/09/2016'
      },
	  ],

	  mockSio
  ;

  mockSio = (function () {
    var
	    call_back_map = {},

	    on_sio, emit_sio
	  ;

	  on_sio = function ( msg_type, call_back ) {
        call_back_map[ msg_type ] = call_back;
	  };

	  emit_sio = function ( msg_type, data ) {
	    if ( msg_type === 'getnewpropertylist' && call_back_map.getnewpropertylist ) {
	      setTimeout( function () {
		      call_back_map.getnewpropertylist(  { property_list : new_property_list  } );
		    }, 3000);
	    }

	    if ( msg_type === 'getnextpropertylist' && call_back_map.getnextpropertylist ) {
	      setTimeout( function () {
		      call_back_map.getnextpropertylist( { property_list : next_property_list } );
		    }, 3000);
	    }
	  };

    return { on : on_sio, emit : emit_sio};
  }());

  return { mockSio : mockSio };
}());
