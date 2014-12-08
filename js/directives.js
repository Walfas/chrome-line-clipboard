var app = angular.module('line');

app.directive('packageHeader', function() {
  return {
    restrict: 'A',
    scope: {
      package: '=',
      isNew: '=?'
    },
    templateUrl: '/views/package_header.html'
  };
});

app.directive('stickerList', function() {
  return {
    restrict: 'A',
    scope: {
      stickers: '=',
      stickerClicked: '='
    },
    templateUrl: '/views/sticker_list.html'
  }
});

