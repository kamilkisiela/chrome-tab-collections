'use strict';
angular.module('app.states', [])
    .provider('States', States);
function States() {
    var self = this;
    this.current = undefined;
    this.previous = undefined;
    var stateData;
    var events = {
        'change': 'states:change'
    };
    var states = [];
    this.set = function (_states_) {
        var i;
        states = [];
        for (i in _states_) {
            this.add(_states_[i]);
        }
    };
    this.add = function (state) {
        if (!angular.isObject(state)) {
            throw new Error('Invalid state');
        }
        if (!state.id || angular.isNumber(state.id) || !state.name || !state.icon) {
            throw new Error('Invalid state object');
        }
        if (this.exists(state.id)) {
            throw new Error('State "' + state.id + '" already exists');
        }
        states.push(state);
    };
    this.get = function (stateId) {
        if (!stateId) {
            return states;
        }
        var state;
        var i;
        for (i in states) {
            if (states[i].id === stateId) {
                state = states[i];
                break;
            }
        }
        return state;
    };
    this.default = function (currentStateId, previousStateId) {
        if (this.exists(currentStateId)) {
            this.current = currentStateId;
        }
        if (this.exists(previousStateId)) {
            this.previous = previousStateId;
        }
    };
    this.exists = function (stateId) {
        return states.some(function (s) {
            return s.id === stateId;
        });
    };
    this.$get = function ($rootScope) {
        var factory = {};
        factory.go = function (stateId, data) {
            if (!self.exists(stateId)) {
                throw new Error('Can\'t go to not registered state');
            }
            var state = this.get(stateId);
            // save data
            stateData = data;
            // save current as previous if different
            if (self.current !== state.id) {
                self.previous = self.current;
            }
            self.current = state.id;
            $rootScope.$broadcast(events.change, state);
        };
        factory.get = function (stateId) {
            return self.get(stateId);
        };
        factory.data = function () {
            return stateData;
        };
        factory.current = function () {
            if (!self.current) {
                return undefined;
            }
            return this.get(self.current);
        };
        factory.previous = function () {
            if (!self.previous) {
                return undefined;
            }
            return this.get(self.previous);
        };
        factory.event = function (i) {
            if (!events[i]) {
                throw new Error('Event not defined');
            }
            return events[i];
        };
        return factory;
    };
}