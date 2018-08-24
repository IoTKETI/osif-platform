(function() {
  'use strict';


  angular
    .module('ciotPlatform')
    .controller('toolsMetadataController', ToolsMetadataController)
  ;


  ToolsMetadataController.$inject = ['$scope', '$state', '$mdDialog', 'apiService'];

  function ToolsMetadataController($scope, $state, $mdDialog, apiService) {

    $scope.init = _init;


    function _init() {

    }


  }

})();
