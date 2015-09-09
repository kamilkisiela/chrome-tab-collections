'use strict';

angular.module('app.collections', ['app.storage'])
    .config(config)
    .provider('Collections', Collections);

function config(StorageProvider) {
    StorageProvider.syncIn();
}

function Collections() {
    this.$get = function () {
        return {};
    };
}