(function() {
  'use strict';


  angular
    .module('ciotPlatform')
    .controller('dashboardController', DashboardController)
  ;



  const STATS_CARD_HEADER_COLOR_CLASSES = [
    "md-card-header-blue",
    "md-card-header-primary",
    "md-card-header-green",
    "md-card-header-warning",
    "md-card-header-danger",
    "md-card-header-rose"
  ];



  DashboardController.$inject = ['$scope', '$state', '$mdDialog', 'apiService'];

  function DashboardController($scope, $state, $mdDialog, apiService) {


    $scope.init = _init;


    $scope.statsHeaderColorClass = _statsHeaderColorClass;

    function _init() {
       apiService.getDashboardData()
      .then(function(dashboardData){
        $scope.$apply(function () {
          $scope.dashboardData = dashboardData;
        });

      }, function(err){
      });
    }


    function _statsHeaderColorClass(index) {
      return STATS_CARD_HEADER_COLOR_CLASSES[index];
    }

  }

})();
