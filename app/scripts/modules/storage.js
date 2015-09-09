'use strict';

angular.module('app.storage', [])
    .provider('Storage', Storage);

function Storage() {
    var self = this;
    var storageData = {};
    var syncing = false;
    this.syncIn = function () {
        if (!syncing) {
            syncing = true;
            chrome.storage.sync.get('data', function (data) {
                if (!chrome.runtime.error) {
                    console.log(data);
                    storageData = data;
                    syncing = false;
                }
            });
        }
    };
    this.syncOut = function () {
        if (!syncing) {
            syncing = true;
            chrome.storage.sync.set({data: storageData}, function () {
                if (!chrome.runtime.error) {
                    syncing = false;
                }
            });
        }
    };
    this.$get = function () {
        var factory = {};
        factory.set = function (key, value) {
            storageData[key] = value;
            self.syncOut();
        };
        factory.get = function (key) {
            return storageData[key];
        };
        /*factory.set = function(key, value) {
         if(key && value) {
         var obj = {};
         obj[key] = value;
         chrome.storage.sync.set(obj);
         } else {
         throw new Error('Storage: invalid key/value pair');
         }
         };
         factory.load = function() {
         chrome.storage.sync.get("data", function(items) {
         if (!chrome.runtime.error) {
         console.log(items);
         document.getElementById("data").innerText = items.data;
         }
         });
         };
         factory.get = function(key) {
         if(key) {
         var obj = {};
         obj[key] = value;
         chrome.storage.sync.set(obj);
         }
         };*/
        return factory;
    };
}