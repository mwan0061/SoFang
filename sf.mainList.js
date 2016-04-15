sf.mainList = (function () {
  'use strict';
  
  var
    configMap = {
        main_html : String()
		  + '<div class="sf-mainList">'
		  + '  <div class="sf-mainList-newListBtn"></div>'
		  + '  <div class="sf-mainList-nextListBtn"></div>'
		  + '</div>',
		
		property_model : null
	},
	
	settableMap = {
	  property_model : true
	},
	
    stateMap = {
	  $append_target
	},
    
	jqueryMap = {},
	
    initModule, setJqueryMap
  ;
  
  setJqueryMap = function () {
    var
	  $append_target = stateMap.$append_target
	;
	
	jqueryMap = {
	  $newListBtn  : $append_target.find( '.sf-mainList-newListBtn'  ),
	  $nextListBtn : $append_target.find( '.sf-mainList-nextListBtn' ),
	  $window      : $(window)
	};
  }
  
  initModule = function ( $append_target ) {
    stateMap.$append_target = $append_target;
	setJqueryMap();
	jqueryMap.$newListBtn.bind(  'utap', onTapNewListBtn  );
	jqueryMap.$nextListBtn.bind( 'utap', onTapNextListBtn );
  };
  
  return { initModule : initModule };
}());