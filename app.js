'use strict';
//novavision-it.com
angular.module('NovaApp', [])

  .controller('KadhemApp', ['$scope', function ($scope) {

    $scope.canvasWidth = 500;
    $scope.canvasHeight = 500;
    $scope.scale = 1;
    $scope.materialType = 'novait';

  }]);