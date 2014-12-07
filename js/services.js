var app = angular.module('line');

app.factory('currentTabService', ['$q', function($q) {
  var deferred = $q.defer();

  chrome.tabs.query({active: true, currentWindow: true}, function(tabArray) {
    // Check if we're on a LINE sticker page
    var matches = tabArray[0].url.match(/stickershop\/product\/([0-9]+)\//);
    if (matches.length > 1) {
      deferred.resolve(matches[1]);
    } else {
      deferred.resolve(null);
    }
  });

  return {
    currentTabPackageId: deferred.promise
  };
}]);

app.factory('clipboardService', function() {
  function copyToClipboard(text) {
    var clip = document.getElementById('clipboard');
    clip.value = text;
    clip.select();
    document.execCommand('Copy', false, null);
  }

  return {
    copy: copyToClipboard
  };
});

app.factory('stickersService', [
  '$q', '$http', '$localStorage', 'lineBaseUrl',
  function($q, $http, $localStorage, lineBaseUrl) {
    $localStorage.$default({packages:{}});

    function addPackageFunctions(package) {
      package.getStickers = function() {
        return package.stickerIds.map(function(stickerId) {
          return {
            id: stickerId,
            packageId: package.id,
            imageUrl: getImageUrl(package.id, stickerId, false),
            thumbnailUrl: getImageUrl(package.id, stickerId, true)
          };
        });
      }

      package.getPreview = function(isSmall) {
        return getPreviewUrl(package.id, isSmall);
      }
      return package;
    }

    function getSavedPackages() {
      var packages = $localStorage.packages;
      for (id in packages) { packages[id] = addPackageFunctions(packages[id]); }

      return packages;
    }

    function getBaseUrl(packageId, platform, ver) {
      platform = (typeof platform !== 'undefined') ? platform : 'android';
      ver = (typeof ver !== 'undefined') ? ver : 1;

      var verPath = Math.floor(ver / 1000000) + '/' + Math.floor(ver / 1000) + '/' + (ver % 1000);
      var url = lineBaseUrl + '/' + verPath + '/' +packageId + '/' + platform;
      return url;
    }

    function removePackage(packageId) {
      delete $localStorage.packages[packageId];
    }

    function getPackage(packageId) {
      var deferred = $q.defer();

      // Check if we've already cached sticker IDs
      var cached = $localStorage.packages[packageId];
      if (typeof cached !== 'undefined') {
        deferred.resolve(cached);
      } else {
        var url = getBaseUrl(packageId) + '/productInfo.meta';
        var promise = $http.get(url).success(function(data) {
          var title = data.title['en'] || data.title['ja'];
          var author = data.author['en'] || data.author['ja'];
          var ids = data.stickers.map(function(img) { return img.id; });

          var package = {
            id: packageId,
            title: title,
            author: author,
            stickerIds: ids
          };
          $localStorage.packages[packageId] = package;
          deferred.resolve(package);
        });
      }

      return deferred.promise.then(addPackageFunctions);
    }

    function getImageUrl(packageId, stickerId, isThumbnail) {
      var suffix = (isThumbnail ? '_key' : '') + '.png';
      var platform = isThumbnail ? 'iphone' : 'android';
      return getBaseUrl(packageId, platform) + '/stickers/' + stickerId + suffix;
    }

    function getPreviewUrl(packageId, isSmall) {
      var platform = (isSmall || false) ? 'PC' : 'android';
      return getBaseUrl(packageId, platform) + '/tab_on.png';
    }

    return {
      removePackage: removePackage,
      getPackage: getPackage,
      getSavedPackages: getSavedPackages
    };
  }
])

