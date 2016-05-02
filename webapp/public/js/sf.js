var sf = (function () {
  'use strict';

  var initModule = function ( $container ) {
    sf.data.initModule();
    sf.model.initModule();
    sf.shell.initModule( $container );
  };

  return { initModule : initModule };
}());
