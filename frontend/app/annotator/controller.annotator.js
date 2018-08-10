(function() {
  'use strict';


  angular
    .module('ciotPlatform')
    .controller('annotatorController', AnnotatorController)
  ;


  function AEResourceRegisterDialogController($scope, $mdDialog ) {

    $scope.formData = {
      aeName: "",
      description: ""
    };


    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.create = function() {

      $mdDialog.hide($scope.formData);
    };
  }






  AnnotatorController.$inject = ['$scope', '$stateParams', '$mdDialog', 'apiService', 'notificationService'];
  function AnnotatorController($scope, $stateParams, $mdDialog, apiService, notificationService) {

    $scope.filters = {
      keyword: ''
    };

    $scope.selectedAeResource = null;
    $scope.selectedContainerResource = null;

    $scope.formData = {};
    $scope.formData.numberRestriction = [];
    $scope.formData.stringRestriction = [];
    $scope.formData.valueRestriction = [];
    $scope.formData.objectRestrictions = [];

    $scope.init = _init;
    $scope.openAEItemMenu = _openAEItemMenu;
    $scope.addObjectRestriction = _addObjectRestriction;
    $scope.deleteObjectRestriction = _deleteObjectRestriction;

    $scope.selectContainer = _selectContainer;
    $scope.showRegisterAEResourceDialog = _showRegisterAEResourceDialog;
    $scope.isSelected = _isSelected;


    $scope.restrictionTypes = [
      {"label": "True/false", "value": "boolean"},
      {"label": "Number", "value": "number"},
      {"label": "Text", "value": "string"},
      {"label": "Object", "value": "object"}
    ];

    $scope.objectRestrictionTypes = $scope.restrictionTypes.slice(0, 3);

    function _init() {
      apiService.getAeResourceList()
        .then(function(aeResourceList){
          $scope.$apply(function () {
            $scope.aeResourceList = aeResourceList;
          });


        }, function(err){
          console.log( err );
        });


      $scope.formData.objectRestrictions.push(
        {name: 'name', type: 'string', numberRestriction: [],  stringRestriction: []}
      );

      $scope.formData.dataType = 'object';
    }



    function _openAEItemMenu($mdMenu, ev) {
      $mdMenu.open(ev);
    }

    function __getObjectRestrictionName(source) {
      var baseName = source + '-copy';
      var newName = baseName;
      var seq = 1;

      while(true) {
        var obj = $scope.formData.objectRestrictions.find(function(item) {
          if (item.name == newName)
            return true;
          else
            return false;
        });

        if(obj == null)
          return newName;
        else
          newName = baseName + (seq++);
      }
    }

    function _addObjectRestriction(index) {
      if(index == -1){
        var source = {name: 'name', type: 'string', numberRestriction: [],  stringRestriction: []};

        source.name = __getObjectRestrictionName(source.name);

        $scope.formData.objectRestrictions.splice(0, 0, source);
      }
      else {
        var source = $scope.formData.objectRestrictions[index];
        source = JSON.parse(JSON.stringify(source));

        source.name = __getObjectRestrictionName(source.name);
        $scope.formData.objectRestrictions.splice(index+1, 0, source);
      }
    }

    function _deleteObjectRestriction(index) {
      $scope.formData.objectRestrictions.splice(index, 1);
    }

    function _selectContainer(ae, cnt) {
      $scope.selectedAeResource = ae;
      $scope.selectedContainerResource = cnt;
    }


    function _isSelected(ae, cnt) {
      if( $scope.selectedAeResource === ae && $scope.selectedContainerResource === cnt)
        return "selected";
      else
        return "";
    }

    function _showRegisterAEResourceDialog(ev) {

      $mdDialog.show({
        controller: AEResourceRegisterDialogController,
        templateUrl: './app/annotator/dialog.register.aeresource.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
        .then(function(aeResource) {
          apiService.registerAeResource(aeResource)
            .then((aeResource)=> {
              $scope.$apply(()=>{
                $scope.aeResourceList.push(aeResource);
              });
            });
        }, function() {
        });
    }

  }

})();
