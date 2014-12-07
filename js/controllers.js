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
    $scope.newPackage = null;
    $scope.packages = stickersService.getSavedPackages();

    $scope.addNewPackage = function() {
      if (!newPackage) return;
      stickersService.getPackage(newPackage.id, true);
      newPackage = null;
    }

    currentTabService.currentTabPackageId.then(function(packageId) {
      if (packageId && !$scope.packages[packageId]) {
        stickersService.getPackage(packageId, false).then(function(package) {
          $scope.newPackage = package;
        });
      }
    });
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

