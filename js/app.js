var app = angular.module('line', ['ui.router', 'ngStorage']);

app.value('config', {
  cdnBaseUrl: 'http://dl.stickershop.line.naver.jp/products',
  redirectBaseUrl: 'http://re-line.herokuapp.com',
  apiBaseUrl: 'http://shiningline.herokuapp.com/stickers',
  shopBaseUrl: 'https://store.line.me/stickershop/product'
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('installed', {
      url: '/installed',
      templateUrl: 'views/installed.html',
      controller: 'installedCtrl'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'views/home.html',
      controller: 'homeCtrl'
    })
    .state('stickers', {
      url: '/stickers/:packageId',
      templateUrl: 'views/stickers.html',
      controller: 'stickersCtrl'
    })
    .state('copy', {
      url: '/copy/:packageId/:stickerId/:fallbackUrl',
      templateUrl: '/views/copy.html',
      controller: 'copyCtrl'
    })
});

