var app = angular.module('line', ['ui.router', 'ngStorage']);

app.value('lineBaseUrl', 'http://dl.stickershop.line.naver.jp/products');

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  //$urlRouterProvider.otherwise('/stickers/3436');

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

