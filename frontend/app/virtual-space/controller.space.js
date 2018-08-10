(function() {
  'use strict';


  angular
    .module('ciotPlatform')
    .controller('virtualSpaceController', VirtualSpaceController)
  ;

  VirtualSpaceController.$inject = ['$scope', '$state', '$stateParams', 'apiService', 'notificationService'];


  function VirtualSpaceController($scope, $state, $stateParams, apiService, notificationService) {

    $scope.filters = {
      keyword: ''
    };
    $scope.spaceId = $stateParams.spaceId;


    $scope.spaceTypeList = [];
    window.SPACE_TYPE.map((item)=>{
      $scope.spaceTypeList.push({
        icon: item.icon,
        name: item.name
      });
    });
    $scope.currentSpaceIcon = $scope.spaceTypeList[0].icon;

    $scope.cvoPanel = {
      position: { x: 40, y: 40 },
      expanded: true
    };

    $scope.init = _init;
    $scope.iconBGColor = _iconBGColor;
    $scope.draggablePositionStyle = _draggablePositionStyle;
    $scope.changeSpaceType = _changeSpaceType;

    $scope.onIconPositionChanged = _onIconPositionChanged;
    $scope.onPanelPositionChanged = _onPanelPositionChanged;

    $scope.containingCVOList = _containingCVOList;

    $scope.openCVOItemMenu = _openCVOItemMenu;

    $scope.moveToComposer = _moveToComposer;


    $scope.onDragComplete = _onDragComplete;
    $scope.onDropComplete = _onDropComplete;


    function _init() {
      apiService.getCompositedVOList()
        .then(function(compositedVOList){
          $scope.$apply(function () {
            $scope.compositedVOList = compositedVOList;
          });


          apiService.getVirtualSpaceInfo($scope.spaceId)
            .then(function(virtualSpace){
              $scope.$apply(function () {
                $scope.virtualSpace = virtualSpace;
              });

            }, function(err){
              console.log( err );
            });


        }, function(err){
          console.log( err );
        });


    }


    function __getVirtualObjctById(voId) {
      if($scope.compositedVOList) {
        var cvoCount = $scope.compositedVOList.length;
        for(var i=0; i < cvoCount; i++) {
          var cvo = $scope.compositedVOList[i];
          var voCount = cvo.nodeList.length;
          for(var j=0; j < voCount; j++) {
            if(voId === cvo.nodeList[j].nodeData.voId) {
              return cvo.nodeList[j].nodeData;
            }
          }
        }
      }

      return null;
    }








    function _draggablePositionStyle(position) {
      return {
        "left": position.x + 'px',
        "top": position.y+'px'
      };
    }


    function _iconBGColor(colorName) {
      var testMarkerColor = {
        "bluejeans": "#5d9cec",
        "aqua": "#4fc1e9",
        "grass": "#a0d468",
        "sunflower": "#ffce54",
        "darkgray": "#656d78"
      }

      return {'background-color': testMarkerColor[colorName] || 'white'};
    }

    function _changeSpaceType(spaceType) {
      $scope.currentSpaceIcon = spaceType.icon;

      $scope.virtualSpace.spaceType = spaceType.name;



      //  1. call service to change space type value on database

      //  1.1. if succeed, change ui

    }

    function _onIconPositionChanged(x, y, voId) {
      if(!voId)
        return;

      var vo = $scope.virtualSpace.voList.find(function(item){
        if(item.voId == voId)
          return true;
        else
          return false;
      });

      $scope.$apply(function(){
        vo.iconPosition.x = x;
        vo.iconPosition.y = y;
      });
    }

    function _onPanelPositionChanged(x, y) {

      //  store x & y to local storage
    }

    function _openCVOItemMenu($mdMenu, ev) {
      $mdMenu.open(ev);
    }


    function _containingCVOList(virtualObject) {
      var result = [];

      var voUrlList = [];
      if(virtualObject) {
        voUrlList.push(virtualObject.resourceUrl);
      }
      else if($scope.virtualSpace) {
        $scope.virtualSpace.voList.map(function(item){
          voUrlList.push(item.resourceUrl);
        });
      }

      if($scope.compositedVOList) {
        $scope.compositedVOList.map(function(cvo){
          cvo.nodeList.map(function(node) {
            var vo = node.nodeData;
            if(voUrlList.indexOf(vo.resourceUrl) != -1) {
              if(result.indexOf(cvo) == -1)
                result.push(cvo);
            }
          });
        });
      }

      return result;
    }

    function _onDragComplete(data, evt) {
      console.log( 'drag', data, evt);
    }

    function _onDropComplete(voId, x, y) {

      if(!voId)
        return;

      var vo = __getVirtualObjctById(voId);


      if($scope.virtualSpace.voList.indexOf(vo) != -1) {
        notificationService.showErrorMessage('이미 존재');
      }
      else {
        vo.iconPosition = {
          x: x, y: y
        };

        $scope.virtualSpace.voList.push(vo);
      }

    }


    function _moveToComposer(cvoId) {
      $state.go('composer', {cvoId: cvoId});
    }

  }

})();
