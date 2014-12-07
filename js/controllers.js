var app = angular.module('line');

app.controller('homeCtrl', [
  '$scope', 'stickersService',
  function($scope, stickersService) {
    $scope.packages = stickersService.getSavedPackages();
  }
]);

app.controller('stickersCtrl',
  ['$scope', '$stateParams', 'stickersService', 'clipboardService',
  function($scope, $stateParams, stickersService, clipboardService) {
    packageId = $stateParams['packageId'];
    $scope.package = { stickers: [] };
    $scope.clipboard = clipboardService;

    stickersService
      .getPackage(packageId)
      .then(function(package) {
        $scope.package = package;
      })
  }
]);

