sf.mainList = (function () {
  'use strict';

  var
    configMap = {
      main_html : String()
		  + '<div class="sf-mainList">'
		  + '  <div class="sf-mainList-newListBtn">refresh</div>'
      + '  <div class="sf-mainList-listTable"></div>'
		  + '  <div class="sf-mainList-nextListBtn">more</div>'
		  + '</div>',

		  property_model : null,

      settable_map : {
        property_model : true
      }
	  },

    stateMap = {
	    $append_target : null
	  },

	  jqueryMap = {},

    configModule, initModule, setJqueryMap,
    onTapNewListBtn, onTapNextListBtn,
    onNewPropertyListChanged, onNextPropertyListChanged,
    convertPropertyListToHTML
  ;

  onTapNewListBtn = function () {
    configMap.property_model.get_new_property_list();
  }

  onTapNextListBtn = function () {
    configMap.property_model.get_next_property_list();
  }

  onNewPropertyListChanged = function ( event, msg_map ) {
    var $listTable, property_list;

    $listTable    = jqueryMap.$listTable;
    property_list = msg_map.property_list;

    $listTable.prepend( convertPropertyListToHTML( property_list ) );
  }

  onNextPropertyListChanged = function ( event, msg_map ) {
    var $listTable, property_list;

    $listTable    = jqueryMap.$listTable;
    property_list = msg_map.property_list;

    $listTable.append( convertPropertyListToHTML( property_list ) );
  }

  convertPropertyListToHTML = function ( property_list ) {
    var list_html;

    list_html = String();
    property_list.forEach( function( property ) {
      list_html += (
          '<div>'
        +   property.pid
        + '</div>'
      );
    });
    return list_html;
  }

  setJqueryMap = function () {
    var
	    $append_target = stateMap.$append_target
	  ;

  	jqueryMap = {
  	  $newListBtn  : $append_target.find( '.sf-mainList-newListBtn'  ),
  	  $nextListBtn : $append_target.find( '.sf-mainList-nextListBtn' ),
      $listTable   : $append_target.find( '.sf-mainList-listTable'   )
  	};
  }

  configModule = function ( input_map ) {
    sf.util.setConfigMap({
      input_map    : input_map,
      settable_map : configMap.settable_map,
      config_map   : configMap
    });
    return true;
  };

  initModule = function ( $append_target ) {
    var $listTable;

    stateMap.$append_target = $append_target;
    stateMap.$append_target.append( configMap.main_html );
	  setJqueryMap();
	  jqueryMap.$newListBtn.bind ( 'utap', onTapNewListBtn  );
	  jqueryMap.$nextListBtn.bind( 'utap', onTapNextListBtn );

    $listTable = jqueryMap.$listTable;
    $.gevent.subscribe( $listTable, 'sf-new-property-list-changed',  onNewPropertyListChanged  );
    $.gevent.subscribe( $listTable, 'sf-next-property-list-changed', onNextPropertyListChanged );
  };

  return {
    configModule : configModule,
    initModule   : initModule
  };
}());
