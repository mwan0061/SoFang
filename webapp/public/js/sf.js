var sf = (function () {
  'use strict';

  var initModule = function ( $container ) {
    sf.model.initModule();
    sf.shell.initModule( $container );
  };

  return { initModule : initModule };
}());
