var app = angular.module('line', ['ui.router', 'ngStorage']);

app.value('config', {
  cdnBaseUrl: 'http://dl.stickershop.line.naver.jp/products',
  redirectBaseUrl: 'http://re-line.herokuapp.com',
  shopBaseUrl: 'https://store.line.me/stickershop/product'
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider
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
});

