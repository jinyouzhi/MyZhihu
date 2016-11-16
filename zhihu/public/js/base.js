;(function () {
    'use strict';

    angular.module('zhihu', [
        'ui.router'
    ])
        .config([
            '$interpolateProvider',
            '$stateProvider',
            '$urlRouterProvider',
            function ($interpolateProvider,
                      $stateProvider,
                      $urlRouterProvider) {
                $interpolateProvider.startSymbol('[:');
                $interpolateProvider.endSymbol(':]');

                $urlRouterProvider.otherwise('/home');

                $stateProvider
                    .state('home', {
                        url: '/home',
                        templateUrl: 'home.tpl' //localhost:8000/home.tpl
                    })
                    .state('login', {
                        url: '/login',
                        templateUrl: 'login.tpl'
                    })
                    .state('signup', {
                        url: '/signup',
                        templateUrl: 'signup.tpl'
                    })
                    .state('question', {
                        abstract: true,
                        url: '/question',
                        template: '<div ui-view></div>'
                    })
                    .state('question.add', {
                        url: '/add',
                        templateUrl: 'question.add.tpl'
                    })
            }])

        .service('UserService', [
            '$state',
            '$http',
            function ($state, $http) {
                var me = this;
                me.signup_data = {};
                me.login_data = {};
                me.signup = function () {
                    $http.post('/api/user/signup', me.signup_data)
                        .then(function (r) {
                                if (r.data.status) {
                                    me.signup_data = {};
                                    $state.go('login');
                                }
                            },
                            function (e) {
                            })
                }
                me.login = function () {
                    $http.post('/api/user/login', me.login_data)
                        .then(function (r) {
                            if (r.data.status) {
                                $state.go('home');
                                location.href = '/';
                            }
                            else
                            {
                                me.login_failed = true;
                            }
                        }, function () {
                            
                        })
                }
                me.username_exists = function () {
                    $http.post('/api/user/exists',
                        {username: me.signup_data.username})
                        .then(function (r) {
                            if (r.data.status && r.data.data.count)
                                me.signup_username_exists = true;
                            else
                                me.signup_username_exists = false;
                        }, function (e) {
                            console.log('e', e);
                        })
                }
            }
        ])

        .controller('SignupController', [
            '$scope',
            'UserService',
            function ($scope, UserService) {
                $scope.User = UserService;
                $scope.$watch(function () {
                    return UserService.signup_data;
                }, function (n, o) {
                    if (n.username != o.username)
                        UserService.username_exists();
                }, true)
            }
        ])

        .controller('LoginController', [
            '$scope',
            'UserService',
            function ($scope, UserService) {
                $scope.User = UserService;
            }
         ])

        .service('QuestionService', [
            '$http',
            '$state',
            function ($http, $state) {
                var me = this;
                me.new_question = {};
                me.go_add_question = function () {
                    $state.go('question.add');
                }
                me.add = function () {
                    if(!me.new_question.title)
                        return;

                    $http.post('/api/question/add', me.new_question)
                        .then(function (r) {
                            console.log('r', r);
                            // if (r.data.status)
                            // {
                            //     me.new_question = {};
                            //     $state.go('home');
                            // }

                        }, function (e) {

                        })
                }
            }

        ])

        .controller('QuestionAddController', [
            '$scope',
            'QuestionService',
            function ($scope, QuestionService) {
                $scope.Question = QuestionService;
            }
        ])



    // .controller('TestController', function ($scope) {
    //     $scope.name = 'Bob';
    // })
})();