'use strict';
angular.module('app', ['ngMaterial', 'ngMessages', 'app.states', 'app.collections'])
    .controller('MainCtrl', MainCtrl)
    .controller('NavCtrl', NavCtrl)
    .controller('ListCtrl', ListCtrl)
    .controller('AddCtrl', AddCtrl)
    .controller('EditCtrl', EditCtrl)
    .config(config);

function config($mdThemingProvider, StatesProvider, CollectionsProvider, $mdIconProvider) {
    StatesProvider.set([
        {id: 'list', name: 'List', icon: 'home'},
        {id: 'add', name: 'Add', icon: 'add_box'},
        {id: 'edit', name: 'Edit', icon: 'edit'}
    ]);
    StatesProvider.default('list', 'add');
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');
    $mdIconProvider
        .icon('home', '../images/icons/home.svg')
        .icon('edit', '../images/icons/pencil.svg')
        .icon('add', '../images/icons/plus.svg')
        .icon('add_box', '../images/icons/plus-box.svg')
        .icon('delete', '../images/icons/delete.svg');
}

function MainCtrl($scope, States) {
    $scope.state = States.current();
    $scope.$on(States.event('change'), function (event, state) {
        $scope.state = state;
    });
}

function NavCtrl($scope, States) {
    var stateMap = {
        edit: 'list',
        add: 'list',
        list: 'add'
    };
    // current state
    $scope.current = States.get('list');
    // state used in button 
    $scope.button = States.get(stateMap.list);
    // toggle between states
    $scope.toggle = function () {
        States.go(stateMap[$scope.current.id]);
    };
    // listen to changes
    $scope.$on(States.event('change'), function (event, state) {
        $scope.current = state;
        $scope.button = States.get(stateMap[state.id]);
    });
}

function ListCtrl($scope, States) {
    $scope.packages = [
        {id: 1, name: 'Test 1'},
        {id: 2, name: 'Test 2'},
        {id: 3, name: 'Test 3'},
        {id: 4, name: 'Test 4'},
        {id: 4, name: 'Test 5'}
    ];
    $scope.edit = function (packageObject) {
        States.go('edit', packageObject);
    };
}

function AddCtrl($scope) {
    $scope.collection = {
        name: null
    };
}

function EditCtrl($scope, States) {
    $scope.data = States.data();
}