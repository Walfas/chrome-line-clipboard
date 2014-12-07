var app = angular.module('line');

app.controller('topNavCtrl', [
  '$scope', 'stickersService',
  function($scope, stickersService) {
    $scope.packages = stickersService.getSavedPackages();
  }
]);

app.controller('homeCtrl', [
  '$scope', 'stickersService', 'chromeApiService', '$window',
  function($scope, stickersService, chromeApiService, $window) {
    $scope.newPackage = null;
    $scope.packages = stickersService.getSavedPackages();
    $scope.recentStickers = stickersService.getRecentStickers;
    $scope.useSticker = stickersService.addRecentSticker;

    $scope.addNewPackage = function() {
      if (!$scope.newPackage) return;
      stickersService.getPackage($scope.newPackage.id, true).then(function() {
        $scope.newPackage = null;
      });
    }

    $scope.clearRecentStickers = function() {
      var message = 'Clear recent stickers?';
      if ($window.confirm(message)) {
        stickersService.clearRecentStickers();
      }
    }

    chromeApiService.currentTabPackageId.then(function(packageId) {
      if (packageId && !$scope.packages[packageId]) {
        stickersService.getPackage(packageId, false).then(function(package) {
          $scope.newPackage = package;
        });
      }
    });
  }
]);

app.controller('stickersCtrl', [
  '$scope', '$state', '$stateParams', 'stickersService', '$window', 'chromeApiService', 'config',
  function($scope, $state, $stateParams, stickersService, $window, chromeApiService, config) {
    packageId = $stateParams['packageId'];
    $scope.package = {};
    $scope.stickers = [];
    $scope.useSticker = stickersService.addRecentSticker;

    $scope.removePackage = function() {
      var message = 'Delete "' + $scope.package.title + '"?';
      if ($window.confirm(message)) {
        $state.go('home');
        stickersService.removePackage(packageId);
      }
    }

    $scope.openInShop = function() {
      chromeApiService.newTab(config['shopBaseUrl'] + '/' + packageId + '/en');
    }

    stickersService
      .getPackage(packageId)
      .then(function(package) {
        $scope.package = package;
        $scope.stickers = package.getStickers();
      })
  }
]);

app.controller('copyCtrl', [
  '$scope', '$stateParams', 'clipboardService',
  function($scope, $stateParams, clipboardService) {
    $scope.url = $stateParams['url'];
    clipboardService.copy($scope.url, '#clipboard');
  }
]);

