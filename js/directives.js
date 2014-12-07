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

