var app = angular.module('line');

app.controller('topNavCtrl', [
  '$scope', 'stickersService',
  function($scope, stickersService) {
    $scope.packages = stickersService.getSavedPackages();
  }
]);

app.controller('homeCtrl', [
  '$scope', 'stickersService', 'currentTabService', 'clipboardService',
  function($scope, stickersService, currentTabService, clipboardService) {
    $scope.newPackage = null;
    $scope.packages = stickersService.getSavedPackages();
    $scope.recentStickers = stickersService.getRecentStickers;

    // TODO: Stop copy/pasting code
    $scope.useSticker = function(sticker) {
      clipboardService.copy(sticker.imageUrl);
      stickersService.addRecentSticker(sticker);
    }

    $scope.addNewPackage = function() {
      if (!$scope.newPackage) return;
      stickersService.getPackage($scope.newPackage.id, true).then(function() {
        $scope.newPackage = null;
      });
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
  ['$scope', '$stateParams', 'stickersService', 'clipboardService', '$window',
  function($scope, $stateParams, stickersService, clipboardService, $window) {
    packageId = $stateParams['packageId'];
    $scope.package = {};
    $scope.stickers = [];
    $scope.useSticker = function(sticker) {
      clipboardService.copy(sticker.imageUrl);
      stickersService.addRecentSticker(sticker);
    }

    $scope.removePackage = function() {
      var message = 'Delete "' + $scope.package.title + '"?';
      if ($window.confirm(message)) {
        stickersService.removePackage(packageId);
      }
    }

    stickersService
      .getPackage(packageId)
      .then(function(package) {
        $scope.package = package;
        $scope.stickers = package.getStickers();
      })
  }
]);

