var app = angular.module('line');

app.factory('chromeApiService', ['$q', function($q) {
  var currentTabDeferred = $q.defer();

  chrome.tabs.query({active: true, currentWindow: true}, function(tabArray) {
    var url = tabArray[0].url;
    if (!url) return;

    // Check if we're on a LINE sticker page
    var matches = url.match(/stickershop\/product\/([0-9]+)\//);
    if (matches.length > 1) {
      deferred.resolve(matches[1]);
    } else {
      deferred.resolve(null);
    }
  });

  function newTab(url) {
    chrome.tabs.create({ url: url });
  }

  return {
    currentTabPackageId: currentTabDeferred.promise,
    newTab: newTab
  };
}]);

app.factory('clipboardService', function() {
  function copyToClipboard(text) {
    var clip = document.getElementById('clipboard');
    clip.value = text;
    clip.select();
    document.execCommand('Copy', false, null);
    window.getSelection().removeAllRanges();
  }

  return {
    copy: copyToClipboard
  };
});

app.factory('stickersService', [
  '$q', '$http', '$localStorage', 'config',
  function($q, $http, $localStorage, config) {
    $localStorage.$default({
      packages: {},
      recent: []
    });

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

    function addRecentSticker(sticker) {
      var recent = $localStorage.recent;
      var recentIds = recent.map(function(s) { return [s.packageId, s.id].join('/'); });

      var existingIndex = recentIds.indexOf([sticker.packageId, sticker.id].join('/'));
      if (existingIndex != -1) {
        recent.splice(existingIndex, 1)
      }
      recent.unshift(sticker);

      while(recent.length > 16) {
        recent.pop();
      }

      $localStorage.recent = recent;
      return recent;
    }

    function getRecentStickers() {
      return $localStorage.recent;
    }

    function clearRecentStickers() {
      delete $localStorage.recent;
      $localStorage.recent = [];
    }

    function getSavedPackages() {
      var packages = $localStorage.packages;
      for (id in packages) { packages[id] = addPackageFunctions(packages[id]); }

      return packages;
    }

    function getBaseUrl(packageId, platform, useRedirect, ver) {
      platform = (typeof platform !== 'undefined') ? platform : 'android';
      useRedirect = (typeof useRedirect !== 'undefined') ? useRedirect : false;
      ver = (typeof ver !== 'undefined') ? ver : 1;

      var domain = useRedirect ? config['redirectBaseUrl'] : config['cdnBaseUrl']

      var verPath = Math.floor(ver / 1000000) + '/' + Math.floor(ver / 1000) + '/' + (ver % 1000);
      var url = domain + '/' + verPath + '/' + packageId + '/' + platform;
      return url;
    }

    function removePackage(packageId) {
      delete $localStorage.packages[packageId];
    }

    function getPackage(packageId, storeInCache) {
      storeInCache = (typeof storeInCache !== 'undefined') ? storeInCache : false;
      var deferred = $q.defer();

      // Check if we've already cached sticker IDs
      var cached = $localStorage.packages[packageId];
      if (typeof cached !== 'undefined') {
        deferred.resolve(cached);
      } else {
        var url = getBaseUrl(packageId, 'android', false) + '/productInfo.meta';
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

          if (storeInCache) {
            $localStorage.packages[packageId] = package;
          }

          deferred.resolve(package);
        });
      }

      return deferred.promise.then(addPackageFunctions);
    }

    function getImageUrl(packageId, stickerId, isThumbnail) {
      var suffix = (isThumbnail ? '_key' : '') + '.png';
      var platform = 'android';
      return getBaseUrl(packageId, platform, !isThumbnail) + '/stickers/' + stickerId + suffix;
    }

    function getPreviewUrl(packageId, isSmall) {
      var platform = (isSmall || false) ? 'PC' : 'android';
      return getBaseUrl(packageId, platform) + '/tab_on.png';
    }

    return {
      removePackage: removePackage,
      getPackage: getPackage,
      getSavedPackages: getSavedPackages,
      addRecentSticker: addRecentSticker,
      getRecentStickers: getRecentStickers,
      clearRecentStickers: clearRecentStickers
    };
  }
])

