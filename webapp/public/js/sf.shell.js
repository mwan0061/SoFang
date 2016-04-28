sf.shell = (function () {
  'use strict';
  var
    configMap = {
      main_html : String() + ''
    },

    stateMap = {
      $container : undefined
    },

    jqueryMap = {},

    initModule, setJqueryMap
  ;

  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap = {
      $container : $container
    };
  }

  initModule = function ( $container ) {
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    setJqueryMap();

    sf.mainList.configModule({
      property_model : sf.model.property
    });

    sf.mainList.initModule( jqueryMap.$container );
  };

  return {
    initModule : initModule
  };
}());
