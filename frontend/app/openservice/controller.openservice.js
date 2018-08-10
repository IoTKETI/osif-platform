(function() {
  'use strict';


  angular
    .module('ciotPlatform')
    .controller('openServiceController', OpenServiceController)
  ;


  OpenServiceController.$inject = ['$scope', '$state', '$mdDialog', 'apiService'];

  function OpenServiceController($scope, $state, $mdDialog, apiService) {

    $scope.init = _init;

    function _init() {
       apiService.listOpenServices()
      .then(function(openServiceList){
        $scope.$apply(function () {
          $scope.openServiceList = openServiceList;
        });

      }, function(err){
      });
    }

  }

})();
