var app = angular.module('line');

app.controller('topNavCtrl', [
  '$scope', 'stickersService',
  function($scope, stickersService) {
    $scope.packages = stickersService.getSavedPackages();
  }
]);

app.controller('homeCtrl', [
  '$scope', 'stickersService', 'currentTabService',
  function($scope, stickersService, currentTabService) {
    currentTabService.currentTabPackageId.then(function(packageId) {
      $scope.currentTabPackageId = packageId;
    });
    $scope.packages = stickersService.getSavedPackages();
  }
]);

app.controller('stickersCtrl',
  ['$scope', '$stateParams', 'stickersService', 'clipboardService',
  function($scope, $stateParams, stickersService, clipboardService) {
    packageId = $stateParams['packageId'];
    $scope.package = {};
    $scope.stickers = [];
    $scope.clipboard = clipboardService;

    stickersService
      .getPackage(packageId)
      .then(function(package) {
        $scope.package = package;
        $scope.stickers = package.getStickers();
      })
  }
]);

