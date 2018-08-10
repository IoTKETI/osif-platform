(function(){
  'use strict';

  angular
    .module('ciotPlatform', ['ui.router', 'LocalStorageModule', 'ngMaterial'])
    .config(config)
    .controller('mainController', MainController)
    .run(run);

    function config($stateProvider, $urlRouterProvider, $mdThemingProvider, localStorageServiceProvider) {

      $urlRouterProvider.otherwise('/dashboard');

      $stateProvider

        // Login page
        .state('login', {
          url: '/login',
          templateUrl: './app/auth/login.html'
        })

        // Login page
        .state('signup', {
          url: '/sighup',
          templateUrl: './app/auth/signup.html'
        })

        // Login page
        .state('password-reset', {
          url: '/password-reset',
          templateUrl: './app/auth/password.reset.html'
        })

        // Login page
        .state('password-change', {
          url: '/password-change',
          templateUrl: './app/auth/password.change.html'
        })

        // List of virtual spaces on map
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: './app/dashboard/view.dashboard.html'
        })

        // List of virtual spaces on map
        .state('openservice', {
          url: '/openservice',
          templateUrl: './app/openservice/view.openservice.html'
        })

      ;


      localStorageServiceProvider
        .setPrefix('ciotPlatform');
      localStorageServiceProvider
        .setStorageType('localStorage');



      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey');

      $mdThemingProvider.theme('vspace-map')
        .primaryPalette('blue');

      $mdThemingProvider.theme('virtual-space')
        .primaryPalette('purple');

      $mdThemingProvider.theme('composer')
        .primaryPalette('purple');

      $mdThemingProvider.theme('annotator')
        .primaryPalette('indigo');



      //  INIT ui constants
      window.SPACE_TYPE = [
        {icon: 'fas fa-bed', color: 'bluejeans', name: 'bedroom'},
        {icon: 'fas fa-utensils', color: 'bluejeans', name: 'kitchen'},
        {icon: 'fas fa-book', color: 'bluejeans', name: 'livingroom'},
        {icon: 'fas fa-industry', color: 'darkgray', name: 'factory'},
        {icon: 'fas fa-pallet', color: 'darkgray', name: 'warehouse'},
        {icon: 'fas fa-lemon', color: 'grass', name: 'farm'},
        {icon: 'fab fa-sticker-mule', color: 'sunflower', name: 'pigsty'},
        {icon: 'fas fa-ruler-combined', color: 'darkgray', name: 'construction'},
        {icon: 'fas fa-leaf', color: 'grass', name: 'garden'},
        {icon: 'fas fa-ship', color: 'aqua', name: 'harbor'},
      ];

      window.VO_TYPE = [
        {icon: 'fas fa-battery-half', name: 'battery'},
        {icon: 'fas fa-bell', name: 'alarm'},
        {icon: 'fas fa-bicycle', name: 'tracker'},
        {icon: 'fas fa-bone', name: 'pet'},
        {icon: 'fas fa-brain', name: 'emotion'},
        {icon: 'fas fa-capsules', name: 'medicine'},
        {icon: 'fas fa-charging-station', name: 'charger'},
        {icon: 'fas fa-umbrella', name: 'weather'},
        {icon: 'fas fa-fire-extinguisher', name: 'fire extinguisher'},
        {icon: 'fas fa-fire', name: 'fire sensor'},
        {icon: 'fas fa-info-circle', name: 'info'},
        {icon: 'fas fa-microphone', name: 'microphone'},
        {icon: 'fas fa-plug', name: 'plug'},
        {icon: 'fas fa-video', name: 'cctv'},
        {icon: 'fas fa-thermometer', name: 'temperature'},
        {icon: 'fas fa-thermometer-half', name: 'thermometer'},
        {icon: 'fas fa-tachometer-alt', name: 'tachometer'},
        {icon: 'fas fa-toggle-on', name: 'switch'}
      ];

      window.CVO_TYPE = [
        {icon: 'fas fa-walking', name: 'go out'},
        {icon: 'fas fa-building', name: 'go to work'},
        {icon: 'fas fa-swimmer', name: 'go to play'},
        {icon: 'fas fa-bed', name: 'go to bed'},
        {icon: 'far fa-tired', name: 'tired'},
        {icon: 'fas fa-smile-beam', name: 'happy'},
        {icon: 'far fa-sad-tear', name: 'sad'}
      ]



    };


    //  controller inject
  MainController.$inject = ['$scope', '$rootScope', '$mdSidenav', 'authService'];


  function MainController($scope, $rootScope, $mdSidenav, authService) {
    $scope.showSideNav = true


    $scope.toggleSideNav = _toggleSideNav;
    $scope.openUserProfileMenu = _openUserProfileMenu;

    $scope.canMoveToBack = _canMoveToBack;


    $scope.init = _init;
    $scope.isLoggedIn = _isLoggedIn;

    $scope.onLogout = _onLogout;


    function _init() {

      $scope.loginUser = authService.getLoginUser();

    }


    function _isLoggedIn() {
      if($scope.loginUser)
        return true;
      else
        return false;
    }


    function _onLogout() {
      $scope.loginUser = null;
      authService.logout();
    }


    function _toggleSideNav() {

      $mdSidenav('gnb-sidebar')
        .toggle()
        .then(function () {
        });
    }

    function _openUserProfileMenu($mdMenu, ev) {
      $mdMenu.open(ev);
    }

    function _canMoveToBack() {
      var result = document.referrer?false:true;
      console.log( result , document.referrer, this.isHistory);
      return result;
    }

  }

  function run($rootScope) {
    window.API_BASE_URL = "";


  }

})();

